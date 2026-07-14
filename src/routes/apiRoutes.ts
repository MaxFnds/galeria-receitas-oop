import { Router, Request, Response } from "express";
import { ReceitaRepository } from "../models/ReceitaRepository";
import { upload } from "../middlewares/upload";

export const apiRoutes = Router();
const repo = new ReceitaRepository();

apiRoutes.get("/api/receitas", async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    const receitas = await repo.listar(q?.toString());
    const dados = receitas.map((r) => r.toJSON());

    res.json({
      sucesso: true,
      dados,
      total: dados.length,
    });
  } catch (e: any) {
    res.status(500).json({
      sucesso: false,
      erro: e.message,
    });
  }
});

apiRoutes.post(
  "/api/receitas",
  upload.single("foto"),
  async (req: Request, res: Response) => {
    try {
      const { titulo, descricao, tempo } = req.body;

      const foto = req.file ? `/uploads/${req.file.filename}` : null;

      const nova = await repo.criar(
        titulo,
        descricao || "",
        tempo || "",
        foto
      );

      res.status(201).json({
        sucesso: true,
        dados: nova.toJSON(),
      });
    } catch (e: any) {
      res.status(400).json({
        sucesso: false,
        erro: e.message,
      });
    }
  }
);

apiRoutes.put("/api/receitas/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const receita = await repo.atualizar(id, req.body);

    if (!receita) {
      res.status(404).json({
        sucesso: false,
        erro: "Nao encontrada",
      });
      return;
    }

    res.json({
      sucesso: true,
      dados: receita.toJSON(),
    });
  } catch (e: any) {
    res.status(400).json({
      sucesso: false,
      erro: e.message,
    });
  }
});

apiRoutes.delete("/api/receitas/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const removido = await repo.remover(id);

  if (!removido) {
    res.status(404).json({
      sucesso: false,
      erro: "Nao encontrada",
    });
    return;
  }

  res.json({
    sucesso: true,
  });
});