const request = require("request");
const d3 = require("d3");
const dataS3 = require("data-s3");

const accessKeyId = process.env.AWS_KEY;
const secretAccessKey = process.env.AWS_SECRET;
const region = process.env.AWS_REGION;
const bucket = process.env.AWS_BUCKET;

const url = "https://toe-or-thumb-db.herokuapp.com/results";

function getDB() {
  return new Promise((resolve, reject) => {
    request(url, (err, response, body) => {
      if (response && response.statusCode === 200) resolve(body);
      else reject(response.statusCode);
    });
  });
}

async function init() {
  try {
    dataS3.init({ accessKeyId, secretAccessKey, region });
    const data = await getDB();
    const path = "misc/toe-or-thumb";
    const file = "data.json";
    await dataS3.upload({ bucket, path, file, data });
  } catch (err) {
    console.log(err);
  }
  process.exit();
}

init();
