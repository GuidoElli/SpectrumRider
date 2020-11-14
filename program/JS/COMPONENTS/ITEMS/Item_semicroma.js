class Item_semicroma extends Item{
    constructor(obj, position_x, position_y, position_z){
        super(obj, position_x, position_y, position_z);
        this.scale = 0.7;
        this.max_dist_take = 1;

        this.points = 1;
    }
    get position_y(){
        return this._position_y + this.current_y_displacement + 0.2;
    }set position_y(p){
        this._position_y = p;
    }
    take = () => {
        super.take();
        app.item_score_manager.add_points(this.points);
    }
}
