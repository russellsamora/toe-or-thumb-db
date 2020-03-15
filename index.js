const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { pool } = require("./config");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");

const app = express();

const production = process.env.NODE_ENV === "production";
const origin = {
  // origin: production ? "https://www.example.com" : "*"
  origin: production ? "*" : "*"
};
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10 // 10 requests,
});

app.use(compression());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(origin));

app.use(limiter);

const getResults = (request, response) => {
  pool.query("SELECT * FROM toe", (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const addAnswer = (request, response) => {
  if (request.body) {
    const { question, answer } = request.body;

    if (typeof question === "number") {
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
    }
  }
};

app
  .route("/answers")
  // POST endpoint
  .post(addAnswer);

app
  .route("/results")
  // GET endpoint
  .get(getResults);

// Start server
app.listen(process.env.PORT || 3002, () => {
  console.log(`Server listening`);
});
