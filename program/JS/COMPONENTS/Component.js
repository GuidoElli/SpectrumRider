class Component {
    constructor(obj){
        this.obj = obj;

        this._position_x = 0.0;
        this._position_y = 0.0;
        this._position_z = 0.0;

        this._rotation_x = 0.0;
        this._rotation_y = 0.0;
        this._rotation_z = 0.0;

        this._scale_x = 1.0;
        this._scale_y = 1.0;
        this._scale_z = 1.0;
    }

    get position_x(){
        return this._position_x;
    }get position_y(){
        return this._position_y;
    }get position_z(){
        return this._position_z;
    }set position_x(p){
        this._position_x = p;
    }set position_y(p){
        this._position_y = p;
    }set position_z(p){
        this._position_z = p;
    }
    get rotation_x(){
        return this._rotation_x;
    }get rotation_y(){
        return this._rotation_y;
    }get rotation_z(){
        return this._rotation_z;
    }set rotation_x(r){
        this._rotation_x = r;
    }set rotation_y(r){
        this._rotation_y = r;
    }set rotation_z(r){
        this._rotation_z = r;
    }
    get scale_x(){
        return this._scale_x;
    }get scale_y(){
        return this._scale_y;
    }get scale_z(){
        return this._scale_z;
    }set scale_x(s){
        this._scale_x = s;
    }set scale_y(s){
        this._scale_y = s;
    }set scale_z(s){
        this._scale_z = s;
    }

    set scale(s){
        this._scale_x = s;
        this._scale_y = s;
        this._scale_z = s;
    }
    get scale(){
        return this.scale_x;
    }

    is_visible(){
        return true;
    }

    get_world_matrix = () => {
        return utils.MakeWorld(
           this.position_x, this.position_y, this.position_z,
           this.rotation_x, this.rotation_y, this.rotation_z,
           this.scale_x, this.scale_y, this.scale_z);
    }

    draw = (view, perspective) => {
        if(this.is_visible()){
            this.obj.draw(this.get_world_matrix(), view, perspective);
        }
    }

}
