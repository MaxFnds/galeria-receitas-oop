let timerBusca = null;

// PRONTO: fetch GET com loading
async function carregarReceitas(termo = '') {
  const loading = document.getElementById('loading');
  const lista = document.getElementById('lista-receitas');
  loading.style.display = 'block';
  lista.style.opacity = '0.5';
  try {
    const url = termo ? '/api/receitas?q=' + encodeURIComponent(termo) : '/api/receitas';
    const response = await fetch(url);
    if (!response.ok) throw new Error('Erro ' + response.status);
    const json = await response.json();
    exibirReceitas(json.dados);
    document.getElementById('total').textContent = json.total;
  } catch (e) {
    lista.innerHTML = '<p class="erro">Falha ao carregar.</p>';
  } finally {
    loading.style.display = 'none';
    lista.style.opacity = '1';
  }
}

// PRONTO: exibir receitas no DOM (com espaco para foto)
function exibirReceitas(receitas) {
  const lista = document.getElementById('lista-receitas');
  if (receitas.length === 0) {
    lista.innerHTML = '<p class="vazio">Nenhuma receita encontrada.</p>';
    return;
  }
  lista.innerHTML = receitas.map(r => `
    <div class="receita-card" id="receita-${r.id}">
      <div class="foto">
        ${r.foto
          ? '<img src="' + r.foto + '" alt="' + r.titulo + '">'
          : '&#x1F372;'}
      </div>
      <div class="info">
        <h3>${r.titulo}</h3>
        <p>${r.descricao || 'Sem descricao'}</p>
        <span class="tempo">${r.tempo || ''}</span>
      </div>
      <div class="acoes">
        <button class="btn btn-sm btn-edit" onclick="editarReceita(${r.id})">Editar</button>
        <button class="btn btn-sm btn-danger" onclick="removerReceita(${r.id})">Remover</button>
      </div>
    </div>
  `).join('');
}

// ============================================================
// TODO 6: Alterar criarReceita para usar FormData
// Trocar JSON.stringify por new FormData(form)
// Remover headers Content-Type (navegador define sozinho!)
// ============================================================
async function criarReceita(event) {
  event.preventDefault();
  const btn = event.target.querySelector('button');
  btn.disabled = true;
  btn.textContent = 'Salvando...';
  try {
    // TODO: trocar por FormData
    const titulo = document.querySelector('[name="titulo"]').value;
    const descricao = document.querySelector('[name="descricao"]').value;
    const tempo = document.querySelector('[name="tempo"]').value;
    const response = await fetch('/api/receitas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo, descricao, tempo }),
      // TODO: substituir as 3 linhas acima por:
      // body: new FormData(document.getElementById('form-receita')),
      // (sem headers Content-Type!)
    });
    const json = await response.json();
    if (!response.ok) { alert('Erro: ' + json.erro); return; }
    document.getElementById('form-receita').reset();
    carregarReceitas();
  } catch (e) { alert('Falha ao criar.'); }
  finally { btn.disabled = false; btn.textContent = 'Adicionar'; }
}

// PRONTO: editar titulo
async function editarReceita(id) {
  const novoTitulo = prompt('Novo titulo:');
  if (!novoTitulo || !novoTitulo.trim()) return;
  try {
    const res = await fetch('/api/receitas/' + id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo: novoTitulo.trim() }),
    });
    if (res.ok) carregarReceitas();
  } catch (e) { alert('Falha.'); }
}

// PRONTO: remover
async function removerReceita(id) {
  if (!confirm('Remover esta receita?')) return;
  try {
    const r = await fetch('/api/receitas/' + id, { method: 'DELETE' });
    if (r.ok) carregarReceitas();
  } catch (e) { alert('Falha.'); }
}

// PRONTO: debounce
function buscarComDebounce(event) {
  clearTimeout(timerBusca);
  timerBusca = setTimeout(() => carregarReceitas(event.target.value.trim()), 300);
}

carregarReceitas();
