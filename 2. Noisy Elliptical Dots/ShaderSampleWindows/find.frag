#version 330 compatibility

in float vLightIntensity;
in vec2 vST;
in vec3 vMCposition;

uniform float uAd = 0.1;
uniform float uBd = 0.1;
uniform float uTol = 0.0;
uniform sampler3D Noise3;
uniform float uNoiseFreq, uNoiseAmp;
uniform float uAlpha;
uniform bool uUseXYZforNoise;

const vec3 BgColor = vec3(0.2, 0.2, 0.2);
const vec3 DotColor = vec3(0.9,0.7,0.9);

void
main() {
	vec4 c0 = vec4(vec3(0.9, 0.2, 0.2) * vLightIntensity, 1.);
	vec4 c1 = vec4(vec3(0.9) * vLightIntensity, uAlpha);


	float Ar = uAd/2.;
	float Br = uBd/2.;
	int numins = int( vST.s / uAd );
	int numint = int( vST.t / uBd );

	vec4 nv; 
	if(uUseXYZforNoise){
		nv = texture(Noise3, uNoiseFreq*vMCposition);
	}else{
		nv = texture(Noise3, uNoiseFreq*vec3(vST,0.));
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

	float oldDist = sqrt( ds*ds + dt*dt );
	float newDist = oldDist + n;
	float scale = newDist / oldDist;        // this could be < 1., = 1., or > 1.

	ds *= scale; 		// scale by noise factor
	ds /= Ar; 			// ellipse equation
	dt *= scale; 		// scale by noise factor
	dt /= Br; 			// ellipse equation
	float ellipse_equation = ds*ds + dt*dt;

	vec4 color = mix(c0, c1, smoothstep(1 - uTol, 1 + uTol, ellipse_equation));
	/*
	if(uAlpha == 0.){
		if(color == c1){
			discard;
		}
	}
	*/
	
	gl_FragColor = color;
}