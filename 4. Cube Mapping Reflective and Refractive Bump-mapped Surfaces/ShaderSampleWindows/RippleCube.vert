#version 330 compatibility

uniform float uA, uB, uD;

out vec3	vNs;
out vec3	vEs;
out vec3	vMC;
out vec3    vNormal;
out vec3    vEyeDir;

// M_PI
const float M_PI = 3.14159265;
const float TWO_PI = 2. * M_PI;

void
main( )
{    
	vMC = gl_Vertex.xyz;
	vec4 newVertex = gl_Vertex;
	float x = gl_Vertex.x;
	float y = gl_Vertex.y;
	float r = sqrt(x * x + y * y);
	newVertex.z = ?????

	vec4 ECposition = gl_ModelViewMatrix * newVertex;

	float dzdr = 
	float drdx = x / r;
	float drdy = y / r;
	float dzdx = dzdr * drdx;
	float dzdy = dzdr * drdy;
	vec3 Tx = vec3(1., 0., dzdx);
	vec3 Ty = vex3(0., 1., dzdy);

	vec3 newNormal = ?????
	vNs = newNormal;
	vEs = ECposition.xyz - vec3( 0., 0., 0. ) ; 
	       		// vector from the eye position to the point

	gl_Position = gl_ModelViewProjectionMatrix * newVertex;
}