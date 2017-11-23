const Commando = require('discord.js-commando');
const Request = require('request');

const PersistentCollection = require('djs-collection-persistent');
const CharacterGeneratorData = new PersistentCollection({name: "CharacterGeneratorData"});

module.exports = class GenerateCharacter extends Commando.Command{
      constructor(client){
            super(client, {
                  name:"chargen",
                  aliases:["generate","instachar","generatecharacter"],
                  group:"utility",
                  memberName:"chargen",
                  description:"Generate a Simple Character",
                  examples: ['!chargen'],
                  throttling: {
                        usages: 1,
                        duration: 5
                  }
            });

            Request('http://tempestgrove.com/wp-json/wp/v2/pages/822', (err, res, body) =>{
                  var answer = JSON.parse(body);
                  CharacterGeneratorData.set( "GeneratorData", answer);
            });
      }

      async run(msg){
            
            var finishedMessage = ""; 
            
            var answer = CharacterGeneratorData.get("GeneratorData");

            var max = answer.acf.races.length;
            var x = Math.floor(Math.random() * (max));
            finishedMessage = "\n**Race:** "+answer.acf.races[x].name+"\n";
            
            max = answer.acf.classes.length;
            x = Math.floor(Math.random() * (max));
            finishedMessage += "**Class:** "+answer.acf.classes[x].name+"\n";

            max = answer.acf.backstory_arrival.length;
            x = Math.floor(Math.random() * (max));
            finishedMessage += "You "+answer.acf.backstory_arrival[x].arrival+" ";
            
            //backstory_purpose
            max = answer.acf.backstory_purpose.length;
            x = Math.floor(Math.random() * (max));
            finishedMessage += "You are "+answer.acf.backstory_purpose[x].purpose+" ";

            //backstory_quirk
            max = answer.acf.backstory_quirk.length;
            x = Math.floor(Math.random() * (max));
            finishedMessage += "You "+answer.acf.backstory_quirk[x].quirk+" ";

            //backstory_profession
            max = answer.acf.backstory_profession.length;
            x = Math.floor(Math.random() * (max));
            finishedMessage += "You are "+answer.acf.backstory_profession[x].profession+". ";
            
            msg.reply(finishedMessage);
            
      }
}