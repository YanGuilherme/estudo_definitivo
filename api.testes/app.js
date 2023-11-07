const axios = require('axios');
const fs = require('fs');
const path = require('path');


// Função para criar a pasta "analises" se não existir
function createAnalisesFolder() {
  const folderPath = path.join(__dirname, 'analises');
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }
}

async function setup() {
  createAnalisesFolder();

  try {
    console.log("Realizando setup no servidor...")
    const response = await axios.post('http://localhost:8080/setup');
    if (response.status !== 200) {
      console.error("Erro ao realizar o setup! " + response.data);
    } else {
      console.log("Setup realizado com sucesso! " + response.data);
    }
  } catch (error) {
    console.error(`Erro ao realizar o setup: ${error.message}`);
  }
}

let failedRequests = 0;
let responseTimes = [];

// Função para realizar uma chamada à API e medir o tempo de resposta
async function makeAPICall(x) {
  const startTime = new Date().getTime();
  let endTime = startTime;

  try {
    const response = await axios.get('http://localhost:8080/distritos');
    endTime = new Date().getTime();

    if (response.status !== 200) {
      console.error(`Erro na chamada ${x}: ${response.data}`);
      failedRequests++;
    }
  } catch (error) {
    console.error(`Erro na chamada ${x}: ${error.message}`);
    failedRequests++;
  }
  const totalTime = endTime - startTime;
  responseTimes.push(totalTime);
  console.log(`Tempo da chamada ${x}: ${totalTime}ms`);
  return totalTime;
}

// Função para calcular a mediana dos tempos de resposta
function calculateMedian(times) {
  const sortedTimes = [...times].sort((a, b) => a - b);
  const middle = Math.floor(sortedTimes.length / 2);
  if (sortedTimes.length % 2 === 0) {
    return (sortedTimes[middle - 1] + sortedTimes[middle]) / 2;
  } else {
    return sortedTimes[middle];
  }
}

// Função para calcular o desvio padrão dos tempos de resposta
function calculateStandardDeviation(times) {
  const mean = times.reduce((acc, time) => acc + time, 0) / times.length;
  const squaredDifferences = times.map(time => (time - mean) ** 2);
  const variance = squaredDifferences.reduce((acc, diff) => acc + diff, 0) / times.length;
  return Math.sqrt(variance);
}

// Função para calcular a variância dos tempos de resposta
function calculateVariance(times) {
  const mean = times.reduce((acc, time) => acc + time, 0) / times.length;
  const squaredDifferences = times.map(time => (time - mean) ** 2);
  return squaredDifferences.reduce((acc, diff) => acc + diff, 0) / times.length;
}

// Função para calcular o valor mínimo dos tempos de resposta
function calculateMin(times) {
  return Math.min(...times);
}

// Função para calcular o valor máximo dos tempos de resposta
function calculateMax(times) {
  return Math.max(...times);
}

// Função para salvar os tempos e os parâmetros em um arquivo .txt
function saveDataToFile(data, filename) {
  const filePath = path.join(__dirname, 'analises', filename);
  fs.writeFileSync(filePath, data, 'utf8');
}

// Função para realizar um número x de chamadas à API e calcular o tempo médio de resposta
async function calculateAverageResponseTime(x) {
  let totalTime = 0;
  responseTimes = [];

  // Cria um array de promessas para fazer chamadas simultâneas
  const promises = Array.from({ length: x }, (_, i) => makeAPICall(i + 1));

  await Promise.all(promises);

  const averageResponseTime = totalTime / x;
  const median = calculateMedian(responseTimes);
  const standardDeviation = calculateStandardDeviation(responseTimes);
  const variance = calculateVariance(responseTimes);
  const minTime = calculateMin(responseTimes);
  const maxTime = calculateMax(responseTimes);

  console.log(`Tempo médio de resposta para ${x} chamadas: ${averageResponseTime}ms`);
  console.log(`Mediana: ${median}ms`);
  console.log(`Desvio Padrão: ${standardDeviation}`);
  console.log(`Variância: ${variance}`);
  console.log(`Mínimo: ${minTime}ms`);
  console.log(`Máximo: ${maxTime}ms`);
  console.log(`Falharam ${failedRequests} requisições`);

  const dataToSave = `Número de chamadas: ${x}\nTempo médio de resposta: ${averageResponseTime}ms\nMediana: ${median}ms\nDesvio Padrão: ${standardDeviation}\nVariância: ${variance}\nMínimo: ${minTime}ms\nMáximo: ${maxTime}ms\nFalharam ${failedRequests} requisições\n\n\nTempos em millisegundos:\n\n` + responseTimes.join('\n');
  const filename = `response_times_${x}_requests.txt`;
  saveDataToFile(dataToSave, filename);
}

async function main() {
  await setup(); // Espera a conclusão do setup
  const numberOfCalls = 10; // Número de chamadas à API que deseja realizar
  await calculateAverageResponseTime(numberOfCalls); // Espera a conclusão do cálculo do tempo médio de resposta
}

main(); // Inicia a execução do código
