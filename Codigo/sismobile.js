// const { response } = require("express");

// const app = document.getElementById('root');
// const container = document.createElement('div');
// container.setAttribute('class', 'container');
// app.appendChild(container);

// fetch('http://mobile-l.sitbus.com.br:6060/siumobile-ws-v01/rest/ws/buscarLinhas/retornoJSONListaLinhas')
// console.log(response) 
// .then((response) => response.json())
//     .then((data) => {

//         data.forEach((retornoJSONListaLinha) => {
//             const card = document.createElement('div');
//             card.setAttribute('class', 'card');

//             const h1 = document.createElement('h1');
//             h1.textContent = retornoJSONListaLinha.sgl;

//             const p = document.createElement('p');
//             p.textContent = retornoJSONListaLinha.nom;

//             container.appendChild(card);

//             card.appendChild(h1);
//             card.appendChild(p);
//         });
//     })
//     .catch((error) => {
//         console.error('Erro na API', error);
//     });

// sismobile.js
// sismobile.js
// sismobile.js
//const axios = require('axios');
let markers = [];
let minhaLatitude, minhaLongitude;
let paradasProximasCodigos = []; // Defina no escopo global

function getGeolocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function (position) {
    minhaLatitude = position.coords.latitude;
    minhaLongitude = position.coords.longitude;
    initMap(); // Chame initMap somente depois de obter as coordenadas
  });
} else {
  console.log("Geolocalização não é suportada por este navegador.");
}

var map;


async function main() {
  try {
    const position = await getGeolocation();
    const minhaLatitude = position.coords.latitude;
    const minhaLongitude = position.coords.longitude;

    const response1 = await axios.get(`http://127.0.0.1:4001/proxyParadasProximas?latitude=${minhaLatitude}&longitude=${minhaLongitude}`);
    const parsedData1 = JSON.parse(response1.data.replace('retornoJSON(', '').slice(0, -1));

    if (parsedData1.sucesso) {
      const paradas = parsedData1.paradas;
      exibirParadasProximas(paradas, minhaLatitude, minhaLongitude);
    } else {
      console.error('Falha ao obter paradas próximas:', parsedData1.errorMessage || 'Erro desconhecido');
    }
  } catch (error) {
    console.error('Erro:', error);
  }
}




// Função para exibir linhas de ônibus como links clicáveis
function exibirLinhasOnibus(linhas, codParada) {
  console.log('Exibindo linhas de ônibus para a parada:', codParada);
  const listaLinhas = document.getElementById('lista-linhas-onibus');
  listaLinhas.innerHTML = '';

  linhas.forEach(linha => {
    console.log('Processando linha:', linha);
    const li = document.createElement('li');
    li.textContent = `${linha.num_linha} - ${linha.descricao} - `;

    buscarPrevisoes(codParada).then(previsoes => {
      console.log('Linha atual:', linha.num_linha);
      previsoes.previsoes.forEach(p => console.log('Previsão:', p.sgLin));
      const previsaoLinha = previsoes.previsoes.find(p => p.sgLin.toString() === linha.num_linha.toString());      if (previsaoLinha) {
        console.log('Previsões encontradas:', previsaoLinha);
        li.textContent += 'Próxima chegada: ' + previsaoLinha.prev;
      } else {
        console.log('Sem previsões disponíveis para a linha:', linha.num_linha);
        li.textContent += 'Sem previsões disponíveis';
      }
    }).catch(error => {
      console.error('Erro ao buscar previsões para a linha:', linha.num_linha, error);
    });

    listaLinhas.appendChild(li);
  });
}



function exibirLinhasOnibus(linhas, codParada) {
  console.log('Exibindo linhas de ônibus para a parada:', codParada);
  const listaLinhas = document.getElementById('lista-linhas-onibus');
  listaLinhas.innerHTML = '';

  linhas.forEach(linha => {
    console.log('Processando linha:', linha);
    const li = document.createElement('li');
    li.textContent = `${linha.num_linha} - ${linha.descricao} - `;

    buscarPrevisoes(codParada, linha.cod_linha).then(previsoes => {
      if (previsoes && previsoes.length > 0) {
        console.log('Previsões encontradas:', previsoes);
        li.textContent += 'Próxima chegada: ' + previsoes[0].horarioPrevisto;
      } else {
        console.log('Sem previsões disponíveis para a linha:', linha.num_linha);
        li.textContent += 'Sem previsões disponíveis';
      }
    }).catch(error => {
      console.error('Erro ao buscar previsões para a linha:', linha.num_linha, error);
    });

    listaLinhas.appendChild(li);
  });
}


function buscarPrevisoes(codParada) {
  return axios.get(`http://mobile-l.sitbus.com.br:6060/siumobile-ws-v01/rest/ws/buscarPrevisoes/${codParada}/0/retornoJSON`)
    .then(response => {
      console.log("Resposta da API:", response.data);  // Log para depuração
      const previsoes = JSON.parse(response.data.replace('retornoJSON(', '').slice(0, -1));
      return previsoes;
    })
    .catch(error => {
      console.error("Erro na requisição da API: ", error);
      throw error;
    });
}













function exibirParadasProximas(paradas, minhaLatitude, minhaLongitude) {
  const paradasCarrossel = document.getElementById('paradasCarrossel');

  paradas.slice(0, 10).forEach((parada, index) => {
    paradasProximasCodigos.push(parada.cod);
    console.log("Parada:", parada.y, parada.x); // Adicione esta linha
    console.log("Latitude2:", parada.y, "Longitude2:", parada.x);
    const distancia = calcularDistancia(minhaLatitude, minhaLongitude, parada.y, parada.x) / 1000;
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(parada.y, parada.x),
      map: map,
      title: parada.nome
    });
    markers.push(marker);
    const card = document.createElement('div');
    card.className = 'card';

    const codigo = document.createElement('h3');
    codigo.innerHTML = `Código: ${parada.cod}`;

    const descricao = document.createElement('p');
    descricao.innerHTML = `<strong>Endereço: </strong> ${parada.desc}`;

    const distanciaElemento = document.createElement('p');
    distanciaElemento.innerHTML = `<strong>Distância:</strong> ${distancia.toFixed(2)} km`;

    card.appendChild(descricao);
    card.appendChild(distanciaElemento);

    card.addEventListener('click', async () => {
      window.location.href = `/parada.html?codParada=${parada.cod}`; // Passa o código da parada como parâmetro na URL
    });


    const carouselItem = document.createElement('div');
    carouselItem.className = index === 0 ? 'carousel-item active' : 'carousel-item';

    carouselItem.appendChild(card);
    paradasCarrossel.appendChild(carouselItem);
  });
}

// function exibirLinhasOnibus(linhas) {
//   const container = document.getElementById('lista-linhas-onibus');
//   container.innerHTML = ''; // Limpar conteúdo anterior
//   linhas.forEach(linha => {
//     const linhaElement = document.createElement('li');
//     linhaElement.textContent = `${linha.num_linha} - ${linha.descricao}`;
//     container.appendChild(linhaElement);
//   });
// }






function calcularDistancia(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const lat1Rad = lat1 * (Math.PI / 180);
  const lat2Rad = lat2 * (Math.PI / 180);
  const deltaLat = (lat2 - lat1) * (Math.PI / 180);
  const deltaLon = (lon2 - lon1) * (Math.PI / 180);

  const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) *
    Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distancia = R * c;
  return distancia;
}


$(document).ready(function () {
  $('#carouselExampleControls').on('slide.bs.carousel', function (event) {
    // Remova o destaque de todos os marcadores
    markers.forEach(marker => {
      marker.setIcon(null);
    });

    // Verifique se o marcador existe antes de tentar acessá-lo
    const currentIndex = event.to;
    if (markers[currentIndex]) {
      markers[currentIndex].setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
    }
  });
});

function initMap() {
  var options = {
    zoom: 16,
    center: { lat: minhaLatitude, lng: minhaLongitude }
  }
  map = new google.maps.Map(document.getElementById('map'), options);

  // Adiciona um marcador para a geolocalização do usuário
  var userLocationMarker = new google.maps.Marker({
    position: { lat: minhaLatitude, lng: minhaLongitude },
    map: map,
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 10,
      fillColor: "#00F",
      fillOpacity: 0.8,
      strokeWeight: 0
    },
    title: 'Sua localização'
  });
}

function retornoJSON(data) {
  if (data && data.linhas) {
    const listaLinhasOnibus = document.getElementById('lista-linhas-onibus');
    listaLinhasOnibus.innerHTML = ''; // Limpa a lista atual

    if (data.linhas.length === 0) {
      console.log('Nenhuma linha de ônibus encontrada para esta parada.');
      return;
    }

    data.linhas.forEach(linha => {
      const item = document.createElement('li');
      item.textContent = `${linha.num_linha} - ${linha.descricao}`;
      listaLinhasOnibus.appendChild(item);
    });
  } else {
    console.error('Resposta inválida ou ausente de linhas de ônibus.');
  }
}

async function buscarLinhasDaParada(codParada) {
  try {
    const response = await axios.get(`http://127.0.0.1:4001/proxyLinhasDaParada?codParada=${codParada}`);

    // Correção para tratar a resposta como JSON
    const parsedData = JSON.parse(response.data.replace('retornoJSON(', '').slice(0, -1));
    if (parsedData && parsedData.linhas && Array.isArray(parsedData.linhas)) {
      const linhas = parsedData.linhas;
      exibirLinhasOnibus(linhas, codParada);

      // Por exemplo, atualizar a interface do usuário com as informações das linhas
      linhas.forEach(linha => {
        // Processamento de cada linha
        console.log(linha); // Exemplo de log
        atualizarUIComLinhas(linhas);

      });
    } else {
      console.error("Nenhuma linha encontrada para a parada:", codParada);
    }
  } catch (error) {
    console.error("Erro ao buscar linhas da parada:", error);
  }
}
function atualizarUIComLinhas(linhas) {
  const container = document.getElementById('linhasContainer');
  container.innerHTML = ''; // Limpar conteúdo anterior

  linhas.forEach(linha => {
    const linhaDiv = document.createElement('div');
    linhaDiv.innerHTML = `
          <p>Código da Linha: ${linha.cod_linha}</p>
          <p>Número da Linha: ${linha.num_linha}</p>
          <p>Descrição: ${linha.descricao}</p>
      `;
    container.appendChild(linhaDiv);
  });
}


window.addEventListener('load', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const codParada = urlParams.get('codParada');

  if (codParada) {
    buscarLinhasDaParada(codParada);
  } else {
    console.error('Código da parada não fornecido na URL.');
  }
});



// Chama a função main quando a página é carregada
window.addEventListener('load', main);


