// Repository: responsavel por ler/gravar no JSON
// Usa a classe Receita (fromJSON/toJSON)
import { readFile, writeFile } from "fs/promises";
import { Receita } from "../entities/Receita";

export class ReceitaRepository {
  private arquivo: string;

  constructor(arquivo: string = "dados/receitas.json") {
    this.arquivo = arquivo;
  }

  async carregar(): Promise<Receita[]> {
    try {
      const texto = await readFile(this.arquivo, "utf-8");
      const dados = JSON.parse(texto);
      return dados.map((d: any) => Receita.fromJSON(d));
    } catch {
      await this.salvar([]);
      return [];
    }
  }

  async salvar(receitas: Receita[]): Promise<void> {
    const json = receitas.map(r => r.toJSON());
    await writeFile(this.arquivo, JSON.stringify(json, null, 2));
  }

  async listar(termo?: string): Promise<Receita[]> {
    let receitas = await this.carregar();
    if (termo && termo.trim()) {
      const t = termo.toLowerCase();
      receitas = receitas.filter(r => r.titulo.toLowerCase().includes(t));
    }
    return receitas;
  }

  async buscarPorId(id: number): Promise<Receita | undefined> {
    const receitas = await this.carregar();
    return receitas.find(r => r.id === id);
  }

  async criar(titulo: string, descricao: string, tempo: string, foto: string | null): Promise<Receita> {
    // Validar usando o metodo estatico da classe
    const erros = Receita.validar({ titulo });
    if (erros.length > 0) throw new Error(erros.join(", "));

    const receitas = await this.carregar();
    const novoId = (receitas.length > 0 ? receitas[receitas.length - 1].id : 0) + 1;
    const nova = new Receita(novoId, titulo.trim(), descricao, tempo, foto);

    receitas.push(nova);
    await this.salvar(receitas);
    return nova;
  }

  async atualizar(id: number, dados: { titulo?: string; descricao?: string; tempo?: string }): Promise<Receita | null> {
    const receitas = await this.carregar();
    const receita = receitas.find(r => r.id === id);
    if (!receita) return null;

    if (dados.titulo) receita.titulo = dados.titulo;
    if (dados.descricao !== undefined) receita.descricao = dados.descricao;
    if (dados.tempo !== undefined) receita.tempo = dados.tempo;

    await this.salvar(receitas);
    return receita;
  }

  async remover(id: number): Promise<boolean> {
    const receitas = await this.carregar();
    const index = receitas.findIndex(r => r.id === id);
    if (index === -1) return false;

    receitas.splice(index, 1);
    await this.salvar(receitas);
    return true;
  }
}
