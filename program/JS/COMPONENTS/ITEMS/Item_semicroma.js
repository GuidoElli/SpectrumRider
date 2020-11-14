class Item_semicroma extends Item{
    constructor(obj, position_x, position_y, position_z){
        super(obj, position_x, position_y, position_z);
        this.scale = 0.7;
        this.max_dist_take = 1.3;

        this.points = 1;
    }

    get current_y_displacement(){
        return 0.6 + 0.1 * Math.sin(this.random*Math.PI*2 + app.current_z*0.7);
    }

    take = () => {
        super.take();
        app.item_score_manager.add_points(this.points);
    }
}
