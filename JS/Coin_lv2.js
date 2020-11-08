class Coin_lv2 extends Item{
    constructor(position_x, position_y, position_z){
        super(position_x, position_y, position_z);
        this.does_add_points = true;
        this.points = 50;
        this.scale = 0.4;
        this.max_dist_take = 0.3*audio_ground_scale_x;
    }

}
