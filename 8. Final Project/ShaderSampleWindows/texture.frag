uniform sampler2D TexUnit;

void main()
{
	vec3 newcolor = texture2D( TexUnit, gl_TexCoord[0].st ).rgb;
	gl_FragColor = vec4( newcolor.rgb, 1. );
}
