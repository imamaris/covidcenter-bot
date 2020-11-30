---
id: enhance-bot-parser-for-covid-intent
title: Enhance bot parser for Covid Intent
---


## Enhance bot parser for Covid Intent

The first thing that you have to do is listing your bot behaviours and responses that come from entities that you have.

We have covid_intents which have two entities.
1. Covid entities
2. Location entities

In order to give covid result based on area, the intent should fulfill both entities.
If one of them is not exist, we must asking user for the missing items.

But, in order to make this bot simpler, we avoid [Finite State Machine](https://en.wikipedia.org/wiki/Finite-state_machine).
So we give response how user should send text to bot.

Therefore, this is code you must add to `bot/index.js` in your branch [covid template](https://github.com/imamaris/covidcenter-bot/tree/covid-template/).

bot/index.js

```js

// default response
const DEFAULT_RESPONSE = 'Sorry, cocid doesnt understand :(. If you want to know the latest covid info, please type "total covid in your city". Example: total covid in Jakarta'

function getMessageFromNlp(nlp) {
  // intents checker
  if (nlp.intents.length == 0) {
    return DEFAULT_RESPONSE
  }

  // switch case the intent.
  switch (nlp.intents[0].name) {
    case 'covid_intents':
      return getCovidResponse(nlp.entities)
    case 'sentiment_intent':
      return getSentimentResponse(nlp.traits.sentiment)
    default:
      return DEFAULT_RESPONSE
  }
}

function getCovidResponse(entities) {
  console.log(entities["covid:covid"]);
  var city = ''
  var isCovid = false

  // null checker
  if (entities['wit$location:location'] == null || entities['covid:covid'] == null) {
    return DEFAULT_RESPONSE;
  }

  // iterate to find covid entities and location entities.
  entities['wit$location:location'].forEach(function (c) {
    city = c.body
  })
  entities['covid:covid'].forEach(function (c) {
    if (c.value == "covid") {
      isCovid = true
    }
  })


  if (isCovid && city != '') {
    // covid response when covid and city is available.
    var totalCase = getRandomNumber(1,100)
    var confirmCase = getRandomNumber(1, totalCase)
    return `total covid in ${city} is ${totalCase} cases, ${confirmCase} confirmed, ${totalCase - confirmCase} deaths.\n
    if you experience the following symptoms, your sense of taste disappears, difficulty breathing, high fever, dry cough, fatigue, immediately do further checks at the referral hospital and after doing the test, if positive it is recommended to do self-quarantine for 14 days at your home. \n\n the following article on how to self quarantine
    good and true according to WHO (World Heart Organization) : https://www.who.int/indonesia/news/novel-coronavirus/new-infographics/self-quarantine
    This is referral hospitals in ${city}:\n
1. rumah sakit Umum Fatmawati (https://goo.gl/maps/GV6fZRxhEgg2PPjK7)\n
2. rumah sakit Jakarta Medical Centre (https://goo.gl/maps/oPnpyw2edFJcg3ha7)\n
3. rumah sakit Umum Andhika (https://g.page/rsuandhika?share)`
  } else if (isCovid) {
    // response when location is not provided (ask the location and give how they should give message)
    return 'Sorry, Cocid wants to know what area is Covid? for example, you can retype the number of covid in your city'
  }

  return DEFAULT_RESPONSE;
}

// random the total case 
function getRandomNumber(start, end) {
  return Math.floor(Math.random() * end-start) + start
}
```

and change the function `getSentimentResponse` to `getMessageFromNlp` on post webhook.
```js
- text: getSentimentResponse(message.nlp.traits.sentiment),
+ text: getMessageFromNlp(message.nlp),
```
Now you can try your bot on facebook messenger, repeat step [Deploy your webhook ](#deploy-your-webhook)from start to finish your setup messenger.

Enjoy, and hack your bot !!! 🤖 📱 

🏆🏆🏆

<p align="center">
<img src="./assets/test_messenger_footer.gif" width="40%">
</p>

