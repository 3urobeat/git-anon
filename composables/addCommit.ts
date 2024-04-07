/*
 * File: addCommit.ts
 * Project: git-anon
 * Created Date: 2024-03-24 19:03:19
 * Author: 3urobeat
 *
 * Last Modified: 2024-04-07 13:13:51
 * Modified By: 3urobeat
 *
 * Copyright (c) 2024 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


import fs from "fs";
import { commitAndPush } from "./handleGit";
import { DetailType, type Detail } from "~/model/projects";


/**
 * Makes line diff changes provided in commit in repository files
 * @param projectName Name of the project to make a new commit to
 * @param projectDetails Array of objects containing name and value prop for every detail
 */
export function addCommit(projectName: string, projectDetails: Detail[]) {

    console.log(`addCommit: Adding new commit for '${projectName}'`);

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

    details.forEach((e) => {
        const lineDiff = (e.detail.lineDiffMinus ? e.detail.lineDiffMinus : 0) - (e.detail.lineDiffPlus ? e.detail.lineDiffPlus : 0); // These ternaries might be unnecessary as `null` would eval to 0 but `undefined` evals to NaN sooooo yeah idk
        const compensationAmount = Math.abs((e.fileContent.length / 2) - lineDiff); // Divided by 2 to remove newline character on every line from calculation

        if (e.fileContent.length < lineDiff * 2) { // Times 2 to include newline character on every line
            console.log(`addCommit: File '${e.detail.name}' requires a compensation commit of +${compensationAmount} lines!`);

            for (let i = 0; i < compensationAmount; i++) {
                e.fileContent += Math.random().toString(36).substring(5, 4) + "\n";
            }

            fs.writeFileSync(`data/repository/${projectName}/${e.detail.name}`, e.fileContent);

            doDummyCommit = true;
        }
    });

    if (doDummyCommit) {
        commitAndPush(projectName, `Compensation commit for '${projectName}' to fulfill incoming line diff`, true);
    }


    // Make provided line diff changes in every file
    setTimeout(() => {
        details.forEach((e) => {
            const detail = e.detail;
            let content  = e.fileContent;

            // Add lineDiffPlus at the bottom
            if (detail.lineDiffPlus) {
                for (let i = 0; i < detail.lineDiffPlus!; i++) {
                    content += Math.random().toString(36).substring(5, 4) + "\n";
                }
            }

            // Remove lineDiffMinus at the start
            if (detail.lineDiffMinus) {
                content = content.slice(detail.lineDiffMinus * 2); // Times 2 to include newline character on every line
            }

            // Write changes
            fs.writeFileSync(`data/repository/${projectName}/${detail.name}`, content);
        });


        // Let git handler make the commit and push it
        const commitMessage = projectDetails.find((e) => e.name == "Commit Message")!.value;

        commitAndPush(projectName, commitMessage!); // TODO: Needs full details for timestamp etc
    }, doDummyCommit ? 500 : 0); // Set timeout if a compensation commit was made because git stores commits with less precision

}
