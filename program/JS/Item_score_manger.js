class Item_score_manger{
    constructor(){
        this.tot_points = 0;

        this.n_bemolle = 0;
        this.n_diesis = 0;
        this.n_chiavedisol = 0;
        this.n_chiavedifa = 0;
        this.n_doppiacroma = 0;

        this.points_mult_factor = 1;
        this.gravity_mult_factor = 1;

        this.jump = 0;
        this.fly = 0;
    }

    take_diesis = (o) => {
        this.mult_gravity(o.gravity_mult_factor);
        this.n_diesis++;
    }
    expired_diesis = (o) => {
        this.mult_gravity(1 / o.gravity_mult_factor);
        this.n_diesis--;
    }
    take_bemolle = (o) => {
        this.mult_gravity(o.gravity_mult_factor);
        this.n_bemolle++;
    }
    expired_bemolle = (o) => {
        this.mult_gravity(1 / o.gravity_mult_factor);
        this.n_bemolle--;
    }

    take_chiavedisol = (o) => {
        this.fly++;
        this.n_chiavedisol++;
    }
    expired_chiavedisol = (o) => {
        this.fly--;
        this.n_chiavedisol--;
    }
    take_chiavedifa = (o) => {
        this.jump++;
        this.n_chiavedifa++;
    }
    expired_chiavedifa = (o) => {
        this.jump--;
        this.n_chiavedifa--;
    }

    take_doppiacroma = (o) => {
        if(this.points_mult_factor === 1){
            this.points_mult_factor = 2;
        }else{
            this.points_mult_factor += o.points_mult_factor;
        }
        this.n_doppiacroma++;
    }
    expired_doppiacroma = (o) => {
        if(this.points_mult_factor === 2){
            this.points_mult_factor = 1;
        }else{
            this.points_mult_factor -= o.points_mult_factor;
        }
        this.n_doppiacroma--;
    }

    add_points = (n) => {
        this.tot_points += this.points_mult_factor * n;
    }
    mult_gravity = (n) => {
        this.gravity_mult_factor *= n;
    }

    update(){
        for(let i = 0; i < app.items_all.length; i++){
            let item = app.items_all[i];
            if(!item.is_taken() && item.is_near_player()){
                item.take();
            }else if(item.has_just_expired()){
                item.when_expired();
            }
        }
    }
}
