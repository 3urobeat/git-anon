/*
 * File: handleGit.ts
 * Project: git-anon
 * Created Date: 2024-03-24 19:03:35
 * Author: 3urobeat
 *
 * Last Modified: 2024-04-12 21:20:33
 * Modified By: 3urobeat
 *
 * Copyright (c) 2024 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


import fs from "fs";
import { simpleGit } from "simple-git";
import { useSettingsDb } from "./useSettingsDb";

import type { SimpleGit } from "simple-git";
import type { ProjectHistory } from "~/model/projects"; // eslint-disable-line


// Init repository and git library
if (!fs.existsSync("data/repository")) {
    console.log("Repository folder missing! Creating folder...");
    fs.mkdirSync("data/repository");
}

const git: SimpleGit = simpleGit({
    baseDir: "data/repository/",
    binary: "git"
});

// Init git repository if .git folder is missing
if (!fs.existsSync("data/repository/.git")) {
    console.log("commitAndPush: Repository not initialized yet! Running 'git init'...");
    git.init();
}


/**
 * Makes a new git commit and pushes it to remote
 * @param filePath File path to commit (from repository base!). Leave empty to commit every outstanding change
 * @param commitMsg Message to use for the commit
 * @param timestamp Timestamp to use for the commit
 * @param anonCommit Whether this commit should be made under the project's name instead of the user's name
 */
export async function commitAndPush(filePath: string, commitMsg: string, timestamp: number, anonCommit?: boolean) {

    console.log(`commitAndPush: Committing ${anonCommit ? "anonymously " : ""}and pushing '${filePath}' with msg '${commitMsg}'`);

    // Stage commit
    if (filePath) {
        git.add(filePath);
    } else {
        git.add(".");
    }


    // Set timestamp
    const formattedTimestamp = new Date(timestamp).toISOString().slice(0, -5); // Remove dot, millis and "Z"

    git.env({ ...process.env, "GIT_AUTHOR_DATE": formattedTimestamp, "GIT_COMMITTER_DATE": formattedTimestamp });


    // Get pushToRemote setting value from database
    const settingsDb = useSettingsDb();
    const pushToRemote = await settingsDb.findOneAsync({ name: "pushToRemote" });


    // Make commit
    if (anonCommit) {
        const response = git.raw("-c", "user.name=\"Git Anon\"", "-c", "user.email=\"anon@test.com\"", "-c", "commit.gpgsign=false", "commit", "-m", commitMsg);

        console.log("commitAndPush: Anon git commit response:");
        console.log(response);

    } else {

        git.commit(commitMsg, undefined, undefined, (err, data) => {
            if (err) {
                console.log("commitAndPush: Failed to run 'git commit'! Error:\n" + err.stack);
                return;
            }

            console.log("commitAndPush: Successfully ran 'git commit'. Response:\n" + JSON.stringify(data));

            // Push if enabled
            if (pushToRemote && pushToRemote.value) {
                git.push(undefined, undefined, undefined, (err, data) => {
                    if (err) {
                        console.log("commitAndPush: Failed to run 'git push'! Error:\n" + err.stack);
                        return;
                    }

                    console.log("commitAndPush: Successfully ran 'git push'. Response:\n" + JSON.stringify(data));

                });
            } else {
                console.log("commitAndPush: pushToRemote is disabled in config, keeping commit local");
            }
        });
    }

}


/**
 * Returns the general commit history of a project. If a project was not found, an empty object will be returned.
 * @param folderName Name of the project to get the history of
 * @returns Collection of all commits with message and timestamp
 */
export function getFolderHistory(folderName: string) {
    return new Promise<ProjectHistory | object>((resolve) => {

        git.log({ file: folderName }, (err, data) => {
            if (err) {
                console.log(`getFolderHistory: git log failed with '${err}'! Returning empty object...`);
                return resolve({});
            }

            // Format data to ProjectHistory
            const history: ProjectHistory = {
                name: folderName,
                commits: []
            };

            data.all.forEach((commit) => {
                history.commits.push({
                    message: commit.message,
                    hash: commit.hash,
                    timestamp: Date.parse(commit.date)
                });
            });

            resolve(history);
        });

    });
}


/**
 * Gets details about a commit from git
 * @param hash Sha sum of the commit to get the details of
 * @return Returns what git returns
 */
export function getCommitDetails(hash: string) {
    return new Promise<string>((resolve) => {

        git.show(hash, (err, data) => {
            if (err) {
                console.log(`getCommitDetails: git show failed with '${err}'! Returning empty string...`);
                return resolve(`Failed to run 'git show ${hash}'!\nError: ${err}`);
            }

            resolve(data);
        });

    });
}
