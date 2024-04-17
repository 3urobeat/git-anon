/*
 * File: set-settings.ts
 * Project: git-anon
 * Created Date: 2024-04-11 15:44:00
 * Author: 3urobeat
 *
 * Last Modified: 2024-04-17 21:43:22
 * Modified By: 3urobeat
 *
 * Copyright (c) 2024 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


import fs from "fs";
import ini from "ini";
import { useSettingsDb } from "../../composables/useSettingsDb";

const defaultGitConfig = ini.decode(fs.readFileSync("server/default-gitconfig").toString());


/**
 * This API route saves all transmitted settings
 * Params: { gitConfig: string }
 * Returns: null
 */


// This function is executed when this API route is called
export default defineEventHandler(async (event) => {

    // Get database instance
    const db = useSettingsDb();

    console.log("API set-settings: Received request");


    // Read body of the request we received
    const params = await readBody(event);

    if (!params) return false;


    // Save gitconfig
    if (params.gitConfig) {
        // Make sure [core] and [branch] settings are not missing - those are not checked by the guided settings page
        const obj = ini.decode(params.gitConfig);

        if (!obj.core) obj.core = defaultGitConfig.core;
        if (!obj["branch \"master\""]) obj["branch \"master\""] = defaultGitConfig["branch \"master\""];

        params.gitConfig = ini.encode(obj);

        // Write data to the file
        fs.writeFileSync("data/repository/.git/config", params.gitConfig);
    }


    // Save database changes
    const logDbError = (err: Error | null) => { if (err) console.log("Error updating settings database! " + err); };

    if (params.pushToRemote != undefined) db.update({ name: "pushToRemote" }, { $set: { value: params.pushToRemote }}, { upsert: true }, logDbError);


});
