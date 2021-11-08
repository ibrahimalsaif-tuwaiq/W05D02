const express = require("express");
const fs = require("fs");

const app = express();
const port = 5000;

app.use(express.json());

// Write to the file
const writeToFile = (movies) => {
  fs.writeFile("./data.json", JSON.stringify(movies), () => {
    console.log("Added to file successfully");
  });
};

// GET //

// Get all movies & get all movies with ID query
app.get("/movies", (req, res) => {
  fs.readFile("./data.json", (err, data) => {
    const id = req.query.id;

    const movies = JSON.parse(data.toString());

    if (id) {
      const notDeletedMovies = movies.filter(
        (movie) => movie.id == id && movie.isDeleted != true
      );
      notDeletedMovies.length
        ? res.status(200).json(notDeletedMovies)
        : res.status(404).json("Not Found");
    } else {
      const notDeletedMovies = movies.filter(
        (movie) => movie.isDeleted != true
      );
      res.status(200).json(notDeletedMovies);
    }
  });
});

// Get movies with ID params
app.get("/movies/:id/view", (req, res) => {
  fs.readFile("./data.json", (err, data) => {
    const movies = JSON.parse(data.toString());

    const movie = movies.find(
      (movie) => movie.id == req.params.id && movie.isDeleted != true
    );

    if (movie) {
      res.status(200).json(movie);
    } else {
      res.status(404).json("Not Found");
    }
  });
});

// Get favourite movies
app.get("/movies/fav", (req, res) => {
  fs.readFile("./data.json", (err, data) => {
    const movies = JSON.parse(data.toString());

    const favMovies = movies.filter(
      (movie) => movie.isFav == true && movie.isDeleted != true
    );

    if (favMovies.length) {
      res.status(200).json(favMovies);
    } else {
      res.status(404).json("Nothing Found");
    }
  });
});

// POST //

app.post("/movies", (req, res) => {
  fs.readFile("./data.json", (err, data) => {
    const movies = JSON.parse(data.toString());

    movies.push({
      id: movies.length + 1,
      movie: req.body.movie,
      isFav: false,
      isDeleted: false,
    });

    writeToFile(movies);

    const moviesAfterAdd = movies.filter((movie) => movie.isDeleted != true);
    res.status(200).json(moviesAfterAdd);
  });
});

// UPDATE //

// Update movie name
app.put("/movies/:id/update_movie", (req, res) => {
  fs.readFile("./data.json", (err, data) => {
    const movies = JSON.parse(data.toString());

    movies.forEach((todo) => {
      if (todo.id == req.params.id) todo.movie = req.body.movie;
    });

    writeToFile(movies);

    const moviesAfterUpdate = movies.filter((movie) => movie.isDeleted != true);
    res.status(200).json(moviesAfterUpdate);
  });
});

// Update movie isFav to true
app.put("/movies/:id/add_to_fav", (req, res) => {
  fs.readFile("./data.json", (err, data) => {
    const movies = JSON.parse(data.toString());

    movies.forEach((movie) => {
      if (movie.id == req.params.id) {
        movie.isFav = true;
      }
    });

    writeToFile(movies);

    const moviesAfterUpdate = movies.filter((movie) => movie.isDeleted != true);
    res.status(200).json(moviesAfterUpdate);
  });
});

// Update movie isFav to false
app.put("/movies/:id/delete_from_fav", (req, res) => {
  fs.readFile("./data.json", (err, data) => {
    const movies = JSON.parse(data.toString());

    movies.forEach((movie) => {
      if (movie.id == req.params.id) {
        movie.isFav = false;
      }
    });

    writeToFile(movies);

    const moviesAfterUpdate = movies.filter((movie) => movie.isDeleted != true);
    res.status(200).json(moviesAfterUpdate);
  });
});

// DELETE //

// Delete movie with ID params
app.delete("/movies/:id", (req, res) => {
  fs.readFile("./data.json", (err, data) => {
    const movies = JSON.parse(data.toString());

    movies.forEach((movie) => {
      if (movie.id == req.params.id) {
        movie.isDeleted = true;
      }
    });

    writeToFile(movies);

    const moviesAfterDelete = movies.filter((movie) => movie.isDeleted != true);
    res.status(200).json(moviesAfterDelete);
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
