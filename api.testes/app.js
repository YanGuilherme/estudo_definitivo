const axios = require('axios');

async function setup() {
  try {
    const response = await axios.post('http://localhost:8080/setup');
    if (response.status !== 200) {
      console.error("Erro ao realizar o setup! "  + response.data);
    } else {
      console.log("Setup realizado com sucesso! " + response.data);
    }
  } catch (error) {
    console.error(`Erro ao realizar o setup: ${error.message}`);
  }
}

let failedRequests = 0

// Função para realizar uma chamada à API e medir o tempo de resposta
async function makeAPICall(x) {
  const startTime = new Date().getTime();
  let endTime = startTime;

  try {
    const response = await axios.get('http://localhost:8080/distritos');
    endTime = new Date().getTime();

    if (response.status !== 200) {
      console.error(`Erro na chamada ${x}: ${response.data}`);
      failedRequests++
    }
  } catch (error) {
    console.error(`Erro na chamada ${x}: ${error.message}`);
    failedRequests++
  }
  const totalTime = endTime - startTime 
  console.log(`Tempo da chamada ${x}: ${totalTime}ms`)
  return totalTime;
}

// Função para realizar um número x de chamadas à API e calcular o tempo médio de resposta
async function calculateAverageResponseTime(x) {
  let totalTime = 0;

  // Cria um array de promessas para fazer chamadas simultâneas
  const promises = Array.from({ length: x }, (_, i) => makeAPICall(i + 1));

  const responseTimes = await Promise.all(promises);

  for (const responseTime of responseTimes) {
    totalTime += responseTime;
  }

  console.log(`Tempo médio de resposta para ${x} chamadas: ${totalTime / x}ms`);
  console.log(`Falharam ${failedRequests} requisições`);
}

async function main() {
  await setup(); // Espera a conclusão do setup
  const numberOfCalls = 1000; // Número de chamadas à API que deseja realizar
  await calculateAverageResponseTime(numberOfCalls); // Espera a conclusão do cálculo do tempo médio de resposta
}

main(); // Inicia a execução do código
