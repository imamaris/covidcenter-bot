---
id: improvement
title: Improvement
---

## (Additional) Integrate with covid API

We would like you to integrate the bot to Covid API. In this tutorial, we use [mathdroid covid API](https://github.com/mathdroid/indonesia-covid-19-api). The steps are :
1. Read how you will use the [API](https://github.com/mathdroid/indonesia-covid-19-api). In this case, you should hit [provinsi API](https://github.com/imamaris/covidcenter-bot/pull/20/files#diff-54ae40e35c503792f71f237cb5dec82d1240eba383b1d80e454482c1563f605dR54)
2. Read async and sync in [this stackoverflow post](https://stackoverflow.com/questions/16336367/what-is-the-difference-between-synchronous-and-asynchronous-programming-in-node)
2. Change `bot/index.js` and `shared.js` like the changes in the [PR](https://github.com/imamaris/covidcenter-bot/pull/20/files)
3. Don't forget to change sync to async!
4. Please change as you see fit or want it.

## Review and continue improving your Wit app

As you are testing the app, you might notice that certain utterances are not resolving to the proper intents. To address this, go to [Wit.ai](https://wit.ai/) and on the **Understanding** page you should see utterances that have been sent to the API endpoint. You can review each utterance by expanding one and making sure that the entity is properly identified and resolving to the correct intent. If there are utterances not relevant to your use case (invalid utterances), you can mark them as **Out of Scope**.

## Next Steps

For demonstration purposes, we’ve created a very simple covid bot, but you can create a much more engaging and interactive bot. Try sketching out a larger conversation flow with various scenarios and see Wit [documentation](https://wit.ai/docs) to learn more about other Wit features e.g. other built-in entities, custom entities, and traits.

If you want to add features, we have recommendation feature to add:
1. Finite State Machine [link](https://en.wikipedia.org/wiki/Finite-state_machine).
2. More data to train.
3. Use time entities.

We look forward to what you will develop! To stay connected, join the [Wit Hackers Facebook Group](https://www.facebook.com/groups/withackers) and follow us on [Twitter @FBPlatform](https://twitter.com/fbplatform).

## Contributing
Please make an issue/PR in this [repo](https://github.com/imamaris/covidcenter-bot) if you want to contribute. we will review it.
