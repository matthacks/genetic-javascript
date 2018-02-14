var express = require('express');
var app = express();
app.use(express.static("public"));
var path = require('path');
app.set("view engine", "ejs");
//this was installed using npm install, we need this when we have forms and we want
//to parse the data on the server side
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
  extended: true
}));

var GeneticClasses = require('./public/js/genetic.js');
var population;

app.get('/', function(req, res) {
  res.render("parameterFormPage");
});

app.post('/launchGeneticAlgorithm', function(req, res) {
  var goalString = req.body.goalString;
  var populationSize = req.body.populationSize;
  var mutationRate = req.body.mutationRate;
  var crossoverRate = req.body.crossoverRate;
  population = new GeneticClasses.Population(populationSize, goalString.length, goalString, crossoverRate, mutationRate);
  res.render("runGeneticAlgorithmPage", {
    goalString: goalString,
    populationSize: populationSize,
    mutationRate: mutationRate,
    crossoverRate: crossoverRate,
    generationNumber: 1,
    mostFitStrandChromosome: population.getMostFit().getChromosomeString(),
    leastFitStrandChromosome: population.getLeastFit().getChromosomeString(),
    mostFitStrandFitnessPercent: (population.getMostFit().getFitness()/goalString.length*100).toFixed(2),
    leastFitStrandFitnessPercent: (population.getLeastFit().getFitness()/goalString.length*100).toFixed(2)
  });
});

app.listen(3000, function() {
  console.log('Genetic Javascript app listening on port 3000!');
});
