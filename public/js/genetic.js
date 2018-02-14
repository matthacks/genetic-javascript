/**
 * @file
 * This file contains the classes and functions necessary to run and manage
 * a genetic algorithm.
 */

/** Represents an Individual member of a population. */
class Individual {

  /**
   * @constructor
   * @param {number} chromosomeLength - The length of the chromosome string.
   * @param {string} chromosomeString - The chromosome string.
   * @param {string} goalString - The string the GA is trying to create.
   * @param {number} mutationRate - The % from 0-100 at which mutations will occur.
   */
  constructor(chromosomeLength, chromosomeString, goalString, mutationRate) {
    this.chromosomeLength = chromosomeLength;
    this.chromosomeString = chromosomeString;
    this.POSSIBLE_CHARACTERS = "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ .!?";
    this.fitness = 0;
    this.mutationRate = mutationRate;

    if (!this.chromosomeString) {
      this.initializeChromosome();
    }
    this.setFitness(goalString);
  }

  /**
   * Initialize an empty chromosome string by selecting random characters from the
   * POSSIBLE_CHARACTERS array and pushing them to chromosomeString one at a time for
   * chromosomeLength times.
   */
  initializeChromosome() {
    for (var i = 0; i < this.chromosomeLength; i++) {
      this.chromosomeString += this.POSSIBLE_CHARACTERS.charAt(Math.floor(Math.random() * this.POSSIBLE_CHARACTERS.length));
    }
  }

  /**
   * Counts how many characters in chromosomeString are an exact match and in the
   * same index as the characters in goalString.
   * @param {string} goalString The string to compare chromosomeString with.
   */
  setFitness(goalString) {
    this.fitness = 0;
    for (var i = 0; i < this.chromosomeLength; i++) {
      if (this.chromosomeString.charAt(i) === goalString.charAt(i)) {
        this.fitness++;
      }
    }
  }

  /** Perfoms a single point mutation 'mutationRate' out of 100 times. */
  mutate() {
    //mutateValue gets a random number from 0-99, if this value is less
    //than the mutationRate than a mutation will occur at a randomly selected index
    //with a randomly selected character
    let mutateValue = Math.floor(Math.random() * 100);

    if (mutateValue < this.mutationRate) {
      let randIndex = Math.floor(Math.random() * this.chromosomeLength);
      //since you cannot directly update a character at a given index for a string,
      //the following line accomplishes the same task
      this.chromosomeString = this.chromosomeString.substr(0, randIndex) + this.POSSIBLE_CHARACTERS.charAt(Math.floor(Math.random() * this.POSSIBLE_CHARACTERS.length)) + this.chromosomeString.substr(randIndex + 1);
    }

  }

  /**
   * Get the fitness value of the individual.
   * @return {number} The fitness value.
   */
  getFitness() {
    return this.fitness;
  }

  /**
   * Get the chromosome string.
   * @return {string} The chromosome string.
   */
  getChromosomeString() {
    return this.chromosomeString;
  }

} //end class Individual

/**
 * A comparison function used for sorting the individuals in population
 * in order of descending fitness values.
 * @return {number} Comparison value.
 */
function compareIndividuals(a, b) {
  if (a.getFitness() < b.getFitness()) {
    return 1;
  } else if (a.getFitness() > b.getFitness()) {
    return -1;
  } else {
    return 0;
  }
}

/** Represents a Population of Individuals. */
class Population {
  /**
   * @constructor
   * @param {number} populationSize - Number of individuals the population will contain.
   * @param {number} chromosomeLength - The length of the chromosome string.
   * @param {string} goalString - The string the GA is trying to create.
   * @param {number} crossoverRate - The % from 0-100 at which crossovers will occur.
   * @param {number} mutationRate - The % from 0-100 at which mutations will occur.
   */
  constructor(populationSize, chromosomeLength, goalString, crossoverRate, mutationRate) {
    this.population = [];
    this.populationSize = populationSize;
    this.fitnessSum = 0;
    this.goalString = goalString;
    this.mutationRate = mutationRate;
    this.crossoverRate = crossoverRate;
    this.generationNumber = 1;
    this.initializePopluation(populationSize, chromosomeLength, goalString, mutationRate);
  }

  /**
   * Create an array of 'populationSize' Individuals and then sort it by descending fitness.
   * @param {number} populationSize - Number of individuals the population will contain.
   * @param {number} chromosomeLength - The length of the chromosome string.
   * @param {string} goalString - The string the GA is trying to create.
   * @param {number} mutationRate - The % from 0-100 at which mutations will occur.
   */
  initializePopluation(populationSize, chromosomeLength, goalString, mutationRate) {
    for (var i = 0; i < populationSize; i++) {
      var individual = new Individual(chromosomeLength, "", this.goalString, this.mutationRate);
      this.fitnessSum += individual.getFitness();
      this.population.push(individual);
    }

    this.sortPopulationByDescendingFitness();
  }

  /**
   * Select an individual from the population array using the roullete wheel selection
   * technique. This works by selected a random number from 0 to the total fitness of
   * the population. Iterate through the sorted individual array and sum the fitness
   * from all the individuals iterated over. When the sum is greater than or equal to
   * the random value, return that individual. The purpose of this improve chances
   * for select more fit individuals for the next generation of individuals (eg an
   * implementation for a varation of survival of the fittest).
   * @return {Individual} Strategically selected individual.
   */
  selectParent() {
    let randomValueWithinFitnessSum = Math.floor(Math.random() * this.fitnessSum);
    var temp = 0;
    var i = 0;

    temp += this.population[i].getFitness();

    while (temp < randomValueWithinFitnessSum) {
      i++;
      temp += this.population[i].getFitness();
    }

    return this.population[i];
  }

  /**
   * Performs a single point crossover. A random index is selected from 0 to 'chromosomeLength' and
   * a chromosome string is produced from the concatenation of parent1's chromosomeString
   * from 0 to the random index and parent2's chromosomeString from random index +1 to
   * chromosomeLength. An Indidual is then produced from that string and returned.
   * @param {Individual} parent1 - The first parent.
   * @param {Individual} parent2 - The second parent.
   * @return {Individual} The Individual produced as a result of the crossover algorithm.
   */
  crossover(parent1, parent2) {
    let length = parent1.getChromosomeString().length;
    let crossoverIndex = Math.floor(Math.random() * length);
    var i = 0;
    var childChromosome = "";

    while (i < crossoverIndex) {
      childChromosome += parent1.getChromosomeString()[i];
      i++;
    }

    while (i < length) {
      childChromosome += parent2.getChromosomeString()[i];
      i++;
    }

    return new Individual(childChromosome.length, childChromosome, this.goalString, this.mutationRate);
  }

  /**
   * Calculates the total population fitness by summing the fitness of every individual
   * in the population.
   */
  sumFitness() {
    this.fitnessSum = 0;
    for (var i = 0; i < this.populationSize; i++) {
      this.fitnessSum += this.population[i].getFitness();
    }
  }

  /**
   * Creates an copy of the passed in Individual.
   * @param {Individual} individualToCopy - The individual to copy.
   * @return {Individual} A new Individual instantiated from the values of the individualToCopy.
   */
  copyIndividual(individualToCopy) {
    return new Individual(individualToCopy.getChromosomeString().length, individualToCopy.getChromosomeString(), this.goalString, this.mutationRate)
  }

  /**
   * Controls the genetic algorithm process of parent selection, crossover, and mutation.
   * A random value between 0-99 is selected, if this value is less than
   * our crossoverRate, we will select another parent and perform
   * the crossover process, otherwise we use parent1 as the child and
   * then perform the mutate process on it.
   * @return {Individual} Individual created through GA processes.
   */
  giveBirth() {
    let parent1 = this.selectParent();
    let crossoverValue = Math.floor(Math.random() * 100)

    var child = this.copyIndividual(parent1)
    if (crossoverValue < this.crossoverRate) {
      let parent2 = this.selectParent();
      child = this.crossover(parent1, parent2);
    }

    child.mutate();
    child.setFitness(this.goalString);

    return child;
  }

  /** Sorts the array of Indivuals by fitness from greatest to least. */
  sortPopulationByDescendingFitness() {
    this.population.sort(compareIndividuals);
  }

  /**
   * Creates a new population by calling the 'giveBirth' method 'populationSize'
   * times and appending each returned Individual to a new array. The array is then
   * set as the Populations current array and then the 'sumFitness' and
   * 'sortPopulationByDescendingFitness' operations are performed.
   */
  generateNewPop() {
    this.generationNumber++;
    var newPopulation = [];

    for (var i = 0; i < this.populationSize; i++) {
      let newChild = this.giveBirth();
      newPopulation.push(newChild);
    }

    this.population = newPopulation;
    this.sumFitness();
    this.sortPopulationByDescendingFitness();
  }

  /**
   * Get the most fit individual from the sorted population.
   * @return {Individual} Individual at index 0.
   */
  getMostFit() {
    return this.population[0];
  }

  /**
   * Get the least fit individual from the sorted population.
   * @return {Individual} Individual at the last index.
   */
  getLeastFit() {
    return this.population[this.population.length - 1];
  }

  /**
   * Get the generation number of the population.
   * @return {number} Current generation number.
   */
  getGenerationNumber() {
    return this.generationNumber;
  }

} //end class Population

module.exports = {
  Population: Population,
  Individual: Individual
}
