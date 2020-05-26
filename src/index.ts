const fs = require('fs');
const request = require('request-promise');
const { promisify } = require('util');
const writeFile = promisify(fs.writeFile);

async function getCsvFromUrl(url: string) {
  console.log('Fetching from:  ' + url);
  let contents: string;
  try {
    let contents = await request(url);
    return contents;
  } catch (err) {
    console.log(err);
  }
}

function processData(contents: string) {
  if (!contents) throw 'Nope! Contents is empty.';
  console.log('Processing data');
  let rows: string[];
  let quotes = [];
  rows = contents.split('\n');
  rows.forEach((i: string) => {
    let columns: string[];
    columns = i.split(',');
    let base: string = columns[0];
    let quote: string = columns[1];
    let daily: number = parseFloat(columns[5]);
    if (base !== quote && Math.abs(daily) >= 80) {
      if (daily > 0) daily = daily - 80;
      else daily = daily + 80;
      daily = daily * 5;
      quotes.push({ base: base, quote: quote, daily: daily });
    }
  });
  return quotes;
}

function filterData(quotes: object[], whitelist?: string[]) {
  if (!whitelist) {
    console.log('Applying filters. No whitelist found! Showing everything.');
    return quotes;
  } else {
    console.log('Applying filters. Whitelist: ' + whitelist);
    return quotes.filter(function (i) {
      if (
        whitelist.includes(i['base'].slice(0, 3)) &&
        whitelist.includes(i['base'].slice(-3)) &&
        whitelist.includes(i['quote'].slice(0, 3)) &&
        whitelist.includes(i['quote'].slice(-3))
      ) {
        return true;
      } else return false;
    });
  }
}

function constructJson(data: object[]) {
  console.log('Reticulating splines');
  let nodes = [];
  let links = [];

  data.map(function (i) {
    if (
      !nodes.find(function (j) {
        if (i['base'] === j['id']) return true;
        else return false;
      })
    ) {
      nodes.push({ id: i['base'], group: 1 });
      // check if a link between then source and destination has been created
      if (
        !links.find(function (j) {
          if (i['base'] === j['target'] && i['quote'] === j['source'])
            return true;
          else return false;
        })
      )
        links.push({
          source: i['base'],
          target: i['quote'],
          coefficient: i['daily']
        });
    }
  });

  return { nodes: nodes, links: links };
}

async function writeJsonToFile(json: object) {
  await writeFile('correlation.json', JSON.stringify(json, null, 2));
}

async function main() {
  let contents = await getCsvFromUrl(
    'https://www.mataf.io/api/tools/csv/correl/snapshot/forex/50/correlation.csv'
  );
  let quotes = processData(contents);

  let whitelist = ['AUD', 'USD', 'CHF', 'JPY', 'EUR', 'CAD', 'GBP', 'SGD'];
  let filtered = filterData(quotes);
  let json = constructJson(filtered);
  await writeJsonToFile(json);
}

main();
