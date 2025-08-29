let estadoInput = document.getElementById("estado");
let cidadeSelect = document.getElementById("cidade");
let procurarBtn = document.querySelector("button");
let temperatura = document.getElementById("temperatura");
let vento = document.getElementById("vento");

async function apiEstado(estadoSigla) {
  const urlEstado = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoSigla}/municipios`;

  try {
    const requisicao = await fetch(urlEstado);
    const resposta = await requisicao.json(); //transforma os dados da api em json

    cidadeSelect.innerHTML = '<option value="">Escolha a cidade.</option>';

    if (resposta && resposta.length > 0) {
      resposta.forEach(cidade => { // percorre todos os dados coletados da api, array
        let option = document.createElement("option"); // cria novos elementos dentro do select, que seria novas opçoes
        option.value = cidade.nome; //pega as cidades dentro da api que sao guardadas como 'nome'
        option.textContent = cidade.nome; //mostra la no html
        cidadeSelect.appendChild(option);
      });
    } else {
        let naoEncontrado = document.getElementById('info')
      naoEncontrado.textContent = ("Nenhuma cidade encontrada");
    }
  } catch (erro) {
    console.error("Erro ao buscar cidades:", erro);
  }
}

async function apiBuscarCidade(cidade) {
  const urlCidade = `https://geocoding-api.open-meteo.com/v1/search?name=${cidade}&count=1&language=pt&format=json`;
  try {
    const requisicao = await fetch(urlCidade);
    const resposta = await requisicao.json();

    if (resposta.results && resposta.results.length > 0) { // se a resposta que for coletada da api existir e tiver a quantidade maior que 0 de dados la(se tudo for true) sera executado 
      let latitude = resposta.results[0].latitude; //pega a resposta depois, pega dentro da resposta do array resultados, na latitude
      let longitude = resposta.results[0].longitude;
      apiLatitudeClima(latitude, longitude);
    } else {
      let naoEncontrado = document.getElementById('info')
      naoEncontrado.textContent = ("Nenhuma cidade encontrada");
    }
  } catch (erro) {
    console.error("Erro ao buscar cidade:", erro);
  }
}

async function apiLatitudeClima(latitude, longitude) {
  const urlClima = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m`;

  try {
    const requisicao = await fetch(urlClima);
    if (!requisicao.ok) throw new Error("Erro ao buscar clima");

    const resposta = await requisicao.json();
    let temperaturaapi = resposta.current.temperature_2m;
    let ventoapi = resposta.current.wind_speed_10m;

    temperatura.textContent = `${temperaturaapi} °C`;
    vento.textContent = `${ventoapi} km/h`;
  } catch (erro) {
    console.error("Erro ao buscar clima:", erro);
  }
}


estadoInput.addEventListener("change", () => {
  let estado = estadoInput.value.trim().toUpperCase(); //tira os espaçoa vazio e coloca como se fosse tudo maiusculo
  if (estado !== "") {
    apiEstado(estado);
  }
});

procurarBtn.addEventListener("click", () => {
  let cidade = cidadeSelect.value;
  if (cidade !== "") {
    apiBuscarCidade(cidade);
  } else {
    let selecionarCidade = document.getElementById('info')
    selecionarCidade.textContent = ("Selecione uma cidade primeiro");
  }
});

async function naoEncontrado(apiEstado){
    const urlEstado = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoSigla}/municipios`;
    const requisicao = await fetch(urlEstado);
    const resposta = await requisicao.json();

    if(!resposta){

    }
}
