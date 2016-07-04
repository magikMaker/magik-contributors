'use strict';

const exec = require( 'child_process' ).execSync;
const fs = require('fs');
const path = require('path');

const distFolderPath = path.join(__dirname, '..', 'dist');
const encoding = 'utf8';
const packageFilePath = path.join(__dirname, '..', 'package.json');
let json = JSON.parse(fs.readFileSync(packageFilePath, encoding));
let responseObject;

// first remove dist folder
try {
    exec(`rm -r ${distFolderPath}`);
}
catch (e) {
}

// create the dist folder
try{
    responseObject = exec(`mkdir ${distFolderPath}`);
}
catch(e){
}

if(responseObject.error) {
    console.error(`Error while trying to create the dist folder (${distFolderPath}):\n${responseObject.stderr}`);
    process.exit(1);
}

// copy the files we need, ie the src folder and package and readme files
responseObject = exec(`cp -R ${path.join(__dirname, '..', 'src', '*')} ${distFolderPath}`);

if(responseObject.error) {
    console.error(`Error while trying to copy the src folder to the dist folder (${distFolderPath}):\n${responseObject.stderr}`);
    process.exit(1);
}

// copy readme file
fs.createReadStream(path.join(__dirname, '..', 'README.md')).pipe(fs.createWriteStream('./dist/README.md'));

// handle package.json
delete json.os;
delete json.engines;
delete json.scripts.release;
delete json.scripts['test'];

json.repository.url = 'git@github.com:magikMaker/magik-contributors.git';
json.bugs = 'https://github.com/magikMaker/magik-contributors/issues';
json = JSON.stringify(json, null, 2) + '\n';
fs.writeFileSync(path.join(__dirname, '..', 'dist', 'package.json'), json, {encoding: encoding});

console.log('\ndone...\n');
