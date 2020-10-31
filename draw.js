
function draw() {

    move();

    current_song_percentage = elapsed_time / song_duration_seconds * .001;

    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // view/perspective
    let view_matrix = utils.MakeView(camera_x, camera_y, current_z + camera_z_offset, camera_elev, camera_angle);
    let perspective_matrix = utils.MakePerspective(60, gl.canvas.width/gl.canvas.height, 0.1, seconds_to_see * audio_ground_scale_z);
    let light_dir_matrix = utils.invertMatrix(utils.transposeMatrix(view_matrix));

    // Audio Ground
    gl.useProgram(audio_ground_program);
    let audio_ground_world_matrix = utils.MakeWorld(
       0.0, 0.0, 0.0,
       0.0, 0.0, 0.0,
       audio_ground_scale_x, audio_ground_scale_y, audio_ground_scale_z);
    let audio_ground_world_view_matrix = utils.multiplyMatrices(view_matrix, audio_ground_world_matrix);
    let audio_ground_projection_matrix = utils.multiplyMatrices(perspective_matrix, audio_ground_world_view_matrix);
    let audio_ground_normal_matrix = utils.invertMatrix(utils.transposeMatrix(audio_ground_world_view_matrix));

    gl.uniformMatrix4fv(audio_ground_matrix_uniform, gl.FALSE, utils.transposeMatrix(audio_ground_projection_matrix));
    gl.uniformMatrix4fv(audio_ground_normal_matrix_uniform, gl.FALSE, utils.transposeMatrix(audio_ground_normal_matrix));
    gl.uniformMatrix4fv(audio_ground_light_dir_matrix_uniform, gl.FALSE, utils.transposeMatrix(light_dir_matrix));
    gl.uniform3fv(audio_ground_light_color_uniform, directionalLightColor);
    gl.uniform3fv(audio_ground_light_direction_uniform, directionalLight);
    gl.uniform1f(audio_ground_tot_seconds_uniform, song_duration_seconds);
    gl.uniform1f(audio_ground_current_song_percentage_uniform, current_song_percentage);

    for(let i = 0; i < audio_ground_vert.length; ++i){
        gl.bindVertexArray(audio_ground_vao[i]);
        gl.bindBuffer(gl.ARRAY_BUFFER, audio_ground_position_buffer[i]);
        gl.drawElements(gl.TRIANGLES, audio_ground_ind[i].length, gl.UNSIGNED_SHORT, 0 );
    }


    // Player
    gl.useProgram(player_program);
    gl.bindBuffer(gl.ARRAY_BUFFER, player_position_buffer);
    let player_world_matrix = utils.MakeWorld(
       player_pos_x, player_pos_y, current_z,
       0.0, 0.0, 0.0,
       player_scale, player_scale, player_scale);
    let player_world_view_matrix = utils.multiplyMatrices(view_matrix, player_world_matrix);
    let player_projection_matrix = utils.multiplyMatrices(perspective_matrix, player_world_view_matrix);
    let player_normal_matrix = utils.invertMatrix(utils.transposeMatrix(player_world_view_matrix));
    gl.uniformMatrix4fv(player_matrix_uniform, gl.FALSE, utils.transposeMatrix(player_projection_matrix));
    gl.uniformMatrix4fv(player_normal_matrix_uniform, gl.FALSE, utils.transposeMatrix(player_normal_matrix));

    gl.bindVertexArray(player_vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, player_position_buffer);
    gl.drawElements(gl.TRIANGLES, player_ind.length, gl.UNSIGNED_SHORT, 0 );

    window.requestAnimationFrame(draw);
}
