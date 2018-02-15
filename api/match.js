const _ = require('lodash')
const db = require('../db')

function generatePreviousPairsSet(previousPairs){
	const pairsSet = new Set([])
	previousPairs.forEach(pair=>{
		pairsSet.add(`${pair['person_one']},${pair['person_two']}`)
		if(pair['person_three']){
      pairsSet.add(`${pair['person_one']},${pair['person_three']}`)
      pairsSet.add(`${pair['person_two']},${pair['person_three']}`)
		}
	})
  return pairsSet
}

function generatePairs(people,previousPairs){
	//generate our pairs set
  const pairsSet = generatePreviousPairsSet(previousPairs)

  //shuffle the array
	let shuffledPeople = _.shuffle(people)

  //create variables
	let personOne
	let personTwo
  let generatedPair
  let previouslyMatchedLength = -1
  let previouslyMatched = []
  const generatedPairs = []

  //checking to see either if there are people left or if we've gone through a loop and nothing has changed
  while(previouslyMatchedLength !== previouslyMatched.length && shuffledPeople.length > 1){
    previouslyMatched = []

  	for (let i = 0; i < shuffledPeople.length; i++) {
      //pop twice to generate pair
      personOne = shuffledPeople.pop()
      personTwo = shuffledPeople.pop()

      //alphabetize names
      if(personTwo<personOne){
        temp = personOne
        personOne = personTwo
        personTwo = temp
      }
      //check to see if this pair has been matched
      generatedPair = `${personOne},${personTwo}`

      if(pairsSet.has(generatedPair)){
        //if they've matched previously, capture in a new array
        previouslyMatched.push([personOne,personTwo])
      }
      
      else{
        //if not, add to our pair set
        generatedPairs.push({personOne, personTwo, hashKey: generatedPair })
      }    
    }
    
    previouslyMatchedLength = previouslyMatched.length
    //add leftovers back so we can go through another loop
    shuffledPeople = _.shuffle(previouslyMatched)
  }

  return {generatedPairs, previouslyMatched}
}

module.exports = {generatePairs}