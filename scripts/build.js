const exec = require( 'child_process' ).execSync;
const path = require('path');

const distFolderPath = path.join(__dirname, '..', 'dist');
const encoding = 'utf8';
const packageFilePath = path.join(__dirname, '..', 'package.json');
let json = JSON.parse(fs.readFileSync(packageFilePath, encoding));
let responseObject;

// first remove dist folder
responseObject = exec(`rm -r ${distFolderPath}`);

if(responseObject.error) {
    console.error(`Error while trying to remove the dist folder (${distFolderPath}):\n${responseObject.stderr}`);
    process.exit(1);
} else {
    console.log(`${responseObject.stdout}\n\nremoved dist folder (${distFolderPath}).`);
}

// create the dist folder
responseObject = exec(`mkdir ${distFolderPath}`);

if(responseObject.error) {
    console.error(`Error while trying to create the dist folder (${distFolderPath}):\n${responseObject.stderr}`);
    process.exit(1);
} else {
    console.log(`${responseObject.stdout}\n\ncreated dist folder (${distFolderPath}).`);
}

// copy the files we need, ie the src folder and package and readme files
responseObject = exec(`cp -R ../src/* ${distFolderPath}`);

if(responseObject.error) {
    console.error(`Error while trying to copy the src folder to the dist folder (${distFolderPath}):\n${responseObject.stderr}`);
    process.exit(1);
} else {
    console.log(`${responseObject.stdout}\n\nsrc folder copied.`);
}

// handle package.json
delete js.os;
delete json.scripts.release;
delete json.scripts['test'];

json.repository.url = 'git@github.com:magikMaker/npm-contributors.git';
json.bugs = 'https://github.com/magikMaker/npm-contributors/issues';
json = JSON.stringify(json, null, 2) + '\n';
fs.writeFileSync(path.join(__dirname, '..', 'dist', 'package.json'), json, {encoding: encoding});
