const fs = require('fs');
var assert = require('assert');

const {
  queryWit  
} = require('../shared.js')

const intentName = "sentiment_intent"
const DOUBLETAB = '   ';
const fileName = 'init-data/test.tsv'
const data = fs
  .readFileSync(fileName, 'utf-8')
  .split('\n')
  .map((row) => row.split(DOUBLETAB))

describe('API test', function () {
  describe('#normalTest()', function () {
    it('same', function () {
      const samples = data.map(([text, trait, value]) => {
        queryWit(text).then((res) =>  {
          assert.equal(res.text, text);
          assert.equal(res.intents[0].name, intentName);
          assert.equal(res.traits.sentiment[0].value, negatif);
        })
      });
    });
  });
});
  