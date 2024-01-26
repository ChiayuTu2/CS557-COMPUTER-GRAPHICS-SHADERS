#include "keytime.h" 
Keytimes::Keytimes( )
{
	Init( );
}

Keytimes::~Keytimes( )
{
	for( std::vector<struct TimeValue *>::iterator tvi = tvs.begin( );  tvi < tvs.end( ); tvi++ )
	{
		delete (*tvi);
	}
}

void
Keytimes::AddTimeValue( float _time, float _value )
{
	// if _time matches a previous time, just replace the value:

	for( std::vector<struct TimeValue *>::iterator tvi = tvs.begin( );  tvi < tvs.end( ); tvi++ )
	{
		if( _time == (*tvi)->time )
		{
			(*tvi)->value = _value;
			return;
		}
	}

	// create the new struct to hold the time-value pair:

	struct TimeValue * tv = new struct TimeValue;
	tv->time  = _time;
	tv->value = _value;

	// if the list is empty, just do a push_back():

	if( tvs.empty( ) )
	{
		tvs.push_back( tv );
		return;
	}

	// otherwise, insert the new time-value pair right before the next biggest time:

	for( std::vector<struct TimeValue *>::iterator tvi = tvs.begin( );  tvi < tvs.end( ); tvi++ )
	{
		if( _time < (*tvi)->time )
		{
			tvs.insert( tvi, tv );
			return;
		}
	}

	// if it's not < any times in the vector, put it at the back:

	tvs.push_back( tv );
}

float
Keytimes::GetFirstTime( )
{
	 return tvs.front( )->time;
}

float
Keytimes::GetLastTime( )
{
	 return tvs.back( )->time;
}

int
Keytimes::GetNumKeytimes( )
{
	return tvs.size( );
}

float
Keytimes::GetValue( float _time )
{
	// if empty, return zero:

	if( tvs.empty( ) )
		return 0.;

	// if _time is outside the existing range, clamp to the existing range:

	if( _time <= tvs.front( )->time )
		return tvs.front( )->value;

	if( _time >= tvs.back( )->time )
		return tvs.back( )->value;

	// find which pair of key-times we are between:
	// (this is guaranteed to succeed)

	int i0, i1;
	float t0, t1;
	float v0, v1;
	for( int i = 0; i < (int) tvs.size()-1; i++ )
	{
		if( tvs[i]->time <= _time  &&  _time <= tvs[i+1]->time )
		{
			i0 = i+0;
			i1 = i+1;
			t0 = tvs[i+0]->time;
			t1 = tvs[i+1]->time;
			v0 = tvs[i+0]->value;
			v1 = tvs[i+1]->value;
			break;
		}
	}

	// fprintf( stderr, "_time = %8.3f: i0 = %3d, i1 = %3d, t0 = %8.2f, t1 = %8.3f\n", _time, i0, i1, t0, t1 );

	// get beginning and ending slopes:

	float dvaluedtime0;
	float dvaluedtime1;

	if( i0 == 0 )
		dvaluedtime0 = 0.;
	else
		dvaluedtime0 = ( v1 - tvs[i0-1]->value ) / ( t1 - tvs[i0-1]->time );

	if( i1 == (int)tvs.size( ) - 1 )
		dvaluedtime1 = 0.;
	else
		dvaluedtime1 = ( tvs[i1+1]->value - v0 ) / ( tvs[i1+1]->time - t0 );

	float dtimedt     = ( t1 - t0 ) / ( 1.f - 0.f );
	float dvaluedt0 = dvaluedtime0 * dtimedt;
	float dvaluedt1 = dvaluedtime1 * dtimedt;

	// get curve coefficients:

	float a = 2.f*v0 - 2.f*v1 + dvaluedt0 + dvaluedt1;
	float b = -3.f*v0 + 3.f*v1 -2.f*dvaluedt0 - dvaluedt1;
	float c = dvaluedt0;
	float d = v0;

	// evaluate the curve:

	float ttt = ( _time - t0 ) / ( t1 - t0 );	// 0. <= ttt <= 1.
	// fprintf( stderr, "ttt = %8.3f\n", ttt );

	float value = d + ttt * ( c + ttt * ( b + ttt*a ) );
	return value;
}


void
Keytimes::Init( )
{
	tvs.clear( );
}


void
Keytimes::PrintTimeValues( )
{
	for( std::vector<struct TimeValue *>::iterator tvi = tvs.begin( );  tvi < tvs.end( ); tvi++ )
	{
		fprintf( stderr, "(%6.2f,%8.3f)   ", (*tvi)->time, (*tvi)->value );
	}
	fprintf( stderr, "\n" );
}

//#define TEST
#ifdef TEST
	Keytimes xpos;

int
main( int argc, char *argv[ ] )
{
	xpos.Init( );

	xpos.AddTimeValue(  0.0,  0.000 );
	xpos.PrintTimeValues( );

	xpos.AddTimeValue(  2.0,  0.333 );
	xpos.PrintTimeValues( );

	xpos.AddTimeValue(  1.0,  3.142 );
	xpos.PrintTimeValues( );

	xpos.AddTimeValue(  0.5,  2.718 );
	xpos.PrintTimeValues( );

	fprintf( stderr, "%d time-value pairs\n", xpos.GetNumKeytimes( ) );
	fprintf( stderr, "Time runs from %8.3f to %8.3f\n", xpos.GetFirstTime( ), xpos.GetLastTime( ) );

	for( float t = 0.; t <= 2.02; t += 0.1 )
	{
		float v = xpos.GetValue( t );
		fprintf( stderr, "%8.3f\t%8.3f\n", t, v );
	}
}
#endif
#ifdef EXPECTED_RESULTS
(  0.00,   0.000)   
(  0.00,   0.000)   (  2.00,   0.333)   
(  0.00,   0.000)   (  1.00,   3.142)   (  2.00,   0.333)   
(  0.00,   0.000)   (  0.50,   2.718)   (  1.00,   3.142)   (  2.00,   0.333)   
4 time-value pairs
Time runs from    0.000 to    2.000
   0.000           0.000
   0.100           0.232
   0.200           0.806
   0.300           1.535
   0.400           2.234
   0.500           2.718
   0.600           2.989
   0.700           3.170
   0.800           3.258
   0.900           3.250
   1.000           3.142
   1.100           2.935
   1.200           2.646
   1.300           2.302
   1.400           1.924
   1.500           1.539
   1.600           1.169
   1.700           0.840
   1.800           0.574
   1.900           0.397
   2.000           0.333
#endif
