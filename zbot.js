var fs = require('fs');
var util = require('util');

//log in debug.log
var log_file = fs.createWriteStream(__dirname + '/debug.log', {flags : 'w'});
var log_stdout = process.stdout;
console.log = function(d) { //
  log_file.write(util.format(d) + '\n');
  log_stdout.write(util.format(d) + '\n');
};


//the bot itself
var Discord = require("discord.js");
var zbot = new Discord.Client();

//username/password auth
var AuthDetails = require("./auth.json");

//json handler to write/read
var jsonfile = require("jsonfile");



zbot.on("ready", function () {
	console.log("Ready to begin! Serving in " + zbot.channels.length + " channels");
});

//id is like that for object finding to find properly as an idea. Planning to use jsonfile as a handler for that
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

zbot.on("message", function(message) {
	if (message.client)
	//console.log(message)
	console.log(message);
	//respond under 2 conditions: You have an administrative role && you have
	var serverID = zbot.getServer("id", message.channel.serverID),
	serverRoles = [],
	serverRoleName = [],
	Admincommands = ["!zPoints", "!zBeatmap"],
	messageArray = message.split(" ");
	//beatmap command expressions planned:
	//Administrators / event planners:
		//beatmap link
    ///regular users
		//beatmap upload

	for (serverRole in serverID.roles) {
		var name = serverID["roles"][serverRole]["name"],
		id = serverID["roles"][serverRole]["id"],
		roleID = {name: name, id: id};

		serverRoles.push(id);
		serverRoleName.push(name);
		//console.log(roleID)
	}

	if (roleCheck(message.author.rawRoles, serverRoles, serverRoleName, message.content)) {
		console.log("role access response Allowed");
	}
	/*
	    if (message.content === "ping")
	        zbot.reply(message, "pong");
	    else if (message.content === "!zTest")
	    	zbot.reply(message, "test success");
	    else
	    	zbot.sendMessage(message, "test Failed");

	*/
});

zbot.on("disconnected", function () {

	console.log("disconnected from discord!");
	process.exit(1); //exit node.js with an error
	
});

//create functions for many things, including role check
function AdminCheck (authorRoleArray, serverRoleArray, serverRoleName) {

	//match role indexes with names and set it as its own array
	var names = [], role;
	for (id in authorRoleArray) {
		role = serverRoleArray.indexOf(authorRoleArray[id]);
		names.push(serverRoleName[role]);
	}
	console.log(names);


	if (names.indexOf("Admin") !== -1 || names.indexOf("Owner") !== -1) {
		return true;
	} else {
		return false;
	}
}

zbot.login(AuthDetails.email, AuthDetails.password);
