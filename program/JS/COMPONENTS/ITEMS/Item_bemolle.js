class Item_bemolle extends Item{
    constructor(obj, position_x, position_y, position_z){
        super(obj, position_x, position_y, position_z);
        this.expiration_time = 7e+3;
        this.scale = 1;
        this.max_dist_take = 1;

        this.gravity_mult_factor = 1.5;
    }

    take = () => {
        super.take();
        app.item_score_manager.mult_gravity(this.gravity_mult_factor);
    }

    when_expired = () => {
        super.when_expired();
        app.item_score_manager.mult_gravity(1 / this.gravity_mult_factor);
    }
}
