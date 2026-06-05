const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3'); 

// Função 1: Criar/Resetar as Tabelas
function createTables(db) {
    console.log("Iniciando a criação das tabelas...");
    const sqlQueries = fs.readFileSync(path.join(__dirname, 'statements.sql'), 'utf8').trim();
    db.exec(sqlQueries);
    console.log("-> Banco de dados reiniciado e tabelas criadas com sucesso!");
}

// Função 2: Listar as Tabelas Existentes
function listTables(db) {
    console.log("Consultando o catálogo do banco de dados...");
    const query = "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';";
    const tables = db.prepare(query).all();

    console.log("\n=== TABELAS ENCONTRADAS ===");
    if (tables.length === 0) {
        console.log("Nenhuma tabela encontrada. O banco está vazio!");
    } else {
        tables.forEach((tabela, index) => {
            console.log(`${index + 1}. ${tabela.name}`);
        });
    }
    console.log("===========================\n");
}

// === LOGICA DE CONTROLE PELO TERMINAL ===

// Captura o argumento no terminal (ex: "init" ou "list")
const comando = process.argv[2]; 

if (!comando) {
    console.log("Por favor, especifique uma ação. Exemplos: node statements.cjs init ou node statements.cjs list");
    process.exit(1);
}

let db;
try {
    // Abre a conexão global para as funções usarem
    db = new Database(path.join(__dirname, 'database.db'));

    // Verifica qual palavra foi digitada após o nome do arquivo
    if (comando === 'init') {
        createTables(db);
    } else if (comando === 'list') {
        listTables(db);
    } else {
        console.log(`Comando '${comando}' não reconhecido. Use 'init' ou 'list'.`);
    }

} catch (error) {
    console.error("Ocorreu um erro ao processar o banco de dados:", error);
} finally {
    if (db) db.close();
}