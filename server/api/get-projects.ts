/*
 * File: get-projects.ts
 * Project: git-anon
 * Created Date: 2024-03-23 21:28:59
 * Author: 3urobeat
 *
 * Last Modified: 2024-04-28 14:05:14
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
 * This API route gets all projects and their details and returns them
 * Params: {}
 * Returns: { name: string, commits: { message: string, timestamp: number }[] }
 */


// This function is executed when this API route is called
export default defineEventHandler(async () => {

    // Get database instance
    const db = useProjectsDb();

    console.log("API get-projects: Received request");


    // Get all projects and their details
    const data: StoredProjects = await db.findAsync({});


    // Insert default 'Anon' project if database is empty
    if (data.length === 0) {
        console.log("API get-projects: Database is empty, inserting default project 'Anon'...");

        data.push({
            name: "Anon (default)",
            details: [
                {
                    name: "Commit Message",
                    value: "",
                    type: DetailType.TEXT,
                    locked: true
                },
                {
                    name: "Timestamp",
                    value: 0,
                    type: DetailType.TIMESTAMP,
                    locked: true
                },
                {
                    name: "Co-Author (optional)",
                    value: "",
                    email: "",
                    type: DetailType.CO_AUTHOR,
                    locked: true
                }
            ]
        });
    }


    // Return data
    return data;

});
