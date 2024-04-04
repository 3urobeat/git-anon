/*
 * File: get-history.ts
 * Project: git-anon
 * Created Date: 2024-03-29 11:58:00
 * Author: 3urobeat
 *
 * Last Modified: 2024-04-01 18:49:45
 * Modified By: 3urobeat
 *
 * Copyright (c) 2024 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


import { getFolderHistory } from "~/composables/handleGit";


/**
 * This API route gets the git history of a project in 'data/repository' and returns it.
 * Params: { name: string }
 * Returns: { name: string, commits: { commitMessage: string, timestamp: number }[] }
 */


// This function is executed when this API route is called
export default defineEventHandler(async (event) => {

    // Read body of the request we received
    const params = await readBody(event);

    if (!params || !params.name) return false;

    console.log(`API get-history: Received request for '${params.name}'`);


    // Get all projects and their details
    const result = await getFolderHistory(params.name);


    // Return data
    return result;

});
