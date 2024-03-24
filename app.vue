<!--
/*
 * File: app.vue
 * Project: git-anon
 * Created Date: 2024-03-23 12:52:57
 * Author: 3urobeat
 *
 * Last Modified: 2024-03-24 13:08:57
 * Modified By: 3urobeat
 *
 * Copyright (c) 2024 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */
-->


<template>
    <title>Git Anon</title>
    <meta content="Git Anon" property="og:title" />
    <meta content="Track personal commit statistics without sharing company code" property="og:description" />

    <!-- Page content -->
    <div class="flex flex-col justify-between h-screen w-screen overflow-auto">

        <!-- Title bar -->
        <div id="titlebar" class="flex justify-center pb-5">
            <PhList class="absolute cursor-pointer left-3 top-2.5 md:hidden block" size="25px"></PhList>

            <div class="pt-2 w-28 text-center">Git Anon</div>               <!-- Title -->
            <hr class="absolute h-0.5 mt-10 w-full bg-gray-500 border-0"> <!-- Border below -->
        </div>

        <!-- Left navigation bar -->
        <nav id="navbar" class="absolute hidden md:block h-full md:w-1/6 w-1/2 bg-white border-2 border-x-gray-500 border-l-0">
            <div class="flex flex-col px-5 md:px-10">                          <!-- px-10 gives every element in this div space on the sides -->
                <div class="my-2"></div>                                       <!-- Add some space above everything-->
                <button class="flex items-center justify-center my-1 rounded-sm hover:bg-gray-200 hover:transition-all">
                    <PhHouse class="mr-2"></PhHouse>
                    Home
                </button>
                <div class="my-2 w-full h-0.5 bg-gray-500 opacity-50"></div> <!-- Divider to give Home more presence -->
                <button class="flex items-center justify-center my-1 rounded-sm hover:bg-gray-200 hover:transition-all">
                    <PhGitFork class="mr-2"></PhGitFork>
                    Projects
                </button>
                <button class="flex items-center justify-center my-1 rounded-sm hover:bg-gray-200 hover:transition-all">
                    <PhGear class="mr-2"></PhGear>
                    Settings
                </button>
            </div>
        </nav>

        <!-- The main content itself -->
        <div class="h-full w-full"> <!-- TODO: Offset by space taken up by navbar on desktop -->
            <NuxtPage></NuxtPage>   <!-- Links to index.vue -->
        </div>

        <!-- Footer for project details -->
        <footer class="self-center flex flex-col items-center mb-2 mt-2 text-xs md:text-sm opacity-50">
            git-anon v{{ packagejson.version }}

            <button type="button" @click="clickGithub" class="mt-1 rounded-full px-2 text-white bg-[#24292F] hover:bg-[#24292F]/90 hover:transition-all focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 text-center flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30 bg-opacity-80">
                <svg class="mr-1" width="1em" height="1em" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z" clip-rule="evenodd"/>
                </svg>
                <span class="text-white rounded-lg text-xm" href="https://github.com/3urobeat/git-anon" target="_blank">Source Code</span>
            </button>

            <p>This application is licensed under the <a class="underline hover:text-gray-500 rounded-lg" href="https://www.gnu.org/licenses/" target="_blank">GPLv3 license</a></p>
            <p>Copyright (c) 2024 <a class="underline hover:text-gray-500 rounded-lg" href="https://github.com/3urobeat" target="_blank">3urobeat</a></p>
        </footer>

    </div>
</template>


<script setup lang="ts">
    import { PhList, PhHouse, PhGitFork, PhGear } from "@phosphor-icons/vue";
    import packagejson from "./package.json";

    /**
     * Executed when user clicks the footer's GitHub icon
     */
    function clickGithub(event: Event) {
        window.open('http://github.com/3urobeat/git-anon', '_blank');
    }
</script>
