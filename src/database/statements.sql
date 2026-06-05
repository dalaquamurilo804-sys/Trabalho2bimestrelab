-- Limpa as tabelas existentes para evitar conflitos (Ordem reversa das chaves estrangeiras)
DROP TABLE IF EXISTS group_members;
DROP TABLE IF EXISTS game_groups;
DROP TABLE IF EXISTS user_games;
DROP TABLE IF EXISTS games;
DROP TABLE IF EXISTS password_resets;
DROP TABLE IF EXISTS admins;
DROP TABLE IF EXISTS profiles;
DROP TABLE IF EXISTS users;

-- 1. Tabela de Autenticação (User)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabela de Perfil do Jogador (Profile)
-- Relacionamento 1:1 com a tabela de Usuários
CREATE TABLE profiles (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    nickname VARCHAR(50) NOT NULL,
    bio TEXT,
    avatar_url VARCHAR(255),
    schedule_availability VARCHAR(100), -- Armazena os horários disponíveis
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_profile_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Tabela de Jogos Cadastrados (Game)
CREATE TABLE games (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    genre VARCHAR(50),
    image_url VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabela Pivô: Jogador e Jogos (User_Games)
-- Relacionamento Many-to-Many (N:N) entre Perfil e Jogo
CREATE TABLE user_games (
    profile_id INT NOT NULL,
    game_id INT NOT NULL,
    game_style VARCHAR(20) CHECK (game_style IN ('casual', 'competitive')) NOT NULL, -- Estilo de jogo
    game_rank VARCHAR(50), -- Rank/Elo atualizado por jogo
    PRIMARY KEY (profile_id, game_id),
    CONSTRAINT fk_user_games_profile FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_games_game FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
);

-- 5. Tabela de Grupos/Salas (Group)
CREATE TABLE game_groups (
    id SERIAL PRIMARY KEY,
    creator_id INT NOT NULL, -- ID do dono do grupo (Profile)
    game_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    max_slots INT NOT NULL CHECK (max_slots > 1),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_group_creator FOREIGN KEY (creator_id) REFERENCES profiles(id) ON DELETE CASCADE,
    CONSTRAINT fk_group_game FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
);

-- 6. Tabela de Membros dos Grupos (Group_Members)
-- Relacionamento Many-to-Many (N:N) que gerencia os participantes e seus papéis
CREATE TABLE group_members (
    group_id INT NOT NULL,
    profile_id INT NOT NULL,
    role VARCHAR(20) CHECK (role IN ('owner', 'member')) NOT NULL DEFAULT 'member', -- Papel no grupo
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (group_id, profile_id),
    CONSTRAINT fk_group_members_group FOREIGN KEY (group_id) REFERENCES game_groups(id) ON DELETE CASCADE,
    CONSTRAINT fk_group_members_profile FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- Tabela para gerenciar tokens de redefinição de senha
-- Relacionamento 1:N com a tabela de Usuários (um usuário pode ter vários tokens, mas cada token pertence a um único usuário)
CREATE TABLE password_resets (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(64) UNIQUE NOT NULL, -- Hash do token que será enviado por e-mail
    expires_at TIMESTAMP NOT NULL,      -- Data/hora de expiração (ex: +15 minutos)
    used BOOLEAN DEFAULT FALSE,         -- Garante que o token só seja usado uma vez
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_password_resets_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 7. Tabela de Administradores (Admin)
-- Relacionamento 1:1 com a tabela de Usuários para diferenciar de 'profiles'
CREATE TABLE admins (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    level INT NOT NULL DEFAULT 1, -- Nível de permissão (ex: 1 = Admin Comum, 2 = Super Admin)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_admin_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Otimização para a rota de busca/filtro de jogadores (GET /players)
CREATE INDEX idx_user_games_search ON user_games(game_id, game_style, game_rank);

-- Otimização para buscar grupos abertos por jogo específicos
CREATE INDEX idx_groups_game ON game_groups(game_id);