class Item_doppiacroma extends Item{
    constructor(obj, position_x, position_y, position_z){
        super(obj, position_x, position_y, position_z);
        this.expiration_time = 7e+3;
        this.scale = 1;
        this.max_dist_take = 1;

        this.points_mult_factor = 2;
    }

    take = () => {
        super.take();
        app.item_score_manager.mult_points(this.points_mult_factor);
    }

    when_expired = () => {
        super.when_expired();
        app.item_score_manager.mult_points(1 / this.points_mult_factor);
    }

}
