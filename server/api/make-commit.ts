/*
 * File: make-commit.ts
 * Project: git-anon
 * Created Date: 2024-03-23 21:10:49
 * Author: 3urobeat
 *
 * Last Modified: 2024-03-24 21:48:26
 * Modified By: 3urobeat
 *
 * Copyright (c) 2024 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


import { addCommit } from "~/composables/addCommit";


/**
 * This API route adds a new file with the supplied info to a project, makes a commit and pushes it. Returns boolean if action was successful.
 * Params: { name: string, details: { name: string, value: string }[] }
 * Returns: boolean
 */


// This function is executed when this API route is called
export default defineEventHandler(async (event) => {

    // Read body of the request we received
    const params = await readBody(event);

    if (!params) return false;
    if (!params.name) return false;
    if (!params.details) return false;

    if (!params.details[0].value) params.details[0].value = "Update project " + params.name; // Add default commit message if none was provided

    // Dispatch commit
    console.log(`API make-commit: Dispatching new commit for project '${params.name}'`);

    addCommit(params.name, params.details);

    return true;

});
