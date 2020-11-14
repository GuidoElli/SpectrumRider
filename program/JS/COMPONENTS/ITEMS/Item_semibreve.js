class Item_semibreve extends Item{
    constructor(obj, position_x, position_y, position_z){
        super(obj, position_x, position_y, position_z);
        this.expiration_time = 7e+3;
        this.scale = 1;
        this.max_dist_take = 1;

        this.points = 16;
    }

    take = () => {
        super.take();
        app.item_score_manager.add_points(this.points);
    }

}
