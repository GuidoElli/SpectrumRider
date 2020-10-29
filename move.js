let current_time = 0;
function move() {
    if(song_begun){
        current_time = (new Date).getTime();
        camera_z = -(current_time-song_start_time) * .001 * audio_ground_scale_z;
    }
}
