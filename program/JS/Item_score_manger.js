class Item_score_manger{
    constructor(){
        this.tot_points = 0;

        this.active_items = [];

        this.points_mult_factor = 1;
        this.gravity_mult_factor = 1;

        this.jump = 0;
        this.fly = 0;
    }

    add_points = (n) => {
        this.tot_points += this.points_mult_factor * n;
    }

    mult_points = (n) => {
        this.points_mult_factor *= n;
    }

    mult_gravity = (n) => {
        this.gravity_mult_factor *= n;
    }

    set_jump = (n) => {
        if(n){this.jump++}else{this.jump--}
    }
    set_fly = (n) => {
        if(n){this.fly++}else{this.fly--}
    }

    update(){
        for(let i = 0; i < app.items_all.length; i++){
            let item = app.items_all[i];
            if(!item.is_taken() && item.is_near_player()){
                item.take();
            }
        }
    }
}
