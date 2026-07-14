import { Router } from "express";
export const pageRoutes = Router();
pageRoutes.get("/", (req, res) => res.render("galeria"));
