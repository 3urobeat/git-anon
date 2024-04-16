/*
 * File: settings.ts
 * Project: git-anon
 * Created Date: 2024-04-11 18:38:58
 * Author: 3urobeat
 *
 * Last Modified: 2024-04-16 22:06:44
 * Modified By: 3urobeat
 *
 * Copyright (c) 2024 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


export type Settings = {
    gitConfig: string,
    pushToRemote: boolean
}

export type GitConfig = {
    core?: {
        repositoryformatversion: string,
        filemode: boolean,
        bare: boolean,
        logallrefupdates: boolean
    },
    user?: {
        name: string,
        email: string,
        signingkey: string
    },
    gpg?: {
        program: string
    },
    commit?: {
        gpgsign: boolean
    },
    "remote \"origin\""?: {
        url: string
    },
    "branch \"master\""?: {
        remote: string,
        merge: string
    }
}
