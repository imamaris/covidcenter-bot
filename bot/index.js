'use strict'

// Imports dependencies and set up http server
const express = require('express'),
  bodyParser = require('body-parser'),
  app = express().use(bodyParser.json()) // creates express http server

const { queryGraph } = require('../shared')

const ACCESS_TOKEN =
  ''

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
        var messageReply = {
          recipient: {
            id: webhook_event.sender.id,
          },
          message: {
            text: getSentimentResponse(message.nlp.traits.sentiment),
          },
        }
        queryGraph(messageReply, ACCESS_TOKEN)
      }
    });

    // Returns a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});

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