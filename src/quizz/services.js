const { log } = require("console");
const req = require("express/lib/request");
const fs = require("fs");
const OpenAI = require("openai");
require("dotenv").config();

const filePath = "quizz.json"; // Change this to your desired file path
const openai = new OpenAI(process.env.OPENAI_API_KEY);
const SYSTEM_MESSAGE =
  "You are an assistant that only writes JSON object output. Do not write normal text. Generated JSON will follow this model : {'title' : 'funny_title', 'questions': [{'question': 'question_body','good_answer': 'good_answer','wrong_answers': ['wrong_answers']}],'tokens_used': ['number_of_token_to_generate_response']}";
const PROMPT =
  "You are an assistant that only writes JSON. Do not write normal text. génère un quizz aléatoire sur Energie solaire. Le quizz devrait contenir 8 questions, chacune ayant une question, une bonne réponse et deux réponses incorrectes. génère un JSON bien formaté avec comme modèle le suivant : {'title' : 'funny_title', 'questions': [{'question': 'question_body','good_answer': 'good_answer','wrong_answers': ['wrong_answers']}],'tokens_used': ['number_of_token_to_generate_response']}";

// Store a generated Quizz from GPT in the JSON file
function storeIfNecessary(quizz, reqTheme) {
  // Check if file JSON exists
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({ themes: [] }));
  }
  try {
    // If file is empty, create a theme and add the quizz
    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    if (jsonData.themes.length === 0) {
      jsonData.themes.push({
        name: reqTheme,
        quizzs: [{ id: 1, quizz: quizz }],
      });
      // Write JSONdata to file
      fs.writeFileSync(filePath, JSON.stringify(jsonData));
      return;
    }

    // If theme doesn't exist, create it and add the Quizz
    console.log("jsonData.themes", jsonData.themes);

    let matchedThemes = jsonData.themes.filter(
      (theme) => theme.name.toLowerCase() === reqTheme.toLowerCase()
    );
    if (matchedThemes.length === 0) {
      jsonData.themes.push({
        name: reqTheme,
        quizzs: [{ id: 1, quizz: quizz }],
      });
      // Write JSONdata to file
      fs.writeFileSync(filePath, JSON.stringify(jsonData));
      return;
    }

    // If theme exists, add the quizz
    for (let i = 0; i < jsonData.themes.length; i++) {
      if (jsonData.themes[i].name === reqTheme) {
        jsonData.themes[i].quizzs.push({
          id: jsonData.themes[i].quizzs.length + 1,
          quizz: quizz,
        });
        // Write JSONdata to file
        fs.writeFileSync(filePath, JSON.stringify(jsonData));
        return;
      }
    }
    return;
  } catch (error) {
    console.error("Error reading the file:", error);
  }
}

function getRandomQuizz(reqTheme) {
  try {
    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const matchedThemes = jsonData.themes.filter(
      (theme) => theme.name.toLowerCase() === reqTheme.toLowerCase()
    );
    if (matchedThemes.length === 0) {
      return "No quizz found for this theme";
    }
    if (matchedThemes.length > 1) {
      return "Multiple themes found for this theme";
    }
    const matchedTheme = matchedThemes[0];
    const randomQuizz =
      matchedTheme.quizzs[
        Math.floor(Math.random() * matchedTheme.quizzs.length)
      ];
    return randomQuizz;
  } catch (error) {
    console.error("Error reading the file:", error);
  }
}

async function getQuizz(req) {
  // Get the quizz from chatGPT
  try {
    const chatCompletion = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `  "You are an assistant that only writes JSON. Do not write normal text. génère un quizz aléatoire sur le thème : ${req.query.theme}, sérieux et difficile, avec une blague dans le titre en rapport avec le thème. Le quizz devrait contenir 7 questions, chacune ayant une question, une bonne réponse et deux réponses incorrectes. génère un JSON bien formaté avec comme modèle le suivant : {'title' : 'nom_marrant', 'questions': [{'question': 'question_body','good_answer': 'good_answer','wrong_answers': ['wrong_answers']}]}";`,
        },
      ],
      model: "gpt-3.5-turbo",
      max_tokens: 800,
    });

    console.log("chatCompletion", chatCompletion);

    let quizz = chatCompletion.choices[0].message.content;
    console.log("quizz", quizz);
    console.log("parsedQuizz", JSON.parse(quizz));

    try {
      quizz = JSON.parse(quizz);
      storeIfNecessary(quizz, req.query.theme);
      return quizz;
    } catch (error) {
      console.error("Error parsing the quizz:", error);
      quizz = await getRandomQuizz(req.query.theme);
      return quizz;
    }
  } catch (error) {
    const quizz = await getRandomQuizz(req.query.theme);
    return quizz;
  }
}

// Export your functions
module.exports = {
  storeIfNecessary,
  getRandomQuizz,
  getQuizz,
};
