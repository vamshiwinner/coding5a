const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "moviesData.db");
let db = null;
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();
function getResponce(eachMovie) {
  return {
    movieName: `${eachMovie.movie_name}`,
  };
}
app.get("/movies/", async (request, responce) => {
  const getMovieQuerry = `
    SELECT
    movie_name
    FROM
    movie`;
  const movieNameList = await db.all(getMovieQuerry);
  responce.send(movieNameList.map((eachMoive) => getResponce(eachMoive)));
});
app.post("/movies/", async (request, responce) => {
  const { director_id, movie_name, lead_actor } = request.body;
  console.log(movie_name);
  const postMovieQueryy = `
    INSERT INTO
    movie (director_id,movie_name,lead_actor)
    
    VALUES
    (${director_id},'${movie_name}','${lead_actor}')

    `;
  const movieDetails = await db.run(postMovieQueryy);
  responce.send("Movie Successfully Added");
});
module.exports = app;
