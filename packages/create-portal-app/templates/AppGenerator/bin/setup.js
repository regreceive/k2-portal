#!/usr/bin/env node
import { promisify } from 'util';
import { join } from 'path';
import { rmdirSync, unlinkSync, writeFileSync, readFileSync } from 'fs';
import { exec } from 'child_process';

/** Steps:
 * 1- create folder
 * 2- copy files to created folder
 * 3- run git init
 */

const defaultFolderName = 'umi-app-template3.0';
const initWorkingDirectory = process.cwd();

let folderName = defaultFolderName;
if (process.argv.slice(2).length > 0) {
  folderName = process.argv.slice(2)[0];
}

const folderPath = join(initWorkingDirectory, folderName);

const repo =
  'https://gitlab.kstonedata.k2/bcf/front-end/umi-app-template3.0.git';
console.log(`downloading files from repo ${repo}`);

const execPromise = promisify(exec);

async function runShellCmd(command) {
  try {
    const { stdout, stderr } = await execPromise(command);
    console.log(stdout);
    console.log(stderr);
  } catch (err) {
    console.error(err);
  }
}

async function setup() {
  try {
    await runShellCmd(`git clone --depth 1 ${repo} ${folderName}`);
    process.chdir(folderPath);

    await runShellCmd(`npx rimraf ./.git`);
    console.log(`old .git folder deleted successfully!`);

    /** remove extra files and folders from disk. we don't need it anymore */
    unlinkSync(join(process.cwd(), '.fatherrc.js'));
    unlinkSync(join(process.cwd(), 'bin', 'setup.js'));
    rmdirSync(join(process.cwd(), 'bin'));

    const pkg = JSON.parse(
      readFileSync(join(process.cwd(), 'package.json'), { encoding: 'utf-8' }),
    );
    delete pkg.devDependencies.father;
    delete pkg.devDependencies['rollup-plugin-hashbang'];
    writeFileSync(
      join(process.cwd(), 'package.json'),
      JSON.stringify(pkg, null, 2),
    );

    await runShellCmd(`git init && git add . && git commit -am "init commit"`);
    console.log(`new git repo initialized successfully!`);
  } catch (error) {
    console.log(error);
  }
}

setup();
