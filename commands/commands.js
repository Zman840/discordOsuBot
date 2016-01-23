var adminlist = ["setsupplies"], //lists total commands
  userlist = ["createship"],
  defaultships = require("../kancolle/defaultShips.js");

/**
 * Admin command setsupplies only within a specific channel
 * @param  {array} args  0: user ID
 *                       1: amount set to, override old
 * @param  {object} msg  message object
 * @return {function}
 */
var setsupplies = (args, msg) => {
  if (args.length < 2 || !args[0].match(/^<@[0-9]{15,25}>$/) || isNaN(args[1])) {
    return bot.sendMessage(msg, "You're typing it wrong.");
  }
};

/**
 * User command createship
 * @param  {array} args  To be turned into a stirng
 * @param  {string} id   String of user, in numbers
 * @param  {object} msg  Message object
 * @return {function}
 */
var createship = (args, id, msg) => {
  //join arguments into a string
  var ship = args.join(" ");
  //check list of strings involved matches any of the defaultship's creation
  if (defaultships.ships.indexOf(ship) !== -1) {
    var defaults = defaultships.newShip(ship, id);
    //console.log(defaults);

    bot.sendMessage(msg, `default ship ${ship} found. Your ship is being made.`, (err, msg) => {
      /*
      user = users.create({
        userid: id
      });
      */
      functions.deleteMessage500(msg);
    });

    functions.deleteMessage500(msg);
  } else {
    return bot.sendMessage(msg, `default ship ${ship} not found`, (err, msg) => {
      functions.deleteMessage500(msg);
    });
  }
  return;
};

module.exports = {
  adminlist: adminlist,
  userlist: userlist,
  setsupplies: setsupplies,
  createship: createship
};
