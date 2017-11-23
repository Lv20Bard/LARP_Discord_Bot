const Commando = require('discord.js-commando');
const Request = require('request');

const cron = require('node-cron');
const PersistentCollection = require('djs-collection-persistent');

const ClassTable = new PersistentCollection({name: "ClassTable"});

var updateTask = cron.schedule('* * * 1 * *', () => { 
      console.log("Monthly Update - Updating Data - Classes");
      Request('http://tempestgrove.com/wp-json/wp/v2/pages/889', (err, res, body) =>{
            JSON.parse(body).acf.classes.map((thisClass) => {
                  var tempClass = ClassTable.get( thisClass.name.toLowerCase() );
                  tempClass = thisClass;
                  ClassTable.set( thisClass.name.toLowerCase(), tempClass);
                  
            })
      });

      console.log("Monthly Update - Finished Updating - Classes");
}, false);

module.exports = class ClassCommand extends Commando.Command {
      constructor(client) {
            super(client, {
                  name:"class",
                  aliases:["classes","vocation","vocations"],
                  group:"information",
                  memberName:"class",
                  description:"Shares information about a specific class.",
                  examples: ['!class templar'],
                  throttling: {
                        usages: 1,
                        duration: 5
                  },
                  args:
                  [
                        {
                              key:'classname',
                              prompt: 'Please add a class name',
                              type:'string'
                        }
                  ]
            });

            Request('http://tempestgrove.com/wp-json/wp/v2/pages/889', (err, res, body) =>{
                  JSON.parse(body).acf.classes.map((thisClass) => {
                        ClassTable.set( thisClass.name.toLowerCase() , thisClass );
                        
                  });
                 
            });


            updateTask.start();

            
      };

      

      async run(msg, args){
            const {classname} = args;
            
            var thisClass = ClassTable.get(classname.toLowerCase());
            console.log(thisClass);
            if(thisClass){
                  var className;
                  if(thisClass.name){
                       className = "**Name**: "+thisClass.name+"\n";
                  }
                  else{
                        className = "";
                  }

                  var optional;
                  if(thisClass.optional){
                        optional = "**Optional**: "+thisClass.optional+"\n";
                  }
                  else{
                        optional = "";
                  }

                  var frag_cost;
                  if(thisClass.frag_cost){
                        frag_cost = "**Frag Cost**: "+thisClass.frag_cost+"\n";
                  }
                  else{
                        frag_cost = "";
                  }

                  var description;
                  if(thisClass.description){
                        description = "**Description**:\n "+thisClass.description+"\n"
                  }
                  else{
                        description = "";
                  }

                  var skills = "**Skills:**\n";
                  if(thisClass.class_skills_lv3){skills += "Level 3: "+thisClass.class_skills_lv3+"\n"}
                  if(thisClass.class_skill_lv6){skills += "Level 6: "+thisClass.class_skill_lv6+"\n"}
                  if(thisClass.class_skill_lv9){skills += "Level 9: "+thisClass.class_skill_lv9+"\n"}
                  if(thisClass.class_skill_lv12){skills += "Level 12: "+thisClass.class_skill_lv12+"\n\n"}
                  skills +="*Type* **!skill** *for more information*";

                  var finishedMessage = className+optional+frag_cost+description+skills;

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
                  msg.reply('I don\'t know any classes by that name.');
            }
      }
}



