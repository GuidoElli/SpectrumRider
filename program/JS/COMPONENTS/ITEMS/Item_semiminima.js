class Item_semiminima extends Item{
    constructor(obj, position_x, position_y, position_z){
        super(obj, position_x, position_y, position_z);
        this.scale = 1.7;
        this.max_dist_take = 1.5;
        this.points = 4;
    }

    take = () => {
        super.take();
        app.item_score_manager.add_points(this.points);
    }
}
