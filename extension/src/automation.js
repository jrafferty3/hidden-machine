/* This file contains functions used to interface with the pokemon showdown website. */

var is_recording = false;
var is_human_learning = false;
var export_database = false;
var db;
var db2;

var interval_id = -1;
var ch_interval_id = -1;

var state_start = 0;
var state_logged_in = 1;
var state_not_logged_in = 2;
var state_in_game = 3;
var state_game_over = 4;
var state_change_name = 5;
var state_searching = 6;

var state = 0;

var roomlist_clicked = false;
var prev_move = "";
var prev_json = null;

function getPrevState(){
	return prev_json;
}

function getRandomInt(min, max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function run()
{
    if (!is_human_learning) {
	interval_id = setInterval( fsm_play, 3000 );
    }
    else {
	interval_id = setInterval( watch_games, 50 );
    }
    ch_interval_id = setInterval( checkTriggers, 100 );

    // Database stuff
    db = create_database();
    db2 = create_human_database();

    if( export_database )
    {
        var csvData = "";
        db.transaction(function(tx){
                tx.executeSql('SELECT * FROM tb_state', [], function (tx, results){
                    var len = results.rows.length, i;

                    for (i = 0; i < len; i++) {
                    item = results.rows.item(i);
                    csvData += item.my_pokemon + "|" + item.en_pokemon + "|" + item.my_type + "|" + item.en_type + "|" + item.my_status + "|" + item.en_status + "|" + item.my_hazards + "|" + item.en_hazards + "|" + item.weather + "|" + item.move + "|" + item.rating + "}";
                    }
                    window.location='data:text/csv;charset=utf8,' + encodeURIComponent(csvData);
                    });

                });
    }
}

function stop()
{
    clearInterval( interval_id );
    clearInterval( ch_interval_id );
}

function perform_next_action()
{
    // Database Recording
    if ( is_recording )
    {
        var rating = score();
		console.log("SCORE: "+rating);
        var json = prev_json;
        prev_json = get_game_info();

        if ( rating >= 35 && prev_move != null && prev_move !== undefined && prev_move != "" && json != null && json !== undefined )
        {
            insert_state( db, getName(json['my statbar']), getName(json['enemy statbar']), json['my type'], json['enemy type'], json['my status'], json['enemy status'], json['my hazards'].toString(), json['enemy hazards'].toString(), json['weather'], prev_move, rating );
        }
    }
    if (can_choose_move() || can_switch_pokemon())
    {
        console.log("Take this!");
		//var move_id = getNextMove();
		var move = pickMove();
		if(move.indexOf("$") != -1){
			move = move.substring(1);
			for(var i=1;i<7;i++){
				if(get_pokemon_by_index(i).indexOf(move) != -1){
					console.log("use switch: " + i);
                    prev_move = "$" + $($(".switchmenu > button")[i-1]).text();
					$($(".switchmenu > button")[i-1]).click();
				}
			}
		}else{
			for(var i=1;i<5;i++){
				if(get_move_by_index(i).indexOf(move) != -1){
					console.log("use move: " + i);
                    prev_move = $($(".movemenu > button")[i-1]).text();
					$($(".movemenu > button")[i-1]).click();
				}
			}
		}
		console.log("move: "+move);
        //var move_id = getRandomInt(0, $(".movemenu > button:not(:disabled)").length - 1);
        //prev_move = $($(".movemenu > button:not(:disabled)")[move_id]).text();
        //$($(".movemenu > button:not(:disabled)")[move_id]).click();
	checked_trigger = false;
    prev_json = get_game_info();
    }
    else
    {
        console.log("Nothing Happened!");
        prev_move = "";
    }

    //if (can_chat())
    //{ // not done
    //    console.log("Oppenent got a critical hit");

    //    $('.battle-log-add > .chatbox > .textbox:last-child').val(getRandomInt(1,10)).submit();
    //}

    if (!in_pokemon_battle())
    {
        state = state_game_over;
    }
}

function fsm_play()
{
    console.log( state );
    switch ( state )
    {
        case state_start :
            if ( click_button_home() )
            {
                if ( button_exists_by_id("login") )
                {
                    state = state_not_logged_in;
                }
                else
                {
                    state = state_logged_in;
                }
            }
            break;

        case state_logged_in :
            if ( button_exists_by_id("login") )
            {
                state = state_not_logged_in;
                break;
            }
            else if ( click_button_by_id("search") )
            {
                state = state_searching;
            }
            break;

        case state_not_logged_in :
            if ( !button_exists_by_id("login") )
            {
                state = state_logged_in;
            }

            if ( login() )
            {
                state = state_logged_in;
            }
            break;

        case state_in_game :
            perform_next_action();
            break;

        case state_game_over :
            console.log("Leaving Game!");
            if ( close_game_tabs() )
            {
                state = state_change_name;
            }
            break;

        case state_change_name :
            console.log("Changing Name!");
            change_name();
            state = state_not_logged_in;
            break;

        case state_searching :
            if( $( 'div.inner').children().length != 1 )
            {
                state = state_in_game;
            }
            break;

        // Unknown state, figure out which state we're in
        default :
            state = state_start;
            break;
    }
}

function fsm_watch()
{
    console.log( state );
    switch ( state )
    {
        case state_start :
            if ( click_button_home() )
            {
                if ( button_exists_by_id("login") )
                {
                    state = state_not_logged_in;
                }
                else
                {
                    state = state_logged_in;
                }
            }
            break;

        case state_logged_in :
            if ( button_exists_by_id("login") )
            {
                state = state_not_logged_in;
                break;
            }

            if ( join_game() )
            {
                state = state_in_game;
            }
            break;

        case state_not_logged_in :
            if ( button_exists_by_id("login") )
            {
                state = state_logged_in;
            }

            if ( login() )
            {
                state = state_logged_in;
            }
            break;

        case state_in_game :
            console.log("Hooray!");
            state = state_game_over;
            break;

        case state_game_over :
            console.log("Leaving Game!");
            if ( close_game_tabs() )
            {
                state = -1; // Go to unknown state, maybe home, maybe search, etc...
            }
            break;

            // Unknown state, figure out which state we're in
        default :
            state = state_start;
            break;
    }
}

/************ BUTTONS **********/

// Used to click a button based on its type/name. **NOTE** Clicks first button chose!
function click_button( type, name )
{
    button = $( "button[" + type + "=" + name + "]" );

    if ( button.length > 0 )
    {
        button[0].click();
        return true;
    }

    return false;
}

// NOTE: Not actually a button, this is <a>
function click_button_home()
{
    button = $( 'a.button[href="/"]' );

    if ( button.length > 0 )
    {
        button[0].click();
        return true;
    }

    return false;
}

// Clicks all <a> close buttons
function close_game_tabs()
{
    buttons = $( 'a.closebutton > .icon-remove-sign' );

    for ( i = 0; i < buttons.length; i++ )
    {
        buttons[i].click();
        if ( !click_button_by_id("submit") )
        {
            if ( !click_button_by_id("submit") )
            {
                if ( !click_button_by_id("submit") )
                {
                    return false;
                }
            }
        }
    }

    return true;
}

function button_exists( type, name )
{
    button = $( "button[" + type + "=" + name + "]" );

    if ( button.length > 0 )
    {
        return true;
    }

    return false;
}

function popup_exists_by_id(identifier) {
    switch (identifier) {
	case "login":
	return $(".ps-popup > form > .buttonbar > [type=submit] > strong").text() == "Choose name";
	default:
	console.log("Unknown popup identifier: " + identifier);
    }
}

function can_chat() {
    return $('.battle-log-add > .chatbox > .textbox:last-child').length > 0;
}

function can_choose_move() {
    return $(".movemenu > button:not(:disabled)").length > 0;    
}

function in_pokemon_battle() {
    //return $(".turn").length > 0;
    return ( $(".battle").length > 0 && !button_exists_by_id("replay"));
}

function can_switch_pokemon() {
    return $(".switchmenu > button:not(:disabled)").length > 0;
}

function button_exists_by_id(identifier) {
    switch (identifier) {
	case "home":
	return click_button_home();
	case "search":
	return button_exists( "name", "search" );
	case "login":
	return button_exists( "name", "login" );
	case "replay":
	return button_exists( "name", "instantReplay" );
	default:
	console.log("Unknown button identifier: " + identifier);
    }
}

function click_button_by_id(identifier) {
    switch (identifier) {
	case "search":
	return click_button( "name", "search" );
	case "close":
	return click_button( "name", "close" );
	case "submit":
	return click_button( "type", "submit" );	
	case "login":
	return click_button( "name", "login" );
    case "roomlist":
    return click_button( "name", "roomlist" );
	default:
	console.log("Unknown button identifier: " + identifier);
    }
}

/********** INPUTS *************/

// Used to place text into a specified input field based on name. **NOTE** Enters text into all selected!
function input_text( name, text )
{
    input = $( "input[name=" + name + "]" );

    if ( input.length > 0 )
    {
        input.val( text );
        return true;
    }

    return false;
}

function input_exists( name )
{
    input = $( "input[ name=" + name + "]" );

    if ( input.length > 0 )
    {
        return true;
    }

    return false;
}

function input_text_username(username)
{
    return input_text( "username", username );
}

function input_exists_username()
{
    return input_exists( "username" );
}


/************** TASKS *************/

function get_username()
{
    return "HMachine_" + getRandomInt(1000,9999);
}

function login()
{
    success = true;

    success = click_button_by_id("login");
    success = input_text_username(get_username());
    success = click_button_by_id("submit");

    return success;
}

function join_game()
{
    if ( !roomlist_clicked )
    {
        click_button_by_id( "roomlist" );
        roomlist_clicked = true;
    }
    else
    {
        $( "select[name = format]" ).val("randombattle").change();
    }
}

function change_name()
{
    $( 'button.icon[name=openOptions]' ).click();
    $( 'p.buttonbar > button[name=logout]' ).click();
}

function get_my_pokemon_statbar()
{
    return $( ".statbar.rstatbar > strong" ).text();
}

function get_enemy_pokemon_statbar()
{
    return $( ".statbar.lstatbar > strong" ).text();
}

function get_my_pokemon_hp()
{
    return $( ".statbar.rstatbar > div.hpbar > div.hptext" ).text();
}

function get_pokemon_by_index( index )
{
	var a = $( "div.switchmenu > button:nth-child(" + index + "):enabled" );
	if(a.length == 0){
		return "";
	}else{
		return $( "div.switchmenu > button:nth-child(" + index + ")" ).text();
	}
}

function get_move_by_index( index )
{
	var a = $( "div.movemenu > button:nth-child(" + index + "):enabled" );
	if(a.length == 0){
		return "";
	}else{
		return $( "div.movemenu > button:nth-child(" + index + ")" ).text();
	}
}

function get_enemy_pokemon_hp(){
	return $( ".statbar.lstatbar > div.hpbar > div.hptext" ).text();
}

function get_enemy_pokemon_status()
{
    var txt = "";

    var length = $( ".statbar.lstatbar > div.hpbar > div.status >" ).length;

    for ( i = 1; i < length+1; i++ )
    {
        txt += $( ".statbar.lstatbar > div.hpbar > div.status > span:nth-child(" + i + ")" ).text() + ",";
    }

    return txt;
}

function get_my_pokemon_status()
{
    var txt = "";

    var length = $( ".statbar.rstatbar > div.hpbar > div.status >" ).length;

    for ( i = 1; i < length+1; i++ )
    {
        txt += $( ".statbar.rstatbar > div.hpbar > div.status > span:nth-child(" + i + ")" ).text() + ",";
    }

    return txt;
}

function get_weather()
{
    if ( $( "div.weather > " ).length > 0 )
    {
        return $( "div.weather > em" ).text();
    }
    else
    {
        return null;
    }
}

function get_my_hazards(){
	var ret = [false,false,false];
	var body = $("body");
	var text = body.html();
	var poison = text.indexOf("poisoncaltrop.png");
	var normal = text.indexOf("caltrop.png");
	var rock = text.indexOf("rock1.png");
	var last_poison = text.lastIndexOf("poisoncaltrop.png");
	var last_normal = text.lastIndexOf("caltrop.png");
	var last_rock = text.lastIndexOf("rock1.png");
	if(poison != -1){
		var x = text.substring(poison);
		x = x.substring(x.indexOf("left")+6,x.indexOf("px"));
		if(parseInt(x)<300){
			ret[0] = true;
		}
	}
	if(normal != -1 && normal-poison > 10){
		var x = text.substring(normal);
		x = x.substring(x.indexOf("left")+6,x.indexOf("px"));
		if(parseInt(x)<300){
			ret[1] = true;
		}
	}
	if(rock != -1){
		var x = text.substring(rock);
		x = x.substring(x.indexOf("left")+6,x.indexOf("px"));
		if(parseInt(x)<300){
			ret[2] = true;
		}
	}
	if(last_poison != -1){
		var x = text.substring(last_poison);
		x = x.substring(x.indexOf("left")+6,x.indexOf("px"));
		if(parseInt(x)<300){
			ret[0] = true;
		}
	}
	if(last_normal != -1 && last_normal-last_poison > 10){
		var x = text.substring(last_normal);
		x = x.substring(x.indexOf("left")+6,x.indexOf("px"));
		if(parseInt(x)<300){
			ret[1] = true;
		}
	}
	if(last_rock != -1){
		var x = text.substring(last_rock);
		x = x.substring(x.indexOf("left")+6,x.indexOf("px"));
		if(parseInt(x)<300){
			ret[2] = true;
		}
	}
	return ret;
}

function get_enemy_hazards(){
	var ret = [false,false,false];
	var body = $("body");
	var text = body.html();
	var poison = text.indexOf("poisoncaltrop.png");
	var normal = text.indexOf("caltrop.png");
	var rock = text.indexOf("rock1.png");
	var last_poison = text.lastIndexOf("poisoncaltrop.png");
	var last_normal = text.lastIndexOf("caltrop.png");
	var last_rock = text.lastIndexOf("rock1.png");
	if(poison != -1){
		var x = text.substring(poison);
		x = x.substring(x.indexOf("left")+6,x.indexOf("px"));
		if(parseInt(x)>300){
			ret[0] = true;
		}
	}
	if(normal != -1 && normal-poison > 10){
		var x = text.substring(normal);
		x = x.substring(x.indexOf("left")+6,x.indexOf("px"));
		if(parseInt(x)>300){
			ret[1] = true;
		}
	}
	if(rock != -1){
		var x = text.substring(rock);
		x = x.substring(x.indexOf("left")+6,x.indexOf("px"));
		if(parseInt(x)>300){
			ret[2] = true;
		}
	}
	if(last_poison != -1){
		var x = text.substring(last_poison);
		x = x.substring(x.indexOf("left")+6,x.indexOf("px"));
		if(parseInt(x)>300){
			ret[0] = true;
		}
	}
	if(last_normal != -1 && last_normal-last_poison > 10){
		var x = text.substring(last_normal);
		x = x.substring(x.indexOf("left")+6,x.indexOf("px"));
		if(parseInt(x)>300){
			ret[1] = true;
		}
	}
	if(last_rock != -1){
		var x = text.substring(last_rock);
		x = x.substring(x.indexOf("left")+6,x.indexOf("px"));
		if(parseInt(x)>300){
			ret[2] = true;
		}
	}
	return ret;
}

function get_game_info()
{
    var json =  {
        "my statbar"       : get_my_pokemon_statbar(),
        "my status"        : get_my_pokemon_status(),
        "enemy statbar"    : get_enemy_pokemon_statbar(),
        "enemy status"     : get_enemy_pokemon_status(),
        "my type"          : get_type( get_my_pokemon_statbar() ),
        "enemy type"       : get_type( get_enemy_pokemon_statbar() ),
        "my pokemon hp"    : get_my_pokemon_hp(),
		"enemy pokemon hp" : get_enemy_pokemon_hp(),
		"my hazards"	   : get_my_hazards(),
		"enemy hazards"	   : get_enemy_hazards(),
        "my pokemon"       : {
                               "index 1" : get_pokemon_by_index(1),
                               "index 2" : get_pokemon_by_index(2),
                               "index 3" : get_pokemon_by_index(3),
                               "index 4" : get_pokemon_by_index(4),
                               "index 5" : get_pokemon_by_index(5),
                               "index 6" : get_pokemon_by_index(6)
                             },
        "my pokemon moves" : {
                               "index 1" : get_move_by_index(1),
                               "index 2" : get_move_by_index(2),
                               "index 3" : get_move_by_index(3),
                               "index 4" : get_move_by_index(4)
                             },
        "weather"          : get_weather()
    }

	return json;
}
