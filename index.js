const slack = require('@slack/client')
const db = require('./db')
const api = require('./api/match')

const slackClient = new slack.WebClient(process.env.SLACK_API_TOKEN)

function main(){
  //get all channels from slack and see where bot is a member
  slackClient.channels.list({exclude_members:true})
  .then(result=>result.channels.filter(channel=>channel.is_member))
  .then(coffeeChannels=>{
    //once you have these channels, get previous pairings, so as to avoid duplicates
    db.fetchAllPairings()
    .then(pairings=>{
      const previousPairs = pairings.rows
      coffeeChannels.forEach(channel=>{
        //for each channel, find its members
        slackClient.channels.info(channel.id)
        .then(res=>
          //generate pairs for each channel
          api.generatePairs(res.channel.members, previousPairs).generatedPairs
          .forEach(({personOne, personTwo})=>{
            //log to the db
            db.createNewPairing(personOne, personTwo)
            //send message via Slack
            sendSlackMessage([personOne,personTwo], channel.name)
          }))
        })
      })
    })    
  .catch(err=>console.error(err))
}

function sendSlackMessage(members, channel){
  members=members.join(',')
  slackClient.mpim.open(members).then(data =>{ 
    slackClient.chat.postMessage(data.group.id,
`:wave: Hello! :wave:

I'm your friendly :coffee::robot_face:, here to help you get to know your teammates by creating pairings from #${channel} weekly.

Now that you're here, why don't you pick a time and day to meet for :coffee:, :tea:, :cake:, or :doughnut:s?

Want to stop participating? Just leave #${channel}`, {
      link_names: true
    })
  })
  .catch(err=>console.error(err))
}

main()
