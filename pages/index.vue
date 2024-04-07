<!--
/*
 * File: index.vue
 * Project: git-anon
 * Created Date: 2024-03-23 13:03:16
 * Author: 3urobeat
 *
 * Last Modified: 2024-04-07 15:29:40
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
        <div class="w-full lg:flex">

            <!-- Projects list -->
            <div class="w-full">
                <span class="lg:flex lg:mx-1 font-medium">Projects</span>

                <!-- Give list with outline some reasonable min and max sizes for mobile and desktop -->
                <ul id="projects-list" class="flex overflow-auto lg:h-full min-h-8 max-h-64 rounded-sm mt-1 outline outline-black outline-2"> <!-- overflow-auto shows scrollbar only when necessary -->

                    <!-- Get text into the list with some space all around -->
                    <div class="mx-2">
                        <button class="flex my-2.5 w-full rounded-sm bg-gray-100 outline outline-gray-400 outline-2 hover:bg-gray-200 hover:transition-all" v-for="thisProject in storedProjects" :key="thisProject.name" @click="selectProject(thisProject)">
                            <div class="relative">
                                <span class="absolute text-lg font-bold -mt-1 ml-1 text-green-600" v-show="selectedProject.name == thisProject.name">|</span>
                            </div>
                            <div class="pl-4 pr-2 text-nowrap">{{thisProject.name}}</div>
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
                        <li class="flex flex-col clearfix mb-1" v-for="thisDetail in selectedProject.details" :key="thisDetail.name">
                            <span class="text-left mx-1 text-nowrap">{{ thisDetail.name }}{{ thisDetail.type == DetailType.LINE_DIFF ? " line diff" : "" }}:</span>

                            <!-- Different inputs based on type -->
                            <input
                                v-if="thisDetail.type == DetailType.TEXT"
                                type="text"
                                class="rounded-sm pl-2 bg-gray-100 outline outline-gray-400 outline-2 hover:bg-gray-200 hover:transition-all"
                                v-model.trim="thisDetail.value"
                                :placeholder="'Update project ' + selectedProject.name"
                            >
                            <input
                                v-if="thisDetail.type == DetailType.TIMESTAMP"
                                type="datetime-local"
                                class="flex text-nowrap rounded-sm pl-2 bg-gray-100 outline outline-gray-400 outline-2 hover:bg-gray-200 hover:transition-all"
                                v-model.trim="thisDetail.value"
                            >
                            <div class="flex gap-1" v-if="thisDetail.type == DetailType.LINE_DIFF">
                                <div class="flex rounded-sm px-1 bg-gray-100">
                                    <p class="text-nowrap">++</p>
                                    <input
                                        type="number"
                                        class="flex ml-1 rounded-sm pl-2 bg-gray-100 outline outline-gray-400 outline-2 hover:bg-gray-200 hover:transition-all"
                                        v-model.trim="thisDetail.lineDiffPlus"
                                    >
                                </div>
                                <div class="flex rounded-sm px-1 bg-gray-100">
                                    <p class="text-nowrap">--</p>
                                    <input
                                        type="number"
                                        class="ml-1 rounded-sm pl-2 bg-gray-100 outline outline-gray-400 outline-2 hover:bg-gray-200 hover:transition-all"
                                        v-model.trim="thisDetail.lineDiffMinus"
                                    >
                                </div>

                            </div>
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
        <div class="w-full mt-10 pb-10">
            <span class="lg:flex lg:mx-1 font-medium text-nowrap line-clamp-1">History for '{{ selectedProject.name }}'</span>

            <!-- Give list with outline some reasonable min and max sizes for mobile and desktop -->
            <ul id="history-list" class="flex overflow-auto lg:h-32 min-h-8 max-h-32 mt-1 rounded-sm outline outline-black outline-2"> <!-- Fixed size on desktop -->

                <!-- Get text into the list with some space all around -->
                <div class="mx-3 my-1.5 w-full">
                    <span class="flex gap-x-1 text-sm cursor-pointer opacity-60 hover:opacity-80 hover:transition-all" v-if="selectedHistory" v-for="thisCommit in selectedHistory.commits" :key="thisCommit.timestamp" @click="showCommitDetails(thisCommit.hash, thisCommit.timestamp)">
                        <span class="text-nowrap">{{ thisCommit.message }}</span>                                                          <!-- Commit fields, left aligned -->
                        <span class="text-nowrap tabular-nums content-end text-right w-full">{{ formatTime(thisCommit.timestamp) }}</span> <!-- Formatted timestamp, right aligned and monospaced -->
                    </span>
                    <span v-if="!selectedHistory">Loading...</span>
                </div>

            </ul>
        </div>

        <!-- History commit details popup -->
        <div class="absolute flex items-center justify-center inset-0 rounded-sm bg-slate-200 bg-opacity-30" v-if="historyPopupContent != null" @click="historyPopupContent = null">
            <div class="flex flex-col lg:w-1/2 w-5/6 lg:h-2/3 h-2/3 py-4 px-5 gap-3 bg-white outline outline-black outline-2 rounded-sm shadow-black shadow-2xl" @click.stop="">
                <!-- Title -->
                <div class="flex h-fit font-bold text-xl">
                    Commit Details
                </div>

                <!-- Description -->
                <div class="flex h-full text-start overflow-auto"> <!-- overflow-auto shows scrollbar only when necessary -->
                    <!-- Detail names -->
                    <div class="flex flex-col text-nowrap gap-y-0.5">
                        <span class="flex">Project: </span>
                        <span class="flex">Committed on: </span>
                        <span class="flex">Commit Details: </span>
                    </div>

                    <!-- Detail values -->
                    <div class="flex flex-col gap-y-0.5 ml-1">
                        <span class="flex w-fit opacity-60 px-1 rounded-sm bg-slate-200">{{ selectedProject.name }}</span>
                        <span class="flex w-fit opacity-60 px-1 rounded-sm bg-slate-200">{{ formatTime(historyPopupContent.timestamp, true) }}</span>
                        <span class="w-fit opacity-60 px-1 rounded-sm bg-slate-200 whitespace-pre-wrap">{{ historyPopupContent.gitShow.replace(/\\n/, "<br>") }}</span>
                    </div>
                </div>

                <!-- Close button -->
                <div class="flex w-full pb-1 justify-end">
                    <button class="flex py-1 px-3 w-fit h-fit items-center justify-center rounded-sm bg-gray-100 outline outline-black outline-2 hover:bg-gray-200 hover:transition-all" @click="historyPopupContent = null">
                        <PhX class="mr-2 size-5 text-red-500"></PhX>
                        Close
                    </button>
                </div>
            </div>
        </div>

    </div>
</template>


<script setup lang="ts">
    import { PhCheck, PhCaretRight, PhCaretDown, PhX } from '@phosphor-icons/vue';
    import { type Project, type StoredProjects, type ProjectHistory, DetailType } from "../model/projects";


    // Cache all stored projects, reference the currently selected project and cache shallow histories of all projects that have been selected in the current session
    const storedProjects:   Ref<StoredProjects>   = ref(null!);
    const selectedProject:  Ref<Project>          = ref(null!);

    const projectHistories: ProjectHistory[] = [];
    const selectedHistory:  Ref<ProjectHistory>   = ref(null!);

    const historyPopupContent: Ref<{ projectName: string, timestamp: number, gitShow: string } | null> = ref(null);


    // Get all projects and their details on load
    let res = await useFetch<StoredProjects>("/api/get-projects");

    storedProjects.value  = res.data.value!;
    await selectProject(res.data.value![0]);


    /**
     * Selects a project and loads its history
     */
    async function selectProject(project: Project, forceRefreshHistory?: boolean) {
        let cachedHistory = projectHistories.find((e) => e.name == project.name);

        // Update TIMESTAMP detail field with current time if empty
        let timestampField = project.details.find((e) => e.type == DetailType.TIMESTAMP)!;

        if (!timestampField.value) {
            const timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000;

            // Add timezone offset to current date, change to ISO format and remove seconds, milliseconds and "Z" from the end for the browser to understand what is going on
            timestampField.value = new Date(Date.now() - timezoneOffset).toISOString().slice(0, -8);
        }

        // Load history if not cached yet
        if (!cachedHistory || forceRefreshHistory) {
            selectedHistory.value = null!; // Set to null to let Loading message appear

            console.log(`No history cached for project '${project.name}' yet, fetching it...`);

            // Make API request
            const newHistory = await useFetch<ProjectHistory>("/api/get-history", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: project.name
                })
            });

            // Set first commit to error message if request failed
            if (!newHistory.data.value) {
                selectedHistory.value = { name: project.name, commits: [{ message: "Failed to load history!", hash: "", timestamp: 0 }] }; // TODO: Improve this kind of hacky thing?
                return;
            }

            projectHistories.push(newHistory.data.value);
            selectedHistory.value = newHistory.data.value;
        } else {
            selectedHistory.value = cachedHistory;
        }

        selectedProject.value = project;
    }


    /**
     * Fetches commit details and populates historyPopupContent
     * @param hash Hash of the commit
     * @param timestamp Timestamp of the commit
     */
    async function showCommitDetails(hash: string, timestamp: number) {

        // Make API request
        const gitShowData = await useFetch<string>("/api/get-commit-details", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                hash: hash
            })
        });

        historyPopupContent.value = {
            projectName: selectedProject.value.name,
            timestamp: timestamp,
            gitShow: gitShowData.data.value!
        };

    }


    /**
     * Formats time to x hours ago if <24 hours, otherwise formats to ISO8601
     * @param timestamp The timestamp to convert
     * @param alwaysShowTimestamp Controls whether to always show the ISO8601 timestamp, even if <24h ago
     * @returns Formatted time, either in "x hours ago" or ISO8601 format
     */
    function formatTime(timestamp: number, alwaysShowTimestamp?: boolean) {
        let until = Math.abs((Date.now() - timestamp) / 1000);
        let untilUnit = "seconds";

        if (until < 86400 && !alwaysShowTimestamp) { // 24h in sec
            if (until > 60) {
                until = until / 60; untilUnit = "minutes";

                if (until > 60) {
                    until = until / 60; untilUnit = "hours";
                }
            }

            return `${Math.round(until)} ${untilUnit} ago`;
        } else {
            const timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000;

            return ((new Date(timestamp - timezoneOffset)).toISOString().replace(/T/, " ").replace(/\..+/, ""));
        }
    }


    /**
     * Makes a commit request to the server
     */
    async function makeCommit() {

        // Find timestamp field and convert to UTC or insert a new timestamp if empty
        let timestamp = selectedProject.value.details.find((e) => e.name == "Timestamp");

        if (timestamp?.value) {
            timestamp!.value = Date.parse(new Date(timestamp!.value).toUTCString()).toString();
        } else {
            timestamp!.value = Date.now().toString();
        }

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

        // Reset fields on success and force refresh history
        if (success) {
            selectedProject.value.details.forEach((detail) => {
                detail.value = "";
                if (detail.lineDiffPlus) detail.lineDiffPlus = undefined;
                if (detail.lineDiffMinus) detail.lineDiffMinus = undefined;
            });

            setTimeout(() => {
                selectProject(selectedProject.value, true);
            }, 500); // TODO: Not really great if the backend takes longer
        }

    }

</script>
