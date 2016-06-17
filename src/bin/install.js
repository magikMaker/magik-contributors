#!/usr/bin/env bash

/**
 * This is run upon installation of the package
 */
var fs = require('fs');
var contributors = require('../lib/');
var hooks = require('../lib/hooks.json');

console.log('\033[4;36m%s\033[0m', 'Contributors');
console.log('setting up git hook');

contributors.getGitHooksDirectory(function(err, directory){
    if (err) {
        console.error('\nError:' + err)
    } else {
        // contributors.createHook(directory, 'pre-push', 'prepush');
        contributors.createCommitMessageHook(directory);
        console.log('done\n');
    }
});
