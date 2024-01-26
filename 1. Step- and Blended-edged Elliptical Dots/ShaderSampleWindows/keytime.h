#ifndef KEYTIME_H
#define KEYTIME_H

#include <stdio.h>
#include <math.h>
#include <vector>

struct TimeValue
{
	float time;
	float value;
};


class Keytimes
{
private:
	std::vector<struct TimeValue *> tvs;

public:
	Keytimes( );
	~Keytimes( );
	void	AddTimeValue( float, float );
	float	GetFirstTime( );
	float	GetLastTime( );
	int	GetNumKeytimes( );
	float	GetValue( float );
	void	Init( );
	void	PrintTimeValues( );
};

#endif	// KEYTIME_H
