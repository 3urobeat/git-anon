/*
 * File: handleGit.ts
 * Project: git-anon
 * Created Date: 2024-03-24 19:03:35
 * Author: 3urobeat
 *
 * Last Modified: 2024-03-25 17:28:39
 * Modified By: 3urobeat
 *
 * Copyright (c) 2024 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


import fs from "fs";
import { simpleGit, SimpleGit, CleanOptions } from 'simple-git'; // eslint-disable-line


if (!fs.existsSync("data/repository")) {
    console.log("Repository folder missing! Creating folder...");
    fs.mkdirSync("data/repository");
}

const git: SimpleGit = simpleGit({
    baseDir: "data/repository/",
    binary: "git"
});


/**
 * Makes a new git commit and pushes it to remote
 * @param filePath File path to commit (from repository base!). Leave empty to commit every outstanding change
 * @param commitMsg Message to use for the commit
 */
export function commitAndPush(filePath: string, commitMsg: string) {

    console.log(`commitAndPush: Committing and pushing '${filePath}' with msg '${commitMsg}'`);

    // Init git repository if .git folder is missing
    if (!fs.existsSync("data/repository/.git")) {
        console.log("commitAndPush: Repository not initialized yet! Running 'git init'...");
        git.init();
    }

    // Stage commit
    if (filePath) {
        git.add(filePath);
    } else {
        git.add(".");
    }

    // Make commit
    git.commit(commitMsg);

    // Push commit to remote
    //git.push();

}
