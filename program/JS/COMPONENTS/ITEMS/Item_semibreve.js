class Item_semibreve extends Item{
    constructor(obj, position_x, position_y, position_z){
        super(obj, position_x, position_y, position_z);
        this.scale = 4;
        this.max_dist_take = 2.5;

        this.points = 16;
    }

    take = () => {
        super.take();
        app.item_score_manager.add_points(this.points);
    }

}
