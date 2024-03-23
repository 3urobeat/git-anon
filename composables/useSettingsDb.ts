/*
 * File: useSettingsDb.ts
 * Project: git-anon
 * Created Date: 2024-03-23 22:34:30
 * Author: 3urobeat
 *
 * Last Modified: 2024-03-23 23:56:46
 * Modified By: 3urobeat
 *
 * Copyright (c) 2024 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


import nedb from "@seald-io/nedb";


// Load database
const settingsDb = new nedb({ filename: "data/database/settings.db", autoload: true });


/**
 * Provide function to access Database instance from API
 * @returns Nedb database instance
 */
export function useSettingsDb() {
    return settingsDb;
}
