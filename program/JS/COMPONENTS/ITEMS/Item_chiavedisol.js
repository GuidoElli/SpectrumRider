class Item_chiavedisol extends Item{
    constructor(obj, position_x, position_y, position_z){
        super(obj, position_x, position_y, position_z);
        this.expiration_time = 15e+3;
        this.scale = 3.3;
        this.max_dist_take = 2.7;
    }

    take = () => {
        super.take();
        app.item_score_manager.take_chiavedisol(this);
    }

    when_expired = () => {
        if(super.when_expired()){
            app.item_score_manager.expired_chiavedisol(this);
        }
    }

}
