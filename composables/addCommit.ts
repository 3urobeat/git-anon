/*
 * File: addCommit.ts
 * Project: git-anon
 * Created Date: 2024-03-24 19:03:19
 * Author: 3urobeat
 *
 * Last Modified: 2024-03-25 17:29:45
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


/**
 * Adds a new file with projectDetails to projectName folder in repository
 * @param projectName Name of the project to make a new commit to
 * @param projectDetails Array of objects containing name and value prop for every detail
 */
export function addCommit(projectName: string, projectDetails: { name: string, value: string }[]) {

    console.log(`addCommit: Adding new commit for '${projectName}' with '${JSON.stringify(projectDetails)}'`);

    // Check if no folder exists yet for this project and create it
    if (!fs.existsSync("data/repository/" + projectName)) {
        console.log(`addCommit: Project '${projectName}' does not have a folder yet, creating one...`);
        fs.mkdirSync("data/repository/" + projectName);
    }

    // Create new file with content
    const fileName = Date.now().toString(); // Use timestamp as file name

    fs.writeFileSync(`data/repository/${projectName}/${fileName}.json`, JSON.stringify(projectDetails));


    // Let git handler make the commit and push it
    const commitMessage = projectDetails.find((e) => e.name.toLowerCase() == "commit message")!.value;

    commitAndPush(`${projectName}/${fileName}.json`, commitMessage);

}
