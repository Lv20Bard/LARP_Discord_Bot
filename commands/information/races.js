const Commando = require('discord.js-commando');
const Request = require('request');

const cron = require('node-cron');
const PersistentCollection = require('djs-collection-persistent');

const RaceTable = new PersistentCollection({name: "RaceTable"});


var updateTask = cron.schedule('* * * 1 * *', () => { 
      console.log("Monthly Update - Updating Data - Races");
      Request('http://tempestgrove.com/wp-json/wp/v2/pages/888', (err, res, body) =>{
            JSON.parse(body).acf.races.map((race) => {
                  
                  var raceName = race.name.toLowerCase().replace(/ *\([^)]*\) */g,"");
                  raceName = raceName.replace(/:/i, "");
                  raceName = raceName.replace(/the cindus'thalan/i, "");
                  raceName = raceName.replace(/the crissen'thalan/i, "");
                  raceName = raceName.replace(/the elghast'thalan/i, "");
                  raceName = raceName.replace(/darkling/i, "");

                  
                  tempRace = RaceTable.get(raceName);
                  tempRace = race;

                  RaceTable.set(raceName, tempRace);

            });

      });

      console.log("Monthly Update - Finished Updating - Races");

}, false);

module.exports = class RaceCommand extends Commando.Command {
      constructor(client) {
            super(client, {
                  name:"race",
                  aliases:["races"],
                  group:"information",
                  memberName:"race",
                  description:"Shares information about a specific race.",
                  examples: ['!race hobling'],
                  throttling: {
                        usages: 1,
                        duration: 5
                  },
                  args:
                  [
                        {
                              key:'racename',
                              prompt: 'Please add a race name',
                              type:'string'
                        }
                  ]
            });
            
            Request('http://tempestgrove.com/wp-json/wp/v2/pages/888', (err, res, body) =>{
                  JSON.parse(body).acf.races.map((race) => {
                        var raceName = race.name.toLowerCase().replace(/ *\([^)]*\) */g,"");
                        raceName = raceName.replace(/: /i, "");
                        raceName = raceName.replace(/the cindus'thalan/i, "");
                        raceName = raceName.replace(/the crissen'thalan/i, "");
                        raceName = raceName.replace(/the elghast'thalan/i, "");
                        raceName = raceName.replace(/darkling/i, "");
                        

                        RaceTable.set( raceName , race );
                  });
            });


            updateTask.start();

           
      }


      async run(msg, args){
            const {racename} = args;

            var race = RaceTable.get(racename.toLowerCase());
            
            

            if(race){
                  var raceName;
                  if(race.name){
                        raceName = "**Name**: "+race.name+"\n";
                  }
                  else{
                        raceName = "";
                  }

                  var lifeSpan;
                  if(race.life_span){
                        lifeSpan = "**Life Span: **"+race.life_span+"\n";
                  }
                  else{
                        lifeSpan = "";
                  }

                  var raceDescription;
                  if(race.description){
                        raceDescription = "**Description**:\n"+race.description+"\n";
                  }
                  else{
                        raceDescription = "";
                  }

                  var racialCharacteristics;
                  if(race.racial_characteristics){
                        racialCharacteristics = "**Racian Characterists: **"+race.racial_characteristics+"\n";
                  }
                  else{
                        racialCharacteristics = "";
                  }

                  var raceAdvantage;
                  if(race.advantages){
                        raceAdvantage = "**Advantages**:\n"+race.advantages+"\n";
                  }
                  else{
                        raceAdvantage = "";
                  }

                  var raceDisadvangae;
                  if(race.disadvantages){
                        raceDisadvangae = "**Disadvantages**:\n"+race.disadvantages+"\n";
                  }
                  else{
                        raceDisadvangae = "";
                  }

                  var fragCost;
                  if(race.frag_cost){
                        fragCost = "**Frag Cost: **"+race.frag_cost+"\n";
                  }
                  else{
                        fragCost = "";
                  }

                  var fromAppendix;
                  if(race.appendix){
                        fromAppendix = "**Appendix Race: ** Yes"+"\n";
                  }
                  else{
                        fromAppendix = "**Appendix Race: ** No"+"\n";
                  }

                  var finishedMessage  = raceName+lifeSpan+raceDescription+racialCharacteristics+raceAdvantage+raceDisadvangae+fragCost+fromAppendix;
                  finishedMessage = finishedMessage.replace(/&#8217;/g, "\'");
                  finishedMessage = finishedMessage.replace(/<(.|\n)*?>/g, "");

                  if(finishedMessage.length >=1950){
                        finishedMessage = splitMessage(finishedMessage);
                        
                        finishedMessage.map((message) => {
                              msg.channel.send(message);
                        });
                  }

                  else{
                        msg.channel.send(finishedMessage);
                  }

            }
            else{
                  msg.reply("I've never heard of that race...");
            }
      }
}


function splitMessage(text, { maxLength = 1950, char = '\n', prepend = '', append = '' } = {}) {
      if (text.length <= maxLength) return text;
            const splitText = text.split(char);
      if (splitText.length === 1) throw new Error('Message exceeds the max length and contains no split characters.');
            const messages = [''];

      let msg = 0;
      for (let i = 0; i < splitText.length; i++) {
            if (messages[msg].length + splitText[i].length + 1 > maxLength) {
                  messages[msg] += append;
                  messages.push(prepend);
                  msg++;
            }
            messages[msg] += (messages[msg].length > 0 && messages[msg] !== prepend ? char : '') + splitText[i];
      }
      return messages;
}


