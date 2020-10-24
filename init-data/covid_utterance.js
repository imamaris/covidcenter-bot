const fs = require('fs');
const fetch = require('node-fetch');
const { validateUtterances } = require('../shared')

const DOUBLETAB = '   ';
const fileName = 'init-data/covid_intent.tsv'
const intentName = 'covid_intents'
const entityName = 'covid:covid'
const data = fs
  .readFileSync(fileName, 'utf-8')
  .split('\r\n')
  .map((row) => row.split(DOUBLETAB))

const samples = data.map(([text, value, start, end]) => {
  return {
    text: text,
    intent: intentName,
    entities: [
        {
            entity: entityName,
            start: start,
            end: end,
            body: value,
            entities: [],
        }
    ],
    traits: [],
  }
});

validateUtterances(samples).then((res) => console.log(res))