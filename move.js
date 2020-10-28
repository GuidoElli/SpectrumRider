function move() {
    current_time = (new Date).getTime();
    audio_ground_delta_z += (current_time-last_move_time) * 0.001 * audio_ground_scale_z;
    
    audio_ground_world_matrix = utils.MakeWorld(
       audio_ground_delta_z, 0.0, 0.0,  
        0.0, 0.0, 0.0,   
        audio_ground_scale_x, audio_ground_scale_y, audio_ground_scale_z);
    
    last_move_time = current_time;
}
