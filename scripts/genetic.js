class Individual {
  constructor(chromosomeLength, chromosomeString){
    self.chromosomeLength = chromosomeLength;
    self.chromosomeString = chromosomeString;
    self.POSSIBLE_CHARACTERS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ .!?";

    if(!self.chromosomeString){
      this.initializeChromosome();
    }
    //setFitness();
  }

  initializeChromosome(){
    for (var i = 0; i < self.chromosomeLength; i++) {
      chromosomeString += self.POSSIBLE_CHARACTERS.charAt(Math.floor(Math.random()*self.POSSIBLE_CHARACTERS.length));
    }
  }

  //for testing
  printChromosomeString(){
    console.log(self.chromosomeString);
  }

}//end class Individual

//for testing
var c = new Individual(10, "");
c.printChromosomeString();
