const Commando = require('discord.js-commando');
const Request = require('request');

const cron = require('node-cron');
const PersistentCollection = require('djs-collection-persistent');

const SpellTable = new PersistentCollection({name: "SpellTable"});

var updateTask = cron.schedule('* * * 1 * *', () => { 
      console.log("Monthly Update - Updating Data - Spells");

      Request('http://tempestgrove.com/wp-json/wp/v2/pages/1291', (err, res, body) =>{
            JSON.parse(body).acf.spells.map((spell) => {
                  SpellTable.get( spell.name.toLowerCase());
                  var tempSpell = thisClass;
                  SpellTable.set ( spell.name.toLowerCase(), tempSpell);            
            });
      });

      Request('http://tempestgrove.com/wp-json/wp/v2/pages/1312', (err, res, body) =>{
            JSON.parse(body).acf.spells.map((spell) => {
                  SpellTable.get( spell.name.toLowerCase());
                  var tempSpell = thisClass;
                  SpellTable.set ( spell.name.toLowerCase(), tempSpell);            
            });
      });

      console.log("Monthly Update - Finished Updating - Spells");
}, false);

module.exports = class SpellCommand extends Commando.Command {
      constructor(client) {
            super(client, {
                  name:"spell",
                  aliases:["spells"],
                  group:"information",
                  memberName:"spell",
                  description:"Shares information about a specific spell.",
                  examples: ['!spell elemental missle'],
                  throttling: {
                        usages: 1,
                        duration: 5
                  },
                  args:
                  [
                        {
                              key:'spellname',
                              prompt: 'Please add a spell name',
                              type:'string'
                        }
                  ]
            });

            Request('http://tempestgrove.com/wp-json/wp/v2/pages/1291', (err, res, body) =>{
                  JSON.parse(body).acf.spells.map((spell) => {
                        SpellTable.set( spell.name.toLowerCase() , spell );
                       
                  });
            });

            Request('http://tempestgrove.com/wp-json/wp/v2/pages/1312', (err, res, body) =>{
                  JSON.parse(body).acf.spells.map((spell) => {
                        SpellTable.set( spell.name.toLowerCase() , spell );
                       
                  });
            });
            

            updateTask.start();
      }



      async run(msg, args){
            const {spellname} = args;

            var spell = SpellTable.get(spellname.toLowerCase());
            
            
            

            if(spell){
                  var spellDescription = spell.description;
                  spellDescription = spellDescription.replace(/&#8217;/g, "\'");
                  spellDescription = spellDescription.replace(/<(.|\n)*?>/g, "");

                  msg.reply(`
                        **Name**: ${spell.name}
                        **Sphere**: ${spell.sphere}
                        **Incant**: ${spell.incant}
                        **Level**: ${spell.level}
                        **Duration**: ${spell.duration}
                        **Description**: ${spellDescription}
                  `);
            }
            else{
                  msg.reply(`A Spell by that name is not in my knowledge...`)
            }
      }
}



