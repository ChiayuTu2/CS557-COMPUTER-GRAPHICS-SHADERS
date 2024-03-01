#version 330 compatibility

uniform sampler2D TexUnit;

in vec2		vST;

void main( )
{
	vec3 newcolor = texture( TexUnit, vST ).rgb;
	gl_FragColor = vec4( newcolor, 1. );
}