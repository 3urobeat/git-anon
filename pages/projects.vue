<!--
/*
 * File: projects.vue
 * Project: git-anon
 * Created Date: 2024-03-25 17:46:42
 * Author: 3urobeat
 *
 * Last Modified: 2024-03-28 21:49:30
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
    <div id="title" class="flex w-full pb-5 lg:pb-7 pt-10 select-none">
        <p class="w-full font-semibold underline underline-offset-4">Configure Projects & Details</p>

        <!-- Save button -->
        <div class="flex justify-end items-center">
            <button class="flex items-center justify-center py-1 px-3 rounded-sm bg-gray-100 outline outline-black outline-2 hover:bg-gray-200 hover:transition-all" @click="saveChanges">
                <PhCheck class="mr-2 size-5 text-green-600"></PhCheck>
                Save
            </button>
        </div>
    </div>

    <div class="text-center lg:flex lg:flex-col lg:mx-12"> <!-- Offset content to the right on desktop to give headline more presence -->
        <div class="w-full lg:flex">

            <!-- Projects list -->
            <div class="w-full">
                <span class="lg:flex lg:mx-1 font-medium">Projects</span>

                <!-- Give list with outline some reasonable min and max sizes for mobile and desktop -->
                <ul id="projects-list" class="flex overflow-auto lg:h-full min-h-8 max-h-96 rounded-sm mt-1 outline outline-black outline-2"> <!-- overflow-auto shows scrollbar only when necessary -->

                    <!-- Get text into the list with some space all around -->
                    <div class="w-full mx-2">
                        <div class="flex my-2.5 w-full" v-for="thisProject in storedProjects"> <!-- :key="thisProject.name" -->

                            <!-- Project select & name edit button -->
                            <button class="flex w-full rounded-sm bg-gray-100 outline outline-gray-400 outline-2 hover:bg-gray-200 hover:transition-all" @click="selectedProject = thisProject">
                                <div class="relative">
                                    <span class="absolute text-lg font-bold -mt-1 ml-1 text-green-600" v-show="selectedProject.name == thisProject.name">|</span>
                                </div>
                                <input
                                    type="text"
                                    class="rounded-sm w-full px-1 mx-4 outline outline-gray-400 outline-2 hover:bg-gray-200 hover:transition-all"
                                    v-model=thisProject.name
                                >
                            </button>

                            <!-- Delete button -->
                            <button class="flex ml-2 justify-end m-0.5 rounded-sm bg-gray-200 hover:bg-gray-300 hover:transition-all" @click="deleteProject(thisProject.name)">
                                <PhX class="size-5 text-red-500"></PhX>
                            </button>

                        </div>
                    </div>

                </ul>

                <button class="flex items-center justify-center mt-2 ml-1 py-1 px-3 rounded-sm bg-gray-100 outline outline-black outline-2 hover:bg-gray-200 hover:transition-all" @click="addProject">
                    <PhPlus class="mr-2 size-5 text-green-600"></PhPlus>
                    Add Project
                </button>
            </div>

            <!-- Dividers between each list, one for desktop layout, one for mobile -->
            <PhCaretRight class="hidden lg:block size-24 m-4 mt-16 self-center"></PhCaretRight>
            <PhCaretDown class="lg:hidden size-7 my-2 w-full"></PhCaretDown>

            <!-- Details list for the selected project -->
            <div class="w-full">
                <span class="lg:flex lg:mx-1 font-medium">Details</span>

                <!-- Give list with outline some reasonable min and max sizes for mobile and desktop -->
                <ul id="details-list" class="flex overflow-auto lg:h-full min-h-8 max-h-96 mt-1 rounded-sm outline outline-black outline-2"> <!-- overflow-auto shows scrollbar only when necessary -->

                    <!-- Get text into the list with some space all around -->
                    <div class="w-full mx-2.5">
                        <li class="flex w-full clearfix my-2" v-for="thisDetail in selectedProject.details"> <!-- :key="thisDetail.name" -->

                            <!-- Bind input with v-model to value prop of the corresponding detail -->
                            <div class="flex w-full rounded-sm bg-gray-100 outline outline-gray-400 outline-2 hover:bg-gray-200 hover:transition-all">
                                <input
                                    type="text"
                                    class="rounded-sm w-full px-1 mx-4 outline outline-gray-400 outline-2 hover:bg-gray-200 hover:transition-all"
                                    v-model=thisDetail.name
                                >
                            </div>

                            <!-- Delete button -->
                            <button class="ml-2 m-0.5 rounded-sm bg-gray-200 hover:bg-gray-300 hover:transition-all" @click="deleteDetail(thisDetail.name)" v-if="thisDetail.name !== 'Commit Message'">
                                <PhX class="size-5 text-red-500"></PhX>
                            </button>

                            <div class="ml-7 m-0.5" v-if="thisDetail.name === 'Commit Message'"></div> <!-- Dummy spacer for Commit Message field -->

                        </li>
                    </div>

                </ul>

                <button class="flex items-center justify-center mt-2 ml-1 py-1 px-3 rounded-sm bg-gray-100 outline outline-black outline-2 hover:bg-gray-200 hover:transition-all" @click="addDetail">
                    <PhPlus class="mr-2 size-5 text-green-600"></PhPlus>
                    Add Detail
                </button>
            </div>

        </div>
    </div>
</template>


<script setup lang="ts">
    import { PhCheck, PhCaretRight, PhCaretDown, PhX, PhPlus } from '@phosphor-icons/vue';
    import type { Project, StoredProjects } from "../model/projects";

    // The details.value field does not exist yet but is created when user inserts text into the input field by the v-model binding
    const storedProjects:  Ref<StoredProjects> = ref(null!);
    const selectedProject: Ref<Project>        = ref(null!);


    // Get all projects and their details on load
    async function getProjects() {
        let res = await useFetch<StoredProjects>("/api/get-projects");

        storedProjects.value  = res.data.value!;
        selectedProject.value = res.data.value![0];
    }

    await getProjects();


    // Sends changes to the database
    async function saveChanges() {
        await useFetch("/api/set-projects", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(storedProjects.value)
        });

        const currentlySelectedProjectName = selectedProject.value.name;

        // Update page with database data
        await getProjects();

        // Select previously selected selectedProject again (woah that's a lot of selected)
        const hit = storedProjects.value.find((e) => e.name == currentlySelectedProjectName);

        if (hit) selectedProject.value = hit;
    }

    // Adds a new project to the list
    function addProject() {
        storedProjects.value.push({
            name: "New Project",
            details: [
                { name: "Commit Message", value: "" }
            ]
        });
    }

    // Adds a new detail to this project
    function addDetail() {
        selectedProject.value.details.push({
            name: "New Detail",
            value: ""
        });
    }

    function deleteProject(projectName: string) {
        let projectIndex = storedProjects.value.findIndex((e) => e.name == projectName);

        storedProjects.value.splice(projectIndex, 1);

        // Set selectedProject to nothing when the currently selected project was deleted
        if (selectedProject.value.name == projectName) selectedProject.value = { name: "", details: [] };
    }

    function deleteDetail(detailName: string) {
        if (detailName === "Commit Message") return; // Deny deletion of Commit Message field

        let detailIndex = selectedProject.value.details.findIndex((e) => e.name == detailName);

        selectedProject.value.details.splice(detailIndex, 1);
    }
</script>
