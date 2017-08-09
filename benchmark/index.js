/* eslint-disable no-console */
/* globals Promise:true */

'use strict';

const Benchmark = require( 'benchmark' );
const Table = require( 'cli-table2' );
const ora = require( 'ora' );
const underscore = require( 'underscore' ).memoize;
const lodash = require( 'lodash' ).memoize;
const ramda = require( 'ramda' ).memoize;
const memoizee = require( 'memoizee' );
const fastMemoize = require( 'fast-memoize' );
const memoizejs = require( 'memoizejs' );
const memoizerific = require( 'memoizerific' );
const lruMemoize = require( 'lru-memoize' ).default;
const moize = require( 'moize' );
const memize = require( '../' );

const showResults = ( benchmarkResults ) => {
	const table = new Table( {
		head: [ 'Name', 'Ops / sec', 'Relative margin of error', 'Sample size' ]
	} );

	benchmarkResults.forEach( ( result ) => {
		const name = result.target.name;
		const opsPerSecond = result.target.hz.toLocaleString( 'en-US', {
			maximumFractionDigits: 0
		} );
		const relativeMarginOferror = `± ${result.target.stats.rme.toFixed( 2 )}%`;
		const sampleSize = result.target.stats.sample.length;

		table.push( [ name, opsPerSecond, relativeMarginOferror, sampleSize ] );
	} );

	console.log( table.toString() );
};

const sortDescResults = ( benchmarkResults ) => {
	return benchmarkResults.sort( ( a, b ) => {
		return a.target.hz < b.target.hz ? 1 : -1;
	} );
};

const spinner = ora( 'Running benchmark' );

let results = [];

const onCycle = ( event ) => {
	results.push( event );
	ora( event.target.name ).succeed();
};

const onComplete = () => {
	spinner.stop();

	const orderedBenchmarkResults = sortDescResults( results );

	showResults( orderedBenchmarkResults );
};

const fibonacci = ( number ) => {
	return number < 2 ? number : fibonacci( number - 1 ) + fibonacci( number - 2 );
};

const fibonacciMultiplePrimitive = ( number, isComplete ) => {
	if ( isComplete ) {
		return number;
	}

	const firstValue = number - 1;
	const secondValue = number - 2;

	return (
		fibonacciMultiplePrimitive( firstValue, firstValue < 2 ) +
		fibonacciMultiplePrimitive( secondValue, secondValue < 2 )
	);
};

const fibonacciMultipleObject = ( number, check ) => {
	if ( check.isComplete ) {
		return number;
	}

	const firstValue = number - 1;
	const secondValue = number - 2;

	return (
		fibonacciMultipleObject( firstValue, {
			isComplete: firstValue < 2
		} ) +
		fibonacciMultipleObject( secondValue, {
			isComplete: secondValue < 2
		} )
	);
};

const fibonacciMultipleDeepEqual = ( { number } ) => {
	return number < 2
		? number
		: (
			fibonacciMultipleDeepEqual( { number: number - 1 } ) +
			fibonacciMultipleDeepEqual( { number: number - 2 } )
		);
};

const runSingleParameterSuite = () => {
	const fibonacciSuite = new Benchmark.Suite( 'Single parameter' );
	const fibonacciNumber = 35;

	const mUnderscore = underscore( fibonacci );
	const mLodash = lodash( fibonacci );
	const mRamda = ramda( fibonacci );
	const mMemoizee = memoizee( fibonacci );
	const mFastMemoize = fastMemoize( fibonacci );
	const mMemoizejs = memoizejs( fibonacci );
	const mMemoizerific = memoizerific( Infinity )( fibonacci );
	const mLruMemoize = lruMemoize( Infinity )( fibonacci );
	const mMoize = moize( fibonacci );
	const mMoizeSerialize = moize.serialize( fibonacci );
	const mMemize = memize( fibonacci );

	return new Promise( ( resolve ) => {
		fibonacciSuite
			.add( 'underscore', () => {
				mUnderscore( fibonacciNumber );
			} )
			.add( 'lodash', () => {
				mLodash( fibonacciNumber );
			} )
			.add( 'memoizee', () => {
				mMemoizee( fibonacciNumber );
			} )
			.add( 'ramda', () => {
				mRamda( fibonacciNumber );
			} )
			.add( 'fast-memoize', () => {
				mFastMemoize( fibonacciNumber );
			} )
			.add( 'memoizejs', () => {
				mMemoizejs( fibonacciNumber );
			} )
			.add( 'memoizerific', () => {
				mMemoizerific( fibonacciNumber );
			} )
			.add( 'lru-memoize', () => {
				mLruMemoize( fibonacciNumber );
			} )
			.add( 'moize', () => {
				mMoize( fibonacciNumber );
			} )
			.add( 'moize (serialized)', () => {
				mMoizeSerialize( fibonacciNumber );
			} )
			.add( 'memize', () => {
				mMemize( fibonacciNumber );
			} )
			.on( 'start', () => {
				console.log( '' );
				console.log( 'Starting cycles for functions with a single parameter...' );

				results = [];

				spinner.start();
			} )
			.on( 'cycle', onCycle )
			.on( 'complete', () => {
				onComplete();
				resolve();
			} )
			.run( {
				async: true
			} );
	} );
};

const runMultiplePrimitiveSuite = () => {
	const fibonacciSuite = new Benchmark.Suite( 'Multiple parameters (Primitive)' );
	const fibonacciNumber = 35;
	const isComplete = false;

	const mMemoizee = memoizee( fibonacciMultiplePrimitive );
	const mFastMemoize = fastMemoize( fibonacciMultiplePrimitive );
	const mMemoizejs = memoizejs( fibonacciMultiplePrimitive );
	const mMemoizerific = memoizerific( Infinity )( fibonacciMultiplePrimitive );
	const mLruMemoize = lruMemoize( Infinity )( fibonacciMultiplePrimitive );
	const mMoize = moize( fibonacciMultiplePrimitive );
	const mMoizeSerialize = moize.serialize( fibonacciMultiplePrimitive );
	const mMemize = memize( fibonacciMultiplePrimitive );

	return new Promise( ( resolve ) => {
		fibonacciSuite
			.add( 'memoizee', () => {
				mMemoizee( fibonacciNumber, isComplete );
			} )
			.add( 'fast-memoize', () => {
				mFastMemoize( fibonacciNumber, isComplete );
			} )
			.add( 'memoizejs', () => {
				mMemoizejs( fibonacciNumber, isComplete );
			} )
			.add( 'memoizerific', () => {
				mMemoizerific( fibonacciNumber, isComplete );
			} )
			.add( 'lru-memoize', () => {
				mLruMemoize( fibonacciNumber, isComplete );
			} )
			.add( 'moize', () => {
				mMoize( fibonacciNumber, isComplete );
			} )
			.add( 'moize (serialized)', () => {
				mMoizeSerialize( fibonacciNumber, isComplete );
			} )
			.add( 'memize', () => {
				mMemize( fibonacciNumber, isComplete );
			} )
			.on( 'start', () => {
				console.log( '' );
				console.log( 'Starting cycles for functions with multiple parameters that contain only primitives...' );

				results = [];

				spinner.start();
			} )
			.on( 'cycle', onCycle )
			.on( 'complete', () => {
				onComplete();
				resolve();
			} )
			.run( {
				async: true
			} );
	} );
};

const runMultipleObjectSuite = () => {
	const fibonacciSuite = new Benchmark.Suite( 'Multiple parameters (Object)' );
	const fibonacciNumber = 35;
	const isComplete = {
		isComplete: false
	};

	const mMemoizee = memoizee( fibonacciMultipleObject );
	const mFastMemoize = fastMemoize( fibonacciMultipleObject );
	const mMemoizejs = memoizejs( fibonacciMultipleObject );
	const mMemoizerific = memoizerific( Infinity )( fibonacciMultipleObject );
	const mLruMemoize = lruMemoize( Infinity )( fibonacciMultipleObject );
	const mMoize = moize( fibonacciMultipleObject );
	const mMoizeSerialize = moize.serialize( fibonacciMultipleObject );
	const mMemize = memize( fibonacciMultipleObject );

	return new Promise( ( resolve ) => {
		fibonacciSuite
			.add( 'memoizee', () => {
				mMemoizee( fibonacciNumber, isComplete );
			} )
			.add( 'fast-memoize', () => {
				mFastMemoize( fibonacciNumber, isComplete );
			} )
			.add( 'memoizejs', () => {
				mMemoizejs( fibonacciNumber, isComplete );
			} )
			.add( 'memoizerific', () => {
				mMemoizerific( fibonacciNumber, isComplete );
			} )
			.add( 'lru-memoize', () => {
				mLruMemoize( fibonacciNumber, isComplete );
			} )
			.add( 'moize', () => {
				mMoize( fibonacciNumber, isComplete );
			} )
			.add( 'moize (serialized)', () => {
				mMoizeSerialize( fibonacciNumber, isComplete );
			} )
			.add( 'memize', () => {
				mMemize( fibonacciNumber, isComplete );
			} )
			.on( 'start', () => {
				console.log( '' );
				console.log( 'Starting cycles for functions with multiple parameters that contain objects...' );

				results = [];

				spinner.start();
			} )
			.on( 'cycle', onCycle )
			.on( 'complete', () => {
				onComplete();
				resolve();
			} )
			.run( {
				async: true
			} );
	} );
};

runSingleParameterSuite()
	.then( runMultiplePrimitiveSuite )
	.then( runMultipleObjectSuite );