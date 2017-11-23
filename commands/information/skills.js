const Commando = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const Request = require('request');

const cron = require('node-cron');
const PersistentCollection = require('djs-collection-persistent');

const SkillTable = new PersistentCollection({name: "SkillTable"});

var updateTask = cron.schedule('* * * 1 * *', () => { 
      console.log("Monthly Update - Updating Data - Skills");

            // Skills
            Request('http://tempestgrove.com/wp-json/wp/v2/pages/890', (err, res, body) =>{
                  JSON.parse(body).acf.skills.map((skill) => {
                        SkillTable.get( skill.name.toLowerCase());
                        var tempSkill = skill;
                        SkillTable.set(skill.name.toLowerCase(), tempSkill);
                  });
                  
            });

            // Frag Skills
            Request('http://tempestgrove.com/wp-json/wp/v2/pages/909', (err, res, body) =>{
                  JSON.parse(body).acf.skills.map((skill) => {
                        SkillTable.get(skill.name.toLowerCase());
                        var tempSkill = skill;
                        SkillTable.set(skill.name.toLowerCase(), tempSkill);
                  });
                 
                  
            });

            // Class Skills
            Request('http://tempestgrove.com/wp-json/wp/v2/pages/908', (err, res, body) =>{
                  JSON.parse(body).acf.skills.map((skill) => {
                        SkillTable.get( skill.name.toLowerCase());
                        var tempSkill = skill;
                        SkillTable.set(skill.name.toLowerCase(), tempSkill);
                  });
                  
            });         

            // Racial Skills
            Request('http://tempestgrove.com/wp-json/wp/v2/pages/897', (err, res, body) =>{
                  JSON.parse(body).acf.skills.map((skill) => {
                        SkillTable.get( skill.name.toLowerCase());
                        var tempSkill = skill;
                        SkillTable.set(skill.name.toLowerCase(), tempSkill);

                  });
            });

            console.log("Monthly Update - Finished Updating - Skills");

}, false);


module.exports = class SkillCommand extends Commando.Command {
      constructor(client) {
            super(client, {
                  name:"skill",
                  aliases:["skills"],
                  group:"information",
                  memberName:"skill",
                  description:"Shares information about a specific skill.",
                  examples: ['!skill slay / parry'],
                  throttling: {
                        usages: 1,
                        duration: 5
                  },
                  args:
                  [
                        {
                              key:'skillname',
                              prompt: 'Please add a skill name',
                              type:'string'
                        }
                  ]
            });
            // Skills
            Request('http://tempestgrove.com/wp-json/wp/v2/pages/890', (err, res, body) =>{
                  JSON.parse(body).acf.skills.map((skill) => {
                        SkillTable.set( skill.name.toLowerCase() , skill );
                  });
            });

            // Frag Skills
            Request('http://tempestgrove.com/wp-json/wp/v2/pages/909', (err, res, body) =>{
                  JSON.parse(body).acf.skills.map((skill) => {
                        SkillTable.set( skill.name.toLowerCase() , skill );
                  });
            });

            // Class Skills
            Request('http://tempestgrove.com/wp-json/wp/v2/pages/908', (err, res, body) =>{
                  JSON.parse(body).acf.skills.map((skill) => {
                        SkillTable.set( skill.name.toLowerCase()+"" , skill );
                  });
            });         

            // Racial Skills
            Request('http://tempestgrove.com/wp-json/wp/v2/pages/897', (err, res, body) =>{
                  JSON.parse(body).acf.skills.map((skill) => {
                        SkillTable.set( skill.name.toLowerCase() , skill );

                  });
            });

            
            updateTask.start();
           
      }



      async run(msg, args){
            const {skillname} = args;

            var skill = SkillTable.get(skillname.toLowerCase());
            
            
            

            if(skill){

                  var skillName
                  if(skill.name){
                        skillName = "**Name**: "+skill.name+"\n";
                  }
                  else{
                        skillName=""
                  }

                  var prerequesites;
                  if(skill.prerequesites){
                        prerequesites = "**Prerequesites**: "+skill.prerequesites+"\n";
                  }
                  else{
                        prerequesites = ""
                  }

                  var frag_cost;
                  if(skill.frag_cost){
                        frag_cost = "**Frag Cost**: "+skill.frag_cost+"\n";
                  }
                  else{
                        frag_cost = "";
                  }
                  
                  var race;
                  if(skill.race){
                        race = "**Race**: "+skill.race+"\n"
                  }
                  else{
                        race = "";
                  }

                  var fromClass;
                  if(skill.class){
                        fromClass = "**Class**: "+skill.class+"\n";
                  }
                  else{
                        fromClass = "";
                  }

                  var level;
                  if(skill.level){
                        level = "**Level**: "+skill.level+"\n";
                  }
                  else{
                        level = "";
                  }

                  var skillDescription = skill.description;
                  skillDescription = skillDescription.replace(/&#8217;/g, "\'");
                  skillDescription = skillDescription.replace(/<(.|\n)*?>/g, "");
                  skillDescription = "**Description**:\n "+skillDescription;

                  var finishedMessage = skillName+prerequesites+frag_cost+race+fromClass+level+skillDescription;
                  var skill_costs = ("\n**CP Cost:** \n")
                  if(skill.mercenary_cost){skill_costs +="**Merc: ** "+skill.mercenary_cost+"\t"}
                  if(skill.ranger_cost){skill_costs +="**Ranger: ** "+skill.ranger_cost+"\t"}
                  if(skill.templar_cost){skill_costs +="**Templar: **"+skill.templar_cost+"\n"}
                  if(skill.nightblade_cost){skill_costs +="**NightBlade: **"+skill.nightblade_cost+"\t"}
                  if(skill.assassin_cost){skill_costs +="**Assassian: **"+skill.assassin_cost+"\t"}
                  if(skill.witchblade_cost){skill_costs +="**Wytchhunter: **"+skill.witchblade_cost+"\n"}
                  if(skill.mage_cost){skill_costs +="**Mage: **"+skill.mage_cost+"\t"}
                  if(skill.druid_cost){skill_costs +="**Druid: **"+skill.druid_cost+"\t"}
                  if(skill.bard_cost){skill_costs +="**Bard: **"+skill.bard_cost+"\n"}
                  if(skill.champion_cost){skill_costs +="**Champion: **"+skill.champion_cost+"\t"}
                  if(skill.demagogue_cost){skill_costs +="**Demagogue: **"+skill.demagogue_cost}
                  if(skill.class){
                        if(skill.level == 3){skill_costs +="**Level 3 Class Skill:** 30"}
                        else if(skill.level == 6){skill_costs +="**Level 6 Class Skill:** 60"}
                        else if(skill.level == 9){skill_costs +="**Level 9 Class Skill:** 90"}
                        else {skill_costs +="**Level 12 Class Skill:** 120"}
                  }


                  if(finishedMessage.length >=1950){
                        finishedMessage = splitMessage(finishedMessage);
                        
                        finishedMessage.map((message) => {
                              msg.channel.send(message);
                              
                        });

                        msg.channel.send(skill_costs);
                  }

            
                  else{
                        msg.channel.send(finishedMessage);
                        msg.channel.send(skill_costs);
                  }
            
            }
            else{
                  msg.reply(`A Skill by that name is not in my knowledge...`)
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


