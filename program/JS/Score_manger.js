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
        this.multiply_factor += o.multiply_factor;
        setInterval(() => {
            this.multiply_factor -= o.multiply_factor;
        }, o.expiration_time);
    }

    update(){
        //multiply
        let mult = 1;
        for(let i = 0; i < items_xx_all.length; i++){
            let item = items_xx_all[i];
            if(!item.is_taken() && item.is_near_player()){
                this.take_multiply(item);
            }
            if(item.is_active()){
                mult += item.multiply_factor;
            }
        }
        this.multiply_factor = mult;
        //coins
        for(let i = 0; i < coins_all.length; i++){
            let coin = coins_all[i];
            if(!coin.is_taken() && coin.is_near_player()){
                this.take_coin(coin);
            }
        }
    }
}
