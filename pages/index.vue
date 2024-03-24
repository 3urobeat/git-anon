<!--
/*
 * File: index.vue
 * Project: git-anon
 * Created Date: 2024-03-23 13:03:16
 * Author: 3urobeat
 *
 * Last Modified: 2024-03-24 17:22:31
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
    <div id="title" class="font-semibold underline underline-offset-4 pb-5 md:pb-10 pt-10 select-none">
        Make a new commit
    </div>

    <div class="text-center md:flex md:flex-col md:mx-16"> <!-- Offset content to the right on desktop to give headline more presence -->

        <!-- Make Commit section -->
        <div class="w-full md:flex">

            <!-- Projects list -->
            <div class="w-full">
                <span class="md:flex md:mx-1 font-medium">Projects</span>

                <!-- Give list with outline some reasonable min and max sizes for mobile and desktop -->
                <ul id="projects-list" class="md:h-full min-h-8 max-h-64 rounded-sm mt-1 outline outline-black outline-2">

                    <!-- Get text into the list with some space all around -->
                    <div class="ml-2 float-left">
                        <button class="flex mt-2.5 w-full rounded-sm bg-gray-100 outline outline-gray-400 outline-2 hover:bg-gray-200 hover:transition-all" v-for="e in storedProjects" :key="e.name" @click="selectedProject = e">
                            <span class="font-extrabold ml-1 -mr-3 text-green-600" v-show="selectedProject.name == e.name">|</span>
                            <span class="px-5">{{e.name}}</span>
                        </button>
                    </div>

                </ul>
            </div>

            <!-- Dividers between each list, one for desktop layout, one for mobile -->
            <PhCaretRight class="hidden md:block size-24 m-4 mt-16 self-center"></PhCaretRight>
            <PhCaretDown class="md:hidden size-7 my-2 w-full"></PhCaretDown>

            <!-- Details list for the selected project -->
            <div class="w-full">
                <span class="md:flex md:mx-1 font-medium">Details</span>

                <!-- Give list with outline some reasonable min and max sizes for mobile and desktop -->
                <ul id="details-list" class="md:h-full min-h-8 max-h-64 mt-1 rounded-sm outline outline-black outline-2">

                    <!-- Get text into the list with some space all around -->
                    <div class="w-full px-5 pt-1 pb-1 float-left">
                        <li class="flex flex-col clearfix mb-1" v-for="e in selectedProject.details" :key="e.name">
                            <span class="text-left mx-1">{{e.name}}:</span>
                            <input type="text" class="rounded-sm bg-gray-100 outline outline-gray-400 outline-2 hover:bg-gray-200 hover:transition-all">
                        </li>
                    </div>

                </ul>
            </div>

            <!-- Dividers between each list, one for desktop layout, one for mobile -->
            <PhCaretRight class="hidden md:block size-24 m-4 mt-16 self-center"></PhCaretRight>
            <PhCaretDown class="md:hidden size-7 my-2 w-full"></PhCaretDown>

            <!-- Commit button -->
            <button class="self-center py-1 px-3 md:mt-12 w-fit h-fit rounded-sm bg-gray-100 outline outline-black outline-2 hover:bg-gray-200 hover:transition-all" @click="makeCommit">
                <div class="flex items-center justify-center">
                    <PhCheck class="mr-2 size-5 text-green-600"></PhCheck>
                    Commit
                </div>
            </button>

        </div>


        <!-- History section -->
        <div class="w-full mt-10 mb-16">
            <span class="md:flex md:mx-1 font-medium">History for '{{ selectedProject.name }}'</span>

            <!-- Give list with outline some reasonable min and max sizes for mobile and desktop -->
            <ul id="history-list" class="md:h-20 min-h-8 max-h-20 mt-1 rounded-sm outline outline-black outline-2"> <!-- Fixed size on desktop -->

                <!-- Get text into the list with some space all around -->
                <div class="ml-5 pt-1 pb-1 float-left">

                </div>

            </ul>
        </div>

    </div>
</template>


<script setup lang="ts">
    import { PhCheck, PhCaretRight, PhCaretDown } from '@phosphor-icons/vue';

    const storedProjects:  Ref<{ name: string, details: { name: string }[] }[]> = ref(null!);
    const selectedProject: Ref<{ name: string, details: { name: string }[] }>   = ref(null!);


    // Get all projects and their details on load
    let res: any = await useFetch("/api/get-projects");

    storedProjects.value  = res.data.value;
    selectedProject.value = res.data.value![0];


    /**
     * Makes a commit request to the server
     */
    async function makeCommit() {

    }

</script>
