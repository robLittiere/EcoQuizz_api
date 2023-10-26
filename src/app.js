const express = require("express");
const cors = require("cors");
const quizzRoutes = require("./quizz/routes");
const app = express();

app.use(cors());
app.use("/api/quizz", quizzRoutes);

// Define a root route for testing.
app.get("/", (req, res) => {
  res.send("Welcome to the Quiz API");
});

// Start the server.
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
