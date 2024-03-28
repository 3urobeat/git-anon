/*
 * File: get-settings.ts
 * Project: git-anon
 * Created Date: 2024-03-23 23:57:07
 * Author: 3urobeat
 *
 * Last Modified: 2024-03-28 22:07:02
 * Modified By: 3urobeat
 *
 * Copyright (c) 2024 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


import { useSettingsDb } from "../../composables/useSettingsDb";


/**
 * This API route gets all stored settings and returns them
 * Params: {}
 * Returns: { name: string, value: any }[]
 */


// This function is executed when this API route is called
export default defineEventHandler(async () => {

    // Get database instance
    const db = useSettingsDb();

    console.log("API get-settings: Received get-settings request");


    // Get all settings and their values
    const data = await db.findAsync({});

    return data;

});
