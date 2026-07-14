import express from "express";
import { pageRoutes } from "./routes/pageRoutes";
import { apiRoutes } from "./routes/apiRoutes";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// TODO 5: Servir a pasta uploads/ para o navegador acessar as fotos
// app.use("/uploads", express.static("uploads"));

app.set("view engine", "ejs");
app.set("views", "./src/views");
app.use(pageRoutes);
app.use(apiRoutes);
app.use("/uploads", express.static("uploads"));

app.listen(3000, () => console.log("Galeria de Receitas rodando em http://localhost:3000"));
