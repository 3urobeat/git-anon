<!--
/*
 * File: settings.vue
 * Project: git-anon
 * Created Date: 2024-03-25 17:46:47
 * Author: 3urobeat
 *
 * Last Modified: 2024-04-16 21:54:52
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
    <div id="title" class="flex w-full mb-5 lg:mb-7 pt-10 select-none">
        <p class="w-full font-semibold underline underline-offset-4">Settings</p>

        <!-- Save button -->
        <div class="flex justify-end items-center">
            <button class="flex items-center justify-center py-1 px-3 rounded-sm bg-gray-100 outline outline-black outline-2 hover:bg-gray-200 hover:transition-all" @click="saveChanges">
                <PhCheck class="mr-2 size-5 text-green-600"></PhCheck>
                Save
            </button>
        </div>
    </div>


    <div class="lg:flex lg:flex-col lg:mx-12 mb-5 lg:mb-7"> <!-- Offset content to the right on desktop to give headline more presence -->
        <p class="font-semibold mb-1">Git Configuration:</p>

        <div id="gitconfig" class="flex flex-col px-2 ml-3">

            <!-- Toggle button -->
            <button class="flex w-fit text-sm items-center gap-2 rounded-full px-2 text-center mb-5 lg:mb-7 text-gray-300 bg-gray-500 hover:bg-gray-600" @click="enableRawGitConfig = !enableRawGitConfig">
                <PhToggleLeft v-if="!enableRawGitConfig"></PhToggleLeft>
                <PhToggleRight v-if="enableRawGitConfig"></PhToggleRight>
                Toggle between Guided and Raw mode
            </button>


            <!-- Guided gitconfig -->
            <div id="gitconfig-guided" class="flex flex-col gap-y-1.5" v-if="!enableRawGitConfig">

                <!-- User Settings -->
                <p class="font-semibold">User:</p>

                <div class="lg:flex gap-x-2">
                    <p class="w-44">Name:</p>
                    <input
                        type="text"
                        class="lg:w-80 w-full px-1 rounded-sm pl-2 bg-gray-100 outline outline-gray-400 outline-2 hover:bg-gray-200 hover:transition-all"
                        v-model.trim=guidedOptionsInputs.name
                    >
                </div>
                <div class="lg:flex gap-x-2">
                    <p class="w-44">Email:</p>
                    <input
                        type="text"
                        class="lg:w-80 w-full px-1 rounded-sm pl-2 bg-gray-100 outline outline-gray-400 outline-2 hover:bg-gray-200 hover:transition-all"
                        v-model.trim=guidedOptionsInputs.email
                    >
                </div>


                <!-- GPG Settings -->
                <p class="font-semibold mt-4">GPG:</p>

                <div class="flex items-center gap-x-2">
                    <input id="enableGpg-input" type="checkbox" v-model="guidedOptionsInputs.enableGpg">
                    <label for="enableGpg-input" class="select-none">Sign commits with GPG</label>
                </div>

                <div class="lg:flex gap-x-2">
                    <p class="w-44 text-nowrap">Signing Key:</p>
                    <input
                        type="text"
                        class="lg:w-80 w-full px-1 rounded-sm pl-2 bg-gray-100 outline outline-gray-400 outline-2 hover:bg-gray-200 hover:transition-all"
                        v-model.trim=guidedOptionsInputs.gpgKey
                    >
                </div>


                <!-- Remote Repo Settings -->
                <p class="font-semibold mt-4">Repository:</p>

                <div class="flex items-center gap-x-2">
                    <input id="pushToRemote-input" type="checkbox" v-model="settings.pushToRemote">
                    <label for="pushToRemote-input" class="select-none">Push commits to remote</label>
                </div>

                <div class="lg:flex gap-x-2">
                    <p class="w-44">Remote URL:</p>
                    <input
                        type="text"
                        class="lg:w-80 w-full px-1 rounded-sm pl-2 bg-gray-100 outline outline-gray-400 outline-2 hover:bg-gray-200 hover:transition-all"
                        v-model.trim=guidedOptionsInputs.remoteUrl
                    >
                </div>
                <div class="flex lg:ml-6 my-0.5 opacity-60 font-semibold text-sm">
                    Note:
                    <p class="ml-1 font-normal">
                        Only GitHub is currently supported, unless your service uses the same authentication style:
                        <br>
                        <span class="w-fit px-1 rounded-sm bg-slate-200">https://username:password@domain.tld/path/to/repo.git</span>
                    </p>
                </div>

                <div class="lg:flex gap-x-2">
                    <p class="w-44">Username:</p>
                    <input
                        type="text"
                        class="lg:w-80 w-full px-1 rounded-sm pl-2 bg-gray-100 outline outline-gray-400 outline-2 hover:bg-gray-200 hover:transition-all"
                        v-model.trim=guidedOptionsInputs.username
                    >
                </div>

                <div class="lg:flex gap-x-2">
                    <p class="w-44 text-nowrap">Password/Access Token:</p>
                    <input
                        type="text"
                        class="lg:w-80 w-full px-1 rounded-sm pl-2 bg-gray-100 outline outline-gray-400 outline-2 hover:bg-gray-200 hover:transition-all"
                        v-model.trim=guidedOptionsInputs.password
                    >
                </div>
                <div class="lg:ml-6 my-0.5 opacity-60 text-sm">
                    Generate your access token <a class="underline hover:text-gray-500 rounded-lg" href="https://github.com/settings/personal-access-tokens/new" target="_blank">here</a>.
                    <br>
                    Increase the expiration, select your repository and grant <span class="w-fit px-1 rounded-sm bg-slate-200">Read and Write</span> for the <span class="w-fit px-1 rounded-sm bg-slate-200">Contents</span> permission.
                </div>

            </div>


            <!-- Raw gitconfig -->
            <div id="gitconfig-raw" class="flex flex-col gap-y-2" v-if="enableRawGitConfig">
                <p class="font-semibold">Raw local '.gitconfig':</p>

                <textarea class="lg:w-2/4 w-full h-80 opacity-60 px-1 bg-slate-200 rounded-sm outline outline-black outline-2" v-model="settings.gitConfig"></textarea>

                <div>
                    <p class="font-semibold mt-2">Other:</p>

                    <div class="flex items-center gap-x-2">
                        <input id="pushToRemote2-input" type="checkbox" v-model="settings.pushToRemote">
                        <label for="pushToRemote2-input" class="select-none">Push commits to remote</label>
                    </div>
                </div>
            </div>

        </div>
    </div>


    <div class="lg:mx-12 opacity-60">
        Need more info? Read the README again <a class="underline hover:text-gray-500 rounded-lg" href="https://github.com/3urobeat/git-anon#readme" target="_blank">here</a>.
    </div>
</template>


<script setup lang="ts">
    import { PhCheck, PhToggleLeft, PhToggleRight } from "@phosphor-icons/vue";
    import type { Settings } from "~/model/settings";


    // Refs
    const settings: Ref<Settings> = ref({
        gitConfig: "",
        pushToRemote: false
    });

    const enableRawGitConfig = ref(false);

    const guidedOptionsInputs = ref({
        name: "",
        email: "",
        enableGpg: false,
        gpgKey: "",
        // Push to Remote is inserted directly into settings
        remoteUrl: "",
        username: "",
        password: ""
    });



    // Load data
    const serverData = await useFetch<any>("/api/get-settings");

    settings.value = serverData.data.value;


    // Sends changes to the database
    async function saveChanges() {
        await useFetch("/api/set-settings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(settings.value)
        });
    }

</script>
