## Overview

In this tutorial, we will be creating an API-based bot that give information covid to your account. The app will be able to process the user's text and respond to the user data about covid that they want. The key things we will explore is how to:

*   Design the user interaction
*   Create and train a Wit app to do natural language processing (NLP)
*   Integrate Wit with your Android app

## Prerequisites

*   Create a [Wit.ai](https://wit.ai/) account
*   Download the [Wit.ai Covid Center Demo base-setup](https://github.com/imamaris/covidcenter-bot/tree/base-setup) branch from GitHub
*   Have an whatsapp API bot key from [Link](https://to-be-announced-link)

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

```

There are many other scenarios to consider as well, but for the tutorial let's just focus on these.

## Add an introduction to your bot

Open the [Wit.ai Covid Center demo base-setup](https://github.com/imamaris/covidcenter-bot/tree/base-setup)) int and run

Next update `greetText` function to include the introduction announcement as follows:

```js
import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

var schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      hello: {
        type: GraphQLString,
        resolve() {
          return 'hello world';
        },
      },
    },
  }),
});

}
```
 
## Training your Wit app to do natural language processing (NLP)

Now that the Android app can res the introduction, let’s train our Wit app to process the user’s response to the app.

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


### Extend entities with inclusive and diverse data

A machine learning model is the product of the data it trains on, so when providing sample utterances make sure to provide a diverse array that is inclusive.

So far, besides my name — `B` — we've only provided euro-centric names for training the model. If there isn't diversity in the names, my name might not be recognized as a name and might be interpreted as a pan that you fry things on.

For example, here are some utterances with more diverse names that we can add:

*   Yeah
*   No
*   Ok
*   Alright
*   Nope

## Integrate Wit with your Bot

When you download the Android Wit.ai Voice Demo from the [base setup branch](https://github.com/imamaris/covidcenter-bot/tree/base-setup), the app will be capable of doing text to speech. In this part, we will enable voice processing capabilities by streaming the user’s voice audio (or utterance) to the [Wit Speech API](https://wit.ai/docs/http/20200513#post__speech_link) via HTTP. For this tutorial, we will use [OkHttp](https://square.github.io/okhttp/) as the HTTP client for making requests.

### Initialize the HTTP client to communicate with Wit Speech API endpoint

Open .... and make the following updates:

```js

```

### Capture and stream the user's voice response to Wit for processing

With a configured HTTP client, let's add the package `FSM` to manage state user response and have it streamed to the Wit API for processing.

```js
```

### Wireup `ask location` to start fetching related data

With a configured HTTP client, let's add the `location` module to get related data from location and have it streamed to the Wit API for processing.

```js
```

### Respond to the user based on the Wit results from Speech API

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