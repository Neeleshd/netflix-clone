import React, { useState, useEffect } from "react";
import axios from "./axios";
import "./Row.css";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";

const baseUrl = "https://image.tmdb.org/t/p/original";

function Row({ title, fetchUrl, isLargeImage }) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");
  useEffect(() => {
    (async function () {
      const request = await axios.get(fetchUrl);
      setMovies(request.data.results);
      return request;
    })();
  }, [fetchUrl]);

  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      origin: "http://localhost:3000",
      enablejsapi: "1",
      autoplay: 1,
    },
  };

  const handleClick = (movie) => {
    trailerUrl
      ? setTrailerUrl("")
      : movieTrailer(movie?.name || movie?.title || movie?.original_name || "")
          .then((url) => {
            const urlParams = new URLSearchParams(new URL(url).search);
            setTrailerUrl(urlParams.get("v"));
          })
          .catch((error) => console.log(error));
  };

  return (
    <div className="row">
      <h2 className="row__title">{title}</h2>
      <div className="row__posters">
        {movies.map((movie) => (
          <img
            key={movie.id}
            onClick={() => handleClick(movie)}
            className={isLargeImage ? "row__posterLarge" : "row__poster"}
            src={
              isLargeImage
                ? `${baseUrl}${movie.poster_path}`
                : `${baseUrl}${movie.backdrop_path}`
            }
            alt={movie.name}
          />
        ))}
        <div>{trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}</div>
      </div>
    </div>
  );
}

export default Row;
