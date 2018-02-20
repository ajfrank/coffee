const pg = require('pg')

const postgresURL = process.env.DATABASE_URL || 'postgres://localhost/dropcoffee';
const client = new pg.Client(postgresURL);

console.log(postgresURL)

console.log('connecting to DB')
client.connect()
    .catch(err=>console.error(err))
console.log('connected to DB')

function fetchAllPairings() {
  return client.query(`SELECT * FROM pairings
                       WHERE created_at > now() - interval '8 weeks'`)
}

function createNewPairing(name1, name2, name3) {
  return client.query(`INSERT INTO pairings(person_one, person_two, person_three) 
                        VALUES($1, $2, $3) RETURNING pairings.id`, [name1, name2, name3 || null])
}

module.exports = {
  fetchAllPairings,
  createNewPairing
}
