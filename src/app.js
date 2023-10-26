const express = require("express");
const app = express();

app.use("/api/quizz", require("./quizz/routes"));

// Define a root route for testing.
app.get("/", (req, res) => {
  res.send("Welcome to the Quiz API");
});

// Start the server.
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
