
function move() {
    if(song_begun){
        current_time = (new Date).getTime();
        audio_ground_delta_z = (current_time-start_time) * .001 * audio_ground_scale_z;
    }
}
