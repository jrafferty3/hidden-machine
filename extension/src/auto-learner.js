/* minimax implementation searching through game choices */


var gameInfo;
var pokemon;
var lastState;
var poss_states;
var states_index;
var min_score = 35;


function getNextMove(){
	gameInfo = get_game_info();
	var enemy = gameInfo["enemy statbar"];
	var moves = new Array();
	var index = 0;
	for(var key in gameInfo["my pokemon moves"]){
		var move = gameInfo["my pokemon moves"][key];
		var end = move.substring(i).search(new RegExp('[0-9]'))-1;
		var split = move.split(new RegExp('[A-Z]'));
		var start = move.substring(i).search(split[split.length-1])-1;
		moves[index] = move.substring(start,end);
		index++;
	}
	if(enemy.indexOf("Mr. Mime") != -1){
		enemy = "MrMime";
	}else{
		enemy = enemy.replace("-","");
		enemy = enemy.replace("'","");
		enemy = enemy.substring(0,enemy.indexOf(" "));
	}
	pokemon = get_pokemon_info();
	var e_types = pokemon[enemy.toLowerCase()]["types"];
	
	var choose_from = [1.0,1.0,1.0,1.0]; //array of doubles, will be set to damage mult of move
	choose_from = chooseMove(e_types,moves,choose_from);
	var index = new Array();
	var index_i = 0;
	var max = 0.0;
	for(var i=0;i<choose_from.length;i++){
		if(choose_from[i] > max){
			max = choose_from[i];
		}
	}
	
	
	for(var i=0;i<choose_from.length;i++){
		if(choose_from[i] == max){
			index[index_i] = i;
			index_i++;
		}
	}
	for(var x=0;x<choose_from.length;x++)
		console.log(choose_from[x]);
	for(var x=0;x<index.length;x++)
	return index[getRandomInt(0,index.length)];

}

/* have some expert knowledge weighting to help speed up learning in favor of good moves */
function chooseMove(types, moves, choose_from){
	for(var i=0;i<types.length;i++){
		var type = types[i];
		if(type == "Normal"){
			for(var j=0;j<moves.length;j++){
				if(moves[j] == "Fighting"){
					choose_from[j] = 2;
				}else if(moves[j] == "Ghost"){
					choose_from[j] = 0;
				}
			}
		}else if(type == "Fire"){
			for(var j=0;j<moves.length;j++){
				if(moves[j] == "Fire" || moves[j] == "Grass" || moves[j] == "Ice" || moves[j] == "Bug" || moves[j] == "Steel"){
					if(0.5 < choose_from[j])
						choose_from[j] = 0.5;
				}else if(moves[j] == "Rock" || moves[j] == "Ground" || moves[j] == "Water"){
					choose_from[j] = 2.0;
				}
			}
		}else if(type == "Water"){
			for(var j=0;j<moves.length;j++){
				if(moves[j] == "Water" || moves[j] == "Fire" || moves[j] == "Ice" || moves[j] == "Steel"){
					if(0.5<choose_from[j])
						choose_from[j] = 0.5;
				}else if(moves[j] == "Electric" || moves[j] == "Grass"){
					choose_from[j] = 2;
				}
			}
		}else if(type == "Electric"){
			for(var j=0;j<moves.length;j++){
				if(moves[j] == "Electric" || moves[j] == "Flying" || moves[j] == "Steel"){
					if(0.5<choose_from[j])
						choose_from[j] = 0.5;
				}else if(moves[j] == "Ground"){
					choose_from[j] = 2;
				}
			}
		}else if(type == "Grass"){
			for(var j=0;j<moves.length;j++){
				if(moves[j] == "Water" || moves[j] == "Grass" || moves[j] == "Electric" || moves[j] == "Ground"){
					if(0.5<choose_from[j])
						choose_from[j] = 0.5;
				}else if(moves[j] == "Fire" || moves[j] == "Ice" || moves[j] == "Poison" || moves[j] == "Flying" || moves[j] == "Bug"){
					choose_from[j] = 2;
				}
			}
		}else if(type == "Ice"){
			for(var j=0;j<moves.length;j++){
				if(moves[j] == "Ice"){
					if(0.5<choose_from[j])
						choose_from[j] = 0.5;
				}else if(moves[j] == "Fire" || moves[j] == "Fighting" || moves[j] == "Rock" || moves[j] == "Steel"){
					choose_from[j] = 2;
				}
			}
		}else if(type == "Fighting"){
			for(var j=0;j<moves.length;j++){
				if(moves[j] == "Bug" || moves[j] == "Rock" || moves[j] == "Dark"){
					if(0.5<choose_from[j])
						choose_from[j] = 0.5;
				}else if(moves[j] == "Flying" || moves[j] == "Psychic"){
					choose_from[j] = 2;
				}
			}
		}else if(type == "Poison"){
			for(var j=0;j<moves.length;j++){
				if(moves[j] == "Poison" || moves[j] == "Grass" || moves[j] == "Fighting" || moves[j] == "Bug"){
					if(0.5<choose_from[j])
						choose_from[j] = 0.5;
				}else if(moves[j] == "Ground" || moves[j] == "Psychic"){
					choose_from[j] = 2;
				}
			}
		}else if(type == "Ground"){
			for(var j=0;j<moves.length;j++){
				if(moves[j] == "Poison" || moves[j] == "Rock"){
					if(0.5<choose_from[j])
						choose_from[j] = 0.5;
				}else if(moves[j] == "Electric"){
					choose_from[j] = 0;
				}else if(moves[j] == "Water" || moves[j] == "Grass" || moves[j] == "Ice"){
					choose_from[j] = 2;
				}
			}
		}else if(type == "Flying"){
			for(var j=0;j<moves.length;j++){
				if(moves[j] == "Grass" || moves[j] == "Fighting" || moves[j] == "Bug"){
					if(0.5<choose_from[j])
						choose_from[j] = 0.5;
				}else if(moves[j] == "Ground"){
					choose_from[j] = 0;
				}else if (moves[j] == "Electric" || moves[j] == "Ice" || moves[j] == "Rock"){
					choose_from[j] = 2;
				}
			}
		}else if(type == "Psychic"){
			for(var j=0;j<moves.length;j++){
				if(moves[j] == "Psychic" || moves[j] == "Fighting"){
					if(0.5<choose_from[j])
						choose_from[j] = 0.5;
				}else if(moves[j] == "Bug" || moves[j] == "Ghost" || moves[j] == "Dark"){
					choose_from[j] = 2;
				}
			}
		}else if(type == "Bug"){
			for(var j=0;j<moves.length;j++){
				if(moves[j] == "Grass" || moves[j] == "Fighting" || moves[j] == "Ground"){
					if(0.5<choose_from[j])
						choose_from[j] = 0.5;
				}else if(moves[j] == "Fire" || moves[j] == "Flying" || moves[j] == "Rock"){
					choose_from[j] = 2;
				}
			}
		}else if(type == "Rock"){
			for(var j=0;j<moves.length;j++){
				if(moves[j] == "Normal" || moves[j] == "Fire" || moves[j] == "Poison" || moves[j] == "Flying"){
					if(0.5<choose_from[j])
						choose_from[j] = 0.5;
				}else if(moves[j] == "Water" || moves[j] == "Grass" || moves[j] == "Fighting" || moves[j] == "Ground" || moves[j] == "Steel"){
					choose_from[j] = 2;
				}
			}
		}else if(type == "Ghost"){
			for(var j=0;j<moves.length;j++){
				if(moves[j] == "Poison" || moves[j] == "Bug"){
					if(0.5<choose_from[j])
						choose_from[j] = 0.5;
				}else if(moves[j] == "Normal" || moves[j] == "Fighting"){
					choose_from[j] = 0;
				}else if(moves[j] == "Dark" || moves[j] == "Ghost"){
					choose_from[j] = 2;
				}
			}
		}else if(type == "Dragon"){
			for(var j=0;j<moves.length;j++){
				if(moves[j] == "Fire"|| moves[j] == "Water" || moves[j] == "Electric" || moves[j] == "Grass"){
					if(0.5<choose_from[j])
						choose_from[j] = 0.5;
				}else if(moves[j] == "Dragon" || moves[j] == "Ice"){
					choose_from[j] = 2;
				}
			}
		}else if(type == "Dark"){
			for(var j=0;j<moves.length;j++){
				if(moves[j] == "Ghost" || moves[j] == "Dark"){
					if(0.5<choose_from[j])
						choose_from[j] = 0.5;
				}else if(moves[j] == "Psychic"){
					choose_from[j] = 0;
				}else if(moves[j] == "Fighting" || moves[j] == "Bug"){
					choose_from[j] = 2;
				}
			}
		}else if(type == "Steel"){
			for(var j=0;j<moves.length;j++){
				if(moves[j] == "Normal" || moves[j] == "Grass" || moves[j] == "Ice" || moves[j] == "Flying" || moves[j] == "Psychic" || moves[j] == "Bug" || moves[j] == "Rock" || moves[j] == "Ghost" || moves[j] == "Dragon" || moves[j] == "Dark" || moves[j] == "Steel"){
					if(0.5<choose_from[j])
						choose_from[j] = 0.5;
				}else if(moves[j] == "Poison"){
					choose_from[j] = 0;
				}else if(moves[j] == "Fire" || moves[j] == "Fighting" || moves[j] == "Ground"){
					choose_from[j] = 2;
				}
			}
		}
	}
	return choose_from;
}

function score(){
	var ret_val = -1;
	
	var currState = get_game_info();
	//our pokemon name
	var poke = currState["my statbar"];
	if(poke.indexOf("Mr. Mime") != -1){
		poke = "MrMime";
	}else{
		poke = poke.replace("-","");
		poke = poke.replace("'","");
		poke = poke.substring(0,poke.indexOf(" "));
	}
	if(poke == ""){
		lastState = getPrevState();
		return -1;
	}
	//our pokemon types
	pokemon = get_pokemon_info();

	var p_types = pokemon[poke.toLowerCase()]["types"];
	//our pokemon health%
	var health_temp = currState["my pokemon hp"];
	var health = parseInt(health_temp.substring(0,health_temp.indexOf("%")));
	//our pokemons good and bad stats
	var status = currState["my status"];
	var s = status.split(",");
	var pos_stats = getPos(s);
	var neg_stats = (s.length-1)-pos_stats;
	//our pokemon hazards
	var temp_hazards = currState["my hazards"];
	var hazards = 0;
	for(var i=0;i<temp_hazards.length;i++){
		if(temp_hazards[i])
			hazards++;
	}
	
	//enemy pokemon name
	var enemy = currState["enemy statbar"];
	if(enemy.indexOf("Mr. Mime") != -1){
		enemy = "MrMime";
	}else{
		enemy = enemy.replace("-","");
		enemy = enemy.replace("'","");
		enemy = enemy.substring(0,enemy.indexOf(" "));
	}
	if(enemy == ""){
		lastState = getPrevState();
		return -1;
	}
	//enemy pokemon types
	var e_types = pokemon[enemy.toLowerCase()]["types"];
	//enemy pokemon health%
	var e_health_temp = currState["enemy pokemon hp"];
	var e_health = parseInt(e_health_temp.substring(0,e_health_temp.indexOf("%")));
	//enemy pokemon good and bad stats
	var e_status = currState["enemy status"];
	var e_s = e_status.split(",");
	var e_pos_stats = getPos(e_s);
	var e_neg_stats = (e_s.length-1)-e_pos_stats;
	//their pokemon hazards
	var e_temp_hazards = currState["enemy hazards"];
	var e_hazards = 0;
	for(var i=0;i<e_temp_hazards.length;i++){
		if(e_temp_hazards[i])
			e_hazards++;
	}
	
	//last state
	if(lastState != null){
		//our pokemon name
		var l_poke = lastState["my statbar"];
		if(l_poke.indexOf("Mr. Mime") != -1){
			l_poke = "MrMime";
		}else{
			l_poke = l_poke.replace("-","");
			l_poke = l_poke.replace("'","");
			l_poke = l_poke.substring(0,l_poke.indexOf(" "));
		}
		//our pokemon types
		if(l_poke == ""){
			lastState = getPrevState();
			return -1;
		}
		var l_p_types = pokemon[l_poke.toLowerCase()]["types"];
		//our pokemon health%
		var l_health_temp = lastState["my pokemon hp"];
		var l_health = parseInt(l_health_temp.substring(0,l_health_temp.indexOf("%")));
		//our pokemons good and bad stats
		var l_status = lastState["my status"];
		var l_s = l_status.split(",");
		var l_pos_stats = getPos(l_s);
		var l_neg_stats = (l_s.length-1)-l_pos_stats;
		//our pokemon hazards
		var l_temp_hazards = lastState["my hazards"];
		var l_hazards = 0;
		for(var i=0;i<l_temp_hazards.length;i++){
			if(l_temp_hazards[i])
				l_hazards++;
		}
		
		//enemy pokemon name
		var l_enemy = lastState["enemy statbar"];
		if(l_enemy.indexOf("Mr. Mime") != -1){
			l_enemy = "MrMime";
		}else{
			l_enemy = l_enemy.replace("-","");
			l_enemy = l_enemy.replace("'","");
			l_enemy = l_enemy.substring(0,l_enemy.indexOf(" "));
		}
		//enemy pokemon types
		if(l_enemy == ""){
			lastState = getPrevState();
			return -1;
		}
		var l_e_types = pokemon[l_enemy.toLowerCase()]["types"];
		//enemy pokemon health%
		var l_e_health_temp = lastState["enemy pokemon hp"];
		var l_e_health = parseInt(l_e_health_temp.substring(0,l_e_health_temp.indexOf("%")));
		//enemy pokemon good and bad stats
		var l_e_status = lastState["enemy status"];
		var l_e_s = l_e_status.split(",");
		var l_e_pos_stats = getPos(l_e_s);
		var l_e_neg_stats = (l_e_s.length-1)-l_e_pos_stats;
		//their pokemon hazards
		var l_e_temp_hazards = lastState["enemy hazards"];
		var l_e_hazards = 0;
		for(var i=0;i<l_e_temp_hazards.length;i++){
			if(l_e_temp_hazards[i])
				l_e_hazards++;
		}
		
		//compare everything
		var health_diff = health-l_health;
		console.log("HP: "+health_diff);
		var hp;
		if(health_diff == 0){
			hp = 25;
		}else if(health_diff > 0){
			if(health_diff%10 >= 5){
				hp = 30;
			}else{
				hp = 25+health_diff%10;
			}
		}else{
			if(health == 0){
				hp = 0;
			}else if(health_diff>-10){
				hp = 20;
			}else if(health_diff>-20){
				hp = 15;
			}else if(health_diff>-30){
				hp = 10;
			}else if(health_diff>-40){
				hp = 5;
			}else{
				hp = 0;
			}
		}
		var e_health_diff = e_health-l_e_health;
		console.log("EHP: "+e_health_diff);
		var e_hp;
		if(e_health_diff == 0){
			e_hp = 5;
		}else if(e_health_diff > 0){
			if(e_health_diff%10 >= 5){
				e_hp = 0;
			}else{
				e_hp = 5-health_diff%10;
			}
		}else{
			if(e_health == 0){
				e_hp = 30;
			}else if(e_health_diff>-10){
				e_hp = 5;
			}else if(health_diff>-20){
				e_hp = 10;
			}else if(health_diff>-30){
				e_hp = 15;
			}else if(health_diff>-40){
				e_hp = 20;
			}else{
				e_hp = 30;
			}
		}
		var our_pos_stats = pos_stats;
		var o_p_stat = our_pos_stats;
		if(o_p_stat > 5)
			o_p_stat = 5;
		var our_neg_stats = neg_stats;
		var o_n_stat = 5-(our_neg_stats);
		if(o_n_stat<0)
			o_n_stat = 0;
		var their_pos_stats = e_pos_stats;
		var e_p_stat = 5-(their_pos_stats);
		if(e_p_stat<0)
			e_p_stat = 0;
		var their_neg_stats = e_neg_stats;
		var e_n_stat = their_neg_stats;
		if(e_n_stat > 5)
			e_n_stat = 5;
		var our_hazards = 5*hazards;
		var their_hazards = 5*e_hazards;
		ret_val = hp+e_hp+o_p_stat+o_n_stat+e_p_stat+e_n_stat+our_hazards+their_hazards;
	}
	
	lastState = getPrevState();
	return ret_val;
}

function getPos(s){
	var count = 0;
	for(var x=0;x<s.length;x++){
		if(s[x].indexOf("1.") != -1 || s[x].indexOf("2.") != -1 || s[x].indexOf("2x") != -1 || s[x].indexOf("3.") != -1 || s[x].indexOf("3x") != -1 || s[x].indexOf("4x") != -1)
			count++;
	}
	return count;
}


function getName(s){
	if(s.indexOf("Mr. Mime") != -1){
		s = "MrMime";
	}else{
		s = s.replace("-","");
		s = s.replace("'","");
		s = s.substring(0,s.indexOf(" "));
	}
	return s;
}

function get_type(s){
	var name = getName(s);
	pokemon = get_pokemon_info();
	if(name == "")
		return "";
	return pokemon[name.toLowerCase()]["types"];
}


function pickMove(){
	gameInfo = get_game_info();
	pokemon = get_pokemon_info();
	var my_poke = getName(gameInfo["my statbar"]);
	lastState = getPrevState();
	if(my_poke == ""){
        my_poke = getName(lastState['my statbar']);
	}
	var my_poke_types = pokemon[my_poke.toLowerCase()]["types"];
	var enemy_poke = getName(gameInfo["enemy statbar"]);
	if(enemy_poke == "")
		return "";
	var enemy_poke_types = pokemon[enemy_poke.toLowerCase()]["types"];
	var my_hazards = gameInfo["my hazards"].toString();
	var my_status = gameInfo["my status"];
	var enemy_hazards = gameInfo["enemy hazards"].toString();
	var enemy_status = gameInfo["enemy status"];
	var weather = gameInfo["weather"];
	var types = new Array();
	var types_index = 0;
	for(var key in gameInfo["my pokemon moves"]){
		var move = gameInfo["my pokemon moves"][key];
		var end = move.substring(i).search(new RegExp('[0-9]'))-1;
		var split = move.split(new RegExp('[A-Z]'));
		var start = move.substring(i).search(split[split.length-1])-1;
		move = move.substring(start,end);
		if(move != ""){
			types[types_index] = move;
			types_index++;
		}
	}
	var moves = new Array();
	var index = 0;
	for(var key in gameInfo["my pokemon moves"]){
		move = gameInfo["my pokemon moves"][key];
		end = move.substring(i).search(new RegExp('[0-9]'))-1;
		split = move.split(new RegExp('[A-Z]'));
		start = move.substring(i).search(split[split.length-1])-1;
		move = move.substring(0,start+1);
		if(move != ""){
			moves[index] = move;
			index++;
		}
	}
	var p_types = new Array();
	for(var key in gameInfo["my pokemon"]){
		var poke = gameInfo["my pokemon"][key];
		if(poke != "" && poke != my_poke){
			moves[index] = "$"+poke;
			poke = poke.replace("-","");
			poke = poke.replace("'","");
			p_types[index] = pokemon[poke.toLowerCase()]["types"];
			index++;
		}
	}
	//add by pokemon name
	var check_states;
	get_states(get_database(),"my_pokemon",my_poke, function (results){
		check_states = results;
	});//change to real call
	var state = new Array();
	var state_index = 0
	//sort by enemy name
	state = addByEnemyName(check_states,state,state_index,enemy_poke);
	state_index = state.length;
	//if none were added, sort by enemy types
	if(state.length == 0){
		state = addByEnemyType(check_states,state,state_index,enemy_poke_types);
		state_index = state.length;
	}
	//if none were in there
	if(state.length == 0){
		//add by pokemon types
		get_states(get_database(),"my_type",my_poke_types,function (results){
			check_states = results;
		});
		//sort by enemy name
		state = addByEnemyName(check_states,state,state_index,enemy_poke);
		state_index = state.length;
		//if none were added, sort by enemy types
		if(state.length == 0){
			state = addByEnemyType(check_states,state,state_index,enemy_poke_types);
			state_index = state.length;
		}
	}
	//if none were in there
	if(state.length == 0){
		//add by enemy name
		get_states(get_database(),"en_pokemon",my_poke, function (results){
			check_states = results;
		});
	}
	//if none were in there
	if(state.length == 0){
		//add by enemy types
		get_states(get_database(),"en_type",enemy_poke_types, function (results) {
			check_states = results;
		});
	}
	//if still none, choose random move
	if(state.length == 0){
		//choose random move and return
		return moves[getRandomInt(0,moves.length)];
	}else{
		poss_states = new Array();
		states_index = 0;
		var poss_moves = new Array();
		var moves_index = 0;
		//narrow by name of move
		poss_moves = addByMoveName(state,moves,poss_moves,moves_index);
		//return if only 1 move left
		if(poss_moves.length == 1)
			return poss_moves[0];
		//set moves to narrowed down list and reset possible moves
		if(poss_moves.length > 1){
			moves = poss_moves;
			poss_movs = new Array();
			moves_index = 0;
		}
		//narrow by type of move
		poss_moves = addByMoveType(state,moves,types,p_types,poss_moves,moves_index);
		if(poss_moves.length == 1)
			return poss_moves[0];
		if(poss_moves.length > 1){
			moves = poss_moves;
			poss_movs = new Array();
			moves_index = 0;
		}
		//after this we have no way of knowing if we even have a move that matches any
		//the only time to check here is if we have found moves we can use
		//we need to keep track of the states that we chose moves from and narrow based on those states
		//narrow by our hazards
		poss_moves = addByHazards(my_hazards,poss_moves);
		if(poss_moves.length == 1)
			return poss_moves[0];
		if(poss_moves.length > 1){
			moves = poss_moves;
			poss_movs = new Array();
			moves_index = 0;
		}
		//narrow by our status
		poss_moves = addByStatus(my_status,poss_moves);
		if(poss_moves.length == 1)
			return poss_moves[0];
		if(poss_moves.length > 1){
			moves = poss_moves;
			poss_movs = new Array();
			moves_index = 0;
		}
		//narrow by enemy hazards
		poss_moves = addByEnemyHazards(enemy_hazards,poss_moves);
		if(poss_moves.length == 1)
			return poss_moves[0];
		if(poss_moves.length > 1){
			moves = poss_moves;
			poss_movs = new Array();
			moves_index = 0;
		}
		//narrow by enemy status
		poss_moves = addByEnemyStatus(enemy_status,poss_moves);
		if(poss_moves.length == 1)
			return poss_moves[0];
		if(poss_moves.length > 1){
			moves = poss_moves;
			poss_movs = new Array();
			moves_index = 0;
		}
		//narrow by weather
		poss_moves = addByWeather(weather,poss_moves);
		if(poss_moves.length == 1)
			return poss_moves[0];
		//return random
		return moves[getRandomInt(0,moves.length)];
	}
}

function addByWeather(weather,poss_moves){
	var temp_s = new Array();
	var temp_s_i = 0;
	var temp_m = new Array();
	var temp_m_i = 0;
	for(var i = 0;i<poss_states.length;i++){
		if(poss_states[i]["weather"] == weather){
			temp_s[temp_s_i] = poss_states[i];
			temp_s_i++;
			temp_m[temp_m_i] = moves[i];
			temp_m_i++;
		}
	}
	if(temp_s.length > 0){
		poss_states = temp_s;
		return temp_m;
	}else{
		return poss_moves;
	}
}

function addByEnemyStatus(status,poss_moves){
	var temp_s = new Array();
	var temp_s_i = 0;
	var temp_m = new Array();
	var temp_m_i = 0;
	for(var i = 0;i<poss_states.length;i++){
		var stats = poss_states[i]["en_status"];
		var chck = true;
		if(stats.length != status.length){
			chck = false;
		}
		for(var s in stats){
			if(!status.contains(stats)){
				chck = false;
			}
		}
		if(chck){
			temp_s[temp_s_i] = poss_states[i];
			temp_s_i++;
			temp_m[temp_m_i] = moves[i];
			temp_m_i++;
		}
	}
	if(temp_s.length > 0){
		poss_states = temp_s;
		return temp_m;
	}else{
		return poss_moves;
	}
}

function addByEnemyHazards(hazards,poss_moves){
	var temp_s = new Array();
	var temp_s_i = 0;
	var temp_m = new Array();
	var temp_m_i = 0;
	for(var i = 0;i<poss_states.length;i++){
		if(poss_states[i]["en_hazards"] == hazards){
			temp_s[temp_s_i] = poss_states[i];
			temp_s_i++;
			temp_m[temp_m_i] = moves[i];
			temp_m_i++;
		}
	}
	if(temp_s.length > 0){
		poss_states = temp_s;
		return temp_m;
	}else{
		return poss_moves;
	}
}

function addByStatus(status,poss_moves){
	var temp_s = new Array();
	var temp_s_i = 0;
	var temp_m = new Array();
	var temp_m_i = 0;
	for(var i = 0;i<poss_states.length;i++){
		var stats = poss_states[i]["my_status"];
		var chck = true;
		if(stats.length != status.length){
			chck = false;
		}
		for(var s in stats){
			if(!status.contains(stats)){
				chck = false;
			}
		}
		if(chck){
			temp_s[temp_s_i] = poss_states[i];
			temp_s_i++;
			temp_m[temp_m_i] = moves[i];
			temp_m_i++;
		}
	}
	if(temp_s.length > 0){
		poss_states = temp_s;
		return temp_m;
	}else{
		return poss_moves;
	}
}

function addByHazards(hazards,poss_moves){
	var temp_s = new Array();
	var temp_s_i = 0;
	var temp_m = new Array();
	var temp_m_i = 0;
	for(var i = 0;i<poss_states.length;i++){
		if(poss_states[i]["my_hazards"] == hazards){
			temp_s[temp_s_i] = poss_states[i];
			temp_s_i++;
			temp_m[temp_m_i] = moves[i];
			temp_m_i++;
		}
	}
	if(temp_s.length > 0){
		poss_states = temp_s;
		return temp_m;
	}else{
		return poss_moves;
	}
}

function addByMoveType(state,moves,types,p_types,poss,index){
	for(var key in state){
		var m = key["move"];
		var t;
		var p = false;
		if(m.indexOf("$") != -1){
			p = true;
			m = m.substring(1);
			t = pokemon[m.toLowerCase()]["types"];
		}else{
			var end = move.substring(i).search(new RegExp('[0-9]'))-1;
			var split = move.split(new RegExp('[A-Z]'));
			var start = move.substring(i).search(split[split.length-1])-1;
			t = m.substring(start,end);
			m = m.substring(0,start);
		}
		if(p){
			for(var x=0;x<p_types.length;x++){
				if(p_types[x] == undefined){
					var chck = true;
					if(t.length != p_types[x].length)
						chck = false;
					for(var y in t){
						if(!p_types[x].contains(y))
							chck = false;
					}
					if(chck && !poss.contains(moves[x])){
						poss[index] = moves[x];
						index++;
						poss_states[states_index] = key;
						states_index++;
					}
				}
			}
		}else{
			for(var x=0;x<types.length;x++){
				if(types[x] == t && !poss.contains(moves[x])){
					poss[index] = moves[x];
					index++;
					poss_states[states_index] = key;
					states_index++;
				}
			}
		}
	}
	return poss;
}

function addByMoveName(state,moves,poss,index){
	for(var key in state){
		var m = key["move"];
		var end = move.substring(i).search(new RegExp('[0-9]'))-1;
		var split = move.split(new RegExp('[A-Z]'));
		var start = move.substring(i).search(split[split.length-1])-1;
		m = m.substring(start,end);
		if(moves.contains(m) && !poss.contains(m)){
			poss[index] = m;
			index++;
			poss_states[states_index] = key;
			states_index++;
		}
	}
	return poss;
}

function addByEnemyName(check,state,index,enemy_poke){
	for(var key in check){
		var enemy_name = key["en_pokemon"];
		if(enemy_name == enemy_poke){
			state[index] = check[key];
			index++;
		}
	}
	return state;
}

function addByEnemyType(check,state,index,types){
	for(var key in check){
		var enemy_name = key["en_pokemon"];
		var enemy_type = pokemon[enemy_name.toLowerCase()]["types"];
		var x = true;
		for(var i=0;i<types.length;i++){
			if(!enemy_type.contains(types[i]) && enemy_type.length == types.length){
				x = false;
			}
		}
		if(x){
			state[index] = check[key];
			index++;
		}
	}
	return state;
}






