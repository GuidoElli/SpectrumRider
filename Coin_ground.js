class Coin_ground extends Item{
    constructor(position_x, position_y, position_z){
        super(position_x, position_y, position_z)
    }

    //overload
    get current_y_displacement(){
        return audio_ground_scale_y*0.1 * (1 + Math.sin(this.random*Math.PI*2 + current_z*0.6));
    }get current_y_rotation(){
        return (this.random*360 + current_song_percentage*30000)%360;
    }
}
