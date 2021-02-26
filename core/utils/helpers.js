const fs = require("fs");
const fe = require('file-encoding');

const dirsModel = require("../models/dirsModel");
const movieModel = require("../models/movieModel");

const dbController = require("../controllers/mongoDbController");

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

    initializeMovies(dirs[0]["movies"], movies);
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
                if(fs.statSync(moviePath + "\\" + file).isDirectory()) {
                    if(file == "Subs") {
                        fs.readdirSync(moviePath + "\\Subs").forEach(subFile => {
                            if(subFile.endsWith(".srt")) { 
                                subObj = {}
                                subObj["filename"] = subFile;
                                subObj["path"] = moviePath + "\\Subs\\" + subFile;
                                subs.push(subObj)
                            }   
                        });
                    }
                }
                else {
                    // Check files. If their extension is a supported movie extension, this is the movie file.
                    if(file.endsWith(".avi") || file.endsWith(".mp4") || file.endsWith(".mkv")) {
                        movieObj["file"] = moviePath + "\\" + file;     
                    }
                    // If files have .srt extension, they are subs. Add them to available movie subs.
                    else if(file.endsWith(".srt")) {
                        subObj = {}
                        subObj["filename"] = file;
                        subObj["path"] = moviePath + "\\" + file;
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