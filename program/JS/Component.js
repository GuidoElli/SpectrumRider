class Component {
    constructor(obj){
        this.obj = obj;

        this._position_x = 0.0;
        this._position_y = 0.0;
        this._position_z = 0.0;

        this.rotation_x = 0.0;
        this.rotation_y = 0.0;
        this.rotation_z = 0.0;

        this.scale_x = 1.0;
        this.scale_y = 1.0;
        this.scale_z = 1.0;
    }

    get position_x(){
        return this._position_x;
    }get position_y(){
        return this._position_y;
    }get position_z(){
        return this._position_z;
    }

    set position_x(p){
        this._position_x = p;
    }set position_y(p){
        this._position_y = p;
    }set position_z(p){
        this._position_z = p;
    }

    is_visible(){
        return true;
    }

    get world_matrix() {
        return utils.MakeWorld(
           this.position_x, this.position_y, this.position_z,
           this.rotation_x, this.rotation_y, this.rotation_z,
           this.scale_x, this.scale_y, this.scale_z);
    }

    draw = (view, perspective) => {
        if(this.is_visible()){
            this.obj.draw(this.world_matrix, view, perspective);
        }
    }

}
