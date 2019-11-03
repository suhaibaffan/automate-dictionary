const inquirer = require( 'inquirer' );
const figlet = require( 'figlet' );
const chalk = require( 'chalk' );
const { getDefinitions } = require( './automate' );
const log = console.log;

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
    const { word } = await inquirer.prompt([
        {
            type: 'input',
            name: 'word',
            message: `Enter a valid word for getting the ${ actions[actions.indexOf( action ) ]}`,
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
    const definitions = await getDefinitions( word )

    log( chalk.blue( action,':' ) );
    
    figlet( word, ( err, data ) => {
        log( chalk.yellow( data ) );
        for ( let define of definitions ) {
            log( chalk.green( define.text ) );
        }
    });
}

main().catch( err => {
    console.log( err );
});
