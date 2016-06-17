Contributors
------------
This makes sure that all Git contributors are added to the package.json file. 
Contributors are taken from actual git commits. Before installing, please read 
the warning below. 

Install
-------
Install this in your project like this:
`$ npm install --save-dev contributors`

Usage
-----
After installation, the list of contributors will be automagically updated just 
before each push.

Uninstall
---------
To uninstall, simply type this on the command line:
`$ npm uninstall --save-dev contributors`

W A R N I N G !!
================
This makes use of Git hooks. If you already have a git pre-push hook set up, it
will be deleted when installing this so please back up your current pre-push 
hook *before* installing this. 

After installation, add your own code to the git pre-push hook. Usually the 
hook files can be found in the folder .`git/hooks/` 

Also when de-installing, make sure to backup your own pre-push hook first, 
because de-installing will remove the entire pre-push hook file.

In order to be future proof, make sure to leave everything between and 
including the comments `#magikContributors` and `#//magikContributors` in 
tact.

In future releases this will be addressed, but for now please do it manually.

 
