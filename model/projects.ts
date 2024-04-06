/*
 * File: projects.ts
 * Project: git-anon
 * Created Date: 2024-03-25 16:24:30
 * Author: 3urobeat
 *
 * Last Modified: 2024-04-06 15:48:16
 * Modified By: 3urobeat
 *
 * Copyright (c) 2024 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


export enum DetailType {
    TEXT,
    TIMESTAMP,
    FILE_EXTENSION,
    LINE_DIFF
}

export type Detail = {
    name: string,
    value?: string,
    lineDiffPlus?: number,
    lineDiffMinus?: number,
    type: DetailType,
    locked?: boolean
}

export type Project = { name: string, details: Detail[] };

export type StoredProjects = Project[];

export type ProjectHistory = { name: string, commits: { message: string, timestamp: number }[] };

export type CommitDetails = { timestamp: number, details: { name: string, value: string }[] };
