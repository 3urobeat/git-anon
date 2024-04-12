/*
 * File: get-settings.ts
 * Project: git-anon
 * Created Date: 2024-03-23 23:57:07
 * Author: 3urobeat
 *
 * Last Modified: 2024-04-12 19:23:44
 * Modified By: 3urobeat
 *
 * Copyright (c) 2024 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


import fs from "fs";
import { useSettingsDb } from "../../composables/useSettingsDb";
import { Settings } from "~/model/settings";


/**
 * This API route gets all stored settings and returns them
 * Params: {}
 * Returns: { gitConfig: string }
 */


// This function is executed when this API route is called
export default defineEventHandler(async () => {

    // Get database instance
    const db = useSettingsDb();

    console.log("API get-settings: Received request");

    const data: Settings = {
        gitConfig: "",
        pushToRemote: false
    };

    // Load local gitconfig
    if (fs.existsSync("data/repository/.git/config")) {
        data.gitConfig = fs.readFileSync("./data/repository/.git/config").toString();
    } else {
        fs.writeFileSync("data/repository/.git/config", "");
    }

    // Get all other settings and their values
    const dbData: { name: string, value: string | boolean }[] = await db.findAsync({});

    dbData.forEach((e) => {
        data[e.name] = e.value;
    });

    return data;

});
