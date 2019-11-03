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
    const actions = [ 'Definitions', 'Synonyms', 'Antonyms', 'Examples', 'Dictionary', 'Word of the day', 'Word Game' ]
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
    if ( actionIndex === 5 ) {
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
    log( chalk.blue.underline.bold( action,': ',input ) );

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
    }

    spinner.stop();
}

main().catch( err => {
    console.log( err );
    log( chalk.red.bold( 'Something went wrong, try again.' ) );
    spinner.stop();
    main();
});
