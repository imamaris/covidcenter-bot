const fs = require('fs');
const {
  queryWit
} = require('../shared')

const DOUBLETAB = '   ';
const fileName = 'init-data/test.tsv'
const data = fs
  .readFileSync(fileName, 'utf-8')
  .split('\n')
  .map((row) => row.split(DOUBLETAB))

const samples = data.map(([text, trait, value]) => {
  queryWit(text).then((res) => console.log(JSON.stringify(res), trait, value))
});