const axios = require('axios');

async function setup() {
    const response = await axios.get('http://localhost:8080/setup');
    if(response.status != 200){
        console.error("Erro ao realizar o setup!")
    } else {
        console.log("Setup realizado com sucesso!")
    }
}

// Função para realizar uma chamada à API e medir o tempo de resposta
async function makeAPICall(x) {
  const startTime = new Date().getTime();
  const endTime = startTime
  try {
    const response = await axios.get('http://localhost:8080/distritos');
    endTime = new Date().getTime();
    
    if (response.status !== 200) {
      console.error(`Erro na chamada ${x}: ${response.body}`);
    }
    
  } catch (error) {
    console.error(`Erro na chamada ${x}: ${error.message}`);
  }
  return endTime - startTime;
}

// Função para realizar um número x de chamadas à API e calcular o tempo médio de resposta
async function calculateAverageResponseTime(x) {
  let totalTime = 0;

  for (let i = 0; i < x; i++) {
    const responseTime = await makeAPICall(x);
    totalTime += responseTime;
    console.log(`Chamada ${i + 1}: Tempo de resposta ${responseTime}ms`);

  }

  const averageResponseTime = totalTime / x;
  console.log(`Tempo médio de resposta para ${x} chamadas: ${averageResponseTime}ms`);
}

// Número de chamadas à API que deseja realizar
const numberOfCalls = 10; // Substitua pelo número desejado

calculateAverageResponseTime(numberOfCalls);
