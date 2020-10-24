## Overview

Figure to explain the result of this tutorial.

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

## Understan Terms in Wit app to do natural language processing (NLP)

Before we train our Wit app, we should learn about intent, entities, traits, and utterances.
If you already learn those terms, you can go to [Next section](https://tbd)

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

<<insert picture here>>

Now that we are understand, let’s train our Wit app to process the user’s response to the app.

## Training your Wit app to do natural language processing (NLP)

Wit AI has two method for training the NLP.
The first is inserting utterances with web interface.
The second one is inserting utterances with API.

### Wit AI Web Interface

TO DO: Change this section
1. Go to [Wit.ai](https://wit.ai/).
2. Create a new Wit.ai app:
    1. Enter a name e.g. _VoiceDemo_
    2. Select **English**
    3. Select **Open** or **Private** for visibility
    4. Click **Create**.
3. Add an utterance:
    1. Make sure you are on the **Train Your App** page by selecting **Understanding** from the left-hand menu.
    1. Type `A` is `B` into the **Utterance** text box.
    2. Label an entity in the utterance by highlighting `B` with your mouse and select `wit/contact` as the Entity type.
4. Add an intent
    1. Click on the **Intent** dropdown.
    2. Enter _Greeting_Intent_ as the name of your new Intent.
    3. Click **Create Intent**.
5. Submit your first utterance by clicking **Train and Validate**. The training should start within a few seconds - you can see the training status in the top right.

![Gif to demo steps to train your Wit app for the Greeting Intent](https://github.com/imamaris/covidcenter-bot/tree/base-setup)

You might have heard that the most important part of machine learning is the training data. At this point, we’ve only provided our Wit app with one data point, so let's think of natural variations that a user might respond with and repeat steps #2 through #4.

Here are some variations that can be added as training utterances:

*   Yeah
*   No
*   Ok
*   Alright
*   Nope

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

TO DO: Change this section

## Integrate Wit with your Messenger Bot

When you download the Tutorial from the [base setup branch](https://github.com/imamaris/covidcenter-bot/tree/base-setup), the app will be capable of doing text and answer with sentiment intent. In this part, we will add how retrieve covid 

### Add an webhook to your Messenger bot

Open the [Wit.ai Covid Center bot demo](https://github.com/imamaris/covidcenter-bot/tree/bot/index.js)) int and run

Next update `API_TOKEN` and `VERIFY_TOKEN` variable to get webhook as follows:

```js

const ACCESS_TOKEN = '' // line 11
let VERIFY_TOKEN = '' // line 74

```

### Deploy your webhook

Run ngrok:

```sh
ngrok http 80
```

### Set your webhook and NLP

```js
```

### Test your chatbot


```js
```

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