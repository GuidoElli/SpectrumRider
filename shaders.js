var audio_ground_vs = `#version 300 es

in vec3 inPosition;
in vec3 inNormal;
out vec3 fsNormal;
out vec3 position;

uniform mat4 matrix; 
uniform mat4 nMatrix;     //matrix to transform normals

void main() {
    fsNormal = mat3(nMatrix) * normalize(inNormal); 
    gl_Position = matrix * vec4(inPosition, 1.0);
    position = inPosition;
}`;

var audio_ground_fs = `#version 300 es

precision mediump float;

in vec3 position;
in vec3 fsNormal;
out vec4 outColor;

uniform vec3 lightDirection; 
uniform vec3 lightColor; 
uniform mat4 lightDirMatrix;       

void main() {
    vec3 nNormal = normalize(fsNormal);
    vec3 lDir = mat3(lightDirMatrix) * lightDirection; 
    vec3 color = vec3(position.y/2.0, position.y/2.0, position.y/2.0);
    vec3 lambertColor = color * lightColor * max(-dot(lDir,nNormal), 0.0);
    //outColor = vec4(clamp(lambertColor, 0.0, 1.0), 1.0);
    outColor = vec4(color, 1.0);
}`;
