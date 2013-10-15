/* most of this can be done as automation.js */

function watch_games() {
    console.log("Mining player data...");

    if ($("div.roomlist").length == 0) {
	$("button[name=roomlist]").click();
    }
}

/* must be run on MAIN servers to be meaningful since
   we care about humans, so upstream changes may affect
   this more */

var moves = [];
   
var last_popup = "";
var m_interval = null;

function begin_replay() {
    if ($("button[name=instantReplay]").length == 0) {
	console.log("No replay found");
        return false;
    }

    $("button[name=instantReplay]").click();
    m_interval = setInterval(capture_popup, 100);
    return true;
}

/* escape regex characters */
function __rescape(r_string) {
    return r_string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

function capture_popup() {
    var popup = $("div.messagebar").text();

    if (!popup.match("^" + __rescape(last_popup))) {
        console.log("Caught popup: " + popup);
	moves.push(popup);
    }

    if (popup.match("won the battle!$")) {
        console.log("Game done!");
	//sync_moves(moves);
	clearInterval(m_interval);
    }

    last_popup = popup;
}

