var express = require("express");
var cors = require("cors");
const axios = require("axios");
const { response } = require("express");
var app = express();

app.use(cors());

const API_KEY = "get your own!";

function getPlayerPUUID(playerName) {
  return axios
    .get(
      "https://euw1.api.riotgames.com" +
        "/lol/summoner/v4/summoners/by-name/" +
        playerName +
        "?api_key=" +
        API_KEY
    )
    .then((response) => {
      console.log(response.data);
      return response.data.puuid;
    })
    .catch((err) => err);
}

//get requests, get past 5 games
app.get("/past5Games", async (req, res) => {
  const playerName = req.query.username;
  const PUUID = await getPlayerPUUID(playerName);

  const PROFILE_CALL =
    "https://euw1.api.riotgames.com" +
    "/lol/summoner/v4/summoners/by-puuid/" +
    PUUID +
    "?api_key=" +
    API_KEY;

  const GAMES_CALL =
    "https://europe.api.riotgames.com" +
    "/lol/match/v5/matches/by-puuid/" +
    PUUID +
    "/ids" +
    "?api_key=" +
    API_KEY;

  //get profile info with   PROFILE_CALL
  const profileInfo = await axios
    .get(PROFILE_CALL)
    .then((response) => response.data)
    .catch((err) => err);

  //get ids with GAMES_CALL
  const gameIDs = await axios
    .get(GAMES_CALL)
    .then((response) => response.data)
    .catch((err) => err);

  console.log(gameIDs);
  //loop through games by ID and get info
  var matchDataArray = [];
  for (var i = 0; i < gameIDs.length - 15; i++) {
    const matchID = gameIDs[i];
    const matchData = await axios
      .get(
        "https://europe.api.riotgames.com" +
          "/lol/match/v5/matches/" +
          matchID +
          "?api_key=" +
          API_KEY
      )
      .then((response) => response.data)
      .catch((err) => err);
    matchDataArray.push(matchData);
  }
  //save in array
  res.json([matchDataArray, profileInfo]);
});

app.listen(4000, function () {
  console.log("server started on port 80");
}); //localhost:4000
