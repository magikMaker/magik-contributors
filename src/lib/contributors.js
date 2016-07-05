'use strict';

const path = require('path');
const fs = require('fs');
const exec = require('child_process').execSync;

/**
 * use magik-hooks to handle Git hooks manipulation
 *
 * @access private
 * @link https://github.com/magikMaker/magik-hooks
 * @type {{create: module.exports.create, remove: module.exports.remove}}
 */
const magikHooks = require('magik-hooks');

/**
 * Identifier used by magik-hooks
 *
 * @access private
 * @type {string}
 */
const id = 'magik-contributors';

/**
 * The git hook to use
 * @type {string}
 */
const gitHook = 'post-commit';

/**
 * Constants to change the text colours in `stdout`, use `ANSI_COLOURS.RESET`
 * to reset to default.
 *
 * @example
 * <code>
 * process.stdout.write(`${ANSI_COLOURS.YELLOW}text in yellow${ANSI_COLOURS.RESET}`);
 * </code>
 * @access private
 * @type {{BLACK: string, BLUE: string, CYAN: string, DEFAULT: string, GREEN: string, MAGENTA: string, RED: string, RESET: string, WHITE: string, YELLOW: string}}
 */
const ANSI_COLOURS = {
    BLACK: '\x1b[30m',
    BLUE: '\x1b[34m',
    CYAN: '\x1b[36m',
    DEFAULT: '\x1b[0m',
    GREEN: '\x1b[32m',
    MAGENTA: '\x1b[35m',
    RED: '\x1b[31m',
    RESET: '\x1b[0m',
    WHITE: '\x1b[37m',
    YELLOW: '\x1b[33m'
};

/**
 * Adds a contributor object to the array of contributors, duplicates are
 * prevented by checking the email address
 *
 * @access private
 * @param {Object} contributor {name, email, url}
 * @param {Array} [contributors]
 * @returns {Array} the array of contributors
 */
function addContributor(contributor, contributors){
    // a person can be a string like this:
    // Jack Black <j@black.com> (http://jackblack.com)
    // or an object containing a `name` field with optional `email` and `url` fields
    var found = false;
    contributors = contributors || [];

    for(let i = 0, l = contributors.length; i < l; ++i){

        // object found
        if(contributors[i].email && contributor.email === contributors[i].email){

            if(!contributors[i].name && contributor.name){
                contributors[i].name = contributor.name;
            }

            if(!contributors[i].url && contributor.url){
                contributors[i].url = contributor.url;
            }

            found = true;
            break;
        }

        // string found
        if(typeof contributors[i] === 'string' && contributors[i].indexOf(`<${contributor.email}>`) > -1){
            found = true;
            break;
        }
    }

    // add object if not found
    if(!found){
        contributors.push(contributor);
    }

    // sort the contributors by name
    contributors.sort(function compare(a, b) {
        return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
    });

    return contributors;
}

/**
 * Prints a message to stdout, ie the console
 *
 * @access private
 * @param {String} message the message to print to stdout (console)
 * @param {String} [level=log] optional log level one of `error`, `log` or `warn`
 * @returns {void}
 */
function log(message, level){
    const levels = {
        error: {
            color: 'RED',
            icon: '✖'
        },
        log: {
            color: 'GREEN',
            icon: '✔'
        },
        warn: {
            color: 'ORANGE',
            icon: '✖'
        }
    };

    const info = levels[level] || levels.log;

    // write to the console
    process.stdout.write(`${ANSI_COLOURS[info.color]}\n ${info.icon} ${message}\n${ANSI_COLOURS.RESET}`);
}
/**
 *
 * @type {{createPrePushHook: module.exports.createPrePushHook, removePrePushHook: module.exports.removePrePushHook}}
 */
module.exports = {

    /**
     * the actual script to parse out the contributors, add them to
     * package.json and then Git add and commit the changes. This is called
     * from the Git hook pre-push
     *
     * @access public
     * @returns {void}
     */
    updateContributors: function parseContributors(){
        const encoding = 'utf8';
        const packageFileName = path.join(process.cwd(), 'package.json');
        let json = JSON.parse(fs.readFileSync(packageFileName));
        let contributors = json.contributors || [];
        let gitContributors = exec('git log --pretty="%an %ae%n%cn %ce" | sort | uniq');

        gitContributors = gitContributors.toString().split('\n');

        gitContributors.forEach(function(value) {
            let matches = value.match(/^(.*)\s([^\s]+)$/);

            if(matches){
                contributors = addContributor({
                    name: matches[1] || '',
                    email: matches[2] || ''
                }, contributors);
            }
        });

        // add contributors array package.json
        json.contributors = contributors;
        json = JSON.stringify(json, null, 2) + '\n';
        fs.writeFileSync(packageFileName, json, {encoding: encoding});

        // add and commit to Git
        try{
            exec(`git add ${packageFileName}`);
        } catch(error){
            log('Error magik-contributors: Git add failed.', 'error');
        }

        try{
            exec('git commit -m "magik-contributors: added contributors to package.json"');
        } catch(error){
            // ignore the error, this mostly happens if nothing changed during Git add
            // log('Error magik-contributors: Git commit failed', 'error');
        }

        // notify console
        log('magik-contributors: updated contributors in package.json.');
    },

    /**
     * Creates a Git pre-push hook that creates a list of all Git contributors,
     * sorts them and then adds them as contributors to package.json
     *
     * @access public
     * @returns {void}
     */
    createPrePushHook: function createPrePushHook() {
        const command = 'node ' + path.join(__dirname, '..', 'bin', 'update-contributors.js');

        // create the Git hook
        magikHooks.create(gitHook, command, id);

        process.stdout.write(`${ANSI_COLOURS.GREEN}\n ✔ magik-contributors installed: ${gitHook} Git hook created.\n\n${ANSI_COLOURS.RESET}`);
    },

    /**
     * Removes the pre-push git hook
     *
     * @access public
     * @returns {void}
     */
    removePrePushHook: function removePrePushHook() {
        magikHooks.remove(gitHook, id);
        process.stdout.write(`${ANSI_COLOURS.GREEN}\n ✔ magik-contributors uninstalled: ${gitHook} Git hook removed\n\n${ANSI_COLOURS.RESET}`);
    }
};
