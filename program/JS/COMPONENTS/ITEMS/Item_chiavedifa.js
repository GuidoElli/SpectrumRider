class Item_chiavedifa extends Item{
    constructor(obj, position_x, position_y, position_z){
        super(obj, position_x, position_y, position_z);
        this.expiration_time = 7e+3;
        this.scale = 1;
        this.max_dist_take = 1;
    }

    take = () => {
        super.take();
        app.item_score_manager.set_jump(true);
    }

    when_expired = () => {
        super.when_expired();
        app.item_score_manager.set_jump(false);
    }

}
