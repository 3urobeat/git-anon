/*
 * File: get-projects.ts
 * Project: git-anon
 * Created Date: 2024-03-23 21:28:59
 * Author: 3urobeat
 *
 * Last Modified: 2024-03-24 21:17:10
 * Modified By: 3urobeat
 *
 * Copyright (c) 2024 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


import { useProjectsDb } from "../../composables/useProjectsDb";


/**
 * This API route gets all projects and their details and returns them
 * Params: {}
 * Returns: "{ name: string, details: { name: string }[] }[]"
 */


// This function is executed when this API route is called
export default defineEventHandler(async () => {

    // Get database instance
    const db = useProjectsDb();

    console.log("API get-projects: Received get-projects request");


    // Get all projects and their details
    const data: { name: string, details: { name: string }[] }[] = await db.findAsync({});


    // Make sure every project has "Commit Message" as first field
    data.forEach((e, i) => {
        // Sort to get Commit Message as the first field // TODO: We could do this only on project edit
        const sorted = [
            ...e.details.filter((detail) => detail.name === "Commit Message"),
            ...e.details.filter((detail) => detail.name !== "Commit Message")
        ];

        // Overwrite details in original data array
        data[i].details = sorted;

        // Insert Commit Message field at first index if it does not exist
        if (data[i].details[0].name !== "Commit Message") {
            data[i].details.splice(0, 0, { name: "Commit Message" });
        }
    });

    return data;

});
