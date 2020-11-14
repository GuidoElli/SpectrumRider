class Player extends Component{
    constructor(obj){
        super(obj);
        this.scale = 0.8;
    }
    get_world_matrix = () => {
        return utils.MakeWorld(
           this.position_x, this.position_y + 0.2, this.position_z,
           this.rotation_x, this.rotation_y, this.rotation_z,
           this.scale_x, this.scale_y, this.scale_z);
    }
}
