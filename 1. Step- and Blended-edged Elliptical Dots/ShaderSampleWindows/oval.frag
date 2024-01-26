#version 330 compatibility

// you can set these uniform variables  dynamically or hardwire them:
uniform float uKa, uKd, uKs;            // coefficients of each type of lighting
uniform float uShininess;               // specular exponent

// these have to be set dynamically from glman sliders or keytime animations:
uniform float uAd, uBd;
uniform float uTol;

const vec3 BgColor = vec3(0.2, 0.2, 0.2);
const vec3 DotColor = vec3(0.9,0.7,0.9);

// in variables from the vertex shader:
in vec2 vST;            // texture cords
in vec3 vN;             // normal vector
in vec3 vL;             // vector from point to light
in vec3 vE;             // vector from point to eye
in vec3 vMCposition;

void main() {
    vec3 Normal = normalize(vN);
    vec3 Light = normalize(vL);
    vec3 Eye = normalize(vE);

    vec3 myColor = vec3(1, 0, 0);           // Default color
    vec3 mySpecularColor = vec3(0, 0, 1);   // Specular color
    
    // Ellipse equation and color blending:
    float Ar = uAd / 2.;
    float Br = uBd / 2.;
    int numins = int(vST.s / uAd);
    int numint = int(vST.t / uBd);
    float sc = float(numins) * uAd + Ar;
    float tc = float(numint) * uBd + Br;
    float ellipse_equation = pow(((vST.s - sc) / Ar), 2) + pow(((vST.t - tc) / Br), 2);

    if(ellipse_equation < 1){
        float t = smoothstep( 1. - uTol, 1. + uTol, ellipse_equation );
        myColor = mix(DotColor, BgColor, t);
	    gl_FragColor = vec4(myColor, 1.);
    }else{
        gl_FragColor = vec4(1., 0., 0., 1.);
    }
    
    /*
    // The per-fragment lighting:
	vec3 ambient = uKa * myColor;
	float d = 0.;
	float s = 0.;
	if( dot(Normal, Light) > 0. )                            // only do specular if the light can see the point
	{
		d = dot(Normal, Light);
		vec3 ref = normalize(reflect(-Light, Normal));  // reflection vector
		s = pow(max(dot(Eye, ref),0. ), uShininess);
	}
	vec3 diffuse =  uKd * d * myColor;
	vec3 specular = uKs * s * mySpecularColor;
	gl_FragColor = vec4(ambient + diffuse + specular, 1.);
    */
}

