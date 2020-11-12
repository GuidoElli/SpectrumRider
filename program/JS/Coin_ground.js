class Coin_ground extends Item{
    constructor(position_x, position_y, position_z){
        super(position_x, position_y, position_z);
        this.does_add_points = true;
        this.points = 1;
        this.max_dist_take = 0.2*audio_ground_scale_x;
    }

    //overload
    get current_y_displacement(){
        return audio_ground_scale_y*0.15 * (1 + Math.sin(this.random*Math.PI*2 + current_z*0.6));
    }


}
