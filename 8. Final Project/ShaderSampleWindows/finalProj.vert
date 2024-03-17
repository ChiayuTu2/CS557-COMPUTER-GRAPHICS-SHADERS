#version 330 compatibility

out vec3  vMC;
out vec3  vNf;
out vec3  vLf;
out vec3  vEf;
out vec2  vST;

uniform sampler3D Noise3; 
uniform float uVertNoise;

uniform float Timer;

const vec3 eyeLightPosition = vec3( 0., 5., 10. );

void
main( )
{
	vST = gl_MultiTexCoord0.st;

	vMC = gl_Vertex.xyz;
	
	vec3 ECposition = ( gl_ModelViewMatrix * gl_Vertex ).xyz;

	float Time = Timer > 0.5 ? 1. - Timer : Timer;

	vec4 nv = texture3D(Noise3, vMC);
    float n = (nv.r + nv.g + nv.b + nv.a) - 2.;
	
	//vLightIntensity  = abs( dot( normalize(LIGHTPOS - ECposition), tnorm ) );
	vNf = normalize(gl_NormalMatrix * gl_Normal);
	vLf = eyeLightPosition - ECposition;
	vEf = vec3(0., 0., 0.) - ECposition;

	vec4 glVertex = vec4(vMC + (Time * vNf * sin(n * uVertNoise)), 1.);
	
	gl_Position = gl_ModelViewProjectionMatrix * glVertex;
}