class Item extends Component {
    constructor(obj, position_x, position_y, position_z){
        super(obj);

        this.position_x = position_x;
        this.position_y = position_y;
        this.position_z = position_z;

        this.random = Math.random();
        this.max_dist_take = 0.2;
        this.scale = 1;
        this.taken_at_time = undefined;
        this.expired = false;
        this.expiration_time = null;
    }

    get current_y_displacement(){
        return 0.2 * (1 +Math.sin(this.random*Math.PI*2 + app.current_z*0.7));
    }get current_y_rotation(){
        return 40 * Math.sin(this.random*2*Math.PI + app.current_z*0.5);
    }

    get position_y(){
        return this._position_y + this.current_y_displacement;
    }set position_y(p){
        this._position_y = p;
    }
    get rotation_y(){
        return this._rotation_y + this.current_y_rotation;
    }set rotation_y(p){
        this._rotation_y = p;
    }


    is_taken = () => {
        return this.taken_at_time !== undefined;
    }

    is_near_player = () => {
        if(Math.abs(this.position_z - app.current_z) > app.audio_ground.scale_z){
            return false;
        }
        let dx = this.position_x - app.player.position_x;
        let dy = this.position_y - app.player.position_y;
        let dz = this.position_z -app.current_z;
        let diff = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2) + Math.pow(dz, 2))
        return diff < this.max_dist_take;
    }

    is_visible = () => {
        return !this.is_taken() && app.current_z - this.position_z > -app.camera.offset_z && app.current_z - this.position_z < app.seconds_to_see * app.audio_ground.scale_z;
    }

    take(){
        this.taken_at_time = (new Date).getTime();
        if(this.expiration_time){
            setTimeout(this.when_expired, this.expiration_time);
        }else{
            this.expired = true;
        }
    }


    when_expired(){
        this.expired = true;
    }

    current_percentage = () => {
        if(this.is_taken() && !this.expired) {
            let current_time = (new Date).getTime();
            let percentage = (current_time - this.taken_at_time) / this.expiration_time;
            return (percentage > 1) ? null : (percentage+1e-16);
        }
        return null;
    }

}
