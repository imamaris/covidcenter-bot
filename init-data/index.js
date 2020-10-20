const fs = require('fs');
const fetch = require('node-fetch');
const { validateUtterances } = require('../shared')

const DOUBLETAB = '   ';
const fileName = 'init-data/sentiment.tsv'
const intentName = 'sentiment_intent'
const data = fs
  .readFileSync(fileName, 'utf-8')
  .split('\n')
  .map((row) => row.split(DOUBLETAB))

const samples = data.map(([text, trait, value]) => {
  return {
    text: text,
    intent: intentName,
    entities: [],
    traits: [
      {
        trait: trait,
        value: value,
      },
    ],
  }
});

validateUtterances(samples).then((res) => console.log(res))