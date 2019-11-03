const inquirer = require( 'inquirer' );

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
    console.log( action );
}

main().catch( err => {
    console.log( err );
});
