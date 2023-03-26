# caprice.ai

This project was created as part of an AI Hackathon. Where the idea was to levarage available AI models and use them to create something based on the certain themes.
`Mental well being` was the chosen theme for this particular one.

## Setup

- Make sure you have nodejs installed on your machine.
- Download the code.
- Run `npm install` in the root director of the downloaded code.
- In case you see errors with the above command run `npm install --legacy-peer-deps`

## Development server

After the setup run `npm run start` for a dev server. Navigate to `http://localhost:4200/`.

## What does the application do

This application captures the users video and attempts to classify their facial expression in one of the seven categories.

- angry
- disgust
- fear
- happy
- neutral
- sad
- surprise

As an additional confirmation, it also asks the user to describe how are they feeling and based on the response attempts to classify the respose also into an emotion using a pre trained model based on BERT.

Based on the the deduction of the video and the answer the system finds some relevant music and plays that for the user. The user also has option to listen to jokes, look at some memes or try AI powered image creation.

## Music

In the music section the user can search of their preffered music using text/voice search.
The user can control the playing music using hand signals which leverage another pre-trained AI model to detect hand signals.
Create and access palylist's.

## AI Draw

The the art section the user can describe what kind of an image they would like to visualize and the system using a pre-trained AI model generates and presents the same to the user. In this section too the user can leverage text/voice search.

## Jokes

In the jokes section, the system pulls joke from an open source API. The system dictates the jokes and also present the same in text format too.

## Memes

In the memes section the system pulls random memes from reddit and present the same to the user. As of now only image memes are supported.

## Future scope and enhancements

- The facial recognititon model can be fine tuned and the accuracy can be improved. As the performamce in detecting the negative emotions is not that good.
- Facial rxpression recognition using images can be done.
- Speech recognition can be improved and implemented to make the system completely handsfree.
- Hand signal detection model can be trained to recognize more singnals can actually help in some real world problems too.
- Image description and text from image AI models can be used to describe the memes.
- The system runs serverless as of now. But by building a robust the capabilities of the application can be improved a lot.
- Use a chat based model to add a feature for chit chat, where a user can just say/ask some random stuff and the system provides an appropriate response.
- The music recommendation system can be improved to suggest more appropriate and personalized music, taking past history, preffered language into consideration.

### AI Capabilities used

- Speech recognition.
- Text to speech
- Hand singnal detection
- Face detection
- Faccial expression recognition
- AI Image creation
