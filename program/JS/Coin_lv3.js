class Coin_lv3 extends Item{
    constructor(position_x, position_y, position_z){
        super(position_x, position_y, position_z);
        this.does_add_points = true;
        this.points = 100;
        this.scale = 0.3;
        this.max_dist_take = 0.4*audio_ground_scale_x;
    }

}
