const fs = require('fs');
var assert = require('assert');

const {
  queryWit
} = require('../shared.js')

const intentName = "covid_intent"
const DOUBLETAB = '   ';
const fileName = 'init-data/datasets/covid_intent_test.tsv'
const data = fs
  .readFileSync(fileName, 'utf-8')
  .split('\n')
  .map((row) => row.split(DOUBLETAB))

describe('API test', function () {
  describe('#covid_intent_test()', function () {
    it('same', function () {
      const samples = data.map(([text, value, start, end]) => {
        queryWit(text).then((res) => {
          assert.equal(res.text, text);
          assert.equal(res.intents[0].name, intentName);
          assert.equal(res.entities["covid:covid"][0].value, value)
          assert.equal(res.entities["covid:covid"][0].start, start)
          assert.equal(res.entities["covid:covid"][0].end, end)
        })
      });
    });
  });
});
