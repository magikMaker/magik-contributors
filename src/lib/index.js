/**
 * Creates a list of all Git contributors, sorts them and then adds them as
 * contributors to package.json
 */

var colors = require('colors');
var exec = require('child_process').exec;
var fs = require('fs');
var path = require('path');

// const packageFileName = path.join(__dirname, '..', 'package.json');
// let json = JSON.parse(fs.readFileSync(packageFileName, encoding));
//
// console.log('json', json);

//  `git log --pretty="%an %ae%n%cn %ce" | sort | uniq`

module.exports = {

    /**
     * Returns a Boolean indicating whether or not the file already has a
     * magikHook definition
     *
     * @todo implement
     * @param fileName
     * @returns {boolean}
     */
    hasMagikHook: function(fileName) {
        return false;
    },

    /**
     * Creates a Git Hook
     * @param directory
     * @param name
     * @param cmd
     */
    createHook: function(fileName, lines) {
        var bang = '#!/bin/sh';

        if(!fs.existsSync(fileName)) {
            lines.unshift(bang);
            this.writeFile(fileName, lines.join('\n'));
        } else {

            if(!this.hasMagikHook(fileName)) {
                // TODO add some nifty magic to add the new code to the existing file
                this.writeFile(fileName, lines.join('\n'));
            }
        }

        console.log('createHook', fileName, comamnd);
    },

    /**
     * Creates a Git hook which will write the Jira ticket ID into the commit
     * message
     *
     * @param directory
     * @param name
     * @param cmd
     */
    createCommitMessageHook: function(directory) {
        var name = 'prepare-commit-msg';
        var lines = [
            '# magikHook',
            'COMMIT_EDITMSG=$1',
            'addBranchName() {',
            '  NAME=$(git branch | grep \'*\' | sed \'s/* .*\/\([A-Z]*-[0-9]*\).*/\\1/\')',
            '  echo "$NAME $(cat $COMMIT_EDITMSG)" > $COMMIT_EDITMSG',
            '}',
            'MERGE=$(cat $COMMIT_EDITMSG|grep \'^Merge\'|wc -l)',
            'if [ $MERGE -eq 0 ] ; then',
            '  addBranchName',
            'fi',
            '#//magikHook'
        ];

        // create the actual hook
        this.createHook(path.join(directory, 'prepare-commit-msg'), lines);
    },

    /**
     * Writes a file to dist
     *
     * @param fileName
     * @param data
     */
    writeFile: function (fileName, data) {
        fs.writeFileSync(fileName, data);
        fs.chmodSync(fileName, 0755);
    },

    /**
     * Removes a git hook file.
     *
     * @todo TODO remove only the magikHook code and only remove file if it's then empty
     * @param directory
     * @param name
     */
    removeHook: function (directory, name) {
        var fileName = path.join(directory, name);

        if (fs.existsSync(fileName) && this.hasMagikHook(fileName)) {
            fs.unlinkSync(fileName);
        }
    },

    /**
     * Returns the .git hooks directory by calling the provided callback
     * function, if the hooks directory doesn't exists, it will be created.
     *
     * @param callback function called when done
     * @returns {void} calls the provided callback function
     */
    getGitHooksDirectory: function(callback) {

        exec('git rev-parse --git-dir', function(error, stdout, stderr) {
            if(error) {
                callback(stderr, null)
            } else {
                var hooksDirectory = stdout.trim() + '/hooks';

                if (!fs.existsSync(hooksDirectory)) {
                    fs.mkdirSync(hooksDirectory);
                }

                callback(null, hooksDirectory);
            }
        });
    }
};
