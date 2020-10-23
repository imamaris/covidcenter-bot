const fs = require('fs');
const {
  queryWit
} = require('../shared')

const DOUBLETAB = '   ';
const fileName = 'init-data/datasets/covid_intent_test.tsv'
const data = fs
  .readFileSync(fileName, 'utf-8')
  .split('\n')
  .map((row) => row.split(DOUBLETAB))

const samples = data.map(([text, value, start, end]) => {
  queryWit(text).then((res) => console.log(JSON.stringify(res), value, start, end))
});