const axios = require('axios');
const fs = require('fs');
const path = require('path');

let javaVersion = undefined
let ids = []

// Função para criar a pasta "analises" se não existir
function createAnalisesFolder(folderName) {
  const folderPath = path.join(__dirname, folderName);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }
}



async function setup() {
  try {
    console.log("Realizando setup no servidor...")
    const response = await axios.post('http://192.168.3.146:8080/setup');
    if (response.status !== 200) {
      console.error("Erro ao realizar o setup! " + response.data);
    } else {
      javaVersion = response.headers['version'];
      ids = response.data
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
async function makeAPICall(x, endpoint, parameters) {
  const startTime = new Date().getTime();
  try {
    await axios.get(`http://192.168.3.146:8080/${endpoint}`, {
      params: parameters,
      paramsSerializer: (params) => {
        return Object.entries(params)
          .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
          .join('&');
      },
    });
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
  const directoryPath = path.join(__dirname, 'analises_java_' + javaVersion);
  const filePath = path.join(directoryPath, filename);

  // Verifica se o diretório já existe, se não existir, cria-o.
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }

  // Cria os diretórios necessários no caminho do arquivo.
  const dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }

  fs.writeFileSync(filePath, data, 'utf8');
}

// Função para realizar um número x de chamadas à API e calcular o tempo médio de resposta
async function calculateAverageResponseTime(x, endpoint, getParameters) {
  responseTimes = [];

  // Cria um array de promessas para fazer chamadas simultâneas
  const promises = Array.from({ length: x }, (_, i) => makeAPICall(i + 1, endpoint, getParameters()));

  await Promise.all(promises);

  const averageResponseTime = calculeteEverage(responseTimes);
  const median = calculateMedian(responseTimes);
  const standardDeviation = calculateStandardDeviation(responseTimes);
  const variance = calculateVariance(responseTimes);
  const minTime = calculateMin(responseTimes);
  const maxTime = calculateMax(responseTimes);

  console.log(`Versão do java: ${javaVersion}`)
  console.log(`Número de requisições ${x}`)
  console.log(`Tempo médio de resposta para ${x} chamadas: ${averageResponseTime}ms`);
  console.log(`Mediana: ${median}ms`);
  console.log(`Desvio Padrão: ${standardDeviation}`);
  console.log(`Variância: ${variance}`);
  console.log(`Mínimo: ${minTime}ms`);
  console.log(`Máximo: ${maxTime}ms`);
  console.log(`Falharam ${failedRequests} requisições`);

  const dataToSave = `Java ${javaVersion}\nNúmero de chamadas: ${x}\nTempo médio de resposta: ${averageResponseTime}ms\nMediana: ${median}ms\nDesvio Padrão: ${standardDeviation}\nVariância: ${variance}\nMínimo: ${minTime}ms\nMáximo: ${maxTime}ms\nFalharam ${failedRequests} requisições\n\n\nTempos em millisegundos:\n\n` + responseTimes.join('\n');
  const filename = `${endpoint}/response_times_${x}_requests.txt`;
  saveDataToFile(dataToSave, filename);
}

const getRandomId = () => {
  return { id: ids[Math.floor(Math.random() * ids.length)] }
}

const nada = () => {
  return { }
}


async function main() {
  const numberOfCallsList = [1, 10, 50, 100, 250, 500, 1000, 10000];
  const endpoints = [
    // { name: 'distritos', timeout: 20000, getParameters: nada},
    { name: 'distritoAleatorio', timeout: 20000, getParameters: getRandomId},
    { name: 'processamento', timeout: 20000, getParameters: nada }
  ];

  await setup();
  const executionStartTime = new Date().getTime();

  for (const { name: endpoint, timeout, getParameters} of endpoints) {
    for (const numberOfCalls of numberOfCallsList) {
      failedRequests = 0 
      console.log("===========================================================");
      const startTime = new Date().getTime();
      await calculateAverageResponseTime(numberOfCalls, endpoint, getParameters );
      const endTime = new Date().getTime();

      console.log(`Número de chamadas: ${numberOfCalls}`);
      console.log(`Tempo total de execução: ${endTime - startTime}ms`);

      // Espera o tempo definido antes da próxima iteração
      if(numberOfCalls != numberOfCallsList[numberOfCalls.length - 1]){
        await new Promise(resolve => setTimeout(resolve, timeout));
      }
    }
  }

  const executionEndTime = new Date().getTime();
  console.log(`Tempo total de execução da bateria de testes: ${executionEndTime - executionStartTime}ms`);
}

main(); // Inicia a execução do código
