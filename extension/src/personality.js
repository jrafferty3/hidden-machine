/* controller for when to use certain audio files */

var checked_trigger = false;

_phrases = [
    {
	"name": "matherr",
	"chance": 0.10,
	"max": 2,
	"used": 0,
	"audio": new Audio("http://i1.theportalwiki.net/img/6/6a/GLaDOS_escape_02_spheredestroy4-11.wav"),
	"trigger": function () {
	    if ($(".battle-log > div:first-child > h2:last").next().length > 0) {
		curr = $(".battle-log > div:first-child > h2:last");
		while (curr.next().length > 0) {
		    if (curr.next().text().match(/The foe's .+ fainted!/)) {
			return true;
		    }
		    curr = curr.next();
		}
	    }
	    return false;
	}
    },
    {
	"name": "hurtbadly",
	"chance": 0.10,
	"max": 2,
	"used": 0,
	"audio": new Audio("http://i1.theportalwiki.net/img/4/41/GLaDOS_escape_00_part1_nag14-1.wav"),
	"trigger": function() {
	    return true;
	}
    },
    {
	"name": "lastthing",
	"chance": 0.05,
	"max": 1,
	"used": 0,
	"audio": new Audio("http://i1.theportalwiki.net/img/e/e8/GLaDOS_escape_02_spheredestroy3-03.wav"),
	"trigger": function() {
	    return true;
	}
    },
    {
	"name": "congrats",
	"chance": 0.99,
	"max": 1,
	"used": 0,
	"audio": new Audio("http://i1.theportalwiki.net/img/1/1a/GLaDOS_15_part1_into_the_fire-1.wav"),
	"trigger": function () {
	    if ($(".battle-log > div:first-child > h2:last").next().length > 0) {
		curr = $(".battle-log > div:first-child > h2:last");
		while (curr.next().length > 0) {
		    if (curr.next().text().match($("span.username").text().replace(/ /g, "") + " won the battle!")) {
			return true;
		    }
		    curr = curr.next();
		}
	    }
	    return false;
	}
    },
    {
	"name": "rrrrhate",
	"chance": 0.20,
	"max": 2,
	"used": 0,
	"audio": new Audio("http://i1.theportalwiki.net/img/9/90/GLaDOS_escape_02_spheredestroy4-01.wav"),
	"trigger": function () {
	    if ($(".battle-log > div:first-child > h2:last").next().length > 0) {
		curr = $(".battle-log > div:first-child > h2:last");
		while (curr.next().length > 0) {
		    if (curr.next().text().match("It's super effective!") &&
		       !curr.next().text().match("The foe")) {
			return true;
		    }
		    curr = curr.next();
		}
	    }
	    return false;
	}
    },
    {
        "name": "painsnd",
        "chance": 0.30,
        "max": 5,
        "used": 0,
        "audio": new Audio("http://i1.theportalwiki.net/img/4/42/GLaDOS_escape_01_first_hit_nag01-1.wav"),
        "trigger": function () {
            if ($(".battle-log > div:first-child > h2:last").next().length > 0) {
                curr = $(".battle-log > div:first-child > h2:last");
                while (curr.next().length > 0) {
                    if (curr.next().text().match("It's super effective!") &&
                       !curr.next().text().match("The foe")) {
                        return true;
                    }
                    curr = curr.next();
                }
            }
            return false;
        }
    },
    {
        "name": "believeme",
        "chance": 0.10,
        "max": 1,
        "used": 0,
        "audio": new Audio("http://i1.theportalwiki.net/img/e/e4/GLaDOS_escape_02_spheredestroy4-09.wav"),
        "trigger": function () {
            if ($(".battle-log > div:first-child > h2:last").next().length > 0) {
                curr = $(".battle-log > div:first-child > h2:last");
                while (curr.next().length > 0) {
                    if (curr.next().text().match("It's super effective!") &&
                       curr.next().text().match("The foe")) {
                        return true;
                    }
                    curr = curr.next();
                }
            }
            return false;
        }
    },
    {
        "name": "immediatecake",
        "chance": 0.05,
        "max": 2,
        "used": 0,
        "audio": new Audio("http://i1.theportalwiki.net/img/3/3d/GLaDOS_05_part1_nag5-1.wav"),
        "trigger": function () {
            if ($(".battle-log > div:first-child > h2:last").next().length > 0) {
                curr = $(".battle-log > div:first-child > h2:last");
                while (curr.next().length > 0) {
                    if (curr.next().text().match("A critical hit!")) {
                        return true;
                    }
                    curr = curr.next();
                }
            }
            return false;
        }
    },
    {
        "name": "nearingconcl",
        "chance": 0.10,
        "max": 1,
        "used": 0,
        "audio": new Audio("http://i1.theportalwiki.net/img/a/aa/GLaDOS_14_part1_entry-1.wav"),
        "trigger": function () {
            if ($(".battle-log > div:first-child > h2:last").next().length > 0) {
                curr = $(".battle-log > div:first-child > h2:last");
                while (curr.next().length > 0) {
                    if (curr.next().text().match("A critical hit!") &&
		       curr.next().text().match("The foe")) {
                        return true;
                    }
                    curr = curr.next();
                }
            }
            return false;
        }
    },
    {
        "name": "timeout",
        "chance": 0.25,
        "max": 2,
        "used": 0,
        "audio": new Audio("http://i1.theportalwiki.net/img/4/43/GLaDOS_escape_02_spheredrop1-01.wav"),
        "trigger": function () {
            if ($(".battle-log > div:first-child > h2:last").next().length > 0) {
                curr = $(".battle-log > div:first-child > h2:last");
                while (curr.next().length > 0) {
                    if (curr.next().text().match("fainted!") &&
                       !curr.next().text().match("The foe")) {
                        return true;
                    }
                    curr = curr.next();
                }
            }
            return false;
        }
    },
    {
        "name": "reversepsych",
        "chance": 0.20,
        "max": 1,
        "used": 0,
        "audio": new Audio("http://i1.theportalwiki.net/img/2/20/GLaDOS_escape_02_spherenag1-03.wav"),
        "trigger": function () {
            if ($(".battle-log > div:first-child > h2:last").next().length > 0) {
                curr = $(".battle-log > div:first-child > h2:last");
                while (curr.next().length > 0) {
                    if (curr.next().text().match("sent out")) {
                        return true;
                    }
                    curr = curr.next();
                }
            }
            return false;
        }
    },
        {
        "name": "ohhi",
        "chance": 0.10,
        "max": 2,
        "used": 0,
        "audio": new Audio("http://i1.theportalwiki.net/img/5/58/GLaDOS_potatos_sp_a3_00_fall05.wav"),
        "trigger": function () {
            if ($(".battle-log > div:first-child > h2:last").next().length > 0) {
                curr = $(".battle-log > div:first-child > h2:last");
                while (curr.next().length > 0) {
                    if (curr.next().text().match("sent out")) {
                        return true;
                    }
                    curr = curr.next();
                }
            }
            return false;
        }
    },
    {
        "name": "no!!",
        "chance": 0.15,
        "max": 3,
        "used": 0,
        "audio": new Audio("http://i1.theportalwiki.net/img/7/74/GLaDOS_potatos_emotion_no03.wav"),
        "trigger": function () {
            if ($(".battle-log > div:first-child > h2:last").next().length > 0) {
                curr = $(".battle-log > div:first-child > h2:last");
                while (curr.next().length > 0) {
                    if (curr.next().text().match("fainted!") &&
			!curr.next().text().match("The foe") ||
			curr.next().text().match("A critical hit!") &&
			!curr.next().text().match("The foe")) {
                        return true;
                    }
                    curr = curr.next();
                }
            }
            return false;
        }
    },
    {
	    "name": "notbrave",
	    "chance": 0.20,
	    "max": 1,
	    "used": 0,
	    "audio": new Audio("http://i1.theportalwiki.net/img/8/8b/GLaDOS_escape_01_part1_nag03-1.wav"),
	    "trigger": function () {
            if ($(".battle-log > div:first-child > h2:last").next().length > 0) {
                curr = $(".battle-log > div:first-child > h2:last");
		while (curr.next().length > 0) {
                    if (curr.next().text().match("fainted!") &&
                        !curr.next().text().match("The foe")) {
                        return true;
                    }
                    curr = curr.next();
                }
            }
            return false;
        }
    },
]

/* Fisher-Yates shuffle algorithm */
function shuffle(array) {
    var counter = array.length, temp, index;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

phrases = shuffle(_phrases);

function checkTriggers() {
    if (!checked_trigger) {
	checked_trigger = true;
    }
    else {
	return;
    }

    console.log("checking all triggers...");

    for (var i = 0; i < phrases.length; i++) {
	if (phrases[i].trigger()) {
	    if (getRandomInt(1,101) > phrases[i].chance * 100) {
		continue;
	    }
	    if (phrases[i].used >= phrases[i].max) {
		continue;
	    }

	    phrases[i].audio.play();
	    console.log("used phrase: " + phrases[i].name);
	    phrases[i].used++;
	    break;
	}
    }
}

