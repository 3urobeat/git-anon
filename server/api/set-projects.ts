/*
 * File: set-projects.ts
 * Project: git-anon
 * Created Date: 2024-03-28 20:11:07
 * Author: 3urobeat
 *
 * Last Modified: 2024-04-01 18:50:03
 * Modified By: 3urobeat
 *
 * Copyright (c) 2024 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


import { StoredProjects } from "~/model/projects";
import { useProjectsDb } from "../../composables/useProjectsDb";


/**
 * This API route saves all projects and their details
 * Params: { name: string, details: { name: string }[] }[]
 * Returns: null
 */


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
        // Sort to get Commit Message as the first field
        const sorted = [
            ...e.details.filter((detail) => detail.name === "Commit Message"),
            ...e.details.filter((detail) => detail.name !== "Commit Message")
        ];

        // Overwrite details in original data array
        params[i].details = sorted;

        // Insert Commit Message field at first index if it does not exist
        if (params[i].details[0].name !== "Commit Message") {
            console.log("API set-projects: Project is missing Commit Message field! Inserting...");

            params[i].details.splice(0, 0, { name: "Commit Message", value: "" });
        }
    });


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
    return null;

});
