const router = require("express").Router();
const controllers = require("./controllers.js");

router.get("/random", controllers.getRandomQuizz);

module.exports = router;
