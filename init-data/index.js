const fs = require('fs');
const fetch = require('node-fetch');
const {validateSamples} = require('../shared');

const DOUBLETAB = '   ';
const fileName = 'initial-data/sentiment.tsv'
const data = fs
  .readFileSync(fileName, 'utf-8')
  .split('\r')
  .map((row) => row.split(DOUBLETAB))

const samples = data.map(([text, trait, value]) => {
  return {
    text,
    entities: [{
      entity: trait,
      value,
    }, ],
  };
});

validateSamples(samples)
  .then(res => console.log(res));