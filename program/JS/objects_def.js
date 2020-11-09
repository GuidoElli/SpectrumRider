let k;


//coin

let thickness = 0.1;
let coin_vert = [];
let coin_norm = [];
let coin_ind = [];
k = 0;
//front face
for(let i = 0; i < 36; i++) {
    let x = Math.cos(i*10.0/180.0*Math.PI);
    let y = Math.sin(i*10.0/180.0*Math.PI);
    let z = thickness;
    coin_norm[k] = 0;
    coin_vert[k++] = x;
    coin_norm[k] = 0;
    coin_vert[k++] = y;
    coin_norm[k] = 1;
    coin_vert[k++] = z;
}
//back face
for(let i = 0; i < 36; i++) {
    let x = Math.cos(i*10.0/180.0*Math.PI);
    let y = Math.sin(i*10.0/180.0*Math.PI);
    let z = -thickness;
    coin_norm[k] = 0;
    coin_vert[k++] = x;
    coin_norm[k] = 0;
    coin_vert[k++] = y;
    coin_norm[k] = -1;
    coin_vert[k++] = z;
}
//border
for(let i = 0; i < 36; i++) {
    let x = Math.cos(i*10.0/180.0*Math.PI);
    let y = Math.sin(i*10.0/180.0*Math.PI);
    let z = -thickness;
    coin_norm[k] = x;
    coin_vert[k++] = x;
    coin_norm[k] = y;
    coin_vert[k++] = y;
    coin_norm[k] = 0;
    coin_vert[k++] = z;
}for(let i = 0; i < 36; i++) {
    let x = Math.cos(i*10.0/180.0*Math.PI);
    let y = Math.sin(i*10.0/180.0*Math.PI);
    let z = thickness;
    coin_norm[k] = x;
    coin_vert[k++] = x;
    coin_norm[k] = y;
    coin_vert[k++] = y;
    coin_norm[k] = 0;
    coin_vert[k++] = z;
}
//center front
coin_norm[k] = 0;
coin_vert[k++] = 0;
coin_norm[k] = 0;
coin_vert[k++] = 0;
coin_norm[k] = 1;
coin_vert[k++] = thickness;
//center back
coin_norm[k] = 0;
coin_vert[k++] = 0;
coin_norm[k] = 0;
coin_vert[k++] = 0;
coin_norm[k] = -1;
coin_vert[k++] = -thickness;
k = 0;
for(let i = 0; i < 36; i++) {
    //front face
    coin_ind[k++] = 36*4;
    coin_ind[k++] = i;
    coin_ind[k++] = (i+1)%36;
    //back face
    coin_ind[k++] = i+36;
    coin_ind[k++] = 36*4+1;
    coin_ind[k++] = (i+1)%36+36;
    //border
    coin_ind[k++] = i+36*3;
    coin_ind[k++] = i+36*2;
    coin_ind[k++] = (i+1)%36+36*2;
    coin_ind[k++] = i+36*3;
    coin_ind[k++] = (i+1)%36+36*2;
    coin_ind[k++] = (i+1)%36+36*3;
}









// Player

let player_vert = [0.0, 1.0, 0.0];
let player_norm = [0.0, 1.0, 0.0];
///// Creates vertices
k = 3;
for(let j = 1; j < 18; j++) {
    for(let i = 0; i < 36; i++) {
        let x = Math.sin(i*10.0/180.0*Math.PI) * Math.sin(j*10.0/180.0*Math.PI);
        let y = Math.cos(j*10.0/180.0*Math.PI);
        let z = Math.cos(i*10.0/180.0*Math.PI) * Math.sin(j*10.0/180.0*Math.PI);
        player_norm[k] = x;
        player_vert[k++] = x;
        player_norm[k] = y;
        player_vert[k++] = y;
        player_norm[k] = z;
        player_vert[k++] = z;
    }
}
let lastVert = k;
player_norm[k] = 0.0;
player_vert[k++] = 0.0;
player_norm[k] = -1.0;
player_vert[k++] = -1.0;
player_norm[k] = 0.0;
player_vert[k++] = 0.0;
////// Creates indices
let player_ind = [];
k = 0;
///////// Lateral part
for(let i = 0; i < 36; i++) {
    for(let j = 1; j < 17; j++) {
        player_ind[k++] = i + (j-1) * 36 + 1;
        player_ind[k++] = i + j * 36 + 1;
        player_ind[k++] = (i + 1) % 36 + (j-1) * 36 + 1;
        player_ind[k++] = (i + 1) % 36 + (j-1) * 36 + 1;
        player_ind[k++] = i + j * 36 + 1;
        player_ind[k++] = (i + 1) % 36 + j * 36 + 1;
    }
}
//////// Upper Cap
for(let i = 0; i < 36; i++) {
    player_ind[k++] = 0;
    player_ind[k++] = i + 1;
    player_ind[k++] = (i + 1) % 36 + 1;
}
//////// Lower Cap
for(let i = 0; i < 36; i++) {
    player_ind[k++] = lastVert;
    player_ind[k++] = (i + 1) % 36 + 541;
    player_ind[k++] = i + 541;
}
