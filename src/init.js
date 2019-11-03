const inquirer = require( 'inquirer' );
const chalk = require( 'chalk' );
const Spinner = require( 'cli-spinner' ).Spinner;
const { getDefinitions, getWordOfTheDay, getSynonyms, examplesOfTheWord } = require( './automate' );

const log = console.log;
const spinner = new Spinner({
    text: '',
    stream: process.stderr,
    onTick: function( msg ){
        this.clearLine( this.stream );
        this.stream.write( msg );
    }
});
spinner.setSpinnerString( '⠋⠙⠚⠞⠖⠦⠴⠲⠳⠓' );

async function main () {
    const actions = [ 'Definitions', 'Synonyms', 'Antonyms', 'Examples', 'Dictionary', 'Word of the day', 'Play' ]
    const { action } = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do with this Smart CLI?',
            choices: actions
        }
    ]);

    let input;
    const actionIndex = actions.indexOf( action );
    if ( actionIndex === 5 || actionIndex === 6 ) {
        spinner.start();
        const wordOfTheDay = await getWordOfTheDay();
        input = wordOfTheDay;
    } else {
        const { word } = await inquirer.prompt([
            {
                type: 'input',
                name: 'word',
                message: `Enter a valid word for getting the ${ actions[ actionIndex ]}`,
                validate: result => {
                    if ( result.length <= 3 )
                        return 'Not a valid word.';
                    if ( result.includes( ' ' ) )
                        return 'Word must not include spaces.';
                    if ( result.toLowerCase() !== result )
                        return 'Word must be lowercase.';
                    return true;
                }
            }
        ]);
        spinner.start();
        input = word
    }
    if ( actionIndex !== 6 )
        log( chalk.blue.underline.bold( action,': ',input ) );

    let definitions;
    let synonyms;

    switch ( actionIndex ) {
        case 0: {
            await getDefinitions( input );
            break;
        }
        case 1: {
            await getSynonyms( input, true );
            break;
        }
        case 2: {
            await getSynonyms( input, false );
            break;
        }
        case 3: {
            await examplesOfTheWord( input );
            break;
        }
        case 4: {
            await getDefinitions( input );
            await getSynonyms( input, true );
            await getSynonyms( input, false );
            await examplesOfTheWord( input );
            break;
        }
        case 5: {
            await getDefinitions( input );
            await getSynonyms( input, true );
            await getSynonyms( input, false );
            await examplesOfTheWord( input );
            break;
        }
        case 6: {
            definitions = await getDefinitions( input, true );
            synonyms = await getSynonyms( input, true, true );
            break;
        }
    }

    spinner.stop();

    if ( actionIndex === 6 ) {
        let tries = 0;

        await play( definitions, synonyms, input, tries ); 
    }

    const { again } = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'again',
            message: 'Run again?',
            default: false
        }
    ]);

    if ( again ) {
        main();
        return;
    }

    log( chalk.red.bold( 'Byee.' ) );
}

main().catch( err => {
    log( chalk.red.bold( 'Something went wrong, try again.' ) );
    spinner.stop();
    main();
});

async function play ( definitions, synonyms, answer, tries ) {
    log( chalk.blue.bold( definitions[0].text ) );
    const { word } = await inquirer.prompt([
        {
            type: 'input',
            name: 'word',
            message: 'Guess the word'
        }
    ]);

    if ( synonyms.includes( word ) || word === answer ) {
        log( chalk.green( 'Sucess!' ) );
        return word;
    } else {
        const quit = await tryAgain( definitions, synonyms, answer, tries )
        if ( quit ) {
            log( chalk.blue( 'Answer: ' ), chalk.green.bold( answer ) );
            await getDefinitions( answer );
            await getSynonyms( answer, true );
            await getSynonyms( answer, false );
            await examplesOfTheWord( answer );
        }
    }
}

async function tryAgain ( definitions, synonyms, answer, tries ) {
    const { option } = await inquirer.prompt([
        {
            type: 'list',
            name: 'option',
            message: 'Wrong answer.',
            choices: [ 'Try again', 'hint', 'quit' ]
        }
    ]);
    if ( option === 'Try again' || option === 'hint' ) {
        if ( option === 'hint' ) {
            tries += 1;
            log( chalk.blue.bold( definitions[tries].text ) );
        }

        await play( definitions, synonyms, answer, tries );
        return;
    }
    return true;
}