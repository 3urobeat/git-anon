<!--
/*
 * File: index.vue
 * Project: git-anon
 * Created Date: 2024-03-23 13:03:16
 * Author: 3urobeat
 *
 * Last Modified: 2024-03-25 19:41:14
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
    <div id="title" class="font-semibold underline underline-offset-4 pb-5 lg:pb-7 pt-10 select-none">
        Make a new commit
    </div>

    <div class="text-center lg:flex lg:flex-col lg:mx-12"> <!-- Offset content to the right on desktop to give headline more presence -->

        <!-- Make Commit section -->
        <div class="w-full lg:flex">

            <!-- Projects list -->
            <div class="w-full">
                <span class="lg:flex lg:mx-1 font-medium">Projects</span>

                <!-- Give list with outline some reasonable min and max sizes for mobile and desktop -->
                <ul id="projects-list" class="flex overflow-auto lg:h-full min-h-8 max-h-64 rounded-sm mt-1 outline outline-black outline-2"> <!-- overflow-auto shows scrollbar only when necessary -->

                    <!-- Get text into the list with some space all around -->
                    <div class="mx-2">
                        <button class="flex my-2.5 w-full rounded-sm bg-gray-100 outline outline-gray-400 outline-2 hover:bg-gray-200 hover:transition-all" v-for="thisProject in storedProjects" :key="thisProject.name" @click="selectedProject = thisProject">
                            <div class="relative">
                                <span class="absolute text-lg font-bold -mt-1 ml-1 text-green-600" v-show="selectedProject.name == thisProject.name">|</span>
                            </div>
                            <div class="pl-4 pr-2">{{thisProject.name}}</div>
                        </button>
                    </div>

                </ul>
            </div>

            <!-- Dividers between each list, one for desktop layout, one for mobile -->
            <PhCaretRight class="hidden lg:block size-24 m-4 mt-16 self-center"></PhCaretRight>
            <PhCaretDown class="lg:hidden size-7 my-2 w-full"></PhCaretDown>

            <!-- Details list for the selected project -->
            <div class="w-full">
                <span class="lg:flex lg:mx-1 font-medium">Details</span>

                <!-- Give list with outline some reasonable min and max sizes for mobile and desktop -->
                <ul id="details-list" class="flex overflow-auto lg:h-full min-h-8 max-h-64 mt-1 rounded-sm outline outline-black outline-2"> <!-- overflow-auto shows scrollbar only when necessary -->

                    <!-- Get text into the list with some space all around -->
                    <div class="w-full mx-2.5 pb-1">
                        <li class="flex flex-col clearfix mb-1" v-for="thisProject in selectedProject.details" :key="thisProject.name">
                            <span class="text-left mx-1">{{thisProject.name}}:</span>

                            <!-- Bind input with v-model to value prop of the corresponding detail for easy readout later on. The value prop might not exist yet so we use this notation to create it -->
                            <input
                                type="text"
                                class="rounded-sm bg-gray-100 outline outline-gray-400 outline-2 hover:bg-gray-200 hover:transition-all"
                                v-model="thisProject['value']"
                            >
                        </li>
                    </div>

                </ul>
            </div>

            <!-- Dividers between each list, one for desktop layout, one for mobile -->
            <PhCaretRight class="hidden lg:block size-24 m-4 mt-16 self-center"></PhCaretRight>
            <PhCaretDown class="lg:hidden size-7 my-2 w-full"></PhCaretDown>

            <!-- Commit button -->
            <button class="self-center py-1 px-3 lg:mt-12 w-fit h-fit rounded-sm bg-gray-100 outline outline-black outline-2 hover:bg-gray-200 hover:transition-all" @click="makeCommit">
                <div class="flex items-center justify-center">
                    <PhCheck class="mr-2 size-5 text-green-600"></PhCheck>
                    Commit
                </div>
            </button>

        </div>


        <!-- History section -->
        <div class="w-full mt-10 mb-16">
            <span class="lg:flex lg:mx-1 font-medium">History for '{{ selectedProject.name }}'</span>

            <!-- Give list with outline some reasonable min and max sizes for mobile and desktop -->
            <ul id="history-list" class="flex overflow-auto lg:h-20 min-h-8 max-h-20 mt-1 rounded-sm outline outline-black outline-2"> <!-- Fixed size on desktop -->

                <!-- Get text into the list with some space all around -->
                <div class="mx-3 my-1.5 w-full float-left">
                    <span class="flex w-full text-sm cursor-default opacity-60 hover:opacity-80 hover:transition-all" v-for="thisProject in storedProjects" :key="thisProject.name"> <!-- TODO: Currently displays dummy content -->
                        <span class="">{{thisProject.name}}</span>                           <!-- Commit fields, left aligned -->
                        <span class="content-end text-right w-full">16h ago</span> <!-- Timestamp, right aligned -->
                    </span>
                </div>

            </ul>
        </div>

    </div>
</template>


<script setup lang="ts">
    import { PhCheck, PhCaretRight, PhCaretDown } from '@phosphor-icons/vue';
    import type { Project, StoredProjects } from "../model/projects";

    // The details.value field does not exist yet but is created when user inserts text into the input field by the v-model binding
    const storedProjects:  Ref<StoredProjects> = ref(null!);
    const selectedProject: Ref<Project>        = ref(null!);


    // Get all projects and their details on load
    let res = await useFetch<StoredProjects>("/api/get-projects");

    storedProjects.value  = res.data.value!;
    selectedProject.value = res.data.value![0];


    /**
     * Makes a commit request to the server
     */
    async function makeCommit() {

        //console.log("Sending make-commit API request with details: ")
        //console.log(selectedProject.value.details)

        // Dispatch request to the server
        let success = await useFetch("/api/make-commit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: selectedProject.value.name,
                details: selectedProject.value.details
            })
        });

    }

</script>
