<!--
/*
 * File: projects.vue
 * Project: git-anon
 * Created Date: 2024-03-25 17:46:42
 * Author: 3urobeat
 *
 * Last Modified: 2024-04-26 14:16:31
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
            <button class="flex items-center justify-center py-1 px-3 rounded-sm bg-bg-input-light dark:bg-bg-input-dark outline outline-border-primary-light dark:outline-border-primary-dark outline-2 hover:bg-bg-input-hover-light hover:dark:bg-bg-input-hover-dark hover:transition-all" @click="saveChanges">
                <PhCheck class="mr-2 size-5 text-green-600"></PhCheck>
                Save
            </button>
        </div>
    </div>

    <div class="text-center lg:flex lg:flex-col lg:mx-12" @change="changesMade = true"> <!-- Offset content to the right on desktop to give headline more presence -->
        <div class="w-full lg:flex">

            <!-- Projects list -->
            <div class="w-full">
                <span class="lg:flex lg:mx-1 font-medium">Projects</span>

                <!-- Give list with outline some reasonable min and max sizes for mobile and desktop -->
                <ul id="projects-list" class="flex overflow-auto lg:h-full min-h-8 max-h-96 rounded-sm mt-1 outline outline-border-primary-light dark:outline-border-primary-dark outline-2"> <!-- overflow-auto shows scrollbar only when necessary -->

                    <!-- Get text into the list with some space all around -->
                    <div class="w-full mx-2">
                        <div class="flex my-2.5 w-full" v-for="thisProject in storedProjects"> <!-- :key="thisProject.name" -->

                            <!-- Project select & name edit button -->
                            <button :class="!thisProject.name ? 'outline-red-500' : 'outline-border-secondary-light dark:outline-border-secondary-dark'" class="flex w-full rounded-sm outline outline-2 hover:bg-bg-input-hover-light hover:dark:bg-bg-input-hover-dark hover:transition-all" @click="selectedProject = thisProject">
                                <div class="relative">
                                    <span class="absolute text-lg font-bold -mt-1 ml-1 text-green-600" v-show="selectedProject.name == thisProject.name">|</span>
                                </div>
                                <input
                                    type="text"
                                    :class="!thisProject.name ? 'outline-red-500' : 'outline-border-secondary-light dark:outline-border-secondary-dark'"
                                    class="rounded-sm w-full px-1 mx-4 bg-bg-input-light dark:bg-bg-input-dark hover:bg-bg-input-hover-light hover:dark:bg-bg-input-hover-dark outline outline-2 hover:transition-all"
                                    v-model.trim=thisProject.name
                                >
                            </button>

                            <!-- Delete button -->
                            <button class="flex ml-2 justify-end m-0.5 rounded-sm bg-bg-input-light dark:bg-bg-input-dark outline outline-border-secondary-light dark:outline-border-secondary-dark outline-2 hover:bg-bg-input-hover-light hover:dark:bg-bg-input-hover-dark hover:transition-all" @click="deleteProject(thisProject.name)">
                                <PhX class="size-5 text-red-500"></PhX>
                            </button>

                        </div>
                    </div>

                </ul>

                <button class="flex items-center justify-center mt-2 ml-1 py-1 px-3 text-nowrap rounded-sm bg-bg-input-light dark:bg-bg-input-dark outline outline-border-primary-light dark:outline-border-primary-dark outline-2 hover:bg-bg-input-hover-light hover:dark:bg-bg-input-hover-dark hover:transition-all" @click="addProject">
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
                <ul id="details-list" class="flex overflow-auto lg:h-full min-h-8 max-h-96 mt-1 rounded-sm outline outline-border-primary-light dark:outline-border-primary-dark outline-2"> <!-- overflow-auto shows scrollbar only when necessary -->

                    <!-- Get text into the list with some space all around -->
                    <div class="w-full mx-2.5">
                        <li class="flex w-full clearfix my-2" v-for="thisDetail in selectedProject.details"> <!-- :key="thisDetail.name" -->

                            <!-- Bind input with v-model to value prop of the corresponding detail -->
                            <div :class="!thisDetail.name ? 'outline-red-500' : 'outline-border-secondary-light dark:outline-border-secondary-dark'" class="flex w-full rounded-sm outline outline-2 hover:bg-bg-input-hover-light hover:dark:bg-bg-input-hover-dark hover:transition-all">
                                <input
                                    type="text"
                                    :class="!thisDetail.name ? 'outline-red-500' : 'outline-border-secondary-light dark:outline-border-secondary-dark'"
                                    class="rounded-sm w-full px-1 mx-4 outline bg-bg-input-light dark:bg-bg-input-dark outline-2 hover:bg-bg-input-hover-light hover:dark:bg-bg-input-hover-dark hover:transition-all"
                                    v-model.trim=thisDetail.name
                                    :disabled=thisDetail.locked
                                >
                            </div>

                            <!-- Delete button -->
                            <button class="ml-2 m-0.5 rounded-sm bg-bg-input-light dark:bg-bg-input-dark outline outline-border-secondary-light dark:outline-border-secondary-dark outline-2 hover:bg-bg-input-hover-light hover:dark:bg-bg-input-hover-dark hover:transition-all" @click="deleteDetail(thisDetail.name)" v-if="!['Commit Message', 'Timestamp'].includes(thisDetail.name)">
                                <PhX class="size-5 text-red-500"></PhX>
                            </button>

                            <div class="ml-7 m-0.5" v-if="['Commit Message', 'Timestamp'].includes(thisDetail.name)"></div> <!-- Dummy spacer for Commit Message field -->

                        </li>
                    </div>

                </ul>

                <button class="flex items-center justify-center mt-2 ml-1 py-1 px-3 text-nowrap rounded-sm bg-bg-input-light dark:bg-bg-input-dark outline outline-border-primary-light dark:outline-border-primary-dark outline-2 hover:bg-bg-input-hover-light hover:dark:bg-bg-input-hover-dark hover:transition-all" @click="addFile">
                    <PhPlus class="mr-2 size-5 text-green-600"></PhPlus>
                    Add File
                </button>
            </div>

        </div>
    </div>
</template>


<script setup lang="ts">
    import { PhCheck, PhCaretRight, PhCaretDown, PhX, PhPlus } from '@phosphor-icons/vue';
    import { DetailType, type Project, type StoredProjects } from "../model/projects";
    import { responseIndicatorFailure, responseIndicatorSuccess } from './helpers/responseIndicator';

    // The details.value field does not exist yet but is created when user inserts text into the input field by the v-model binding
    const storedProjects:  Ref<StoredProjects> = ref(null!);
    const selectedProject: Ref<Project>        = ref(null!);


    // Track if user made changes
    const changesMade = ref(false);

    onBeforeRouteLeave((to, from, next) => {
        if (changesMade.value) {
            if (!confirm("You have unsaved changes!\nWould you still like to continue?")) {
                next(false);
            }
        }

        next();
    });


    // Get all projects and their details on load
    async function getProjects() {
        let res = await useFetch<StoredProjects>("/api/get-projects");

        storedProjects.value  = res.data.value!;
        selectedProject.value = res.data.value![0];
    }

    await getProjects();


    // Sends changes to the database
    async function saveChanges() {

        // Check for missing name field
        if (storedProjects.value.some(e => !e.name)) {
            responseIndicatorFailure();
            return;
        }

        // Check for missing details name field and select project
        let abort = false;

        storedProjects.value.forEach((thisProject) => {
            if (abort) return;

            thisProject.details.forEach((thisDetail) => {
                if (!thisDetail.name) {
                    selectedProject.value = thisProject;
                    abort = true;
                    responseIndicatorFailure();
                    return;
                }
            });
        });

        if (abort) return;

        // Check for duplicate project names and files
        storedProjects.value.forEach((project) => {
            if (abort) return;

            if (storedProjects.value.filter((e) => e.name == project.name).length > 1) {
                alert(`You cannot have duplicate project names!\nProject '${project.name}' exists multiple times.`);
                abort = true;
                responseIndicatorFailure();
                return;
            }

            project.details.forEach((detail) => {
                if (abort) return;

                if (project.details.filter((e) => e.name == detail.name).length > 1) {
                    alert(`You cannot have duplicate file names!\nProject '${project.name}' has multiple files called '${detail.name}'.`);
                    abort = true;
                    responseIndicatorFailure();
                    return;
                }
            });
        });

        if (abort) return;


        // Send request
        const success = await useFetch("/api/set-projects", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(storedProjects.value)
        });

        // Indicate success/failure
        if (success.data.value) {
            responseIndicatorSuccess();

            changesMade.value = false;
        } else {
            responseIndicatorFailure();
        }


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
            details: [           // Include default values
                {
                    name: "Commit Message",
                    value: "",
                    type: DetailType.TEXT,
                    locked: true
                },
                {
                    name: "Timestamp",
                    value: "",
                    type: DetailType.TIMESTAMP,
                    locked: true
                }
            ]
        });
    }

    // Adds a new detail to this project
    function addFile() {
        selectedProject.value.details.push({
            name: "New File",
            value: "",
            type: DetailType.LINE_DIFF,
            locked: false
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
