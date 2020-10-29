var is_first_move = true;
function move() {
    if(is_first_move){
        start_time = (new Date).getTime();
        song.play();
        is_first_move = false;
    }
    current_time = (new Date).getTime();
    audio_ground_delta_z += (current_time-last_move_time) * 0.001 * audio_ground_scale_z;

    
    last_move_time = current_time;
}
