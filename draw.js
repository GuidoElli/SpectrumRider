
function draw() {

    move();

    gl.clearColor(0.1, 0.1, 0.1, 0.2);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Audio Ground
    let viewMatrix = utils.MakeView(player_pos_x, player_pos_y, camera_z, camera_elev, camera_angle);

    //matrix
    let perspectiveMatrix = utils.MakePerspective(65, gl.canvas.width/gl.canvas.height, 0.1, seconds_to_see * audio_ground_scale_z);
    let audio_ground_world_matrix = utils.MakeWorld(
        0.0, 0.0, 0.0,
        0.0, 0.0, 0.0,
        audio_ground_scale_x, audio_ground_scale_y, audio_ground_scale_z);

    let lightDirMatrix = utils.invertMatrix(utils.transposeMatrix(viewMatrix));
    let worldViewMatrix = utils.multiplyMatrices(viewMatrix, audio_ground_world_matrix);
    let projectionMatrix = utils.multiplyMatrices(perspectiveMatrix, worldViewMatrix);
    let normalMatrix = utils.invertMatrix(utils.transposeMatrix(worldViewMatrix));

    gl.uniformMatrix4fv(matrixLocation, gl.FALSE, utils.transposeMatrix(projectionMatrix));
    gl.uniformMatrix4fv(normalMatrixPositionHandle, gl.FALSE, utils.transposeMatrix(normalMatrix));
    gl.uniformMatrix4fv(lightDirMatrixPositionHandle, gl.FALSE, utils.transposeMatrix(lightDirMatrix));
    gl.uniform3fv(lightColorHandle, directionalLightColor);
    gl.uniform3fv(lightDirectionHandle, directionalLight);

    for(let i = 0; i < audio_ground_vert.length; ++i){
        gl.bindVertexArray(audio_ground_vao[i]);
        gl.drawElements(gl.TRIANGLES, audio_ground_ind[i].length, gl.UNSIGNED_SHORT, 0 );

    }
    window.requestAnimationFrame(draw);
}
