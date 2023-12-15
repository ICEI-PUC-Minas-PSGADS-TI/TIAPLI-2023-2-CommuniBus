function postarMensagem() {
    var nome = document.getElementById('nomeInput').value.trim();
    var mensagem = document.getElementById('mensagemInput').value.trim();

    if (nome && mensagem) {
        var mural = document.getElementById('mensagensMural');
        var novaMensagem = document.createElement('div');
        novaMensagem.classList.add('mensagem');
        novaMensagem.innerHTML = `<strong>${nome}:</strong> ${mensagem}`;
        mural.appendChild(novaMensagem);
        document.getElementById('mensagemInput').value = '';

        // Adicionar a mensagem ao localStorage
        adicionarMensagemAoLocalStorage(nome, mensagem);
    } else {
        alert("Por favor, preencha seu nome e a mensagem.");
    }
}

// Função para adicionar mensagem ao localStorage
function adicionarMensagemAoLocalStorage(nome, mensagem) {
    var mensagens = JSON.parse(localStorage.getItem('mensagensMural') || '[]');
    var dataHoraAtual = new Date().toLocaleString();
    mensagens.push({ usuario: nome, mensagemCompleta: `${nome}: ${mensagem}`, timestamp: dataHoraAtual });
    localStorage.setItem('mensagensMural', JSON.stringify(mensagens));
}

function apagarTodasMensagens() {
    localStorage.removeItem('mensagensMural');
    carregarMensagensDoLocalStorage(); // Atualiza o mural após remover as mensagens
}


// Função para carregar mensagens do localStorage ao mural
function carregarMensagensDoLocalStorage() {
    var mensagens = JSON.parse(localStorage.getItem('mensagensMural') || '[]');
    var mural = document.getElementById('mensagensMural');
    mural.innerHTML = mensagens.map(m => `<div class="mensagem">${m.mensagemCompleta}</div>`).join('');
}


document.addEventListener('DOMContentLoaded', function() {
    carregarMensagensDoLocalStorage();
});
