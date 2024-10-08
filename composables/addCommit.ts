/*
 * File: addCommit.ts
 * Project: git-anon
 * Created Date: 2024-03-24 19:03:19
 * Author: 3urobeat
 *
 * Last Modified: 2024-09-01 12:14:04
 * Modified By: 3urobeat
 *
 * Copyright (c) 2024 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


import fs from "fs";

import { gitCommit, gitPush} from "./handleGit";
import { DetailType, type Detail } from "~/model/projects";


/**
 * Makes line diff changes provided in commit in repository files
 * @param projectName Name of the project to make a new commit to
 * @param projectDetails Array of objects containing name and value prop for every detail
 * @returns Resolves with `null` on success or `Error` on failure for the user commit and a potential dummy commit
 */
export function addCommit(projectName: string, projectDetails: Detail[]) {
    return new Promise<{ dummyCommitResponse: string | null, commitResponse: string | null }>((resolve) => {
        (async () => {

            const timestamp = Number(projectDetails.find((e) => e.type === DetailType.TIMESTAMP)!.value);

            console.log(`addCommit: Adding new commit for '${projectName}'`);


            // Pull new commits from repository to prevent git push from failing
            /* const pushToRemote = await useSettingsDb().findOneAsync({ name: "pushToRemote" });

            if (pushToRemote) gitPull(); */


            // Check if no folder exists yet for this project and create it
            if (!fs.existsSync("data/repository/" + projectName)) {
                console.log(`addCommit: Project '${projectName}' does not have a folder yet, creating one...`);
                fs.mkdirSync("data/repository/" + projectName);
            }


            // Get every file that contains changes in this commit and create file for every LINE_DIFF detail that does not exist yet
            const details: { detail: Detail, fileContent: string }[] = [];
            const lineDiffDetails = projectDetails.filter((e) => e.type == DetailType.LINE_DIFF);

            lineDiffDetails.forEach((detail) => {
                if (!fs.existsSync(`data/repository/${projectName}/${detail.name}`)) {
                    fs.writeFileSync(`data/repository/${projectName}/${detail.name}`, "");
                }

                if (detail.lineDiffPlus || detail.lineDiffMinus) {
                    const content = fs.readFileSync(`data/repository/${projectName}/${detail.name}`).toString();

                    details.push({ detail: detail, fileContent: content });
                }
            });


            // Iterate through every detail and check if the file does not have enough lines to fulfill the lineDiff request and make a anon commit under our name.
            // We do this beforehand to group all files in one commit, instead of making a commit for every file in the loop below.
            let doDummyCommit = false;
            let detailsBeforeModification = structuredClone(details); // Clone details before lines were modified to be able to revert should the commit fail

            details.forEach((e) => {
                let lineDiff = (e.detail.lineDiffMinus ? e.detail.lineDiffMinus : 0) - (e.detail.lineDiffPlus ? e.detail.lineDiffPlus : 0); // These ternaries might be unnecessary as `null` would eval to 0 but `undefined` evals to NaN sooooo yeah idk

                // Inflate lineDiff with 10 lines if file is empty to fix commits with lineDiffPlus == lineDiffMinus not working
                if (e.fileContent.length == 0) lineDiff += 60;

                // Divide by 6 to remove the 5 chars every line contains and the trailing newline character from calculation. Add 10 lines to fix file becoming empty, which can result in incorrect line diffs
                const compensationAmount = Math.abs((e.fileContent.length / 6) - lineDiff) + 10;

                // Check if file inflation is needed and make the required change
                if (e.fileContent.length < lineDiff * 6) { // Times 6 to include 5 chars and newline character on every line
                    console.log(`addCommit: File '${e.detail.name}' requires a compensation commit of +${compensationAmount} lines!`);

                    for (let i = 0; i < compensationAmount; i++) {
                        e.fileContent += Math.random().toString(36).substring(2, 7) + "\n";
                    }

                    fs.writeFileSync(`data/repository/${projectName}/${e.detail.name}`, e.fileContent);

                    doDummyCommit = true;
                }
            });

            let dummyCommitResponse = null;

            if (doDummyCommit) {
                // Only commit, push both commits at once at the bottom
                dummyCommitResponse = await gitCommit(projectName, `Compensation commit for '${projectName}' to fulfill incoming line diff`, timestamp - 501, true);

                // Abort if commit failed, reset content and resolve instantly
                if (dummyCommitResponse != null) {
                    detailsBeforeModification.forEach((e) => {
                        console.log(`addCommit: Commit failed, undoing ${(details.find((f) => f.detail.name == e.detail.name)!.fileContent.length - e.fileContent.length) / 6} lines in '${e.detail.name}'`);
                        fs.writeFileSync(`data/repository/${projectName}/${e.detail.name}`, e.fileContent);
                    });

                    resolve({ dummyCommitResponse: dummyCommitResponse, commitResponse: "Skipped because compensation commit failed" });
                    return;
                }
            }


            // Make provided line diff changes in every file
            setTimeout(async () => {
                detailsBeforeModification = structuredClone(details);   // Update our copy the unmodified details to be able to revert to after the compensation commit if the next commit fails

                details.forEach((e) => {
                    const detail = e.detail;

                    // Add lineDiffPlus at the bottom
                    if (detail.lineDiffPlus) {
                        for (let i = 0; i < detail.lineDiffPlus!; i++) {
                            e.fileContent += Math.random().toString(36).substring(2, 7) + "\n";
                        }
                    }

                    // Remove lineDiffMinus at the start
                    if (detail.lineDiffMinus) {
                        e.fileContent = e.fileContent.slice(detail.lineDiffMinus * 6); // Times 6 to include 5 chars and newline character on every line
                    }

                    // Write changes
                    fs.writeFileSync(`data/repository/${projectName}/${detail.name}`, e.fileContent);
                });


                // Let git handler make the commit and push it
                const commitMessage = projectDetails.find((e) => e.name == "Commit Message")!.value?.toString();

                let commitResponse = await gitCommit(projectName, commitMessage!, timestamp);

                if (!commitResponse) {
                    commitResponse = await gitPush(); // Only push if commit was successful and reuse commitResponse for this response
                } else {
                    detailsBeforeModification.forEach((e) => { // If the commits failed, reset the file content
                        console.log(`addCommit: Commit failed, undoing ${(details.find((f) => f.detail.name == e.detail.name)!.fileContent.length - e.fileContent.length) / 6} lines in '${e.detail.name}'`);
                        fs.writeFileSync(`data/repository/${projectName}/${e.detail.name}`, e.fileContent);
                    });
                }


                // Resolve promise
                resolve({ commitResponse: commitResponse, dummyCommitResponse: dummyCommitResponse });
            }, doDummyCommit ? 500 : 0); // Set timeout if a compensation commit was made because git stores commits with less precision

        })();
    });
}
