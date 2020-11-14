class Item_chiavedisol extends Item{
    constructor(obj, position_x, position_y, position_z){
        super(obj, position_x, position_y, position_z);
        this.expiration_time = 7e+3;
        this.scale = 3;
        this.max_dist_take = 2.5;
    }

    take = () => {
        super.take();
        app.item_score_manager.set_fly(true);
    }

    when_expired = () => {
        super.when_expired();
        app.item_score_manager.set_fly(false);
    }

}
