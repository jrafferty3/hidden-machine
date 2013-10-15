
public class state {
	pokemon our_p,their_p;
	move our_m, their_m;
	
	public state(pokemon our_p,pokemon their_p, move our_m, move their_m){
		this.our_p = our_p;
		this.their_p = their_p;
		this.our_m = our_m;
		this.their_m = their_m;
	}
}
