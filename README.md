# Galeria de Receitas (OOP) - Pratica Aula 39

Projeto com Orientacao a Objetos: Classe Receita + ReceitaRepository.
O CRUD ja funciona! Voce so adiciona o UPLOAD.

## Estrutura OOP:
- src/entities/Receita.ts -> CLASSE com private, get/set, validar, fromJSON/toJSON
- src/models/ReceitaRepository.ts -> Repository com listar, criar, atualizar, remover
- src/routes/apiRoutes.ts -> usa repo.criar(), repo.listar(), etc.

## npm install && npm run dev

## 6 TODOs (todos sobre upload):
1. upload.ts: criar configuracao Multer (storage + fileFilter + limits)
2. apiRoutes.ts: importar upload
3. apiRoutes.ts: upload.single("foto") no POST
4. apiRoutes.ts: salvar req.file.filename no campo foto
5. app.ts: express.static("uploads")
6. galeria.js: trocar JSON.stringify por FormData

## O que ja funciona (OOP):
- Receita como CLASSE (nao interface!)
- ReceitaRepository com carregar/salvar/listar/criar/atualizar/remover
- Validacao estatica: Receita.validar({ titulo })
- fromJSON (arquivo -> classe) e toJSON (classe -> arquivo)
- GET, PUT, DELETE, busca, loading, debounce
