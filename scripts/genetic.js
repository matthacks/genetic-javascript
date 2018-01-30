class Individual {
  constructor(chromosomeLength, chromosomeString, goalString, mutationRate){
    this.chromosomeLength = chromosomeLength;
    this.chromosomeString = chromosomeString;
    this.POSSIBLE_CHARACTERS = "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ .!?";
    this.fitness = 0;
    this.mutationRate = mutationRate;

    if(!this.chromosomeString){
      this.initializeChromosome();
    }
    this.setFitness(goalString);
  }

  initializeChromosome(){
    for (var i = 0; i < this.chromosomeLength; i++) {
      this.chromosomeString += this.POSSIBLE_CHARACTERS.charAt(Math.floor(Math.random()*this.POSSIBLE_CHARACTERS.length));
    }
  }

  setFitness(goalString) {
    for (var i = 0; i < this.chromosomeLength; i++) {
      if (this.chromosomeString[i] === goalString[i]){
        this.fitness += 1;
      }
    }
  }

  mutate() {
    //mutateValue gets a random number from 0-99, if this value is less
    //than the mutationRate than a mutation will occur at a randomly selected index
    //with a randomly selected character
    let mutateValue = Math.floor(Math.random()*100);

    if(mutateValue < this.mutationRate){
      let randIndex = Math.floor(Math.random()*this.chromosomeLength);
      //since you cannot directly update a character at a given index for a string,
      //the following line accomplishes the same task
      this.chromosomeString =  this.chromosomeString.substr(0, randIndex) + this.POSSIBLE_CHARACTERS.charAt(Math.floor(Math.random()*this.POSSIBLE_CHARACTERS.length)) + this.chromosomeString.substr(randIndex+1);
    }

  }

  getFitness(){
    return this.fitness;
  }

  getChromosomeString() {
    return this.chromosomeString;
  }


  //for testing
  printChromosomeStringAndFitness(){
    console.log("String: " + this.chromosomeString + " Fitness: " + this.fitness);
  }

}//end class Individual

//used for sorting population by descending fitness
function compareIndividuals(a, b){
  if(a.getFitness() < b.getFitness()){
    return 1;
  }
  else if (a.getFitness() > b.getFitness()) {
    return -1;
  }
  else{
    return 0;
  }
}



class Population {
  constructor(populationSize, chromosomeLength, goalString, crossoverRate, mutationRate){
    this.population = [];
    this.populationSize = populationSize;
    this.fitnessSum = 0;
    this.goalString = goalString;
    this.mutationRate = mutationRate;
    this.crossoverRate = crossoverRate;
    this.initializePopluation(populationSize, chromosomeLength, goalString, mutationRate);
  }

  initializePopluation(populationSize, chromosomeLength, goalString, mutationRate){
    for (var i = 0; i < populationSize; i++) {
      var individual = new Individual(chromosomeLength, "", this.goalString, this.mutationRate);
      this.fitnessSum += individual.getFitness();
      this.population.push(individual);
    }

    this.sortPopulationByDescendingFitness();
  }

    getIndividual(index){
      return population[index];
    }

    //uses roullete wheel selection
    selectParent() {
      let randomValueWithinFitnessSum = Math.floor(Math.random()*this.fitnessSum);
      var temp = 0;
      var i = 0;

      temp += this.population[i].getFitness();

      while(temp < randomValueWithinFitnessSum){
        i++;
        temp+=this.population[i].getFitness();
      }

      return this.population[i];
    }

    //one child single point crossover
    crossover(p1, p2){
      let length = p1.getChromosomeString().length;
      let crossoverIndex = Math.floor(Math.random()*length);
      var i = 0;
      var childChromosome = "";

      while(i < crossoverIndex){
        childChromosome += p1.getChromosomeString()[i];
        i++;
      }

      while(i < length){
        childChromosome += p2.getChromosomeString()[i];
        i++;
      }

      return new Individual(childChromosome.length, childChromosome, this.goalString, this.mutationRate);
    }

    sumFitness(){
      this.fitnessSum = 0;
      for (var i = 0; i < this.populationSize; i++) {
        this.fitnessSum += this.population[i].getFitness();
      }
    }

    giveBirth(){
      let parent1 = this.selectParent();

      //select a random value between 0-99, if this value is less than
      //our crossoverRate, we will select another parent and perform
      //the crossover process, otherwise we use parent1 as the child and
      //then perform the mutate process on it
      let crossoverValue = Math.floor(Math.random()*100)

      if(crossoverValue < this.crossoverRate){
        let parent2 = this.selectParent();
        var child = this.crossover(parent1, parent2);
      }
      else{
        var child = parent1;
      }

      child.mutate();

      return child;
    }


    sortPopulationByDescendingFitness(){
      this.population.sort(compareIndividuals);
    }

    generateNewPop(){
      var newPopulation = [];

      for (var i = 0; i < this.populationSize; i++) {
        let newChild = this.giveBirth();
        newPopulation.push(newChild);
      }

      this.population = newPopulation;
      this.sumFitness();
      this.sortPopulationByDescendingFitness();
    }

    getMostFit(){
      return this.population[0];
    }

}//end class Population

//base functionality
let POPULATION_SIZE = 100;
let GOAL_STRING = "ThIS 1s SuP3r C00l!!";
let CHROMOSOME_LENGTH = GOAL_STRING.length;
let CROSSOVER_RATE = 80;
let MUTATION_RATE = 10;
let LOG_EVERY_XTH_GENERATION = 100;

let p = new Population(POPULATION_SIZE, CHROMOSOME_LENGTH, GOAL_STRING, CROSSOVER_RATE, MUTATION_RATE);
var generation = 1;

console.log("Generation: " + generation);
console.log("Most Fit Chromosome: \"" + p.getMostFit().getChromosomeString() + "\" With Fitness of: " + (p.getMostFit().getFitness()/CHROMOSOME_LENGTH)*100 + "%");
console.log(" ");

while(p.getMostFit().getChromosomeString() !== GOAL_STRING){

  p.generateNewPop();
  generation++;

  if(generation%LOG_EVERY_XTH_GENERATION === 0){
    console.log("Generation: " + generation);
    console.log("Most Fit Chromosome: \"" + p.getMostFit().getChromosomeString() + "\" With Fitness of: " + (p.getMostFit().getFitness()/CHROMOSOME_LENGTH)*100 + "%");
    console.log(" ");
  }

}

console.log("Solution Found At Generation: " + generation);
console.log("Most Fit Chromosome: \"" + p.getMostFit().getChromosomeString() + "\" With Fitness of: " + (p.getMostFit().getFitness()/CHROMOSOME_LENGTH)*100 + "%");
