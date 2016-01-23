//only within this file
var Discord = require("discord.js");
var fs = require("fs");
var util = require("util");
var Loki = require("lokijs"); //shared requires
moment = require("moment");
bot = new Discord.Client();

//use readdir to get all the commands
commands = require("./commands/commands.js");
functions = require("./commands/functions.js");

log_file = fs.createWriteStream(__dirname + "/debug.log", {
  flags: "w"
});

console.log = (d) => {
  log_file.write(util.format(d) + "\n");
  process.stdout.write(util.format(d) + "\n");
};

var config = require("./config.json");

var users = null;
var db = new Loki("data.json", {
  autoload: true,
  autoloadCallback: () => {
    //user data collections
    if (!(users = db.getCollection("users"))) {
      users = db.addCollection("users");
    }
    users.create = (query) => {
      var user = users.findOne(query);
      if (user) {
        sendMessage(msg, "ship already created", (err, msg) => {
          functions.deleteMessage500(msg);
        });
      } else if (!user) {console.log("no user");}
    };
    users.find = (query) => {
      var user = users.findOne(query);
      if (!user) {
        sendMessage(msg, `Ship not found. Please create your ship using ${config.prefix}createship.`, (err, msg) => {
          functions.deleteMessage500(msg);
        });
      } else {
        return user;
      }
    };

    //death control list
    //if(!())
    console.log("Database loaded!");
  }
});

processMessage = (msg) => {
  //users.findOrCreate({userid: msg.author.id});
  var user = null,
    cmdID = null;
  if (msg.content.startsWith(config.prefix)) {
    //separate message from command and remove the prefix
    var args = msg.content.split(" "),
      cmd = args.shift().substring(config.prefix.length).toLowerCase();

    //cross check current admin command list
    if (commands.adminlist.indexOf(cmd) !== -1) {
      if (!hasAdmin(msg.channel.server, msg.author)) {
        console.log(`${msg.author.username} tried to use ${cmd}!`);
        return;
      }
      console.log("Authenticated " + msg.author.username);
      cmdID = commands.adminlist.indexOf(cmd);
      commands[cmdID](args, msg.author.id, msg);

      bot.sendMessage(msg, "command executed");
      /*
      if (cmd === "setsupplies") {

        if (args.length < 2 || !args[0].match(/^<@[0-9]{15,25}>$/) || isNaN(args[1])) {
          return bot.sendMessage(msg, "You're typing it wrong.");
        }
        user = users.findOrCreate({
          userid: args[0].substring(2, args[0].length - 1)
        });
        user.points = +args[1];
        users.update(user);
        saveDatabase();
        bot.sendMessage(msg, `${msg.author.username} now has ${user.points} points!`);
      }
      */
    } else if (commands.userlist.indexOf(cmd) !== -1) {
      //commands all users can use
      cmdID = commands.userlist[commands.userlist.indexOf(cmd)];

      //launch function of object
      commands[cmdID](args, msg.author.id, msg);
    } else {
      console.log(`Command ${cmd} was not found; executed by ${msg.author.username}`);
    }
  } else if (msg.content.match(/^<@[0-9]{15,25}> *\+\+/)) {
    var target = msg.content.substring(2, msg.content.indexOf(">"));
    user = users.findOne({
      userid: target
    });
    if (!user) {
      return bot.sendMessage(msg, "User not found!");
    }
    user.points++;
    users.update(user);
    saveDatabase();
    bot.sendMessage(msg, `${msg.author.username} gave 1 point to ${bot.users.get("id", target)}!`);
  }
};

hasAdmin = (server, user) => {
  var roles = server.rolesOf(user);
  for (var i in roles) {
    if (roles[i].name.match(/(admin|owner|admiral)/i)) {
      return true;
    }
  }
  return false;
};

saveDatabase = () => {
  db.saveDatabase();
  console.log(`Saved database at ${moment()}!`);
};

bot.on("ready", () => {
  console.log("Ready to begin! Serving in " + bot.channels.length + " channels");
});

bot.on("message", (message) => {
  processMessage(message);
});

bot.on("disconnected", () => {
  console.log("Disconnected from Discord!");
  process.exit(1);
});

bot.login(config.auth.email, config.auth.pass);

/*

var pointsSystem = [{
    'id12345678': {
    	"name": "Zman840",
    	"id": 12345678,
    	"points": 128,
    	"pointsBreakdown": {
    		"participation": 21,
    		"referral": 21,
    		"activity": 21
    	},
    	"infractions": 0,
    	"lastMessage": 12384791
    },
    'id138913789': {
    	"name": "Incorrect",
    	"id": 138913789,
    	"points": 128,
    	"pointsBreakdown": {
    		"participation": 21,
    		"referral": 21,
    		"activity": 21
    	},
    	"infractions": 0,
    	"lastMessage": 144179
    }
}];
*/
