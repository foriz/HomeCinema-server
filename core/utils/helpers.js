const fs = require("fs");
const fe = require('file-encoding');

const dbController = require("../controllers/mongoDbController");

const dirsModel = require("../models/dirsModel");
const movieModel = require("../models/movieModel");
const seriesModel = require("../models/seriesModel");

// Initialize data for all movies & series in saved locations.
// For each folder name in these paths save the following attributes:
// --folder name (the movies name, that will be shown in client)
// --languages of available subtitles, if they exist (recognize language of .srt file)
// --availability(if folder already exists in database, check if the location is valid)
// --description (from some open movie db api)
// --tags (from some open movie db api)
// --poster (from some open movie db api)
exports.initializeContent = async function (mongoDbController) {
    var dirs = await mongoDbController.getAllCollection(dirsModel);
    var movies = await mongoDbController.getAllCollection(movieModel);
    var series = await mongoDbController.getAllCollection(seriesModel);

    initializeMovies(dirs[0]["movies"], movies);
    initializeSeries(dirs[0]["series"], series);
}

exports.initializeMoviesOnly = async function (mongoDbController) {
    var dirs = await mongoDbController.getAllCollection(dirsModel);
    var movies = await mongoDbController.getAllCollection(movieModel);

    return new Promise((resolve, reject) => {
        initializeMovies(dirs[0]["movies"], movies)
            .then((init) => {
                resolve(init);
            })
            .catch((err) => {
                reject(err);
            })
    });
}

exports.initializeSeriesOnly = async function (mongoDbController) {
    var dirs = await mongoDbController.getAllCollection(dirsModel);
    var series = await mongoDbController.getAllCollection(seriesModel);

    return new Promise((resolve, reject) => {
        initializeSeries(dirs[0]["series"], series)
            .then((init) => {
                resolve(init);
            })
            .catch((err) => {
                reject(err);
            })
    });
}

async function initializeMovies(movies, existingMovies) {
    var moviesArray = [];
    for(var i=0;i<movies.length;i++) {
        var locationToSearch = movies[i];
        // Check if given location exists
        try {
            fs.readdirSync(locationToSearch, { withFileTypes: true })

            var locationMoviesArr = await addMoviesFromLocation(locationToSearch, existingMovies);
            moviesArray.push(...locationMoviesArr);
        }
        catch (err) {
            console.error(err);
            continue;
        }
    }

    // Batch insert all collected movies in Database
    return new Promise((resolve, reject) => {
        dbController.insertBatchRecords(movieModel.collection, moviesArray)
            .then((insertResult) => {
                resolve(insertResult);
            })
            .catch((insertResultError) => {
                reject(insertResultError);
            });
    });
}

async function initializeSeries(series, existingSeries) {
    var seriesArray = [];
    for(var i=0;i<series.length;i++) {
        var locationToSearch = series[i];
        // Check if given location exists
        try {
            fs.readdirSync(locationToSearch, { withFileTypes: true })

            var locationSeriesArr = await addSeriesFromLocation(locationToSearch, existingSeries);
            seriesArray.push(...locationSeriesArr);
        }
        catch (err) {
            console.error(err);
            continue;
        }
    }

    // Batch insert all collected series in Database
    return new Promise((resolve, reject) => {
        dbController.insertBatchRecords(seriesModel.collection, seriesArray)
            .then((insertResult) => {
                resolve(insertResult);
            })
            .catch((insertResultError) => {
                reject(insertResultError);
            });
    });
}

// Add all folders found in the given location.
async function addMoviesFromLocation(loc, existingMovies) {
    var m = []
    var moviesInLoc = fs.readdirSync(loc, { withFileTypes: true })
    for(var i=0;i<moviesInLoc.length;i++) {
        const movieName = moviesInLoc[i]["name"];
        const moviePath = loc + movieName

        // Check if subfolder exists.
        if(fs.statSync(moviePath).isDirectory()) {
            // Check if same folder has been stored already to database
            if(existingMovies.filter((element) => element["path"] == moviePath).length > 0) {
                // Movie already exists. Check new folder
                continue;
            }

            var movieObj = {}
            movieObj["name"] = movieName;
            movieObj["path"] = moviePath;
        
            subs = [];

            // Read all files in subfolder.
            fs.readdirSync(moviePath).forEach(file => {
                // If contains a dir and its name is Subs, add existing files in Subs with extension .srt to available movie subs.
                if(fs.statSync(moviePath + "/" + file).isDirectory()) {
                    if(file == "Subs") {
                        fs.readdirSync(moviePath + "/Subs").forEach(subFile => {
                            if(subFile.endsWith(".srt")) { 
                                subObj = {}
                                subObj["filename"] = subFile;
                                subObj["path"] = moviePath + "/Subs/" + subFile;
                                subs.push(subObj)
                            }   
                        });
                    }
                }
                else {
                    // Check files. If their extension is a supported movie extension, this is the movie file.
                    if(file.endsWith(".avi") || file.endsWith(".mp4") || file.endsWith(".mkv")) {
                        movieObj["file"] = moviePath + "/" + file;     
                    }
                    // If files have .srt extension, they are subs. Add them to available movie subs.
                    else if(file.endsWith(".srt")) {
                        subObj = {}
                        subObj["filename"] = file;
                        subObj["path"] = moviePath + "/" + file;
                        subs.push(subObj)
                    }
                }
            });

            movieObj["subs"] = subs;
            m.push(new movieModel(movieObj));
        }
    }

    return m;
}

// Add all folders found in the given location.
async function addSeriesFromLocation(loc, existingSeries) {
    var s = []
    var seriesInLoc = fs.readdirSync(loc, { withFileTypes: true })
    for(var i=0;i<seriesInLoc.length;i++) {
        const seriesName = seriesInLoc[i]["name"];
        const seriesPath = loc + seriesName
        
        // Check if subfolder exists.
        if(fs.statSync(seriesPath).isDirectory()) {
            // Check if same folder has been stored already to database
            if(existingSeries.filter((element) => element["path"] == seriesPath).length > 0) {
                // Series already exists. Check new folder
                continue;
            }

            // Each Series must have specific structure. Inside of the root folder there must be 
            // one folder for each season, even if there is only one season or it is mini-series.
            // Season names must be in format Season 01, Season 02, etc.

            seasonsCounter = 0
            episodesCounter = 0

            // Count the number of seasons as follow: Every folder in root dir 
            // which its name starts with "Season", is considered a different season.
            // Count the number of episodes as follow: For every season folder count the number
            // of files, where extension is one of (.mp4, .mkv, .avi).
            fs.readdirSync(seriesPath).forEach(folder => {
                if(fs.statSync(seriesPath + "/" + folder).isDirectory()) {
                    if(folder.startsWith("Season")) {
                        seasonsCounter = seasonsCounter + 1

                        fs.readdirSync(seriesPath + "/" + folder).forEach(f => {
                            if(f.endsWith(".mp4") || f.endsWith(".mkv") || f.endsWith(".avi")) {
                                episodesCounter = episodesCounter + 1
                            }
                        });
                    }
                }
            });

            var seriesObj = {}
            seriesObj["name"] = seriesName;
            seriesObj["path"] = seriesPath;
            seriesObj["seasons"] = seasonsCounter;
            seriesObj["episodes"] = episodesCounter;

            s.push(new seriesModel(seriesObj));
        }
    }

    //console.log(s)
    return s;
}

exports.createSubBlob = async function (sub) {
    const subFile = fe(sub["path"]);
    return new Promise((resolve, reject) => {
        subFile.detect()
            .then((encoding) => {
                // Detect subtitles file encoding
                sub["encoding"] = encoding;
                
                // Read subtitles file        
                var buffer = fs.readFileSync(sub["path"]);
                
                // Encode file to Base64
                sub["base64_encoded"] = buffer.toString("base64");
                resolve(sub);
            })
            .catch((err) => {
                // Set UTF-8 as default encoding for sub
                sub["encoding"] = "UTF-8";
                
                // Read subtitles file        
                var buffer = fs.readFileSync(sub["path"]);
                
                // Encode file to Base64
                sub["base64_encoded"] = buffer.toString("base64");
                resolve(sub);
            });
    });
}

function toArrayBuffer(buf) {
    var ab = new ArrayBuffer(buf.length);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buf.length; ++i) {
        view[i] = buf[i];
    }
    return ab;
}