class Coin_lv1 extends Item{
    constructor(position_x, position_y, position_z){
        super(position_x, position_y, position_z);
        this.does_add_points = true;
        this.points = 20;
        this.scale = 0.1;
        this.max_dist_take = 0.25*audio_ground_scale_x;
    }
}
