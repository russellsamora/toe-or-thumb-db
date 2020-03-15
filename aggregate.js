const request = require("request");

const url = "https://toe-or-thumb-db.herokuapp.com/results";
request(url, (err, response, body) => {
  console.log(body);
});
