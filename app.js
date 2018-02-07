var express = require('express');
var app = express();
app.use(express.static("public"));
var path = require('path');
var testGeneticAlgorithm = require( path.resolve( __dirname, "./public/js/genetic.js" ) );
app.set("view engine", "ejs");

testGeneticAlgorithm();

app.get('/', function (req, res) {
  res.render("parameterFormPage");
});

app.listen(3000, function () {
  console.log('Genetic Javascript app listening on port 3000!');
});
