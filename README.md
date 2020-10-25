## Overview

Figure to explain the result of this tutorial.

![pic 1](/examples/neutral_positive.png) ![pic 2](/examples/negative.png) ![pic 3](/examples/p_negative.png)
In this tutorial, we will be creating an API-based bot that give information covid to your account. The app will be able to process the user's text and respond to the user data about covid that they want. The key things we will explore is how to:

*   Design the user interaction and Architecture
*   Create and train a Wit app to do natural language processing (NLP)
*   Integrate Wit with your Messenger Bot

## Prerequisites

*   Create a [Wit.ai](https://wit.ai/) account
*   Clone this repository [Wit.ai Covid Center Demo](https://github.com/imamaris/covidcenter-bot) from GitHub
*   Create Facebook App with Messenger [Link](https://to-be-announced-link)
*   Install Ngrok [Link](https://ngrok.com/download) 

## Design the User Interaction

When designing applications with interactions, it's important to understand the various ways that a user may interact with your app. Some techniques that can help with modeling the conversation is writing a script or creating a flow diagram. For our covid app, let's write a script to outline it.

Let's consider the following conversation as the happy path:
```
User: "Morning"/"Hi"

Wit:  "Hi, welcome to the Wit.ai covid center demo. I'm Wit. Would you like newest covid information in your area ?"

User: "Yes"

Wit:  "Where is your domicile ?"

User: "South Jakarta" / (send a location)

Wit: "Today, we have 500 new cases. 100 recovered, 0 died. Please stay at home and please get your test if you have followings indication:
1. Can't smell and taste
2. Out of breathe
3. etc

There is 3 nearest location that you can go for test:

(giving 3 location)
A Hospital
B Drive Thru Check
XYZ Hospital
"

User : "Sad"

Wit : "I know this is hard, cheer up! maybe we soon could meet with our friends, please don't be discouraged"
```

Now let's think about scenarios were the user can deviate:
```

User: "Morning"/"Hi"

Wit:  "Hi, welcome to the Wit.ai covid center demo. I'm Wit. Would you like newest covid information in your area ?"

User: "I want pizza"

Wit:  "Sorry, I didn't get that. Would you like newest covid information in your area ?""

User: "Yeah"

Wit:  "Where is your domicile ?"

User: "South Jakarta" / (send a location)

Wit: "Today, we have 0 new cases. 100 recovered, 0 died. Please stay at home and please get your test if you have followings indication:
1. Can't smell and taste
2. Out of breathe
3. etc

There is 3 nearest location that you can go for test:

(giving 3 location)
A Hospital 
B Drive Thru Check
XYZ Hospital
" 

User : "Nice"

Wit : "Congratulation!! please don't be lulled by this achievement. Stay distancing, stay healthy"
```

There are many other scenarios to consider as well, but for the tutorial let's just focus on these.

## Understand Terms in Wit app to do natural language processing (NLP)

Before we train our Wit app, we should learn about intent, entities, traits, and utterances.
If you already learn those terms, you can go to [Next section](https://github.com/imamaris/covidcenter-bot/blob/master/README.md#training-your-wit-app-to-do-natural-language-processing-nlp)

Case Study:
We want to understand what our end-user wants to perform. For example:

- Ask about the weather
- Book a restaurant
- Open the garage door

The problem is that there a millions of different ways to express a given intent. For instance, all the following expressions should be mapped to the same intent:

"What is the weather in Paris?"
"Give me tomorrow weather in Paris."
"Is it sunny or rainy in Paris now?"

Those expressions are asking about the weather intent. How about entities ? 
Entities is object that referred in the intent of sentence.

"What is the weather in **Paris** ?"
Paris is **city** where we ask about the weather for.

"Give me **tomorrow** weather in **Paris**."
Tomorrow is **time** when we ask about the weather for.

"Is it **sunny** or **rainy** in **Paris** **now**?"
And **sunny** and **rainy** are options what we ask about he weather.

The entities make machine understand what object that related with the intent.
example: "Give me **tomorrow** weather in **Paris**."

Intent: Ask about the weather , Entities: City: Paris Time: Tomorrow
Machine could query to the database in table weather(intent) with paris city and tomorrow queries (entities)

So what is trait ?
Trait is tendency of an intent.
We could give an example of this like sentiment on reaction_intent.

"Sad" (negative)
"OMG :(" (negative)
"I can't believe this. I'm crying" (negative)
"Superb" (positive)

Utterances is sample data which define a sentence to be categorized to an intent and have entities and traits.
This term will be used to train data, for example: 

![pic utterance](/examples/utterance.png)

Now that we are understand, let’s train our Wit app to process the user’s response to the app.

## Training your Wit app to do natural language processing (NLP)

Wit AI has two method for training the NLP.
The first is inserting utterances with web interface.
The second one is inserting utterances with API.

We would like to introduce to you all for two methods. But, because data is supossed to be large,
we emphasize the API method more than Web Interface method in this tutorial.

### Wit AI Web Interface

How to produce sentiment
1. Select Understanding from the left nav and add a sentence you want to do sentiment analysis on.
```
This is amazing!
```
2. Click **Add Trait**. Enter the name of the trait, such as "sentiment".
3. Click the value selector to create a value "positive".
4. Validate your sentence.
5. Select **Traits** from the left nav and select the trait you just created.
6. In the values section, add more values such as "negative" and "neutral".
7. Annotate a few more examples to get more accurate results!

Update: for English apps, you can use our wit/sentiment built-in! It should already appear in your traits dropdown when you click Add Trait.

Your "sentiment" is a trait, which means that it depends on the utterance as a whole (as opposed to a particular word or sequence of words appearing in the sentence). If it is inferred from a keyword or a specific phrase, use an entity instead. Your "sentiment" trait is trained by and for you. The good news is, it will be completely customized to your case. The bad news is, you need to provide several examples for each value :).

For more information on this, see the [Quick Start](https://wit.ai/docs/quickstart) guide.

### Wit AI API

Open the [Wit.ai Covid Center init data script](https://github.com/imamaris/covidcenter-bot/tree/init-data))

Update the `sentiment.tsv` and add
```tsv
Alhamdulillah    sentiment   positif
Kabar buruk   sentiment   negatif
Tidak menyenangkan   sentiment   negatif
Sedih akutu   sentiment   negatif
Huhuhuhu   sentiment   negatif
```

Get Your Seed Token

![overview](/examples/seed_token.png)

In order to start using the Wit.ai API, we need to start with some identification. Make sure you have signed up for [Wit.ai](https://wit.ai) if you haven't already.

Once you have:

1. Go to the `Settings` page of the [Wit console](https://wit.ai/home)
2. Copy the `Server Access Token`

This will be the base token we will use to create other apps. In the code this will be under the variable `NEW_ACCESS_TOKEN`.

Next update `NEW_ACCESS_TOKEN` and `APP_ID` in ../shared.js variable to run the  as follows:
```js
const NEW_ACCESS_TOKEN = '' // TODO: fill this in 
const APP_ID = ''; // TODO: fill this in
```

Run the file with:
```sh
  node init-data/index.js
```

### Test your Wit.AI App with API

Open the [Wit.ai Covid Center init data script](https://github.com/imamaris/covidcenter-bot/tree/init-data))

Update the `test.tsv` and add
```tsv
Alhamdulillah, banyak yg sembuh    sentiment   positif
Kabar jelek   sentiment   negatif
Tidak senang   sentiment   negatif
Sedih bgt akutu   sentiment   negatif
Huhuhuuhuuuuu   sentiment   negatif
```

Run the file with:
```sh
  node init-data/test.js
```

## Integrate Wit with your Messenger Bot

When you download the Tutorial from the [base setup branch](https://github.com/imamaris/covidcenter-bot/tree/base-setup), the app will be capable of doing text and answer with sentiment intent. In this part, we will add how retrieve covid 

Before you begin, you will need to create a few things. Please ensure you have all of the following:
- Facebook Page: A Facebook Page will be used as the identity of your Messenger experience. When people chat with your app, they will see the Page name and the Page profile picture. To create a new Page, visit https://www.facebook.com/pages/create
- Facebook Developer Account: Your developer account is required to create new apps, which are the core of any Facebook integration. You can create a new developer account by going to the Facebook Developers website and clicking the 'Get Started' button.
- Facebook App: The Facebook app contains the settings for your Messenger experience, including access tokens. To create a new app, visit your [app dashboard](https://developers.facebook.com/apps).

### Configure App

Add the Messenger Platform to your Facebook app
1. In the sidebar of your app settings under 'PRODUCTS', click '+ Add Product'.
2. Hover over 'Messenger' to display options.
3. Click the 'Set Up' button.
The Messenger Platform will be added to your app, and the Messenger settings console will be displayed.

### Add an webhook to your Messenger bot

Open the [Wit.ai Covid Center bot demo](https://github.com/imamaris/covidcenter-bot/tree/bot/index.js)) int and run

Next update `API_TOKEN` and `VERIFY_TOKEN` variable to get webhook as follows:

```js
const ACCESS_TOKEN = '' // line 11
let VERIFY_TOKEN = '' // line 74
```

If you want make the code from scratch, you could read [webhook tutorial](https://developers.facebook.com/docs/messenger-platform/getting-started/webhook-setup/)

### Test your webhook

Now that you have all the code in place for a basic webhook, it is time to test it by sending a couple sample requests to your webhook running on localhost.
1. Run the following on the command line to start your webhook on localhost:
```sh
node bot/index.js
```

2. From a separate command line prompt, test your webhook verification by substituting your verify token into this cURL request:
```sh
curl -X GET "localhost:1337/webhook?hub.verify_token=<YOUR_VERIFY_TOKEN>&hub.challenge=CHALLENGE_ACCEPTED&hub.mode=subscribe"
```

If your webhook verification is working as expected, you should see the following:
- `WEBHOOK_VERIFIED` logged to the command line where your node process is running.
- `CHALLENGE_ACCEPTED` logged to the command line where you sent the cURL request.

3. Test your webhook by sending this cURL request:
```sh
curl -H "Content-Type: application/json" -X POST "localhost:1337/webhook" -d '{"object": "page", "entry": [{"messaging": [{"message": "TEST_MESSAGE"}]}]}'
```

If your webhook is working as expected, you should see the following:
- `TEST_MESSAGE` logged to the command line where your node process is running.
- `EVENT RECEIVED` logged to the command line where you sent the cURL request.

### Deploy your webhook

Run ngrok:

```sh
ngrok http 1337
```

![ngrok](/examples/ngrok.png)

We could access your API from https://3c37b05d146e.ngrok.io

### Set your webhook and NLP

After we get https webhook url, and working Wit.API, we change our facebook app webhook and connect our working wit api.

Configure the webhook for your app

![wit messenger](/examples/edit_callback_url.png)

1. In the 'Webhooks' section of the Messenger settings console, click the 'Setup Webhooks' button.
2. In the 'Callback URL' field, enter the ngrok URL for your webhook. (example: https://3c37b05d146e.ngrok.io)
3. In the 'Verify Token' field, enter the verify token for your webhook. See [Step 4 of Webhook Setup](https://developers.facebook.com/docs/messenger-platform/getting-started/webhook-setup/) for further reference.
4. Click 'Verify and Save' to confirm you callback URL.


The Built-in NLP integration with the Page inbox lets you create a Wit.ai app automatically and bootstrap it with past conversations from your Page directly from the Facebook app console settings. These samples that are compiled into your Wit.ai app are based on real conversations your Page has had with your users.

To try the Built-in NLP Page Inbox feature with your Messenger experience, do the following:

![wit messenger](/examples/link_wit_messenger.png)

1. In your app settings, go to Messenger > Settings.
2. Enable built-in NLP for your app.
3. In the 'Select a Model' dropdown, select 'Custom'.
4. Click 'Link to existing Wit App'
5. Choose your app
6. Insert your Wit Server Access Token [See how to get Wit Access Token](https://github.com/imamaris/covidcenter-bot/blob/master/README.md#wit-ai-api)

### Test your chatbot

Now, after you set your webhook and NLP, you could test your chatbot.

![pic 1](/examples/neutral_positive.png) ![pic 2](/examples/negative.png) ![pic 3](/examples/p_negative.png)

### Train covid_intent the Wit API

When the `StreamRecordingRunnable` is finished recording and streaming the voice data, Wit will return the resolved intents and entities in the response. We will need to extract that information from the JSON and respond to the user appropriately.

```js

```

### Train covid_intent the Wit API

When the `StreamRecordingRunnable` is finished recording and streaming the voice data, Wit will return the resolved intents and entities in the response. We will need to extract that information from the JSON and respond to the user appropriately.

```js

```

## Review and continue improving your Wit app

As you are testing the app, you might notice that certain utterances are not resolving to the proper intents. To address this, go to [Wit.ai](https://wit.ai/) and on the **Understanding** page you should see utterances that have been sent to the API endpoint. You can review each utterance by expanding one and making sure that the entity is properly identified and resolving to the correct intent. If there are utterances not relevant to your use case (invalid utterances), you can mark them as **Out of Scope**.

## Next Steps

For demonstration purposes, we’ve created a very simple greeting app, but you can create a much more engaging and interactive voice-enabled app. Try sketching out a larger conversation flow with various scenarios and see our [documentation](https://wit.ai/docs) to learn more about other Wit features e.g. other built-in entities, custom entities, and traits (I recommend the [sentiment analysis trait](https://wit.ai/docs/built-in-entities#wit_sentiment)).

We look forward to what you will develop! To stay connected, join the [Wit Hackers Facebook Group](https://www.facebook.com/groups/withackers) and follow us on [Twitter @FBPlatform](https://twitter.com/fbplatform).


## Related Content

* [Wit Speech API](https://wit.ai/docs/http#post__speech_link)
* [Wit Documentation](https://wit.ai/docs)
* [Wit GitHub](https://github.com/wit-ai)
* [Wit Blog](https://wit.ai/blog)

## Contributing
See the [CONTRIBUTING](CONTRIBUTING.md) file for how to help out.

## License
Wit.ai Android Voice Demo is licensed, as found in the [LICENSE](LICENSE) file.