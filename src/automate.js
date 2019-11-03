const axios = require( 'axios' );

const API_HOST = 'https://fourtytwowords.herokuapp.com';
const API_KEY = '441e2172676bf4269d82dc298c4849827074dd67091d1f698a9dcc51902c0c92c45cf70b00360cf694e62f0f0ffd3bd2530e6f4d285bd8f6d7d50499122cb534401622f2aba3ad15a5c0ee32ad8843ba'
const definitionsPath = word => `word/${word}/definitions?api_key=`
const randomPath = 'words/randomWord?api_key='


module.exports.getDefinitions = async function getDefinitions ( word ) {
    const response = await axios.get( `${API_HOST}/${definitionsPath( word )}${API_KEY}`);
    return response.data;
}

module.exports.getWordOfTheDay = async function getWordOfTheDay ( ) {
    const response = await axios.get( `${API_HOST}/${randomPath}${API_KEY}`);

    return response.data.word;
}
