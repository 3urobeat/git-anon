/*
 * File: set-projects.ts
 * Project: git-anon
 * Created Date: 2024-03-28 20:11:07
 * Author: 3urobeat
 *
 * Last Modified: 2024-04-29 20:28:52
 * Modified By: 3urobeat
 *
 * Copyright (c) 2024 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


import { DetailType, StoredProjects } from "~/model/projects";
import { useProjectsDb } from "../../composables/useProjectsDb";


/**
 * This API route saves all projects and their details to the database. Returns boolean if action was successful.
 * Params: { name: string, details: { name: string }[] }[]
 * Returns: boolean
 */


/**
 * Validates incoming project data
 * @param params Incoming data
 * @returns Boolean if data passed checks
 */
function validateData(params: StoredProjects) {
    let abort = false;

    params.forEach((thisProject) => {
        if (abort) return;

        // Check for missing or duplicate project name
        if (!thisProject.name || params.filter((e) => e.name == thisProject.name).length > 1) {
            abort = true;
            return;
        }

        // Check for missing or duplicate detail name
        thisProject.details.forEach((thisDetail) => {
            if (abort) return;

            if (!thisDetail.name || thisProject.details.filter((e) => e.name == thisDetail.name).length > 1) {
                abort = true;
                return;
            }
        });
    });

    return !abort;
}


// This function is executed when this API route is called
export default defineEventHandler(async (event) => {

    // Get database instance
    const db = useProjectsDb();


    // Read body of the request we received
    const params: StoredProjects = await readBody(event);

    if (!params) return false;

    console.log("API set-projects: Received request");


    // Make sure every project has "Commit Message" as first field
    params.forEach((e, i) => {
        // Sort to get Commit Message as the first and Timestamp as the second field
        const sorted = [
            ...e.details.filter((detail) => detail.name === "Commit Message"),
            ...e.details.filter((detail) => detail.type === DetailType.TIMESTAMP),
            ...e.details.filter((detail) => detail.type === DetailType.CO_AUTHOR),
            ...e.details.filter((detail) => detail.name !== "Commit Message" && detail.type !== DetailType.TIMESTAMP && detail.type !== DetailType.CO_AUTHOR)
        ];

        // Overwrite details in original data array
        params[i].details = sorted;

        // Insert Commit Message field at first index if it does not exist
        if (params[i].details[0].name !== "Commit Message") {
            console.log(`API set-projects: Project '${e.name}' is missing Commit Message field! Inserting...`);

            params[i].details.splice(0, 0, { name: "Commit Message", value: "", type: DetailType.TEXT, locked: true });
        }

        // Insert Timestamp field at second index if it does not exist
        if (params[i].details[1].name !== "Timestamp") {
            console.log(`API set-projects: Project '${e.name}' is missing Timestamp field! Inserting...`);

            params[i].details.splice(1, 0, { name: "Timestamp", value: 0, type: DetailType.TIMESTAMP, locked: true });
        }
    });


    // Validate incoming data
    if (!validateData(params)) {
        console.log("API set-projects: Rejecting request because validateData() failed");
        return false;
    }


    // Remove all deleted projects from database
    const removePromises: Promise<number>[] = [];

    const projectsStored = await db.findAsync({});

    projectsStored.forEach((project) => {
        if (!params.find((e) => e.name == project.name)) {
            removePromises.push(db.removeAsync({ name: project.name }, { }));
        }
    });

    await Promise.allSettled(removePromises);


    // Save updates and insertions to database
    const updatePromises: Promise<{ numAffected: number; affectedDocuments: null; upsert: boolean; }>[] = [];

    params.forEach((e) => {
        updatePromises.push(db.updateAsync({ name: e.name }, e, { upsert: true }));
    });

    await Promise.allSettled(updatePromises);


    // Indicate we're done
    return true;

});
