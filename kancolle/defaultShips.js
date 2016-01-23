//default stats. Ship type irrelevant
var defaults = {
    //core handler to find things
    userid: "", //literal ID
    type: "", //Based on a series of types of ships

    //message counter
    sailed: "", //use momentjs to capture date
    messages: 0, //message counter, must have 15 characters
    lastmessage: "", //to check to see if it's a spam
    lastmessagedate: "", //date
    dailypoints: 0, //Also known as revival points, supply reset points, and other bonuses, limited to 10. if (dailypoints < 10 && lastmessagedate.diff(moment(), 'hours') > 22) {}

    //death control
    lastdeath: "", //delay used to respawn/repair, by the hour (lastdeath.diff(moment(), 'hours'))
    morale: 0, //lost per PvP / PvE battle, gained by waiting / spending for supplies. 50 pts for between. up to 20% damage boost / reduction at 100/0.
    supplies: 0, //action points to do something. Based on hourly supplies. Max is 100
    suppliesStolen: 0, //these will be the first to go when supplies are stolen
    status: [], //represents ship injuries, such as hull damage or weapon damage. Low morale causes a hidden status

    //starting stats
    stats: {
      hp: 0, //current HP in a battle, trainable to 100.
      armor: 0, //damage reduction by 100/(100 + armor). Limit 100 armor. up to 400 extra armor from armory. Breakpoint at 100 (50% armor reduction)
      evasion: 0, //chance to reduce being hit. Max 100 pts for 33% evasion (100 / (100 + evasion / 2)), trainable up to 100 points
      firepower: 0, //offensive power to ships, trainable with a limit of 100
      torpedo: 0, //offensive power to submarines, trainable with a limit of 100
      AA: 0, //offensive power to aircraft, trainable with a limit of 100
      speed: 0, //How fast a ship can respond for first and subsequent attacks, trainable up to 50, limit 100. 100 speed = 2x speed (1/(1+speed)) action rate
      luck: 0 //chance of criticals, 100% = 10% Crit Chance, untrainable
    },
    totalStats: 0,
    /*var total; for (var i in stats) {total += stats[i]}; return */

    stock: {
      model: "", //default bonuses, primarily where most of the HP comes from
      main_weapon: "", //focus on bringing bonus to offensive of any type
      secondary_weapon: "", //focus on bringing bonus to offensive of any type
      third_weapon: "",
      engine: "", //increases evasion / speed generally
      hull: "", //increases armor, sometimes penalizing in speed
      misc: "" //provides special bonuses per turn
    }
  },
  ships = [
    "destroyer",
    "light cruiser",
    "torpedo cruiser",
    "submarine", //
    "heavy cruiser",
    "aviation cruiser",
    "battleship",
    "aviation battleship",
    "light aircraft carrier",
    "regular aircraft carrier",
    "armored aircraft carrier",
    "submarine aircraft carrier",
    "amphibious assault ship"
  ],
  ships = {
    "destroyer": {
      description: "A fast and enduring warship, balanced in ship combat",
      stockAllow: {
        main_weapon: "gun",
        secondary_weapon: "AA",
        third_weapon: "torpedo",
        engine: "boiler", //dynamically helps with max speed and evasion per class
        hull: "steel", //dynamically helps with max armor and health per class
        misc: "" //bonus stats
      }
    },
    "light cruiser": {
      description: "A small warship, capable of moving fast in action with reduced armor"
    },
    "torpedo cruiser": {
      description: "A warship with additional missile bay for more ship / submarine damage"
    },
    "submarine": {
      description: "A fast and mobile ship, capable of evading gunfire. Only has torpedo weaponry"
    },
    "heavy cruiser": {
      description: "A strong warship that can push through the likes of skirmishing"
    },
    "aviation cruiser": {
      description: "A standard skirmishing warship with an additional bay for allowing arial bombardment"
    },
    "battleship": {
      description: "Armed with high caliber guns, these ships deal massive damage while taking just as much"
    },
    "aviation battleship": {
      description: "Sacrificing a slot for a plane runway, these ships deal more tactical damage towards enemy ships"
    },
    "light aircraft carrier": {
      description: "A warship designed for speed and deploying planes, sacrifices defenses for evasion"
    },
    "regular aircraft carrier": {
      description: "A balanced ship loaded with planes"
    },
    "armored aircraft carrier": {
      description: "A warship slower than an average carrier for carrying planes, at a benefit for maximizing defenses"
    },
    "submarine aircraft carrier": {
      description: "A submarine capable of stealthily launching planes for additional support"
    },
    "amphibious assault ship": {
      descriptioN: "A maneuverable ship capable of adapting to different types of attacks"
    }
  };

//starting stats no more than 100 points


newShip = (id, shipName) => {
  var Ship = defaults;
  Ship.userid = id;
  if (shipName === "destroyer") {
    //fast and enduring (armor)
    Ship.type = "destroyer";
    Ship.stats.hp = 50;
    Ship.stats.armor = 15;
    Ship.stats.evasion = 10;
    Ship.stats.firepower = 20;
    Ship.stats.torpedo = 0;
    Ship.stats.AA = 0;
    Ship.stats.speed = 5;
    Ship.stats.luck = 0;
    Ship.totalStats = 100;
  } else
    return Ship;
};

module.exports = {
  defaults: defaults,
  ships: ships,
  newShip: newShip
};
