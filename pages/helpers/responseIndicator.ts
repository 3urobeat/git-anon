/*
 * File: responseIndicator.ts
 * Project: git-anon
 * Created Date: 2024-04-24 19:06:11
 * Author: 3urobeat
 *
 * Last Modified: 2024-04-24 19:10:41
 * Modified By: 3urobeat
 *
 * Copyright (c) 2024 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


/**
 * Colors the response indicator color bar green for 500ms
 */
export function responseIndicatorSuccess() {
    document.getElementById("color-border")?.classList.remove("border-transparent");
    document.getElementById("color-border")?.classList.add("border-green-500");

    setTimeout(() => {
        document.getElementById("color-border")?.classList.remove("border-green-500");
        document.getElementById("color-border")?.classList.add("border-transparent");
    }, 750);
}

/**
 * Colors the response indicator color bar red for 500ms
 */
export function responseIndicatorFailure() {
    document.getElementById("color-border")?.classList.remove("border-transparent");
    document.getElementById("color-border")?.classList.add("border-red-500");

    setTimeout(() => {
        document.getElementById("color-border")?.classList.remove("border-red-500");
        document.getElementById("color-border")?.classList.add("border-transparent");
    }, 750);
}
