<!--
/*
 * File: index.vue
 * Project: git-anon
 * Created Date: 2024-03-23 13:03:16
 * Author: 3urobeat
 *
 * Last Modified: 2024-04-24 20:26:48
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
            <div class="w-full lg:max-w-[40%]">
                <span class="lg:flex lg:mx-1 font-medium">Projects</span>

                <!-- Give list with outline some reasonable min and max sizes for mobile and desktop -->
                <ul id="projects-list" class="flex overflow-auto lg:h-full min-h-8 max-h-64 rounded-sm mt-1 outline outline-border-primary-light dark:outline-border-primary-dark outline-2"> <!-- overflow-auto shows scrollbar only when necessary -->

                    <!-- Get text into the list with some space all around -->
                    <div class="mx-2">
                        <button class="flex my-2.5 w-full rounded-sm bg-bg-input-light dark:bg-bg-input-dark outline outline-border-secondary-light dark:outline-border-secondary-dark outline-2 hover:bg-bg-input-hover-light hover:dark:bg-bg-input-hover-dark hover:transition-all" v-for="thisProject in storedProjects" :key="thisProject.name" @click="selectProject(thisProject)">
                            <div class="relative">
                                <span class="absolute text-lg font-bold -mt-1 ml-1 text-green-600" v-show="selectedProject.name == thisProject.name">|</span>
                            </div>
                            <div class="pl-4 pr-2 text-nowrap">{{thisProject.name}}</div>
                        </button>
                    </div>

                </ul>
            </div>

            <!-- Dividers between each list, one for desktop layout, one for mobile -->
            <PhCaretRight class="hidden lg:block min-w-[4%] max-w-[4%] size-12 m-2 mt-16 self-center"></PhCaretRight> <!-- h-10 makes sure the caret is not scaling with window width -->
            <PhCaretDown class="lg:hidden size-7 my-2 w-full"></PhCaretDown>

            <!-- Details list for the selected project -->
            <div class="w-full lg:max-w-[40%]">
                <span class="lg:flex lg:mx-1 font-medium">Details</span>

                <!-- Give list with outline some reasonable min and max sizes for mobile and desktop -->
                <ul id="details-list" class="flex overflow-auto lg:h-full min-h-8 max-h-64 mt-1 rounded-sm outline outline-border-primary-light dark:outline-border-primary-dark outline-2"> <!-- overflow-auto shows scrollbar only when necessary -->

                    <!-- Get text into the list with some space all around -->
                    <div class="w-full mx-2.5 pb-1">
                        <li class="flex flex-col clearfix mb-1" v-for="thisDetail in selectedProject.details" :key="thisDetail.name" @change="!changesMade.includes(selectedProject.name) ? changesMade.push(selectedProject.name) : null">
                            <span class="text-left mx-1 text-nowrap">{{ thisDetail.name }}{{ thisDetail.type == DetailType.LINE_DIFF ? " line diff" : "" }}:</span>

                            <!-- Different inputs based on type -->
                            <input
                                v-if="thisDetail.type == DetailType.TEXT"
                                type="text"
                                class="rounded-sm pl-2 bg-bg-input-light dark:bg-bg-input-dark outline outline-border-secondary-light dark:outline-border-secondary-dark outline-2 hover:bg-bg-input-hover-light hover:dark:bg-bg-input-hover-dark hover:transition-all"
                                v-model.trim="thisDetail.value"
                                :placeholder="'Update project ' + selectedProject.name"
                            >
                            <input
                                v-if="thisDetail.type == DetailType.TIMESTAMP"
                                type="datetime-local"
                                class="text-nowrap rounded-sm pl-2 bg-bg-input-light dark:bg-bg-input-dark outline outline-border-secondary-light dark:outline-border-secondary-dark outline-2 hover:bg-bg-input-hover-light hover:dark:bg-bg-input-hover-dark hover:transition-all"
                                v-model.trim="thisDetail.value"
                            >
                            <div class="flex gap-1" v-if="thisDetail.type == DetailType.LINE_DIFF">
                                <div class="flex w-full rounded-sm px-1 bg-bg-input-light dark:bg-bg-input-dark">
                                    <p class="text-nowrap">++</p>
                                    <input
                                        type="number"
                                        class="ml-1 w-full rounded-sm pl-2 bg-bg-input-light dark:bg-bg-input-dark outline outline-border-secondary-light dark:outline-border-secondary-dark outline-2 hover:bg-bg-input-hover-light hover:dark:bg-bg-input-hover-dark hover:transition-all"
                                        v-model.trim="thisDetail.lineDiffPlus"
                                    >
                                </div>
                                <div class="flex w-full rounded-sm px-1 bg-bg-input-light dark:bg-bg-input-dark">
                                    <p class="text-nowrap">--</p>
                                    <input
                                        type="number"
                                        class="ml-1 w-full rounded-sm pl-2 bg-bg-input-light dark:bg-bg-input-dark outline outline-border-secondary-light dark:outline-border-secondary-dark outline-2 hover:bg-bg-input-hover-light hover:dark:bg-bg-input-hover-dark hover:transition-all"
                                        v-model.trim="thisDetail.lineDiffMinus"
                                    >
                                </div>

                            </div>
                        </li>
                    </div>

                </ul>
            </div>

            <!-- Dividers between each list, one for desktop layout, one for mobile -->
            <PhCaretRight class="hidden lg:block min-w-[4%] max-w-[4%] size-12 m-2 mt-16 self-center"></PhCaretRight>
            <PhCaretDown class="lg:hidden size-7 my-2 w-full"></PhCaretDown>

            <!-- Commit button -->
            <button class="lg:max-w-[15%] self-center py-1 px-3 lg:mt-12 w-fit h-fit rounded-sm bg-bg-input-light dark:bg-bg-input-dark outline outline-border-primary-light dark:outline-border-primary-dark outline-2 hover:bg-bg-input-hover-light hover:dark:bg-bg-input-hover-dark hover:transition-all" @click="makeCommit">
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
            <ul id="history-list" class="flex overflow-y-auto overflow-x-clip lg:h-32 min-h-8 max-h-32 mt-1 rounded-sm outline outline-border-primary-light dark:outline-border-primary-dark outline-2"> <!-- Fixed size on desktop -->

                <!-- Get text into the list with some space all around -->
                <div class="px-3 my-1.5 w-full">
                    <div class="flex gap-x-1 text-sm cursor-pointer opacity-60 hover:opacity-80 hover:transition-all" v-if="selectedHistory" v-for="thisCommit in selectedHistory.commits" :key="thisCommit.timestamp" @click="showCommitDetails(thisCommit.hash, thisCommit.timestamp)">
                        <span class="w-full text-left text-nowrap line-clamp-1">{{ thisCommit.message }}</span>                                                          <!-- Commit fields, left aligned -->
                        <span class="w-full text-nowrap tabular-nums content-end text-right">{{ formatTime(thisCommit.timestamp) }}</span> <!-- Formatted timestamp, right aligned and monospaced -->
                    </div>
                    <span v-if="!selectedHistory">Loading...</span>
                </div>

            </ul>
        </div>

        <!-- History commit details popup -->
        <div class="absolute flex items-center justify-center inset-0 rounded-sm bg-bg-embed-light dark:bg-bg-embed-dark bg-opacity-30 dark:bg-opacity-30" v-if="historyPopupContent != null" @click="historyPopupContent = null">
            <div class="flex flex-col lg:w-1/2 w-5/6 lg:h-2/3 h-2/3 py-4 px-5 gap-3 bg-bg-light dark:bg-bg-dark outline outline-border-primary-light dark:outline-border-primary-dark outline-2 rounded-sm shadow-black shadow-2xl" @click.stop="">
                <!-- Title -->
                <div class="flex h-fit font-bold text-xl">
                    Commit Details
                </div>

                <!-- Description -->
                <div class="flex flex-col lg:gap-y-0.5 gap-y-1.5 h-full text-start overflow-y-auto"> <!-- overflow-auto shows scrollbar only when necessary -->
                    <div class="flex lg:flex-row flex-col text-nowrap">
                        <span class="w-36">Project:</span>
                        <span class="w-fit opacity-60 px-1 rounded-sm bg-bg-embed-light dark:bg-bg-embed-dark">{{ selectedProject.name }}</span>
                    </div>
                    <div class="flex lg:flex-row flex-col text-nowrap">
                        <span class="w-36">Committed on:</span>
                        <span class="w-fit opacity-60 px-1 rounded-sm bg-bg-embed-light dark:bg-bg-embed-dark">{{ formatTime(historyPopupContent.timestamp, true) }}</span>
                    </div>
                    <div class="flex lg:flex-row flex-col text-nowrap">
                        <span class="w-36">Commit Details:</span>
                        <span class="w-fit opacity-60 px-1 rounded-sm bg-bg-embed-light dark:bg-bg-embed-dark whitespace-pre-wrap">{{ historyPopupContent.gitShow }}</span>
                    </div>
                    <div class="flex lg:flex-row flex-col text-nowrap">
                        <span class="w-36">Commit Signature:</span>
                        <span class="w-fit opacity-60 px-1 rounded-sm bg-bg-embed-light dark:bg-bg-embed-dark whitespace-pre-wrap">{{ historyPopupContent.gitVerifyCommit }}</span>
                    </div>
                </div>

                <!-- Close button -->
                <div class="flex w-full pb-1 justify-end">
                    <button class="flex py-1 px-3 w-fit h-fit items-center justify-center rounded-sm bg-bg-input-light dark:bg-bg-input-dark outline outline-border-primary-light dark:outline-border-primary-dark outline-2 hover:bg-bg-input-hover-light hover:dark:bg-bg-input-hover-dark hover:transition-all" @click="historyPopupContent = null">
                        <PhX class="mr-2 size-5 text-red-500"></PhX>
                        Close
                    </button>
                </div>
            </div>
        </div>

    </div>
</template>


<script setup lang="ts">
    import { PhCheck, PhCaretRight, PhCaretDown, PhX } from "@phosphor-icons/vue";
    import { type Project, type StoredProjects, type ProjectHistory, DetailType } from "../model/projects";
    import { responseIndicatorFailure, responseIndicatorSuccess } from "./helpers/responseIndicator";


    // Cache all stored projects, reference the currently selected project and cache shallow histories of all projects that have been selected in the current session
    const storedProjects:   Ref<StoredProjects>   = ref(null!);
    const selectedProject:  Ref<Project>          = ref(null!);

    const projectHistories: ProjectHistory[] = [];
    const selectedHistory:  Ref<ProjectHistory>   = ref(null!);

    const historyPopupContent: Ref<{ projectName: string, timestamp: number, gitShow: string, gitVerifyCommit: string } | null> = ref(null);


    // Get all projects and their details on load
    let res = await useFetch<StoredProjects>("/api/get-projects");

    storedProjects.value  = res.data.value!;
    await selectProject(res.data.value![0]);


    // Track if user made changes
    let changesMade: Ref<string[]> = ref([]);

    onBeforeRouteLeave((to, from, next) => {
        if (changesMade.value.length > 0) {
            if (!confirm(`You have uncommited line diffs in these project(s):\n> ${changesMade.value.join(", ")}\nWould you still like to continue?`)) {
                selectedProject.value = storedProjects.value.find((e) => e.name == changesMade.value[0])!; // Set selectedProject to the first project in changesMade for convenience
                next(false);
            }
        }

        next();
    });


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
        const gitShowData = await useFetch<{ show: string, verifyCommit: string }>("/api/get-commit-details", {
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
            gitShow: gitShowData.data.value!.show,
            gitVerifyCommit: gitShowData.data.value!.verifyCommit
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

        // Check if every lineDiff field is empty and reject commit
        let lineDiffFields = selectedProject.value.details.filter((e) => e.type == DetailType.LINE_DIFF);

        if (!lineDiffFields.some((e) => e.lineDiffMinus || e.lineDiffPlus)) {
            alert("Cannot make commit without any line diffs!");
            return;
        }


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


        // Indicate result, reset fields on success and force refresh history
        console.log(success.data.value)

        if (success.data.value) {

            // Indicate success
            responseIndicatorSuccess();

            // Reset fields
            selectedProject.value.details.forEach((detail) => {
                detail.value = "";
                if (detail.lineDiffPlus) detail.lineDiffPlus = undefined;
                if (detail.lineDiffMinus) detail.lineDiffMinus = undefined;
            });

            // Remove project name from changesMade array
            changesMade.value = changesMade.value.filter((e) => e != selectedProject.value.name);

            // Refresh history
            setTimeout(() => {
                selectProject(selectedProject.value, true);
            }, 1000); // TODO: Not really great if the backend takes longer

        } else {

            // Indicate failure
            responseIndicatorFailure();

            // Restore time input field - Change to ISO format and remove seconds, milliseconds and "Z" from the end for the browser to understand what is going on
            timestamp!.value = new Date(Number(timestamp!.value)).toISOString().slice(0, -8);

            alert("Sorry, the commit failed!");
        }

    }

</script>
