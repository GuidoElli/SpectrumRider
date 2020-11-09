
// key controls
document.addEventListener("keydown" ,function(e) { // TODO
    switch (e.key) {
        case "ArrowUp": // up
            up_pressed = true;
            break;
        case "ArrowDown": // down
            down_pressed = true;
            break;
        case "ArrowRight": // right
            right_pressed = true;
            break;
        case "ArrowLeft": // left
            left_pressed = true;
            break;
        case "X":
        case "x":
            e.preventDefault();
            if(synchronized){
                if(e.ctrlKey){
                    time_correction += 10;
                }
            }
            break;
        case "Z":
        case "z":
            e.preventDefault();
            if(synchronized){
                if(synchronized){
                    if(e.ctrlKey){
                        time_correction -= 10;
                    }
                }
            }
            break;
        case "s":
        case "S":
            e.preventDefault();
            if(synchronized){
                if(e.ctrlKey){
                    stretch_correction += 0.00001;
                }
            }
            break;
        case "a":
        case "A":
            e.preventDefault();
            if(synchronized){
                if(synchronized){
                    if(e.ctrlKey){
                        stretch_correction -= 0.00001;
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
            if(in_game){
                if(playing){
                    pause_game();
                }else{
                    resume_game();
                }
            }
            e.preventDefault();
            break;
        default:
            break;
    }
})
document.addEventListener("keyup" ,function(e) { // TODO
    switch (e.key) {
        case "ArrowUp": // up
            up_pressed = false;
            break;
        case "ArrowDown": // down
            down_pressed = false;
            break;
        case "ArrowRight": // right
            right_pressed = false;
            break;
        case "ArrowLeft": // left
            left_pressed = false;
            break;
        default:
            break;
    }
})
