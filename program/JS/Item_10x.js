class Item_10x extends Item{
    constructor(position_x, position_y, position_z){
        super(position_x, position_y, position_z);
        this.does_multiply_points = true;
        this.multiply_factor = 10;
        this.expiration_time = 20e+3;
        this.scale = 0.3;
        this.max_dist_take = 0.35*audio_ground_scale_x;
    }

}
