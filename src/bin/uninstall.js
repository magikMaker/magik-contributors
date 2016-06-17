// Run when package is uninstalled

/**
 * Uninstalls the magikHook
 */
var magikHook = require('../lib/');
var hooks = require('../lib/hooks.json')

console.log('\033[4;36m%s\033[0m', 'uninstalling magikHooks');

magikHook.getGitHooksDirectory(function(err, directory) {
    if(!err) {

        hooks.forEach(function(hook) {
            magikHook.removeHook(directory, hook);
        });

        console.log('magikHooks uninstalld\n');
    }
})
