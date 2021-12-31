const express = require("express");
const router = new express.Router();
const axios = require("axios");
const { AUDIODB_API_KEY } = process.env.AUDIODB_API_KEY || require("../config");
const { BadRequestError } = require("../expressError");

router.get("/:name", async(req, res, next) => {
    let { name } = req.params;
    name = name.split("_").join(" ");
    const options = {
        method: "GET",
        url: 'https://theaudiodb.p.rapidapi.com/search.php',
        params: { s: name },
        headers: {
            'x-rapidapi-host': 'theaudiodb.p.rapidapi.com',
            'x-rapidapi-key': process.env.REACT_APP_API_KEY || AUDIODB_API_KEY
        }
    };
    
    try {
        const response = await axios.request(options);
        if (!response.data.artists) throw new BadRequestError("Sorry, we could not find this musician.");

        const { intBornYear, intDiedYear, strGenre, strBiographyEN, strArtistThumb } 
            = response.data.artists[0];

        return res.json({
            birthYear: intBornYear,
            deathYear: intDiedYear === null ? "N/A" : intDiedYear,
            genre: strGenre,
            biography: strBiographyEN,
            photo: strArtistThumb
        });
    } catch (error) {
        return next(error);
    };
});

module.exports = router;