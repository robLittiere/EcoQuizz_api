const { log } = require("console");
const req = require("express/lib/request");
const fs = require("fs");
const OpenAI = require("openai");
require("dotenv").config();

const filePath = "quizz.json"; // Change this to your desired file path
const openai = new OpenAI(process.env.OPENAI_API_KEY);

// Define your functions
function storeIfNecessary(quizz) {
  // Check if file JSON exists
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
  }
  try {
    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    console.log(jsonData);
    jsonData.push({ id: jsonData.length + 1, quizz: quizz });
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
    console.log(matchedTheme);
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
      messages: [{ role: "user", content: "Say this is a test" }],
      model: "gpt-3.5-turbo",
      max_tokens: 355,
    });

    let quizz = chatCompletion.data.choices[0].text;

    return quizz;
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
