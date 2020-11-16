class Item_diesis extends Item{
    constructor(obj, position_x, position_y, position_z){
        super(obj, position_x, position_y, position_z);
        this.expiration_time = 10e+3;
        this.scale = 1.5;
        this.max_dist_take = 1.5;

        this.gravity_mult_factor = 1 / 1.2;
    }

    take = () => {
        super.take();
        app.item_score_manager.take_diesis(this);
    }

    when_expired = () => {
        super.when_expired();
        app.item_score_manager.expired_diesis(this);
    }
}
