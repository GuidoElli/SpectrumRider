
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
        case "+":
        case "Add":
            if(synchronized && !e.repeat){
                if(e.ctrlKey && !e.shiftKey){
                    time_correction -= 20;
                }else if(e.shiftKey && !e.ctrlKey){
                    stretch_correction -= 0.0001
                }
            }
            break;
        case "-":
        case "Subtract":
            if(synchronized && !e.repeat){
                if(e.ctrlKey && !e.shiftKey){
                    time_correction += 20;
                }else if(e.shiftKey && !e.ctrlKey){
                    stretch_correction += 0.0001
                }
            }
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
