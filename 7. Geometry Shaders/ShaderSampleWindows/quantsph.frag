#version 330 compatibility

// lighting uniform variables -- these can be set once and left alone:
uniform float uKa, uKd, uKs;		
uniform float uShininess;	
uniform bool  uUseChromaDepth;
uniform float uRedDepth;
uniform float uBlueDepth;

in vec3	gN;		 // normal vector
in vec3	gL;		 // vector from point to light
in vec3	gE;		 // vector from point to eye
in float  gZ;

vec3
Rainbow(float t)
{
     t = clamp(t, 0., 1.);        

     float r = 1.;
     float g = 0.0;
     float b = 1. - 6. * (t - (5. / 6.));

     if (t <= (5. / 6.))
     {
          r = 6. * (t - (4. / 6.));
          g = 0.;
          b = 1.;
     }

     if (t <= (4. / 6.))
     {
          r = 0.;
          g = 1. - 6. * (t - (3. / 6.));
          b = 1.;
     }

     if (t <= (3. / 6.))
     {
          r = 0.;
          g = 1.;
          b = 6. * (t - (2. / 6.));
     }

     if (t <= (2. / 6.))
     {
          r = 1. - 6. * (t - (1. / 6.));
          g = 1.;
          b = 0.;
     }

     if (t <= (1. / 6.))
     {
          r = 1.;
          g = 6. * t;
     }

     return vec3(r, g, b);
}

void
main()
{
	vec3 Normal = normalize(gN);
	vec3 Light = normalize(gL);
	vec3 Eye = normalize(gE);
	vec3 myColor = vec3(0.85, 0.85, 0.85);		
	vec3 mySpecularColor = vec3(1., 1., 1.);	

     if (uUseChromaDepth)
     {
          float t = (2./3.) * ( abs(gZ) - uRedDepth ) / ( uBlueDepth - uRedDepth );
          t = clamp(t, 0., 2. / 3.);
          myColor = Rainbow(t);
     }

	vec3 ambient = uKa * myColor;
	float d = 0.;
	float s = 0.;
	if (dot(Normal, Light) > 0.) 
	{
		d = dot(Normal, Light);
		vec3 ref = normalize(reflect(-Light, Normal)); // reflection vector
		s = pow(max(dot(Eye, ref), 0.), uShininess);
	}
	vec3 diffuse = uKd * d * myColor;
	vec3 specular = uKs * s * mySpecularColor;
	gl_FragColor = vec4(ambient + diffuse + specular, 1.);
}