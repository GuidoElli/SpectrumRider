class Item_2x extends Item{
    constructor(position_x, position_y, position_z){
        super(position_x, position_y, position_z);
        this.does_multiply_points = true;
        this.multiply_factor = 2;
        this.expiration_time = 7e+3;
        this.scale = 0.004;
        this.max_dist_take = 0.25*audio_ground_scale_x;
    }

}
