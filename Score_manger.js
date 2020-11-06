class Score_manger{
    constructor(){
        this.multiply_factor = 1;
        this.tot_points = 0;

    }

    take_coin(o){
        o.take();
        this.tot_points += this.multiply_factor * o.points;
    }

    take_multiply(o){
        o.take();
        this.multiply_factor *= o.multiply_factor;
        setInterval(function (){
            this.multiply_factor /= o.multiply_factor;
        }, o.expiration_time);
    }

    update(){
        //ground coins
        for(let i = 0; i < coins_ground.length; i++){
            let coin = coins_ground[i];
            if(!coin.is_taken() && coin.is_near_player()){
                this.take_coin(coin);
            }
        }
        for(let i = 0; i < coins_lv1.length; i++){
            let coin = coins_lv1[i];
            if(!coin.is_taken() && coin.is_near_player()){
                this.take_coin(coin);
            }
        }
        for(let i = 0; i < coins_lv2.length; i++){
            let coin = coins_lv2[i];
            if(!coin.is_taken() && coin.is_near_player()){
                this.take_coin(coin);
            }
        }
        for(let i = 0; i < coins_lv3.length; i++){
            let coin = coins_lv3[i];
            if(!coin.is_taken() && coin.is_near_player()){
                this.take_coin(coin);
            }
        }
    }

}
