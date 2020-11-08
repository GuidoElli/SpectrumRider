class Item {
    constructor(position_x, position_y, position_z){
        this._position_x = position_x;
        this._position_y = position_y;
        this._position_z = position_z;

        this.random = Math.random();
        this.max_dist_take = 0.2*audio_ground_scale_x;
        this.scale = 0.1;

        this.does_add_points = false;
        this.points = 0;

        this.does_multiply_points = false;
        this.multiply_factor = 1;

        this.taken_at_time = null;
        this.expiration_time = 0;
    }

    get current_y_displacement(){
        return audio_ground_scale_y*0.2 * (1 +Math.sin(this.random*Math.PI*2 + current_z*0.7));
    }get current_y_rotation(){
        return (this.random*360 + current_z*15)%360;
    }
    get position_x(){
        return this._position_x*audio_ground_scale_x;
    }get position_y(){
        return this._position_y*audio_ground_scale_y + this.current_y_displacement;
    }get position_z(){
        return this._position_z*audio_ground_scale_z;
    }
    is_taken(){
        return this.taken_at_time != null;
    }

    is_near_player(){
        if(Math.abs(this.position_z - current_z) > audio_ground_scale_z){
            return false;
        }
        let dx = this.position_x - player_pos_x;
        let dy = this.position_y - player_pos_y;
        let dz = this.position_z - current_z*stretch_correction;
        let diff = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2) + Math.pow(dz, 2))
        return diff < this.max_dist_take;
    }

    is_visible(){
        return !this.is_taken() && current_z - this.position_z > -camera_z_offset && current_z - this.position_z < seconds_to_see * audio_ground_scale_z;
    }

    take(){
        this.taken_at_time = (new Date).getTime();
    }

    is_active(){
        if(this.taken_at_time){
            let current_time = (new Date).getTime();
            return current_time < this.taken_at_time+this.expiration_time;
        }
    }
}
