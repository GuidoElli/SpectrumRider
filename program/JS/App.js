class App {
    constructor() {

        // DOM Elements
        this.menu = document.getElementById("menu");
        this.game = document.getElementById("game");
        this.options = document.getElementById("options");
        this.game_over = document.getElementById("game_over");
        this.pause = document.getElementById("pause");
        this.loading = document.getElementById("loading");
        this.start_button = document.getElementById("start_button");
        this.options_button = document.getElementById("options_button");
        this.menu_button = document.getElementById("menu_button");
        this.play_again_button = document.getElementById("play_again_button");
        this.resume_button = document.getElementById("resume_button");
        this.pause_menu_button = document.getElementById("pause_menu_button");
        this.pause_restart_button = document.getElementById("pause_restart_button");
        this.options_back_button = document.getElementById("options_back_button");
        this.score = document.getElementById("score");
        this.song = document.getElementById("song");
        this.canvasText = document.getElementById("text2d");
        this.canvas3d = document.getElementById("webgl");

        //canvas
        this.gl = this.canvas3d.getContext("webgl2");
        this.ctx_2d = this.canvasText.getContext("2d");
        this.song.load();
        this.canvasText.width = screen.width;
        this.canvasText.height = screen.height;
        this.canvas3d.width = screen.width;
        this.canvas3d.height = screen.height;
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clearColor(0.0, 0.0, 0.0, 0.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);

        //obj
        this.obj_audio_ground = new Obj_audio_ground(this.gl);
        this.obj_player = new Obj_player(this.gl);
        this.obj_semicroma = new Obj_semicroma(this.gl);
        this.obj_semibreve = new Obj_semibreve(this.gl);
        this.obj_minima = new Obj_minima(this.gl);
        this.obj_semiminima= new Obj_semiminima(this.gl);
        this.obj_croma = new Obj_croma(this.gl);
        this.obj_doppiacroma = new Obj_doppiacroma(this.gl);
        this.obj_diesis = new Obj_diesis(this.gl);
        this.obj_bemolle = new Obj_bemolle(this.gl);
        this.obj_chiavedifa = new Obj_chiavedifa(this.gl);
        this.obj_chiavedisol = new Obj_chiavedisol(this.gl);


        this.audio_ground = new Audio_ground(this.obj_audio_ground);

        this.player = new Player(this.obj_player);
        this.player.max_vel_x = 1.2 * this.audio_ground.scale_x;
        this.player.max_pos_x = this.audio_ground.scale_x / 2 * 0.97;
        this.player.max_pos_y = this.audio_ground.scale_y * 15;
        this.player.max_vel_y_up = 15 * this.audio_ground.scale_y;
        this.player.force_x = 0.0;
        this.player.vel_x = 0.0;
        this.player.force_y = 0.0;
        this.player.vel_y = 0.0;
        this.player.position_x = 0.0;
        this.player.position_y = this.audio_ground.scale_y * 1.1;



        //Parameters
        this.max_delta_t_ms = 100;
        this.stretch_correction = 1;
        this.time_correction = 0;

        this.song_begun = false;
        this.song_start_time = undefined;
        this.synchronized = false;
        this.in_game = false;

        this.seconds_to_see = 10;
        this.current_z = undefined;
        this.current_song_percentage = undefined;
        this.current_time = undefined;
        this.elapsed_time = undefined;
        this.last_update_time = undefined;

        this.gravity = 12; // unitary mass (no acceleration parameters)
        this.x_force = 16 * this.audio_ground.scale_x;
        this.down_force = this.gravity * 6.0;
        this.max_vel_y_up_button = 1.4 * this.audio_ground.scale_y;
        this.up_force = this.gravity * 0.7;
        this.touching_ground = false;
        this.last_z_index = 0;
        this.last_x_index = 0;
        this.new_vert = false;
        this.last_max_diff = 0;

        this.camera = {
            "position_x": 0.0,
            "position_y": 0.0,
            "position_z": 0.0,
            "offset_z_min": 2.5,
            "offset_z": 2.5,
            "position_x_max": 0.7 * this.audio_ground.scale_x,
            "position_y_min": 1.9 * this.audio_ground.scale_y,
            "angle": 0,
            "elevation": -11,
            "fov": 80
        }

        this.current_bass_light = 0.0;
        this.current_mid_light = 0.0;
        this.current_high_light = 0.0;

        this.gl_clear_color = {
            r: 0.0,
            g: 0.0,
            b: 0.0
        }

        this.up_pressed = false;
        this.down_pressed = false;
        this.left_pressed = false;
        this.right_pressed = false;
        this.up_just_pressed = true;

        this.init();

        this.bind_listeners();
    }




    init = () => {

        this.items_all = [];

        this.items_semicroma = [];
        for(let i = 0; i < items_00.length; i++){
            this.items_semicroma[i] = new Item_semicroma(
               this.obj_semicroma,
               items_00[i][0]*this.audio_ground.scale_x,
               items_00[i][1]*this.audio_ground.scale_y,
               items_00[i][2]*this.audio_ground.scale_z);
        }
        this.items_all = this.items_all.concat(this.items_semicroma);

        this.items_croma = [];
        for(let i = 0; i < items_10.length; i++){
            this.items_croma[i] = new Item_croma(
               this.obj_croma,
               items_10[i][0]*this.audio_ground.scale_x,
               items_10[i][1]*this.audio_ground.scale_y,
               items_10[i][2]*this.audio_ground.scale_z);
        }
        this.items_all = this.items_all.concat(this.items_croma);

        this.items_semiminima = [];
        for(let i = 0; i < items_20.length; i++){
            this.items_semiminima[i] = new Item_semiminima(
               this.obj_semiminima,
               items_20[i][0]*this.audio_ground.scale_x,
               items_20[i][1]*this.audio_ground.scale_y,
               items_20[i][2]*this.audio_ground.scale_z);
        }
        this.items_all = this.items_all.concat(this.items_semiminima);

        this.items_minima = [];
        for(let i = 0; i < items_21.length; i++){
            this.items_minima[i] = new Item_minima(
               this.obj_minima,
               items_21[i][0]*this.audio_ground.scale_x,
               items_21[i][1]*this.audio_ground.scale_y,
               items_21[i][2]*this.audio_ground.scale_z);
        }
        this.items_all = this.items_all.concat(this.items_minima);

        this.items_doppiacroma = [];
        for(let i = 0; i < items_22.length; i++){
            this.items_doppiacroma[i] = new Item_doppiacroma(
               this.obj_doppiacroma,
               items_22[i][0]*this.audio_ground.scale_x,
               items_22[i][1]*this.audio_ground.scale_y,
               items_22[i][2]*this.audio_ground.scale_z);
        }
        this.items_all = this.items_all.concat(this.items_doppiacroma);

        this.items_diesis = [];
        for(let i = 0; i < items_12.length; i++){
            this.items_diesis[i] = new Item_diesis(
               this.obj_diesis,
               items_12[i][0]*this.audio_ground.scale_x,
               items_12[i][1]*this.audio_ground.scale_y,
               items_12[i][2]*this.audio_ground.scale_z);
        }
        this.items_all = this.items_all.concat(this.items_diesis);

        this.items_bemolle = [];
        for(let i = 0; i < items_11.length; i++){
            this.items_bemolle[i] = new Item_bemolle(
               this.obj_bemolle,
               items_11[i][0]*this.audio_ground.scale_x,
               items_11[i][1]*this.audio_ground.scale_y,
               items_11[i][2]*this.audio_ground.scale_z);
        }
        this.items_all = this.items_all.concat(this.items_bemolle);

        this.items_semibreve = [];
        for(let i = 0; i < items_30.length; i++){
            this.items_semibreve[i] = new Item_semibreve(
               this.obj_semibreve,
               items_30[i][0]*this.audio_ground.scale_x,
               items_30[i][1]*this.audio_ground.scale_y,
               items_30[i][2]*this.audio_ground.scale_z);
        }
        this.items_all = this.items_all.concat(this.items_semibreve);

        this.items_chiavedifa = [];
        for(let i = 0; i < items_31.length; i++){
            this.items_chiavedifa[i] = new Item_chiavedifa(
               this.obj_chiavedifa,
               items_31[i][0]*this.audio_ground.scale_x,
               items_31[i][1]*this.audio_ground.scale_y,
               items_31[i][2]*this.audio_ground.scale_z);
        }
        this.items_all = this.items_all.concat(this.items_chiavedifa);

        this.items_chiavedisol = [];
        for(let i = 0; i < items_32.length; i++){
            this.items_chiavedisol[i] = new Item_chiavedisol(
               this.obj_chiavedisol,
               items_32[i][0]*this.audio_ground.scale_x,
               items_32[i][1]*this.audio_ground.scale_y,
               items_32[i][2]*this.audio_ground.scale_z);
        }
        this.items_all = this.items_all.concat(this.items_chiavedisol);

        this.item_score_manager = new Item_score_manger();
    }


    bind_listeners = () => {
        this.song.ontimeupdate = this.on_song_time_update;

        window.addEventListener("load", () => {
            this.show_screen("menu");
        })

        this.resume_button.addEventListener("mouseup", () => {
            this.resume_game();
        })
        this.pause_menu_button.addEventListener("mouseup", () => {
            this.exit_game();
        })
        this.pause_restart_button.addEventListener("mouseup", () => {
            this.start_game();
        })
        this.options_back_button.addEventListener("mouseup", () => {
            this.show_screen("menu");
        })
        this.menu_button.addEventListener("mouseup", () => {
            this.show_screen("menu");
        })
        this.start_button.addEventListener("mouseup", () => {
            document.documentElement.requestFullscreen().then(() => {})
            this.start_game();
        })
        this.options_button.addEventListener("mouseup", () => {
            this.show_screen("options");
        })
        this.play_again_button.addEventListener("mouseup", () => {
            this.start_game();
        })


        // key controls
        document.addEventListener("keydown" ,(e) => {
            switch (e.key) {
                case "ArrowUp": // up
                    this.up_pressed = true;
                    break;
                case "ArrowDown": // down
                    this.down_pressed = true;
                    break;
                case "ArrowRight": // right
                    this.right_pressed = true;
                    break;
                case "ArrowLeft": // left
                    this.left_pressed = true;
                    break;
                case "X":
                case "x":
                    e.preventDefault();
                    if(this.synchronized){
                        if(e.ctrlKey){
                            this.time_correction += 10;
                        }
                    }
                    break;
                case "Z":
                case "z":
                    e.preventDefault();
                    if(this.synchronized){
                        if(e.ctrlKey){
                            this.time_correction -= 10;
                        }
                    }
                    break;
                case "s":
                case "S":
                    e.preventDefault();
                    if(this.synchronized){
                        if(e.ctrlKey){
                            this.stretch_correction += 0.00001;
                        }
                    }
                    break;
                case "a":
                case "A":
                    e.preventDefault();
                    if(this.synchronized){
                        if(this.synchronized){
                            if(e.ctrlKey){
                                this.stretch_correction -= 0.00001;
                            }
                        }
                    }
                    break;
                case "+":
                case "*":
                case "-":
                case "_":
                    e.preventDefault();
                    break;
                case " ":
                    if(this.in_game){
                        if(this.playing){
                            this.pause_game();
                        }else{
                            this.resume_game();
                        }
                    }
                    e.preventDefault();
                    break;
                default:
                    break;
            }
        })
        document.addEventListener("keyup" ,(e) => {
            switch (e.key) {
                case "ArrowUp": // up
                    this.up_pressed = false;
                    break;
                case "ArrowDown": // down
                    this.down_pressed = false;
                    break;
                case "ArrowRight": // right
                    this.right_pressed = false;
                    break;
                case "ArrowLeft": // left
                    this.left_pressed = false;
                    break;
                default:
                    break;
            }
        })
    }

    draw_scene = () => {
        if(this.synchronized) {
            this.update();

            this.current_song_percentage = this.elapsed_time / song_duration_seconds * .001 * this.stretch_correction;
            this.gl.clearColor(this.gl_clear_color.r, this.gl_clear_color.g, this.gl_clear_color.b, 1.0);
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

            // view/perspective
            let view_matrix = utils.MakeView(this.camera.position_x, this.camera.position_y, this.current_z + this.camera.offset_z, this.camera.elevation, this.camera.angle);
            let perspective_matrix = utils.MakePerspective(this.camera.fov, this.gl.canvas.width/this.gl.canvas.height, 0.1, this.seconds_to_see * this.audio_ground.scale_z);

            //draw 3d obj
            this.audio_ground.draw(view_matrix, perspective_matrix);
            this.player.draw(view_matrix, perspective_matrix);

            for(let i = 0; i < this.items_all.length; i++){
                this.items_all[i].draw(view_matrix, perspective_matrix);
            }


            //draw 2d elements
            this.ctx_2d.clearRect(0, 0, this.canvasText.width, this.canvasText.height);

            this.ctx_2d.font = '700 90px Arial';
            this.ctx_2d.fillStyle = '#eeeeee';
            this.ctx_2d.textAlign = "left";
            this.ctx_2d.fillText(this.item_score_manager.tot_points, 60, 120);

            if(this.item_score_manager.n_doppiacroma > 0){
                this.ctx_2d.font = '600 50px Arial';
                this.ctx_2d.fillStyle = '#bbbbbb';
                this.ctx_2d.textAlign = "left";
                this.ctx_2d.fillText( "x" + this.item_score_manager.points_mult_factor, 60, 190);
            }
            for(let i = 0; i < this.item_score_manager.n_diesis; i++){
                this.ctx_2d.font = '600 40px Arial';
                this.ctx_2d.fillStyle = '#bbbbbb';
                this.ctx_2d.textAlign = "left";
                this.ctx_2d.fillText( "# ", 60 + i*30, 310);
            }
            for(let i = 0; i < this.item_score_manager.n_bemolle; i++){
                this.ctx_2d.font = '600 40px Arial';
                this.ctx_2d.fillStyle = '#bbbbbb';
                this.ctx_2d.textAlign = "left";
                this.ctx_2d.fillText( "b ", 60 + i*30, 380);
            }
            if(this.item_score_manager.fly > 0){
                this.ctx_2d.font = '600 40px Arial';
                this.ctx_2d.fillStyle = '#bbbbbb';
                this.ctx_2d.textAlign = "left";
                this.ctx_2d.fillText( "[FLY]", 60, 450);
            }
            if(this.item_score_manager.jump > 0){
                this.ctx_2d.font = '600 40px Arial';
                this.ctx_2d.fillStyle = '#bbbbbb';
                this.ctx_2d.textAlign = "left";
                this.ctx_2d.fillText( "[JUMP]", 60, 520);
            }



            //title
            let title = document.getElementById("song_info_title").innerHTML;
            this.ctx_2d.font = '100 25px Arial';
            this.ctx_2d.fillStyle = 'rgba(150, 150, 150, 0.5)';
            this.ctx_2d.textAlign = "right";
            this.ctx_2d.fillText(title, this.ctx_2d.canvas.width - 60 - 5, 60);

            //evolution bar
            let ev_bar_width = this.ctx_2d.canvas.width/5;
            let ev_bar_height = 30;
            this.ctx_2d.fillStyle = 'rgba(100, 100, 100, 0.5)';
            this.ctx_2d.fillRect(this.ctx_2d.canvas.width - 60 - ev_bar_width, 80, ev_bar_width, ev_bar_height);
            this.ctx_2d.fillStyle = 'rgba(150, 150, 150, 0.5)';
            this.ctx_2d.fillRect(this.ctx_2d.canvas.width - 60 - ev_bar_width + 2, 80 + 2,  (ev_bar_width - 4) * this.current_song_percentage, ev_bar_height - 4);

            //timing
            let min_tot = Math.floor(song_duration_seconds / 60);
            let sec_tot = Math.floor(song_duration_seconds % 60);
            let min_curr = Math.floor(song_duration_seconds*this.current_song_percentage / 60);
            let sec_curr = Math.floor(song_duration_seconds*this.current_song_percentage % 60);
            let total_timing = "";
            let current_timing = "";
            total_timing += (min_tot < 10) ? ("0" + min_tot) : (min_tot);
            total_timing += ":";
            total_timing += (sec_tot < 10) ? ("0" + sec_tot) : (sec_tot);
            current_timing += (min_curr < 10) ? ("0" + min_curr) : (min_curr);
            current_timing += ":";
            current_timing += (sec_curr < 10) ? ("0" + sec_curr) : (sec_curr);
            this.ctx_2d.textAlign = "right";
            this.ctx_2d.fillText(total_timing, this.ctx_2d.canvas.width - 60 - 5, 140);
            this.ctx_2d.textAlign = "left";
            this.ctx_2d.fillText(current_timing, this.ctx_2d.canvas.width - 60 - ev_bar_width + 5, 140);

            //commands
            this.ctx_2d.fillStyle = 'rgba(150, 150, 150, 0.5)';
            this.ctx_2d.textAlign = "right";
            this.ctx_2d.font = '100 15px Arial';
            this.ctx_2d.fillText("Time-Shift: " + this.time_correction + "ms", this.ctx_2d.canvas.width - 60 - 5, 240);
            this.ctx_2d.fillText("Time-Stretch: " + (this.stretch_correction * 100).toFixed(3) + "%", this.ctx_2d.canvas.width - 60 - 5, 300);
            this.ctx_2d.font = '500 12px Arial';
            this.ctx_2d.fillText("CTRL + [A]/[S]", this.ctx_2d.canvas.width - 60 - 5, 260);
            this.ctx_2d.fillText("CTRL + [Z]/[X]", this.ctx_2d.canvas.width - 60 - 5, 320);


        }

        this.last_update_time = this.current_time;
        window.requestAnimationFrame(this.draw_scene);
    }

    update = () => {
        this.current_time = (new Date).getTime();
        this.elapsed_time = this.current_time-this.song_start_time+this.time_correction;
        let delta_t;
        if (this.last_update_time){
            if(this.player.vel_y < 0){
                delta_t = Math.min(this.max_delta_t_ms, this.current_time - this.last_update_time);
            }else{
                delta_t = Math.min(this.max_delta_t_ms*3, this.current_time - this.last_update_time);
            }
        }else{
            delta_t = 0;
        }
        this.current_z = -(this.current_time-this.song_start_time+this.time_correction) * .001 * this.audio_ground.scale_z * this.stretch_correction;

        //player
        //compute force
        if(this.left_pressed && !this.right_pressed) {
            this.player.force_x = -this.x_force;
        }else if(!this.left_pressed && this.right_pressed) {
            this.player.force_x = this.x_force;
        }else{
            this.player.force_x = 0.0;
            this.player.vel_x *= 0.8;
        }
        // x
        this.player.vel_x += this.player.force_x * delta_t / 1000;
        if(this.player.vel_x > this.player.max_vel_x){
            this.player.vel_x = this.player.max_vel_x;
        }else if(this.player.vel_x < -this.player.max_vel_x){
            this.player.vel_x = -this.player.max_vel_x;
        }
        this.player.position_x += this.player.vel_x * delta_t / 1000;
        if(this.player.position_x > this.player.max_pos_x){
            this.player.position_x = this.player.max_pos_x;
            this.player.vel_x = 0.0;
        }else if(this.player.position_x < -this.player.max_pos_x){
            this.player.position_x = -this.player.max_pos_x;
            this.player.vel_x = 0.0;
        }
        this.player.position_z = this.current_z;

        let x_index_cont = (this.player.position_x / this.audio_ground.scale_x + 0.5) * (n_vertex_per_row-1);
        let x_index = Math.round(x_index_cont);

        let z_index_cont = -this.current_z / this.audio_ground.scale_z / song_duration_seconds * (n_rows-1);
        let z_index = Math.round(z_index_cont);

        if (z_index >= n_rows){
            this.end_game();
            return;
        }else if(z_index < 0){
            return;
        }

        let y_curr = y_map[z_index][x_index] * this.audio_ground.scale_y;
        let y_prev = [];
        let y_next = [];
        let range = 5;
        //compute path
        for(let i = 1; i <= range; i++){
            if(this.left_pressed && !this.right_pressed && this.player.position_x > -this.player.max_pos_x + 0.01) {
                y_prev.push(y_map[Math.max(z_index-i, 0)][Math.min(x_index+i, n_vertex_per_row-1)] * this.audio_ground.scale_y);
                y_next.push(y_map[Math.min(z_index+i, n_rows-1)][Math.max(x_index-i, 0)] * this.audio_ground.scale_y);
            }else if(!this.left_pressed && this.right_pressed && this.player.position_x < this.player.max_pos_x - 0.01) {
                y_prev.push(y_map[Math.max(z_index-i, 0)][Math.max(x_index-i, 0)] * this.audio_ground.scale_y);
                y_next.push(y_map[Math.min(z_index+i, n_rows-1)][Math.min(x_index+i, n_vertex_per_row-1)] * this.audio_ground.scale_y);
            }else{
                y_prev.push(y_map[Math.max(z_index-i, 0)][x_index] * this.audio_ground.scale_y);
                y_next.push(y_map[Math.min(z_index+i, n_rows-1)][x_index] * this.audio_ground.scale_y);
            }
        }
        //compute max difference
        let new_max_diff = -Infinity;
        for(let i = -range+1; i < range-1; i++){
            let curr;
            let next;
            if(i < -1){
                curr = y_prev[-i];
                next = y_prev[-i-1];
            }else if(i === -1){
                curr = y_prev[-i-1];
                next = y_curr;
            }else if(i === 0){
                curr = y_curr;
                next = y_next[i];
            }else{
                curr = y_next[i-1];
                next = y_next[i];
            }
            if(next - curr > new_max_diff){
                new_max_diff = next - curr;
            }
        }

        let alpha = z_index_cont - z_index;
        let y_cont;
        if(alpha > 0){
            y_cont = alpha * y_next[0] + (1 - alpha) * y_curr;
        }else{
            y_cont = -alpha * y_prev[0] + (1 + alpha) * y_curr;
        }

        if(z_index !== this.last_z_index || x_index !== this.last_x_index){
            this.last_z_index = z_index;
            this.last_x_index = x_index;
            this.new_vert = true;
        }else{
            this.new_vert = false;
        }

        if(this.touching_ground && this.up_pressed && !this.down_pressed && (this.item_score_manager.jump > 0 && this.up_just_pressed  ||  this.item_score_manager.fly > 0)){
            this.player.position_y = y_cont;
            this.player.vel_y = 0.5;
            this.touching_ground = false;
        }

        if(this.touching_ground){//on ground
            if(this.down_pressed && !this.up_pressed){
                this.player.position_y = y_cont;
            }else if(this.new_vert){
                if(this.last_max_diff > y_next[0] - y_curr && // not on ground anymore
                   y_next[0] - y_curr < y_curr - y_prev[0]){
                    this.touching_ground = false;
                    this.player.vel_y = this.last_max_diff * vertex_sample_rate;
                    if(this.player.vel_y > this.player.max_vel_y_up){
                        this.player.vel_y = this.player.max_vel_y_up;
                    }
                    this.player.position_y += this.player.vel_y * delta_t / 1000;
                }else{
                    this.player.position_y = y_cont;
                }
            }else{
                this.player.position_y = y_cont;
            }
        }else{ // not on ground
            if(this.player.position_y < y_cont - 1e-3){ //now on ground
                this.touching_ground = true;
                this.player.position_y = y_cont;
            }else{ //still in the air
                if(this.up_pressed && !this.down_pressed){
                    if(this.item_score_manager.jump > 0 && this.up_just_pressed && this.player.vel_y < 5){// jump amount
                        this.player.vel_y = 5; // jump amount
                    }
                    let v = -this.max_vel_y_up_button;
                    if(this.item_score_manager.fly > 0){
                        v = -v*4; // fly amount
                    }
                    if(this.player.vel_y < v){
                        this.player.force_y = this.up_force *
                           (v - this.player.vel_y);
                    }else{
                        this.player.force_y = -this.gravity * this.item_score_manager.gravity_mult_factor;
                    }
                    this.up_just_pressed = false;
                }else if(this.down_pressed && !this.up_pressed){
                    this.player.force_y = -this.down_force;
                    this.up_just_pressed = true;
                }else{
                    this.player.force_y = -this.gravity * this.item_score_manager.gravity_mult_factor;
                    this.up_just_pressed = true;
                }
                this.player.vel_y += this.player.force_y * delta_t / 1000;
                this.player.position_y += this.player.vel_y * delta_t / 1000;
                if(this.player.position_y > this.player.max_pos_y){
                    this.player.position_y = this.player.max_pos_y;
                    this.player.vel_y = 0;
                }
            }
        }
        this.last_max_diff = new_max_diff;


        //lights
        this.current_bass_light = pattern_bass[z_index];
        this.current_mid_light = pattern_mid[z_index];
        this.current_high_light = pattern_high[z_index];


        //camera
        let camera_x_old = this.camera.position_x;
        let camera_x_target = this.player.position_x*0.6;
        this.camera.position_x += (camera_x_target - camera_x_old) * 0.15;

        let camera_y_old = this.camera.position_y;
        let camera_y_target = this.camera.position_y_min *
           (this.player.position_y/this.camera.position_y_min +
              1 / (this.player.position_y/this.camera.position_y_min + 1));
        this.camera.position_y += (camera_y_target - camera_y_old) * 0.35;

        this.camera.offset_z = this.camera.offset_z_min +
           (this.camera.position_y - this.camera.position_y_min) * 0.8;


        //colors
        let white_coeff = 0.05;
        this.gl_clear_color.r = white_coeff + (0.6 - white_coeff) *
           Math.pow(Math.min(pattern_bass[z_index+2], pattern_bass.length-1), 1.7);
        this.gl_clear_color.g = this.gl_clear_color.r
        this.gl_clear_color.b = this.gl_clear_color.r


        this.item_score_manager.update();


    }

    on_song_time_update = () => {
        let current = (new Date).getTime();
        if(this.song_begun && !this.synchronized && this.playing){
            this.song_start_time = current - this.song.currentTime * 1000;
            this.synchronized = true;
            this.show_screen("game");
            this.in_game = true;
            this.draw_scene();
        }
    }

    start_game = () => {
        this.init();
        this.show_screen("loading");
        this.playing = true;
        this.song.currentTime = 0;
        this.song.play().then(() =>  {
            this.song_begun = true;
        });
    }
    end_game = () => {
        this.score.innerHTML = this.item_score_manager.tot_points;
        this.show_screen("game_over");
        this.playing = false;
        this.song.pause();
        this.in_game = false;
        this.synchronized = false;
    }
    exit_game = () => {
        this.show_screen("menu");
        this.playing = false;
        this.song.pause();
        this.in_game = false;
        this.synchronized = false;
    }
    pause_game = () => {
        this.show_screen("pause");
        this.playing = false;
        this.synchronized = false;
        this.song.pause();
    }
    resume_game = () => {
        this.show_screen("loading");
        this.playing = true;
        this.song.play();
    }
    show_screen = (s) => {
        this.menu.style.display = "none";
        this.game.style.display = "none";
        this.options.style.display = "none";
        this.game_over.style.display = "none";
        this.pause.style.display = "none";
        this.loading.style.display = "none";

        this.playing = false;

        switch (s){
            case "menu":
                this.menu.style.display = "block";
                break;
            case "game":
                this.game.style.display = "block";
                this.playing = true;
                break;
            case "options":
                this.options.style.display = "block";
                break;
            case "game_over":
                this.game_over.style.display = "block";
                break;
            case "pause":
                this.pause.style.display = "block";
                break;
            case "loading":
                this.loading.style.display = "block";
                break;
        }
    }

}

window.onerror = function myErrorHandler(errorMsg) {
    alert("Error: " + errorMsg);
}
let app = new App();
