// Configure a URL do seu backend aqui
const API_URL = "https://recados-backend.onrender.com";

async function carregarRecados() {

  const container = document.getElementById("recados");
  const mensagem = document.getElementById("mensagem");

  container.innerHTML =
    '<div class="loading">⏳ Carregando recados...</div>';

  mensagem.innerHTML = '';

  try {

    const response = await fetch(`${API_URL}/recados`);

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const dados = await response.json();

    if (dados.recados.length === 0) {
      container.innerHTML =
        '<p style="text-align:center;color:#999;">Nenhum recado encontrado</p>';
      return;
    }

    container.innerHTML = dados.recados.map(recado => `
      <div class="recado">

        <h3>${recado.mensagem}</h3>

        <div class="recado-meta">
          <span class="autor">${recado.autor}</span>
          <span>📅 ${recado.data}</span>
          <span>⏰ ${recado.hora}</span>
          <span>🆔 ID: ${recado.id}</span>
        </div>

        <button
          class="btn-excluir"
          onclick="excluirRecado(${recado.id})">
          Excluir
        </button>

      </div>
    `).join('');

  } catch (erro) {

    console.error("Erro ao carregar recados:", erro);

    mensagem.innerHTML = `
      <div class="error">
        ❌ Erro ao conectar ao backend: ${erro.message}
        <br/>
        <small>
          Verifique se a URL está correta:
          ${API_URL}
        </small>
      </div>
    `;

    container.innerHTML = '';
  }
}

async function criarRecado() {

  const autor =
    document.getElementById("autor").value.trim();

  const mensagemRecado =
    document.getElementById("mensagemRecado").value.trim();

  const mensagem =
    document.getElementById("mensagem");

  if (!autor || !mensagemRecado) {

    mensagem.innerHTML =
      '<div class="error">❌ Autor e mensagem são obrigatórios!</div>';

    return;
  }

  try {

    const response = await fetch(`${API_URL}/recados`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        autor,
        mensagem: mensagemRecado
      })
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    mensagem.innerHTML =
      '<div class="success">✅ Recado criado com sucesso!</div>';

    document.getElementById("autor").value = '';
    document.getElementById("mensagemRecado").value = '';

    setTimeout(() => {

      carregarRecados();

      mensagem.innerHTML = '';

    }, 1500);

  } catch (erro) {

    console.error("Erro ao criar recado:", erro);

    mensagem.innerHTML = `
      <div class="error">
        ❌ Erro ao criar recado: ${erro.message}
      </div>
    `;
  }
}

async function excluirRecado(id) {

  try {

    const response = await fetch(`${API_URL}/recados/${id}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    carregarRecados();

  } catch (erro) {

    console.error("Erro ao excluir recado:", erro);

    document.getElementById("mensagem").innerHTML = `
      <div class="error">
        ❌ Erro ao excluir recado: ${erro.message}
      </div>
    `;
  }
}

// Carregar recados ao abrir a página
document.addEventListener("DOMContentLoaded", carregarRecados);