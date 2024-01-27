#version 330 compatibility

// you can set these uniform variables  dynamically or hardwire them:
const float uKa = 0.2; // ambient coefficient
const float uKd = 0.7; // diffuse coefficient
const float uKs = 0.5; // specular coefficient
uniform float uShininess = 100.0; // specular exponent

// these have to be set dynamically from glman sliders or keytime animations:
uniform float uAd;
uniform float uBd;
uniform float uTol;
uniform float uNoiseAmp;
uniform float uNoiseFreq;
uniform bool uUseXYZforNoise;

// in variables from the vertex shader:
in vec2 vST; // texture cords
in vec3 vN; // normal vector
in vec3 vL; // vector from point to light
in vec3 vE; // vector from point to eye
in vec3 vMCposition;

const vec3 BgColor = vec3(0.2, 0.2, 0.2);
const vec3 DotColor = vec3(0.9, 0.7, 0.9);

uniform sampler3D Noise3;

void
main( )
{
	vec3 Normal = normalize(vN);
	vec3 Light = normalize(vL);
	vec3 Eye = normalize(vE);
	vec3 myColor = vec3(1.0, 0.5, 0.0);           // Default color
    vec3 mySpecularColor = vec3(1.0, 1.0, 1.0);   // Specular color

	//My code
	float Ar = uAd/2.;
	float Br = uBd/2.;
	int numins = int( vST.s / uAd );
	int numint = int( vST.t / uBd );

	vec4 nv;
	if(uUseXYZforNoise){
		nv = texture(Noise3, uNoiseFreq * vMCposition);
	}else{
		nv = texture(Noise3, uNoiseFreq * vec3(vST, 0.));
	}

	// give the noise a range of [-1.,+1.]:

	float n = nv.r + nv.g + nv.b + nv.a;    //  1. -> 3.
	n = n - 2.;                             // -1. -> 1.
	n *= uNoiseAmp;

	// determine the color based on the noise-modified (s,t):

	float sc = float(numins) * uAd  +  Ar;
	float ds = vST.s - sc;                   // wrt ellipse center
	float tc = float(numint) * uBd  +  Br;
	float dt = vST.t - tc;                   // wrt ellipse center

	float oldDist = sqrt(ds*ds + dt*dt);
	float newDist = oldDist + n;
	float scale = newDist / oldDist;        // this could be < 1., = 1., or > 1.

	ds *= scale; 		// scale by noise factor
	ds /= Ar; 			// ellipse equation
	dt *= scale; 		// scale by noise factor
	dt /= Br; 			// ellipse equation
	float ellipse_equation = ds*ds + dt*dt;

	float t = smoothstep(1. - uTol, 1. + uTol, ellipse_equation);
	myColor = mix(DotColor, BgColor, t);
	gl_FragColor = vec4(myColor, 1.);
	
	// here is the per-fragment lighting:
	vec3 ambient = uKa * myColor;
	float d = max( dot(Normal,Light), 0. );
	float s = 0.;
	if( dot(Normal,Light) > 0. ) // only do specular if the light can see the point
	{
		d = dot(Normal, Light);
		vec3 ref = normalize( reflect( -Light, Normal ) ); // reflection vector
		s = pow( max( dot(Eye,ref),0. ), uShininess );
	}
	vec3 diffuse =  uKd * d * myColor;
	vec3 specular = uKs * s * mySpecularColor;
	gl_FragColor = vec4( ambient + diffuse + specular, 1. );
}