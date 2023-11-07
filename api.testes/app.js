const axios = require('axios');
const fs = require('fs');
const path = require('path');

let javaVersion = undefined

// Função para criar a pasta "analises" se não existir
function createAnalisesFolder(folderName) {
  const folderPath = path.join(__dirname, folderName);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }
}

let setupTime = undefined 

async function setup() {
  try {
    console.log("Realizando setup no servidor...")
    const setupStartTime = new Date().getTime();
    const response = await axios.post('http://localhost:8080/setup');
    let setupEndTime = new Date().getTime();
    setupTime = setupEndTime - setupStartTime
    if (response.status !== 200) {
      console.error("Erro ao realizar o setup! " + response.data);
    } else {
      javaVersion = response.headers['version'];
      console.log("Setup realizado com sucesso!");
      createAnalisesFolder('analises_java_' + javaVersion);
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
  try {
    await axios.get('http://localhost:8080/distritos');
  } catch (error) {
    console.error(`Erro na chamada ${x}: ${error.message}`);
    failedRequests++;
  }
  const endTime = new Date().getTime();
  const totalTime = endTime - startTime;
  responseTimes.push(totalTime);
  // console.log(`Tempo da chamada ${x}: ${totalTime}ms`);
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

function calculeteEverage(times) {
  return times.reduce((acc, time) => acc + time, 0) / times.length
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
  const filePath = path.join(__dirname, 'analises_java_' + javaVersion, filename);
  fs.writeFileSync(filePath, data, 'utf8');
}

// Função para realizar um número x de chamadas à API e calcular o tempo médio de resposta
async function calculateAverageResponseTime(x) {
  responseTimes = [];

  // Cria um array de promessas para fazer chamadas simultâneas
  const promises = Array.from({ length: x }, (_, i) => makeAPICall(i + 1));

  await Promise.all(promises);

  const averageResponseTime = calculeteEverage(responseTimes);
  const median = calculateMedian(responseTimes);
  const standardDeviation = calculateStandardDeviation(responseTimes);
  const variance = calculateVariance(responseTimes);
  const minTime = calculateMin(responseTimes);
  const maxTime = calculateMax(responseTimes);

  console.log(`Versão do java: ${javaVersion}`)
  console.log(`Número de requisições ${x}`)
  console.log(`Tempo de setup: ${setupTime}ms`)
  console.log(`Tempo médio de resposta para ${x} chamadas: ${averageResponseTime}ms`);
  console.log(`Mediana: ${median}ms`);
  console.log(`Desvio Padrão: ${standardDeviation}`);
  console.log(`Variância: ${variance}`);
  console.log(`Mínimo: ${minTime}ms`);
  console.log(`Máximo: ${maxTime}ms`);
  console.log(`Falharam ${failedRequests} requisições`);

  const dataToSave = `Java ${javaVersion}\nTempo de setup ${setupTime}ms\nNúmero de chamadas: ${x}\nTempo médio de resposta: ${averageResponseTime}ms\nMediana: ${median}ms\nDesvio Padrão: ${standardDeviation}\nVariância: ${variance}\nMínimo: ${minTime}ms\nMáximo: ${maxTime}ms\nFalharam ${failedRequests} requisições\n\n\nTempos em millisegundos:\n\n` + responseTimes.join('\n');
  const filename = `response_times_${x}_requests.txt`;
  saveDataToFile(dataToSave, filename);
}

async function main() {
  const numberOfCallsList = [1, 10, 50, 100];
  await setup();
  const executionStartTime = new Date().getTime();
  for (const numberOfCalls of numberOfCallsList) {
    console.log("===========================================================")
    const startTime = new Date().getTime();
    await calculateAverageResponseTime(numberOfCalls);
    const endTime = new Date().getTime();
    console.log(`Número de chamadas: ${numberOfCalls}`);
    console.log(`Tempo total de execução: ${endTime - startTime}ms`);
    // Espera 10 segundos antes da próxima iteração
    await new Promise(resolve => setTimeout(resolve, 10000));
  }
  const executionEndTime = new Date().getTime();
  console.log(`Tempo total de execução da bateria de testes: ${executionEndTime - executionStartTime}ms`);
}

main(); // Inicia a execução do código
