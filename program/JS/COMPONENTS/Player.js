class Player extends Component{
    constructor(obj){
        super(obj);
        this.scale = 1.3;
    }
    get_world_matrix = () => {
        return utils.MakeWorld(
           this.position_x, this.position_y + 0.25, this.position_z-0.07,
           this.rotation_x, this.rotation_y, this.rotation_z,
           this.scale_x, this.scale_y, this.scale_z);
    }
}
