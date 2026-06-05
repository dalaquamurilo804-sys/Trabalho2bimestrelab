# Guia de Desenvolvimento: Trabalho 2º Bimestre Laboratório

Este guia contém os passos essenciais para configurar seu ambiente, gerenciar o código com Git e rodar a aplicação localmente.


## 👾 Clonando o projeto e preparando Commits
Para iniciar, abra o terminal na pasta onde deseja salvar o projeto e faça o clone do repositório executando o comando `git clone https://github.com/dalaquamurilo804-sys/Trabalho2bimestrelab.git`. Assim que o download terminar, entre na pasta do projeto utilizando `cd Trabalho2bimestrelab`.

Com o projeto clonado, o próximo passo é realizar o build inicial instalando as dependências do Node.js. Para fazer isso, execute o comando `npm install`. Esse comando lerá o arquivo `package.json` e baixará automaticamente a pasta `node_modules` com todas as bibliotecas necessárias para a aplicação funcionar.

Para organizar o desenvolvimento e manter o código da branch principal seguro, é fundamental trabalhar com ramificações. Você pode criar e migrar para uma branch separada da main rodando o comando `git checkout -b nome-da-sua-branch`. Se precisar listar as branches existentes na sua máquina, use `git branch`, e para retornar a uma branch já existente, como a própria main, utilize `git checkout main`.

Antes de iniciar qualquer alteração no código ou criar novas funcionalidades, lembre-se de atualizar seu repositório local com as últimas mudanças do servidor remoto. Para isso, utilize o comando `git pull origin main` (ou substitua "main" pelo nome da branch que deseja atualizar).

Após fazer as modificações necessárias nos arquivos do projeto, você deve salvar seu progresso criando um commit. Primeiro, verifique quais arquivos foram alterados usando `git status`. Em seguida, adicione os arquivos que deseja salvar na área de preparação com o comando `git add .` para incluir todas as modificações (ou `git add caminho/do/arquivo` para um arquivo específico). Com os arquivos preparados, crie o commit executando `git commit -m "Sua mensagem explicativa aqui"`. Para enviar essas alterações para o GitHub, finalize com `git push origin nome-da-sua-branch`.

## 🛠️ Como Inicializar o Banco de Dados

Se você acabou de clonar o repositório ou está configurando o projeto em um novo dispositivo, é necessário gerar o arquivo do banco de dados local (`database.db`) e criar as tabelas estruturais. 

Você pode fazer isso de duas formas (escolha a que preferir):

### Opção 1: Atalho Rápido (Recomendado)
A partir da **raiz do projeto**, execute o comando abaixo para inicializar o banco diretamente:
```bash
npm run db:init
```

Por fim, com todas as dependências instaladas e o código pronto, você pode iniciar o servidor de desenvolvimento local do Vite executando o comando `npm run dev`. O terminal exibirá o endereço local da aplicação, que geralmente é `http://localhost:5173/`. Basta abrir essa URL no seu navegador para visualizar o projeto rodando em tempo real com suporte a atualizações automáticas assim que os arquivos forem salvos.