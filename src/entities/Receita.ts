// Classe Receita com OOP: private, get/set, validacao, fromJSON/toJSON
export class Receita {
  private _id: number;
  private _titulo: string;
  private _descricao: string;
  private _tempo: string;
  private _foto: string | null;

  constructor(id: number, titulo: string, descricao: string, tempo: string, foto: string | null = null) {
    this._id = id;
    this._titulo = titulo;
    this._descricao = descricao;
    this._tempo = tempo;
    this._foto = foto;
  }

  // Getters
  get id(): number { return this._id; }
  get titulo(): string { return this._titulo; }
  get descricao(): string { return this._descricao; }
  get tempo(): string { return this._tempo; }
  get foto(): string | null { return this._foto; }

  // Setters com validacao
  set titulo(valor: string) {
    if (!valor || valor.trim() === "") throw new Error("Titulo obrigatorio");
    this._titulo = valor.trim();
  }

  set descricao(valor: string) { this._descricao = (valor || "").trim(); }
  set tempo(valor: string) { this._tempo = (valor || "").trim(); }
  set foto(valor: string | null) { this._foto = valor; }

  // Validacao estatica (antes de criar)
  static validar(dados: { titulo?: string }): string[] {
    const erros: string[] = [];
    if (!dados.titulo || dados.titulo.trim() === "") erros.push("Titulo obrigatorio");
    if (dados.titulo && dados.titulo.trim().length < 3) erros.push("Titulo deve ter pelo menos 3 caracteres");
    return erros;
  }

  // Converter de JSON (do arquivo) para instancia da classe
  static fromJSON(json: any): Receita {
    return new Receita(json.id, json.titulo, json.descricao || "", json.tempo || "", json.foto || null);
  }

  // Converter da instancia para JSON (para salvar no arquivo)
  toJSON(): object {
    return {
      id: this._id,
      titulo: this._titulo,
      descricao: this._descricao,
      tempo: this._tempo,
      foto: this._foto,
    };
  }
}
