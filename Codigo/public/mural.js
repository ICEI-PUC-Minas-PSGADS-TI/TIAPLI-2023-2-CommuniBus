function postarMensagem() {
    var mensagem = document.getElementById('mensagemInput').value.trim();
    if (mensagem) {
        var mural = document.getElementById('mensagensMural');
        mural.innerHTML += '<div class="mensagem">' + mensagem + '</div>';
        document.getElementById('mensagemInput').value = '';
    } else {
        alert("Por favor, escreva uma mensagem.");
    }
}

function adicionarMensagemAoMural(mensagem) {
    var mural = document.getElementById('mensagensMural');
    var dataFormatada = new Date(dataHora).toLocaleString();
    mural.innerHTML += `<div class="mensagem"><strong>${usuario}</strong> (${dataFormatada}): ${mensagem}</div>`;


function carregarMensagens() {
    var mensagens = JSON.parse(localStorage.getItem('mensagensMural') || '[]');
    mensagens = mensagens.filter(m => Date.now() - m.timestamp < 24 * 60 * 60 * 1000); // Filtrar mensagens das últimas 24 horas
    localStorage.setItem('mensagensMural', JSON.stringify(mensagens)); // Atualizar o localStorage

    var mural = document.getElementById('mensagensMural');
    mural.innerHTML = mensagens.map(m => `<p>${m.mensagemCompleta}</p>`).join('');
}

document.addEventListener('DOMContentLoaded', function() {
    var form = document.getElementById('mensagemForm');
    
    if(form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            var mensagem = document.querySelector('textarea[name="mensagem"]').value;
            console.log('Enviando mensagem: ', mensagem);

            fetch('/postarMensagem', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'mensagem=' + encodeURIComponent(mensagem)
            })
            .then(response => {
                console.log('Resposta recebida do servidor.');
                return response.text();
            })
            .then(text => {
                console.log('Mensagem postada com sucesso:', text);
                // Aqui você atualiza a página com a nova mensagem
            })
            .catch(err => console.error('Erro ao postar mensagem:', err));
        });
    }
});


// Carregar mensagens quando a página for carregada
document.addEventListener('DOMContentLoaded', carregarMensagens);}
