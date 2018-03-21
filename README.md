# genetic-javascript

This Node.js application allows you to set the parameters for a genetic algorithm and see how many generations it takes for it to generate your goal string.

![Homepage Screenshot](screenshots/homepage.png?raw=true)

After clicking "Run Algorithm" you can then specify how many steps you would like to take each time you click "Take Steps". After each click the page will update and show you the current state of the algorithm.

![Running Algorithm Screenshot](screenshots/runningAlgorithm.png?raw=true)


If at any point while running the algorithm generates the goal string, it will stop and display the final results.

![Solution Found Screenshot](screenshots/solutionFound.png?raw=true)

Keep in mind this is my very first attempt at building any sort of web application so the visuals may be a little rough.

Also note that roulette wheel selection is used when selecting parents for reproduction and single point crossover and mutation algorithms are used in the reproduction process.
