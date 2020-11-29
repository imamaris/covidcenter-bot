'use strict'

// Imports dependencies and set up http server
const express = require('express'),
  bodyParser = require('body-parser'),
  app = express().use(bodyParser.json()) // creates express http server

const {
  queryGraph,
  queryCovidAPI
} = require('../shared')

const ACCESS_TOKEN =
  ''

const DEFAULT_RESPONSE = 'Sorry, cocid doesnt understand :(. If you want to know the latest covid info, please type "total covid in your city". Example: total covid in Jakarta'

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'))

// Creates the endpoint for our webhook 
app.post('/webhook', (req, res) => {  
  let body = req.body;

  // Checks this is an event from a page subscription
  if (body.object === 'page') {

    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {

      // Gets the message. entry.messaging is an array, but 
      // will only ever contain one message, so we get index 0
      if (entry.messaging.length == 0) {
        return
      }

      let webhook_event = entry.messaging[0];
      let message = webhook_event.message;
      if (message != null && message.nlp != null) {
         getMessageFromNlp(message.nlp).then((res) => {
          var messageReply = {
            recipient: {
              id: webhook_event.sender.id,
            },
            message: {
              text: res,
            },
          }
          queryGraph(messageReply, ACCESS_TOKEN)
        })
      }
    });

    // Returns a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});

async function getMessageFromNlp(nlp) {
  if (nlp.intents.length == 0) {
    return DEFAULT_RESPONSE
  }
  switch (nlp.intents[0].name) {
    case 'covid_intents':
      return await getCovidResponse(nlp.entities)
    case 'sentiment_intent':
      return await getSentimentResponse(nlp.traits.sentiment)
    default:
      return DEFAULT_RESPONSE
  }
}

async function getCovidResponse(entities) {
  console.log(entities);
  var city = ''
  var isCovid = false

  // null checker
  if (entities['wit$location:location'] == null || entities['covid:covid'] == null) {
    return DEFAULT_RESPONSE;
  }

  entities['wit$location:location'].forEach(function (c) {
    city = c.body
  })
  entities['covid:covid'].forEach(function (c) {
    if (c.value == "covid") {
      isCovid = true
    }
  })

  if (isCovid && city != '') {
    var res = await getCases(city.toLowerCase())
    var totalCase = res[0]
    var newCase  = res[1]
    var confirmCase = res[2]
    return `We have new ${newCase} cases. Total covid cases in ${city} is ${totalCase} cases, ${confirmCase} confirmed, ${totalCase - confirmCase} deaths.\n
    if you experience the following symptoms, your sense of taste disappears, difficulty breathing, high fever, dry cough, fatigue, immediately do further checks at the referral hospital and after doing the test, if positive it is recommended to do self-quarantine for 14 days at your home. \n\n the following article on how to self quarantine
    good and true according to WHO (World Heart Organization) : https://www.who.int/indonesia/news/novel-coronavirus/new-infographics/self-quarantine
    These are our referral hospitals in ${city}:\n
1. rumah sakit Umum Fatmawati (https://goo.gl/maps/GV6fZRxhEgg2PPjK7)\n
2. rumah sakit Jakarta Medical Centre (https://goo.gl/maps/oPnpyw2edFJcg3ha7)\n
3. rumah sakit Umum Andhika (https://g.page/rsuandhika?share)`
  } else if (isCovid) {
    return 'Sorry, Cocid wants to know what area is Covid? for example, you can retype the number of covid in your city'
  }

  return DEFAULT_RESPONSE;
}

// function to hit API for get total cases and confirm cases
async function getCases(city) {
  // initial number with random
  var totalCase = getRandomNumber(1, 100)
  var newCase = getRandomNumber(1, 10)
  var confirmCase = getRandomNumber(1, totalCase)

  await queryCovidAPI(city).then((res) => {
    // undefined checker
    if (res == undefined || res.length != 3) {
      return [totalCase, newCase, confirmCase];
    }
    // assign when has the data
    if (res[0] > 0) {
      totalCase = res[0];
    }
    if (res[1] > 0) {
      newCase = res[1];
    }
    if (res[2] > 0) {
      confirmCase = res[2];
    }
  })
  return [totalCase, newCase, confirmCase];
}

function getRandomNumber(start, end) {
  return Math.floor(Math.random() * end - start) + start;
}

function getSentimentResponse(sentiment) {
  if (sentiment === undefined ) {
    return 'Is there anything cocid can help?'
  }

  console.log(sentiment[0].value);
  if (sentiment[0].value === 'positive') {
    return 'Great !! keep physical distancing and wear a mask !! :D '
  }

  return 'Yes, i know its a bit sad :( I know its hard, but keep physical distancing <3 '
}

// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {

  // Your verify token. Should be a random string.
  let VERIFY_TOKEN =
    ''
    
  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
    
  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
  
    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      
      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);      
    }
  }
});