#version 330 compatibility

uniform float uA, uB, uD;

out vec3	vNs;
out vec3	vEs;
out vec3	vMC;


void
main( )
{    
	vMC = gl_Vertex.xyz;
	vec4 newVertex = gl_Vertex;
	float r = ?????
	newVertex.z = ?????

	vec4 ECposition = gl_ModelViewMatrix * newVertex;

	float dzdr = ?????
	float drdx = ?????
	float drdy = ?????
	float dzdx = ?????
	float dzdy = ?????
	vec3 xtangent = ?????
	vec3 ytangent = ?????

	vec3 newNormal = ?????
	vNs = newNormal;
	vEs = ECposition.xyz - vec3( 0., 0., 0. ) ; 
	       		// vector from the eye position to the point

	gl_Position = gl_ModelViewProjectionMatrix * newVertex;
}