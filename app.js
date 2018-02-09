var express = require('express');
var app = express();
app.use(express.static("public"));
var path = require('path');
//var testGeneticAlgorithm = require( path.resolve( __dirname, "./public/js/genetic.js" ) );
app.set("view engine", "ejs");
//this was installed using npm install, we need this when we have forms and we want
//to parse the data on the server side
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

//testGeneticAlgorithm();

app.get('/', function (req, res) {
  res.render("parameterFormPage");
});

app.post('/launchGeneticAlgorithm', function (req, res) {
  var goalString = req.body.goalString;
  var populationSize = req.body.populationSize;
  var mutationRate = req.body.mutationRate;
  var crossoverRate = req.body.crossoverRate;
  console.log("testing:" + goalString + " " + populationSize + " " + mutationRate + " " + crossoverRate);
  res.render("runGeneticAlgorithmPage", {goalString: goalString, populationSize: populationSize, mutationRate: mutationRate, crossoverRate: crossoverRate});
});

app.listen(3000, function () {
  console.log('Genetic Javascript app listening on port 3000!');
});
