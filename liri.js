require("dotenv").config();
var keys = require("./keys");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require("request");
var fs = require("fs");

console.log("Type my-tweets , spotify-this-song , movie-this , or do-what-it-says");
var firstCommand = process.argv[2];
var secondCommand = process.argv[3];
for (i = 4; i < process.argv.length; i++) {
	secondCommand += "+" + process.argv[i];
}

function mySwitch() {
	switch (firstCommand) {

		case "my-tweets":
			myTweets();
			break;

		case "spotify-this-song":
			mySpotify();
			break;

		case "movie-this":
			myMovie();
			break;

		case "do-what-it-says":
			randText();
			break;

	}
};

function myTweets() {
	console.log("Twitter posts");
	//variable for twitter keys
	var client = new Twitter(keys.twitter);


	var params = {
		screen_name: "13_Jack_O",
		count: 20
	};
	/*client.get('statuses/user_timeline', params, function(error, tweets, response) {
	  if (!error) {
		console.log(tweets);
		console.log("----------------");
	  }
	});*/

	client.get("statuses/user_timeline", params, function (error, tweets, response) {
		if (!error) {
			for (i = 0; i < tweets.length; i++) {
				// var returnedData = ("Number: " + (i + 1) + "\n" + tweets[i].created_at + "\n" + tweets[i].text + "\n");
				console.log(tweets[i].created_at);
				console.log(tweets[i].text);

			}
		};
	});
};

function mySpotify() {
	console.log("spotify");


	var spotify = new Spotify({
		id: process.env.SPOTIFY_ID,
		secret: process.env.SPOTIFY_SECRET
	});	
	//variable for search.

	var searchVar;
	if (secondCommand == null) {
		searchVar = "Wave of Mutilation";
	} else {
		searchVar = secondCommand;
	}
	//spotify search


	spotify.search({
		type: 'track',
		query: searchVar,
	}, function (err, data) {

		console.log(data);

		if (err) {
			console.log("Error occurred: " + err);
			return;
		} else {
			console.log("Artist: " + data.tracks.items[0].artists[0].name);
			console.log("Song: " + data.tracks.items[0].name);
			console.log("Album: " + data.tracks.items[0].album.name);
			console.log("Preview: " + data.tracks.items[0].preview_url);
		}
	})
};

function myMovie() {
	console.log("movie");


	var searchMovie;
	if (secondCommand === undefined) {
		searchMovie = "Mr. Nobody";
	} else {
		searchMovie = secondCommand;
	};

	var url = "http://www.omdbapi.com/?t=" + searchMovie + "&y=&plot=short&apikey=trilogy";
	request(url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log("Title: " + JSON.parse(body)["Title"]);
			console.log("Year: " + JSON.parse(body)["Year"]);
			console.log("IMDB Rating: " + JSON.parse(body)["imdbRating"]);
			console.log("Country: " + JSON.parse(body)["Country"]);
			console.log("Language: " + JSON.parse(body)["Language"]);
			console.log("Plot: " + JSON.parse(body)["Plot"]);
			console.log("Actors: " + JSON.parse(body)["Actors"]);
			console.log("Rotten Tomatoes Rating: " + JSON.parse(body)["tomatoRating"]);
			console.log("Rotten Tomatoes URL: " + JSON.parse(body)["tomatoURL"]);
		}
	});
};

function randText() {
	fs.readFile("random.txt", "utf8", function (error, data) {
		if (error) {
			console.log(error);
		} else {


			var dataArr = data.split(",");
			firstCommand = dataArr[0];
			secondCommand = dataArr[1];

			for (i = 2; i < dataArr.length; i++) {
				secondCommand = secondCommand + "+" + dataArr[i];
			};

			mySwitch();

		};

	});

};

mySwitch();