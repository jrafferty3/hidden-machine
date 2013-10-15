import java.util.ArrayList;
import java.util.Random;


public class test {
	static pokemon bulbasaur = new pokemon("bulbasaur","grass",100);
	static pokemon squirtle = new pokemon("squirtle","water",100);
	static pokemon charmander = new pokemon("charmander","fire",100);
	static pokemon pikachu = new pokemon("pikachu","electric",100);
	
	//made up pokemon
	static pokemon grass = new pokemon("grass","grass",100);
	static pokemon water = new pokemon("water","water",100);
	static pokemon fire = new pokemon("fire","fire",100);
	static pokemon electric = new pokemon("electric","electric",100);
	static pokemon ground = new pokemon("ground","ground",100);
	
	static move vine_whip = new move("vine_whip","grass","attack");
	static move thunderbolt = new move("thunderbolt","electric","attack");
	static move ember = new move("ember","fire","attack");
	static move surf = new move("surf","water","attack");
	static move poison_powder = new move("poison_powder","grass","status");
	static move thunder = new move("thunder","electric","status");
	static move hyperbeam = new move("hyperbeam","normal","special");
	static move icebeam = new move("icebeam","water","special");
	static move tackle = new move("tackle","normal","attack");
	static move growl = new move("growl","normal","status");
	static move bite = new move("bite","normal","attack");
	static move swap_fire = new move("swap_fire","fire","swap");
	static move swap_electric = new move("swap_electric","electric","swap");
	static move swap_water = new move("swap_water","water","swap");
	static move swap_grass = new move("swap_grass","grass","swap");
	
	//made up moves
	static move drip = new move("drip","water","attack");
	static move burn = new move("burn","fire","attack");
	static move shock = new move("shock","electric","attack");
	static move leaf = new move("leaf","grass","attack");
	static move punch = new move("punch","normal","attack");
	static move poison = new move("poison","grass","status");
	static move stun = new move("stun","electric","status");
	static move kamehameha = new move("kamehameha","normal","special");
	static move rock = new move("rock","ground","attack");
	static move shell = new move("shell","ground","status");
	static move smash = new move("smash","ground","special");
	static move fall = new move("fall","ground","attack");
	
	static ArrayList<state> games = new ArrayList<state>();

	/**
	 * @param args
	 */
	public static void main(String[] args) {

		games.add(new state(pikachu,squirtle,thunderbolt,surf));
		games.add(new state(pikachu,bulbasaur,bite,vine_whip));
		games.add(new state(charmander,bulbasaur,ember,poison_powder));
		games.add(new state(charmander,squirtle,swap_electric,surf));
		games.add(new state(pikachu,charmander,tackle,ember));
		games.add(new state(bulbasaur,charmander,hyperbeam,bite));
		games.add(new state(bulbasaur,squirtle,vine_whip,surf));
		games.add(new state(pikachu,charmander,thunder,tackle));
		games.add(new state(bulbasaur,charmander,swap_water,ember));
		games.add(new state(squirtle,bulbasaur,icebeam,growl));
		
		
		pokemon active = pikachu;
		pokemon opponent = squirtle;
		
		move[] moves = {rock,smash,tackle,shell,swap_water,swap_fire,swap_grass};
		
		System.out.println(getMove(active,opponent,moves));
	}

	private static String getMove(pokemon active, pokemon opponent, move[] moves) {
		String ret = "nothing";
		ArrayList<state> poss0 = new ArrayList<state>();
		ArrayList<state> poss1 = new ArrayList<state>();
		ArrayList<state> poss2 = new ArrayList<state>();
		ArrayList<state> poss3 = new ArrayList<state>();
		

		ArrayList<move> moves0 = new ArrayList<move>();
		ArrayList<move> moves1 = new ArrayList<move>();
		ArrayList<move> moves2 = new ArrayList<move>();
		ArrayList<move> moves3 = new ArrayList<move>();
		
		//first get the states that match
		addByName(active,poss0,moves0);
		addByType(active,poss1,moves1);
		addByOppName(opponent,poss2,moves2);
		addByOppType(opponent,poss3,moves3);
		//then try to match the moves
		ArrayList<move> valid0 = new ArrayList<move>();
		ArrayList<move> valid1 = new ArrayList<move>();
		ArrayList<move> valid2 = new ArrayList<move>();
		ArrayList<move> valid3 = new ArrayList<move>();
		
		getMove(moves,valid0,poss0,opponent, moves0);
		getMove(moves,valid1,poss1,opponent, moves1);
		getMove(moves,valid2,poss2,opponent, moves2);
		getMove(moves,valid3,poss3,opponent, moves3);
		
		ArrayList<move> ret_moves = getMax(valid0,valid1,valid2,valid3);
		//compare more things to help narrow down even more
		if(ret_moves.size()>1){
			Random rand = new Random();
			ret = ret_moves.get(rand.nextInt(ret_moves.size())).name;
		}else{
			ret = ret_moves.get(0).name;
		}
		return ret;
	}

	private static ArrayList<move> getMax(ArrayList<move> valid0,
			ArrayList<move> valid1, ArrayList<move> valid2,
			ArrayList<move> valid3) {
		if(valid0.size()>0){
			return valid0;
		}else if(valid1.size()>0){
			return valid1;
		}else if(valid2.size()>0){
			return valid2;
		}else if(valid3.size()>0){
			return valid3;
		}
		int zero,one,two,three;
		zero = valid0.size();
		one = valid1.size();
		two = valid2.size();
		three = valid3.size();
		if(zero<one && zero<two && zero<three){
			return valid0;
		}else if(one<zero && one<two && one<three){
			return valid1;
		}else if(two<one && two<zero && two<three){
			return valid2;
		}else{
			return valid3;
		}
	}

	private static void getMove(move[] moves, ArrayList<move> valid, ArrayList<state> poss, pokemon opponent, ArrayList<move> our_m) {
		if(poss.size() >= 1){
			for(move x : moves)
				valid.add(x);
		}
		if(valid.size()>1){
			narrowByOppName(valid,opponent,poss);
		}
		if(valid.size()>1){
			narrowByOppType(valid,opponent,poss);
		}
		if(valid.size()>1){
			narrowBySet(valid,poss, our_m);
		}
	}

	private static void narrowByOppType(ArrayList<move> valid, pokemon opponent, ArrayList<state> poss) {
		ArrayList<move> newSet = new ArrayList<move>();
		for(move choose : valid){
			for(state game : poss){
				if(game.their_p.type == opponent.type && (choose.name == game.our_m.name || choose.type == game.our_m.type) && !newSet.contains(choose)){
					newSet.add(choose);
				}
			}
		}
		if(newSet.size() > 0){
			valid.clear();
			valid.addAll(newSet);
		}
	}

	private static void narrowByOppName(ArrayList<move> valid, pokemon opponent, ArrayList<state> poss) {
		ArrayList<move> newSet = new ArrayList<move>();
		for(move choose : valid){
			for(state game : poss){
				if(game.their_p.name == opponent.name && (choose.name == game.our_m.name || choose.type == game.our_m.type) && !newSet.contains(choose)){
					newSet.add(choose);
				}
			}
		}
		if(newSet.size() > 0){
			valid.clear();
			valid.addAll(newSet);
		}
	}

	private static void narrowBySet(ArrayList<move> valid, ArrayList<state> poss, ArrayList<move> our_m) {
		ArrayList<move> newSet = new ArrayList<move>();
		for(move choose : valid){
			for(move chosen : our_m){
				if(choose.set == chosen.set && !newSet.contains(choose)){
					newSet.add(choose);
				}
			}
		}
		if(newSet.size() > 0){
			valid.clear();
			valid.addAll(newSet);
		}
	}

	private static void addMoveByType(move[] moves, ArrayList<move> valid, ArrayList<state> poss) {
		for(state game : poss){
			for(move choose : moves){
				if(game.our_m.type == choose.type && !valid.contains(choose)){
					valid.add(choose);
				}
			}
		}
	}

	private static void addMoveByName(move[] moves, ArrayList<move> valid, ArrayList<state> poss) {
		for(state game : poss){
			for(move choose : moves){
				if(game.our_m.name == choose.name && !valid.contains(choose)){
					valid.add(choose);
				}
			}
		}
	}

	private static void addByOppType(pokemon opponent, ArrayList<state> poss, ArrayList<move> moves) {
		for(state game : games){
			if(game.their_p.type == opponent.type){
				poss.add(game);
				moves.add(game.our_m);
			}
		}
	}

	private static void addByOppName(pokemon opponent, ArrayList<state> poss, ArrayList<move> moves) {
		for(state game : games){
			if(game.their_p.name == opponent.name){
				poss.add(game);
				moves.add(game.our_m);
			}
		}
	}

	private static void addByType(pokemon active, ArrayList<state> poss, ArrayList<move> moves) {
		for(state game : games){
			if(game.our_p.type == active.type){
				poss.add(game);
				moves.add(game.our_m);
			}
		}
	}

	private static void addByName(pokemon active, ArrayList<state> poss, ArrayList<move> moves) {
		for(state game : games){
			if(game.our_p.name == active.name){
				poss.add(game);
				moves.add(game.our_m);
			}
		}		
	}

}
