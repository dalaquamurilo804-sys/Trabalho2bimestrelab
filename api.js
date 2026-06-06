// api.js
import express from 'express';
import { db, createTables } from './statements.js'; 

const app = express();
const PORT = 3000;

app.use(express.json());

// =======================================================
// MÉTODOS PUT (UPDATES - ATUALIZAÇÃO)
// =======================================================

// 1. Atualizar Senha do Usuário (users)
app.put('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({ status: "erro", mensagem: "A nova password é obrigatória." });
    }

    const query = `UPDATE users SET password = ? WHERE id = ?`;
    db.run(query, [password, id], function(err) {
        if (err) return res.status(500).json({ status: "erro", mensagem: err.message });
        if (this.changes === 0) return res.status(404).json({ status: "erro", mensagem: "Usuário não encontrado." });
        res.json({ status: "sucesso", mensagem: "Senha atualizada com sucesso!" });
    });
});

// 2. Atualizar Perfil (profiles)
app.put('/api/profiles/:id', (req, res) => {
    const { id } = req.params;
    const { nickname, bio, avatar_url, schedule_availability } = req.body;

    if (!nickname) {
        return res.status(400).json({ status: "erro", mensagem: "O nickname é obrigatório." });
    }

    const query = `
        UPDATE profiles 
        SET nickname = ?, bio = ?, avatar_url = ?, schedule_availability = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `;
    db.run(query, [nickname, bio || null, avatar_url || null, schedule_availability || null, id], function(err) {
        if (err) return res.status(500).json({ status: "erro", mensagem: err.message });
        if (this.changes === 0) return res.status(404).json({ status: "erro", mensagem: "Perfil não encontrado." });
        res.json({ status: "sucesso", mensagem: "Perfil atualizado com sucesso!" });
    });
});

// 3. Atualizar Dados de um Jogo (games)
app.put('/api/games/:id', (req, res) => {
    const { id } = req.params;
    const { name, genre, image_url } = req.body;

    if (!name) {
        return res.status(400).json({ status: "erro", mensagem: "O nome do jogo é obrigatório." });
    }

    const query = `UPDATE games SET name = ?, genre = ?, image_url = ? WHERE id = ?`;
    db.run(query, [name, genre || null, image_url || null, id], function(err) {
        if (err) return res.status(500).json({ status: "erro", mensagem: err.message });
        if (this.changes === 0) return res.status(404).json({ status: "erro", mensagem: "Jogo não encontrado." });
        res.json({ status: "sucesso", mensagem: "Jogo atualizado com sucesso!" });
    });
});

// 4. Atualizar Nível de Habilidade no Jogo (user_games)
app.put('/api/user-games', (req, res) => {
    const { profile_id, game_id, skill_level } = req.body;

    if (!profile_id || !game_id || !skill_level) {
        return res.status(400).json({ status: "erro", mensagem: "profile_id, game_id e skill_level são obrigatórios." });
    }

    const query = `UPDATE user_games SET skill_level = ? WHERE profile_id = ? AND game_id = ?`;
    db.run(query, [skill_level, profile_id, game_id], function(err) {
        if (err) return res.status(500).json({ status: "erro", mensagem: err.message });
        if (this.changes === 0) return res.status(404).json({ status: "erro", mensagem: "Vínculo de jogo não encontrado." });
        res.json({ status: "sucesso", mensagem: "Nível de habilidade atualizado!" });
    });
});

// 5. Atualizar Informações de um Grupo (game_groups)
app.put('/api/game-groups/:id', (req, res) => {
    const { id } = req.params;
    const { name, description, max_players } = req.body;

    if (!name) {
        return res.status(400).json({ status: "erro", mensagem: "O nome do grupo é obrigatório." });
    }

    const query = `UPDATE game_groups SET name = ?, description = ?, max_players = ? WHERE id = ?`;
    db.run(query, [name, description || null, max_players || 5, id], function(err) {
        if (err) return res.status(500).json({ status: "erro", mensagem: err.message });
        if (this.changes === 0) return res.status(404).json({ status: "erro", mensagem: "Grupo não encontrado." });
        res.json({ status: "sucesso", mensagem: "Grupo atualizado com sucesso!" });
    });
});

// 6. Alterar Cargo de um Membro no Grupo (group_members)
app.put('/api/group-members', (req, res) => {
    const { group_id, profile_id, role } = req.body;

    if (!group_id || !profile_id || !role) {
        return res.status(400).json({ status: "erro", mensagem: "group_id, profile_id e role são obrigatórios." });
    }

    const query = `UPDATE group_members SET role = ? WHERE group_id = ? AND profile_id = ?`;
    db.run(query, [role, group_id, profile_id], function(err) {
        if (err) return res.status(500).json({ status: "erro", mensagem: err.message });
        if (this.changes === 0) return res.status(404).json({ status: "erro", mensagem: "Membro ou grupo não encontrado." });
        res.json({ status: "sucesso", mensagem: "Cargo do membro atualizado!" });
    });
});


// =======================================================
// MÉTODOS DELETE (DELETES - REMOÇÃO)
// =======================================================

// 1. Apagar Usuário (users) -> Cascata apaga profiles, admins, etc.
app.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;
    
    db.run(`DELETE FROM users WHERE id = ?`, [id], function(err) {
        if (err) return res.status(500).json({ status: "erro", mensagem: err.message });
        if (this.changes === 0) return res.status(404).json({ status: "erro", mensagem: "Usuário não encontrado." });
        res.json({ status: "sucesso", mensagem: "Usuário e dados vinculados removidos com sucesso!" });
    });
});

// 2. Apagar apenas o Perfil (profiles)
app.delete('/api/profiles/:id', (req, res) => {
    const { id } = req.params;

    db.run(`DELETE FROM profiles WHERE id = ?`, [id], function(err) {
        if (err) return res.status(500).json({ status: "erro", mensagem: err.message });
        if (this.changes === 0) return res.status(404).json({ status: "erro", message: "Perfil não encontrado." });
        res.json({ status: "sucesso", mensagem: "Perfil removido com sucesso." });
    });
});

// 3. Remover um Jogo do catálogo (games)
app.delete('/api/games/:id', (req, res) => {
    const { id } = req.params;

    db.run(`DELETE FROM games WHERE id = ?`, [id], function(err) {
        if (err) return res.status(500).json({ status: "erro", mensagem: err.message });
        if (this.changes === 0) return res.status(404).json({ status: "erro", mensagem: "Jogo não encontrado." });
        res.json({ status: "sucesso", mensagem: "Jogo removido do catálogo." });
    });
});

// 4. Remover um Jogo do perfil de um usuário (user_games)
app.delete('/api/user-games', (req, res) => {
    const { profile_id, game_id } = req.body;

    db.run(`DELETE FROM user_games WHERE profile_id = ? AND game_id = ?`, [profile_id, game_id], function(err) {
        if (err) return res.status(500).json({ status: "erro", mensagem: err.message });
        if (this.changes === 0) return res.status(404).json({ status: "erro", mensagem: "Vínculo não encontrado." });
        res.json({ status: "sucesso", mensagem: "Jogo desvinculado do perfil." });
    });
});

// 5. Deletar um Grupo de jogo (game_groups)
app.delete('/api/game-groups/:id', (req, res) => {
    const { id } = req.params;

    db.run(`DELETE FROM game_groups WHERE id = ?`, [id], function(err) {
        if (err) return res.status(500).json({ status: "erro", mensagem: err.message });
        if (this.changes === 0) return res.status(404).json({ status: "erro", mensagem: "Grupo não encontrado." });
        res.json({ status: "sucesso", mensagem: "Grupo removido com sucesso." });
    });
});

// 6. Remover um Membro de um Grupo / Sair do grupo (group_members)
app.delete('/api/group-members', (req, res) => {
    const { group_id, profile_id } = req.body;

    db.run(`DELETE FROM group_members WHERE group_id = ? AND profile_id = ?`, [group_id, profile_id], function(err) {
        if (err) return res.status(500).json({ status: "erro", mensagem: err.message });
        if (this.changes === 0) return res.status(404).json({ status: "erro", mensagem: "Membro não encontrado neste grupo." });
        res.json({ status: "sucesso", mensagem: "Membro removido do grupo." });
    });
});

// =======================================================
// ROTAS GENÉRICAS E DE INICIALIZAÇÃO OMITIDAS PARA BREVIDADE...
// =======================================================

app.listen(PORT, () => {
    console.log(`API ativa com suporte completo a CRUD em http://localhost:${PORT}`);
});