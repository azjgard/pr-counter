require("dotenv").config();
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const AUTHORIZATION = `token ${process.env.TOKEN}`;
const ACTION = process.env.ACTION;
const REPO_PATH = process.env.REPO_PATH;

const FILE_PATH = path.resolve(__dirname, "pr-data.json");

switch (ACTION) {
  case "pull-data":
    pullData();
    break;
  case "analyze-data":
    analyzeData();
    break;
  default:
  case "pull-and-analyze-data":
    pullAndAnalyzeData();
    break;
}

function readFile(path, options) {
  return new Promise(resolve =>
    fs.readFile(path, options, (err, data) => {
      if (err) throw err;
      resolve(data);
    })
  );
}

function writeFile(path, data, options) {
  return new Promise(resolve =>
    fs.writeFile(path, data, options, (err, data) => {
      if (err) throw err;
      resolve(data);
    })
  );
}

async function pullData() {
  async function fetchData(page = 1) {
    const { data } = await axios.get(
      `https://api.github.com/repos/${REPO_PATH}/pulls?state=closed&page=${page}&per_page=100`,
      {
        headers: { Authorization: AUTHORIZATION }
      }
    );

    console.log(`Page ${page}:\t\tFetched ${data.length} PRs`);

    const hasMore = data.length === 100;

    if (hasMore) {
      return [...data, ...(await fetchData(page + 1))];
    } else {
      return data;
    }
  }

  const data = await fetchData();
  console.log(`Fetched ${data.length} PRs in total`);

  await writeFile(FILE_PATH, JSON.stringify({ data }), { encoding: "utf-8" });
  console.log(`Wrote PR data to ${FILE_PATH}`);
}

async function analyzeData() {
  const rawData = await readFile(FILE_PATH);
  const pullRequestArray = JSON.parse(rawData).data;

  console.log("Total pull requests: " + pullRequestArray.length);

  const pullRequestsByLogin = pullRequestArray.reduce(
    (obj, pr) => ({
      ...obj,
      [pr.user.login]: [...(obj[pr.user.login] || []), pr]
    }),
    {}
  );

  const loginBlacklist = ["dependabot-preview[bot]"];
  const usernames = Object.keys(pullRequestsByLogin);

  usernames.forEach(username => {
    const numPrs = pullRequestsByLogin[username].length;
    if (loginBlacklist.indexOf(username) === -1) {
      console.log(`${username}:\t${numPrs}`);
    }
  });
}

async function pullAndAnalyzeData() {
  await pullData();
  await analyzeData();
}
