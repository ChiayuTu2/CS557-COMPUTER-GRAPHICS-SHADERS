#version 330 compatibility

uniform float uLightX, uLightY, uLightZ;
uniform float uK, uP;

out vec2 vST;
out vec3 vNf;
out vec3 vLf;
out vec3 vEf;
out vec3 vMC;

const float PI = 3.14159265359;

vec3 eyeLightPosition = vec3( uLightX, uLightY, uLightZ );

void
main()
{
	
	vST = gl_MultiTexCoord0.st;

	float x = gl_Vertex.x;
	float y = gl_Vertex.y;
	float z = uK * (1. - y) * sin(2 * PI * x / uP);
	
	vec4 p = vec4(x, y, z, 1.);
	vMC = p.xyz;
	
	float dzdx = uK * (1.-y) * (2.*PI/uP) * cos( 2.*PI*x/uP );
	float dzdy = -uK * sin( 2.*PI*x/uP );

	vec3 Tx = vec3(1., 0., dzdx );
	vec3 Ty = vec3(0., 1., dzdy );

	vec3 normal = normalize( cross( Tx, Ty ) );

	vec4 ECposition = gl_ModelViewMatrix * p;

	vNf = normalize(gl_NormalMatrix * normal);
	vLf = eyeLightPosition - ECposition.xyz;
	vEf = vec3(0., 0., 0.) - ECposition.xyz;
	
	gl_Position = gl_ModelViewProjectionMatrix * p;
}