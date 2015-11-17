var Discord = require("discord.js");
var fs = require('fs');
var Loki = require("lokijs");
var util = require('util');

var log_file = fs.createWriteStream(__dirname + '/debug.log', {flags : 'w'});
console.log = function(d) { //
    log_file.write(util.format(d) + '\n');
    process.stdout.write(util.format(d) + '\n');
};

var config = require("./config.json");
var adminCommands = ['setpoints'];

var users = null;
var db = new Loki('data.json', {
	autoload: true,
	autoloadCallback: () => {
		if(!(users = db.getCollection('users'))) {
			users = db.addCollection('users');
		}
		users.findOrCreate = (query) => {
			var user = users.findOne(query);
			if(!user) {
				user = {
					userid: query.userid,
					points: 0,
					pointSpread: {},
					infractions: 0,
					infractionSpread: {}
				};
				users.insert(user);
				saveDatabase();
			}
			return user;
		};
		console.log('Database loaded!');
	}
});

processMessage = (msg) => {
	users.findOrCreate({userid: msg.author.id});
	if(msg.content.startsWith(config.prefix)) {
		var args = msg.content.split(" ");
		var cmd = args.shift().substring(config.prefix.length).toLowerCase();
		if(adminCommands.indexOf(cmd) !== -1) {
			if(!hasAdmin(msg.channel.server, msg.author)) {
				console.log(`${msg.author.username} tried to use ${cmd}!`);
				return;
			}
			console.log("Authenticated "  + msg.author.username);
			if(cmd === "setpoints") {
				if(args.length < 2 || !args[0].match(/^<@[0-9]{15,25}>$/) || isNaN(args[1])) {
					return bot.sendMessage(msg, "You're typing it wrong.");
				}
				var user = users.findOrCreate({userid: args[0].substring(2, args[0].length - 1)});
				user.points = +args[1];
				users.update(user);
				saveDatabase();
				bot.sendMessage(msg, `${msg.author.username} now has ${user.points} points!`);
			}
		}
		else {
			if(cmd === "points") {
				var target = msg.author.id;
				if(args.length >= 1 && (reg = args[0].match(/^<@[0-9]{15,25}>$/))) {
					target = args[0].substring(2, args[0].length - 1);
				}
				var user = users.findOne({userid: target});
				if(!user) {
					return bot.sendMessage(msg, "User not found!");
				}
				else {
					bot.sendMessage(msg, `${msg.author.username} has ${user.points} points!`);
				}
			}
		}
	}
	else if(msg.content.match(/^<@[0-9]{15,25}> *\+\+/)) {
		var target = msg.content.substring(2, msg.content.indexOf('>'));
		var user = users.findOne({userid: target});
		if(!user) {
			return bot.sendMessage(msg, "User not found!");
		}
		user.points++;
		users.update(user);
		saveDatabase();
		bot.sendMessage(msg, `${msg.author.username} gave 1 point to ${bot.users.get('id', target)}!`);
	}
};

hasAdmin = (server, user) => {
	var roles = server.rolesOf(user);
	for(i in roles) {
		if(roles[i].name.match(/(admin|owner)/i)) {
			return true;
		}
	}
	return false;
};

saveDatabase = () => {
	db.saveDatabase();
	console.log('Saved database!');
};

var bot = new Discord.Client();

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