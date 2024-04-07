/*
 * File: get-commit-details.ts
 * Project: git-anon
 * Created Date: 2024-03-29 12:10:39
 * Author: 3urobeat
 *
 * Last Modified: 2024-04-07 15:09:52
 * Modified By: 3urobeat
 *
 * Copyright (c) 2024 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


import { getCommitDetails } from "~/composables/handleGit";


/**
 * This API route gets the details of a commit and returns its details.
 * An empty object is returned if the commit was not found.
 * Params: { projectName: string, timestamp: string }
 * Returns: { name: string, value: string }[]
 */


// This function is executed when this API route is called
export default defineEventHandler(async (event) => {

    // Read body of the request we received
    const params = await readBody(event);

    if (!params || !params.hash) return {};

    console.log(`API get-commit-details: Received request for '${params.hash}'`);


    // Attempt to find the commit
    const info = await getCommitDetails(params.hash);

    return info;

});
