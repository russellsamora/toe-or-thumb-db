const request = require("request");
const d3 = require("d3");
const dataS3 = require("data-s3");

const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const region = process.env.AWS_REGION;
const bucket = process.env.AWS_BUCKET;

function getDB() {
  const url = "https://toe-or-thumb-db.herokuapp.com/results";
  return new Promise((resolve, reject) => {
    request(url, (err, response, body) => {
      if (response && response.statusCode === 200) resolve(body);
      else reject(response.statusCode);
    });
  });
}

function clean(raw) {
  const data = JSON.parse(raw);
  const answers = d3
    .nest()
    .key(d => d.question)
    .rollup(v => {
      const r = v.filter(d => d.answer).length;
      const w = v.length - r;
      return { r, w };
    })
    .entries(data.filter(d => typeof d.question === "number"));
  return {
    updated: new Date().toISOString(),
    answers
  };
}

async function init() {
  try {
    dataS3.init({ accessKeyId, secretAccessKey, region });
    const raw = await getDB();
    const data = clean(raw);
    const path = "misc/toe-or-thumb";
    const file = "data.json";
    await dataS3.upload({ bucket, path, file, data });
  } catch (err) {
    console.log(err);
  }
  process.exit();
}

init();
