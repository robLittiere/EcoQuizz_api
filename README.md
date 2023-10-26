# Ecoquizz API

## What is Ecoquizz

Ecoquizz is a mobile application that allows you to test your knowledge about ecology and the environment. It is available on Android and iOS.
Ecoquizz generates quizzes randomly using LLMs such as chatGPT, davinci, etc.

## How does the API work

Ecoquizz's API is for now a minimalist and very simplistic Express API that allows you to generate a quiz using the OpenAI API.
If you do not have tokens for the OpenAI API, the API will randomly return one of premade quizzes that are store in the quizz.json file.

## Installation

Clone this project, add an .env file at the root of the project and add the following variables:

```
PORT=3000
OPENAI_API_KEY=YOUR_OPENAI_API_KEY
```

Then run the following commands:

```
npm install
node src/app.js
```

The API should be running on localhost:3000

You're good to go ! Happy coding =^-^=

## To test te API

Try the following exemple route :

```
http://localhost:3000/api/quizz/random?theme=Biodiversite
```
