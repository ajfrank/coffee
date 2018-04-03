const _ = require('lodash')

const ordered = (a, b) => (a < b ? [a, b] : [b, a])

function addPair(pairs, a, b) {
  const [first, second] = ordered(a, b)
  if (!pairs[first])
    pairs[first] = {}
  pairs[first][second] = true
}

function hasPair(pairs, a, b) {
  const [first, second] = ordered(a, b)
  return pairs[first] && pairs[first][second]
}

function transformPreviousPairs(previousPairs) {
  const pairDict = {}
  previousPairs.forEach(({ person_one, person_two, person_three }) => {
    addPair(pairDict, person_one, person_two)
    if (person_three) {
      addPair(pairDict, person_one, person_three)
      addPair(pairDict, person_two, person_three)
    }
  })
  return pairDict
}

function generatePairs(people, previousPairs) {
  const shuffledPeople = _.shuffle(people)
  const pool = _.map(shuffledPeople, name => ({ name, isAssigned: false }))
  const currentPairs = []
  const unmatched = []
  let best = { pairs: [], unmatched: shuffledPeople }

  function genPairsRec(start) {
    const remaining = pool.length - start
    if (unmatched.length + remaining % 2 >= best.unmatched.length) {
      // Will not be able to beat current best, so skip this subtree
      return
    }

    const i = _.findIndex(pool, person => !person.isAssigned, start)
    if (i === -1) {
      // Everyone has been assigned. Check if this assignment is best
      if (currentPairs.length > best.pairs.length)
        best = { pairs: _.clone(currentPairs), unmatched: _.clone(unmatched) }
      return
    }

    const person1 = pool[i]
    person1.isAssigned = true

    for (let j = i + 1; j < pool.length; j++) {
      const person2 = pool[j]
      if (!person2.isAssigned && !hasPair(previousPairs, person1.name, person2.name)) {
        person2.isAssigned = true
        currentPairs.push({ personOne: person1.name, personTwo: person2.name})
        genPairsRec(i + 1)
        currentPairs.pop()
        person2.isAssigned = false
      }
    }

    // Consider assignments where person1 is unmatched
    unmatched.push(person1.name)
    genPairsRec(i + 1)
    unmatched.pop()

    person1.isAssigned = false
  }

  genPairsRec(0)
  return {
    generatedPairs: best.pairs,
    unmatched: best.unmatched
  }
}

module.exports = {
  generatePairs,
  transformPreviousPairs
}