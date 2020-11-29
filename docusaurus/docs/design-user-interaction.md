## Design the User Interaction

When designing applications with interactions, it's important to understand the various ways that a user may interact with your app. Some techniques that can help with modeling the conversation is writing a script or creating a flow diagram. For our covid app, let's write a script to outline it.

![alt text](./assets/flow_new.png 'Cara Kerja Aplikasi')

Let's consider the following conversation as the happy path:
```
User: "Good morning, what is this bot for?"

Wit:  "Sorry, Cocid doesn't understand :(. If you want to know the latest covid info, please type "total covid in your city". Example: total covid in Jakarta"

User: "Total covid in Jakarta"

Wit:  "total covid in jakarta is 10 case, 1 confirmed, 9 deaths.\n
If you experience the following symptoms, your sense of taste disappears, difficulty breathing, high fever, dry cough, fatigue, immediately do further checks at the referral hospital and after doing the test, if positive it is recommended to do self-quarantine for 14 days at your home. \n\n the following article on how to self quarantine
good and true according to WHO (World Heart Organization) :

https://www.who.int/indonesia/news/novel-coronavirus/new-infographics/self-quarantine

This is referral hospitals in Jakarta :\n
1. rumah sakit Umum Fatmawati (https://goo.gl/maps/GV6fZRxhEgg2PPjK7)\n
2. rumah sakit Jakarta Medical Centre (https://goo.gl/maps/oPnpyw2edFJcg3ha7)\n
3. rumah sakit Umum Andhika (https://g.page/rsuandhika?share)`?"

User: "Alhamdulillah" / (send a location)

Wit: "Great, if you feel good !! keep physical distancing yaaa :D"

```

There are many other scenarios to consider as well, but for the tutorial let's just focus on these.
