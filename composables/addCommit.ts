/*
 * File: addCommit.ts
 * Project: git-anon
 * Created Date: 2024-03-24 19:03:19
 * Author: 3urobeat
 *
 * Last Modified: 2024-04-06 18:37:38
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
    const details: Detail[] = [];
    const lineDiffDetails = projectDetails.filter((e) => e.type == DetailType.LINE_DIFF);

    lineDiffDetails.forEach((detail) => {
        if (!fs.existsSync(`data/repository/${projectName}/${detail.name}`)) {
            fs.writeFileSync(`data/repository/${projectName}/${detail.name}`, "");
        }

        if (detail.lineDiffPlus || detail.lineDiffMinus) {
            details.push(detail);
        }
    });


    // Make provided line diff changes in every file
    details.forEach((detail) => {
        let content = fs.readFileSync(`data/repository/${projectName}/${detail.name}`).toString();

        // Add lineDiffPlus at the bottom
        if (detail.lineDiffPlus) {
            for (let i = 0; i < detail.lineDiffPlus!; i++) {
                content += Math.random().toString(36).substring(5, 4) + "\n";
            }
        }

        // Remove lineDiffMinus at the start. Should the file not have enough lines, we need to make a dummy commit in our name first that adds the needed amount of lines.
        if (detail.lineDiffMinus) {
            if (detail.lineDiffMinus > content.length * 3) { // Length times 3 to account for newline character "\n"
                // TODO: Make dummy commit
            }

            content = content.slice(detail.lineDiffMinus * 2);
        }

        // Write changes
        fs.writeFileSync(`data/repository/${projectName}/${detail.name}`, content);
    });


    // Let git handler make the commit and push it
    const commitMessage = projectDetails.find((e) => e.name.toLowerCase() == "commit message")!.value;

    commitAndPush(projectName, commitMessage!); // TODO: Needs full details for timestamp etc

}
