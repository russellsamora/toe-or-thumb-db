const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { pool } = require("./config");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const getAnswers = (request, response) => {
  pool.query("SELECT * FROM toe", (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const addAnswer = (request, response) => {
  const { question, answer } = request.body;

  pool.query(
    "INSERT INTO toe (question, answer) VALUES ($1, $2)",
    [question, answer],
    error => {
      if (error) {
        throw error;
      }
      response
        .status(201)
        .json({ status: "success", message: "Answer added." });
    }
  );
};

app
  .route("/answers")
  // GET endpoint
  .get(getAnswers)
  // POST endpoint
  .post(addAnswer);

// Start server
app.listen(process.env.PORT || 3002, () => {
  console.log(`Server listening`);
});
