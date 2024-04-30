/*
 * File: tailwind.config.js
 * Project: git-anon
 * Created Date: 2024-03-23 14:31:06
 * Author: 3urobeat
 *
 * Last Modified: 2024-04-30 16:48:14
 * Modified By: 3urobeat
 *
 * Copyright (c) 2024 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                bg: {
                    light: "#f1f2f3",
                    dark: "#181a1b",
                    input: {
                        hover: {
                            light: "#e5e7eb",
                            dark: "#25282a"
                        },
                        light: "#f3f4f6",
                        dark: "#1e2022"
                    },
                    embed: {
                        light: "#e2e8f0",
                        dark: "#242729",
                    }
                },
                text: {
                    light: "#000000",
                    dark: "#e8e6e3"
                },
                border: {
                    primary: {
                        light: "#000000",
                        dark: "#8c8273"
                    },
                    secondary: {
                        light: "#9ca3af",
                        dark: "#565d5f"
                    }
                }
            }
        },
    },
    plugins: [],
    darkMode: "selector"
};
