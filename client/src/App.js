import { useState } from "react";
import "./App.css";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";

<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css"
  integrity="sha384-0evHe/X+R7YkIZDRvuzKMRqM+OrBnVFBL6DOitfPri4tjfHxaWutUpFmBp4vmVor"
  crossorigin="anonymous"
/>;

function App() {
  const [searchText, setSearchText] = useState("");
  const [profileInfo, setProfileInfo] = useState("");
  const [gameList, setGameList] = useState([]);

  function getPlayerGames(event) {
    axios
      .get("http://localhost:4000/past5Games", {
        params: { username: searchText },
      })
      .then(function (response) {
        console.log(response);
        setGameList(response.data[0]);
        setProfileInfo(response.data[1]);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  function timestampToDate(timestamp) {
    var options = {
      year: "numeric",
      month: "2-digit",
      day: "numeric",
    };
    const unixTimestamp = timestamp;
    const dateObject = new Date(unixTimestamp);
    return dateObject.toLocaleString("en-GB", options);
  }
  console.log(gameList);

  function getProfileImage(profileID) {
    var pfpSrc =
      "http://ddragon.leagueoflegends.com/cdn/12.17.1/img/profileicon/" +
      profileID +
      ".png";
    return pfpSrc;
  }

  function isWinner(gameData) {
    var isWinner = false;

    if (gameData.info.teams[0].win) {
      var winningTeamID = 100;
    } else {
      winningTeamID = 200;
    }

    for (var i = 0; i < gameData.info.participants.length; i++) {
      if (gameData.info.participants[i].summonerName === profileInfo.name) {
        if (gameData.info.participants[i].teamId === winningTeamID) {
          isWinner = true;
        }
      }
    }
    return isWinner;
  }

  return (
    <div className="App">
      <>
        <Navbar bg="light" variant="light">
          <Container>
            <Navbar.Brand href="#home">
              <img
                alt=""
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/LoL_icon.svg/1200px-LoL_icon.svg.png"
                width="30"
                height="30"
                className="d-inline-block align-top"
              />{" "}
              League Profile Viewer
            </Navbar.Brand>
            <div className="SearchField">
              <input
                type="text"
                onInput={(e) => setSearchText(e.target.value)}
              ></input>
              <Button variant="primary" onClick={getPlayerGames}>
                Get match history
              </Button>
            </div>
          </Container>
        </Navbar>
      </>

      <div className="full-container">
        <br></br>
        <div className="stats">
          {gameList.length !== 0 ? (
            <>
              <img
                src={getProfileImage(profileInfo.profileIconId)}
                alt="profile avatar"
                width={100}
                height={100}
              ></img>
              <div className="profile-text">
                <h1> {profileInfo.name}</h1>
                <h4>Level: {profileInfo.summonerLevel}</h4>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
        <br></br>
        <div className="flex-container-matches">
          {gameList.length !== 0 ? (
            <>
              {gameList.map((gameData, index) => (
                <>
                  <div
                    style={
                      isWinner(gameData)
                        ? { backgroundColor: "RGBA(0,255,0,0.2)" }
                        : { backgroundColor: "rgba(255, 0, 0, 0.2)" }
                    }
                    className="flex-match"
                  >
                    <div className="match-title">
                      <h2>Game {index + 1}</h2>
                      <h5>
                        Played: {timestampToDate(gameData.info.gameCreation)}
                      </h5>
                    </div>
                    {gameData.info.participants.map(
                      (data, participantIndex) => (
                        <div className="match-content">
                          {data.summonerName === searchText ? (
                            <p>
                              <b>{data.summonerName}</b>, KDA: {data.kills} /{" "}
                              {data.deaths} / {data.assists}
                            </p>
                          ) : (
                            <p>
                              {data.summonerName}, KDA: {data.kills} /{" "}
                              {data.deaths} / {data.assists}
                            </p>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </>
              ))}
            </>
          ) : (
            <>
              {profileInfo.status === 400 ? (
                <>
                  <h2>User not found!</h2>
                </>
              ) : (
                <>
                  <h2>Enter a summoner name!</h2>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
