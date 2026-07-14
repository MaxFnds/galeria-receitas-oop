import { Router, Request, Response } from "express";
import { ReceitaRepository } from "../models/ReceitaRepository";
// TODO 2: importar { upload } de "../middlewares/upload"

export const apiRoutes = Router();
const repo = new ReceitaRepository();

// GET /api/receitas - listar (com busca opcional) [PRONTO]
apiRoutes.get("/api/receitas", async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    const receitas = await repo.listar(q?.toString());
    const dados = receitas.map(r => r.toJSON());
    res.json({ sucesso: true, dados, total: dados.length });
  } catch (e: any) {
    res.status(500).json({ sucesso: false, erro: e.message });
  }
});

// POST /api/receitas - criar nova [TEM TODOs DE UPLOAD]
// TODO 3: adicionar upload.single("foto") como middleware
apiRoutes.post("/api/receitas", /* TODO: upload.single("foto"), */ async (req: Request, res: Response) => {
  try {
    const { titulo, descricao, tempo } = req.body;

    // TODO 4: pegar o caminho da foto do req.file
    // const foto = req.file ? `/uploads/${req.file.filename}` : null;
    const foto: string | null = null; // <- substituir pela linha acima

    const nova = await repo.criar(titulo, descricao || "", tempo || "", foto);
    res.status(201).json({ sucesso: true, dados: nova.toJSON() });
  } catch (e: any) {
    res.status(400).json({ sucesso: false, erro: e.message });
  }
});

// PUT /api/receitas/:id - editar [PRONTO]
apiRoutes.put("/api/receitas/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const receita = await repo.atualizar(id, req.body);
    if (!receita) { res.status(404).json({ sucesso: false, erro: "Nao encontrada" }); return; }
    res.json({ sucesso: true, dados: receita.toJSON() });
  } catch (e: any) {
    res.status(400).json({ sucesso: false, erro: e.message });
  }
});

// DELETE /api/receitas/:id - remover [PRONTO]
apiRoutes.delete("/api/receitas/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const removido = await repo.remover(id);
  if (!removido) { res.status(404).json({ sucesso: false, erro: "Nao encontrada" }); return; }
  res.json({ sucesso: true });
});
