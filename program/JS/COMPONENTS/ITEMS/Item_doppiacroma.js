class Item_doppiacroma extends Item{
    constructor(obj, position_x, position_y, position_z){
        super(obj, position_x, position_y, position_z);
        this.expiration_time = 15e+3;
        this.scale = 2;
        this.max_dist_take = 2;

        this.points_mult_factor = 2;
    }

    take = () => {
        super.take();
        app.item_score_manager.take_doppiacroma(this);
    }

    when_expired = () => {
        if(super.when_expired()){
            app.item_score_manager.expired_doppiacroma(this);
        }
    }
}
