const { storeIfNecessary, getQuizz } = require("./services.js");

module.exports = {
  getRandomQuizz: async (req, res) => {
    try {
      const quizz = await getQuizz(req);
      res.status(200).json({ quizz });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
