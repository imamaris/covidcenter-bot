const readline = require('readline');
const fetch = require('node-fetch');

// ------------------------------------------------------------
// Config

const NEW_ACCESS_TOKEN = '' // TODO: fill this in
const FIREBASE_CONFIG = {}; // TODO: fill this in
const APP_ID = '995445434256954'; // TODO: fill this in

// ------------------------------------------------------------
// Wit API Calls

function queryWit(text, n = 1) {
  return fetch(
    `https://api.wit.ai/message?v=${APP_ID}&=n=${n}&q=${encodeURIComponent(text)}`, {
      headers: {
        Authorization: `Bearer ${NEW_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    }
  ).then(res => res.json());
}

function validateUtterances(samples) {
  console.log(JSON.stringify(samples))
  return fetch(`https://api.wit.ai/utterances?v=${APP_ID}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${NEW_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(samples),
    })
    .then(res => res.json())
}

function queryGraph(json, access_token) {
  return fetch(
    `https://graph.facebook.com/v8.0/me/messages?access_token=${access_token}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${NEW_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(json),
    }
  ).then((res) => res.json())
}

queryCovidAPI = async (location) => {
  // fetch from API
  resp = await fetch(`https://indonesia-covid-19-api.now.sh/api/provinsi`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  //init data
  var data = await resp.json()
  var totalNumber=0;
  var newCaseNumber=0;
  var revivedNumber=0;

  location = location.toLowerCase()

  // must include intended location
  if (JSON.stringify(data).toLowerCase().includes(location)) {
    // iterate locations
    for (k in data['data']) {
      var provinsi = data['data'][k]

      // search location
      if (provinsi['provinsi'].toLowerCase() == location) {
        totalNumber = provinsi['kasusPosi'];
        newCaseNumber = provinsi['kasusPosi'] - provinsi['kasusSemb'];
        revivedNumber = provinsi['kasusSemb'];
        break;
      }
    }
  }
  return [totalNumber, newCaseNumber, revivedNumber];
}

module.exports = {
  queryWit,
  validateUtterances,
  queryGraph,
  queryCovidAPI,
  NEW_ACCESS_TOKEN,
  FIREBASE_CONFIG,
}
