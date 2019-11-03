const axios = require( 'axios' );
const figlet = require( 'figlet' );
const chalk = require( 'chalk' );

const log = console.log;
const API_HOST = 'https://fourtytwowords.herokuapp.com';
const API_KEY = '441e2172676bf4269d82dc298c4849827074dd67091d1f698a9dcc51902c0c92c45cf70b00360cf694e62f0f0ffd3bd2530e6f4d285bd8f6d7d50499122cb534401622f2aba3ad15a5c0ee32ad8843ba';
const definitionsPath = word => `word/${word}/definitions?api_key=`;
const examplesPath = word => `word/${word}/examples?api_key=`;
const relatedWords = word => `word/${word}/relatedWords?api_key=`;
const randomPath = 'words/randomWord?api_key=';


module.exports.getDefinitions = async function getDefinitions ( word, dontLog = false ) {
    try {
        const response = await axios.get( `${API_HOST}/${definitionsPath( word )}${API_KEY}`);
    
        if ( !response ) return false;

        if ( dontLog ) return response.data;

        await logData( 'Definitions:', response.data );
        return response.data;
    } catch ( err ) {
        await logData( 'Definitions:', []);
    }
}

module.exports.getWordOfTheDay = async function getWordOfTheDay ( ) {
    try {
        const response = await axios.get( `${API_HOST}/${randomPath}${API_KEY}`);
    
        return response.data.word;
    } catch ( err ) {
        log( chalk.red( 'Something went wrong while fetching the word of the day.' ) );
    }
}

module.exports.examplesOfTheWord = async function examplesOfTheWord ( word ) {
    try {
        const response = await axios.get( `${API_HOST}/${examplesPath( word )}${API_KEY}`);
    
        await logData( 'Examples:', response.data.examples );
    } catch ( err ) {
        await logData( 'Examples:', []);
    }
}

module.exports.getSynonyms = async function getSynonyms ( word, synonym, dontLog = false ) {
    try {
        const { data } = await axios.get( `${API_HOST}/${relatedWords( word )}${API_KEY}`);
        
        if ( synonym ) {
            const type = data.map( value => value.relationshipType ).indexOf( 'synonym' )

            if ( dontLog ) return data[type].words;

            await logData( 'Synonyms:', data[type] ? data[type].words: []);
            return;
        }
        const type = data.map( value => value.relationshipType ).indexOf( 'antonym' )
        await logData( 'Antonyms:', data[type] ? data[type].words : []);
    } catch ( err ) {
        await logData( 'Related words:', []);
    }
}

async function logData ( input, responses ) {
    figlet( input, ( err, data ) => {
        log( chalk.yellow( data ) );
        if ( responses.length === 0 ) {
            log( chalk.red( 'Not found' ) );
        }

        for ( let response of responses ) {
            if ( typeof response !== 'object' ) {
                log( chalk.yellow( '-' ), chalk.green( response ) );
            }
            else {
                log( chalk.yellow( '---' ), chalk.green( response.text ) );
            }
        }
    });
}