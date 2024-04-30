<!--
/*
 * File: settings.vue
 * Project: git-anon
 * Created Date: 2024-03-25 17:46:47
 * Author: 3urobeat
 *
 * Last Modified: 2024-04-30 18:04:42
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
            <button class="flex items-center justify-center py-1 px-3 rounded-sm bg-bg-input-light dark:bg-bg-input-dark outline outline-border-primary-light dark:outline-border-primary-dark outline-2 hover:bg-bg-input-hover-light hover:dark:bg-bg-input-hover-dark hover:transition-all" @click="saveChanges">
                <PhCheck class="mr-2 size-5 text-green-600"></PhCheck>
                Save
            </button>
        </div>
    </div>


    <div class="lg:flex lg:flex-col lg:mx-12 mb-5 lg:mb-7" @change="changesMade = true"> <!-- Offset content to the right on desktop to give headline more presence -->
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
                        :class="!guidedOptionsInputs.name ? 'outline-red-500' : 'outline-border-secondary-light dark:outline-border-secondary-dark'"
                        class="lg:w-80 w-full px-1 rounded-sm pl-2 bg-bg-input-light dark:bg-bg-input-dark outline outline-2 hover:bg-bg-input-hover-light hover:dark:bg-bg-input-hover-dark hover:transition-all transition-colors duration-500"
                        v-model.trim=guidedOptionsInputs.name
                        @focusout="processGuidedGitConfig()"
                    >
                </div>
                <div class="lg:flex gap-x-2">
                    <p class="w-44">Email:</p>
                    <input
                        type="text"
                        :class="!guidedOptionsInputs.email ? 'outline-red-500' : 'outline-border-secondary-light dark:outline-border-secondary-dark'"
                        class="lg:w-80 w-full px-1 rounded-sm pl-2 bg-bg-input-light dark:bg-bg-input-dark outline outline-2 hover:bg-bg-input-hover-light hover:dark:bg-bg-input-hover-dark hover:transition-all transition-colors duration-500"
                        v-model.trim=guidedOptionsInputs.email
                        @focusout="processGuidedGitConfig()"
                    >
                </div>


                <!-- GPG Settings -->
                <!-- <p class="font-semibold mt-4">GPG:</p>

                <div class="flex items-center gap-x-2">
                    <input id="enableGpg-input" type="checkbox" v-model="guidedOptionsInputs.enableGpg" @change="processGuidedGitConfig()">
                    <label for="enableGpg-input" class="select-none">Sign commits with GPG</label>
                </div>

                <div class="lg:flex gap-x-2">
                    <p class="w-44 text-nowrap">Signing Key:</p>
                    <input
                        type="text"
                        class="lg:w-80 w-full px-1 rounded-sm pl-2 bg-bg-input-light dark:bg-bg-input-dark outline outline-border-secondary-light dark:outline-border-secondary-dark outline-2 hover:bg-bg-input-hover-light hover:dark:bg-bg-input-hover-dark hover:transition-all"
                        v-model.trim=guidedOptionsInputs.gpgKey
                        @focusout="processGuidedGitConfig()"
                    >
                </div> -->


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
                        :class="settings.pushToRemote && !guidedOptionsInputs.remoteUrl ? 'outline-red-500' : 'outline-border-secondary-light dark:outline-border-secondary-dark'"
                        class="lg:w-80 w-full px-1 rounded-sm pl-2 bg-bg-input-light dark:bg-bg-input-dark outline outline-2 hover:bg-bg-input-hover-light hover:dark:bg-bg-input-hover-dark hover:transition-all"
                        v-model.trim=guidedOptionsInputs.remoteUrl
                        @focusout="processGuidedGitConfig()"
                    >
                </div>
                <div class="flex lg:ml-6 my-0.5 opacity-60 font-semibold text-sm">
                    Note:
                    <p class="ml-1 font-normal">
                        Only GitHub is currently supported, unless your service uses the same authentication style:
                        <br>
                        <span class="w-fit px-1 rounded-sm bg-bg-embed-light dark:bg-bg-embed-dark">https://username:password@domain.tld/path/to/repo.git</span>
                    </p>
                </div>

                <div class="lg:flex gap-x-2">
                    <p class="w-44">Username:</p>
                    <input
                        type="text"
                        class="lg:w-80 w-full px-1 rounded-sm pl-2 bg-bg-input-light dark:bg-bg-input-dark outline outline-border-secondary-light dark:outline-border-secondary-dark outline-2 hover:bg-bg-input-hover-light hover:dark:bg-bg-input-hover-dark hover:transition-all"
                        v-model.trim=guidedOptionsInputs.username
                        @focusout="processGuidedGitConfig()"
                    >
                </div>

                <div class="lg:flex gap-x-2">
                    <p class="w-44 text-nowrap">Password/Access Token:</p>
                    <input
                        type="text"
                        class="lg:w-80 w-full px-1 rounded-sm pl-2 bg-bg-input-light dark:bg-bg-input-dark outline outline-border-secondary-light dark:outline-border-secondary-dark outline-2 hover:bg-bg-input-hover-light hover:dark:bg-bg-input-hover-dark hover:transition-all"
                        v-model.trim=guidedOptionsInputs.password
                        @focusout="processGuidedGitConfig()"
                    >
                </div>
                <div class="lg:ml-6 my-0.5 opacity-60 text-sm">
                    Generate your access token <a class="underline hover:text-gray-500 rounded-lg" href="https://github.com/settings/personal-access-tokens/new" target="_blank">here</a>.
                    <br>
                    Increase the expiration, select your repository and grant <span class="w-fit px-1 rounded-sm bg-bg-embed-light dark:bg-bg-embed-dark">Read and Write</span> for the <span class="w-fit px-1 rounded-sm bg-bg-embed-light dark:bg-bg-embed-dark">Contents</span> permission.
                </div>

            </div>


            <!-- Raw gitconfig -->
            <div id="gitconfig-raw" class="flex flex-col gap-y-2" v-if="enableRawGitConfig">
                <p class="font-semibold">Raw local '.gitconfig':</p>
                <p class="text-sm opacity-60">Please be careful and rather use the guided mode unless you know what you are doing!</p>

                <div class="lg:flex gap-2">
                    <textarea
                        class="lg:w-2/4 w-full h-80 opacity-60 px-1 bg-bg-embed-light dark:bg-bg-embed-dark rounded-sm outline outline-border-primary-light dark:outline-border-primary-dark outline-2"
                        v-model="settings.gitConfig"
                        @focusout="processRawGitConfig()"
                    >
                    </textarea>

                    <div class="opacity-60 text-sm">
                        <span class="font-semibold">Information:</span><br>
                        <br>
                        This textarea contains the raw <span class="w-fit px-1 rounded-sm bg-bg-embed-light dark:bg-bg-embed-dark">config</span> file, placed inside the <span class="w-fit px-1 rounded-sm bg-bg-embed-light dark:bg-bg-embed-dark">.git</span> folder of the repository.<br>
                        <br>
                        Set the name and email to use for committing at 'name' & 'email' in the <span class="w-fit px-1 rounded-sm bg-bg-embed-light dark:bg-bg-embed-dark">user</span> section.<br>
                        <!-- <br>
                        The key at 'signingkey' specifies the gpg key to use when commit.gpgsign is set to 'true'.<br>
                        You can leave the field empty if 'gpgsign' is disabled.<br> -->
                        <br>
                        When 'Push commits to remote' is enabled, you need to specify the remote repository URL and credentials.<br>
                        GitHub expects this format: <span class="w-fit px-1 rounded-sm bg-bg-embed-light dark:bg-bg-embed-dark">https://username:password@github.com/user/repo.git</span><br>
                        <br>
                        You can generate an access token, which you have to provide as the password in the URL, <a class="underline hover:text-gray-500 rounded-lg" href="https://github.com/settings/personal-access-tokens/new" target="_blank">here</a>.<br>
                        Increase the expiration, select your repository and grant <span class="w-fit px-1 rounded-sm bg-bg-embed-light dark:bg-bg-embed-dark">Read and Write</span> for the <span class="w-fit px-1 rounded-sm bg-bg-embed-light dark:bg-bg-embed-dark">Contents</span> permission.<br>
                        <br>
                        Do not modify the sections <span class="w-fit px-1 rounded-sm bg-bg-embed-light dark:bg-bg-embed-dark">core</span>, <span class="w-fit px-1 rounded-sm bg-bg-embed-light dark:bg-bg-embed-dark">gpg</span> & <span class="w-fit px-1 rounded-sm bg-bg-embed-light dark:bg-bg-embed-dark">branch "master"</span>.
                    </div>
                </div>

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


    <div class="lg:mx-12 opacity-60 mb-5">
        Need more info? Read the README again <a class="underline hover:text-gray-500 rounded-lg" href="https://github.com/3urobeat/git-anon#readme" target="_blank">here</a>.
    </div>
</template>


<script setup lang="ts">
    import { PhCheck, PhToggleLeft, PhToggleRight } from "@phosphor-icons/vue";
    import type { GitConfig, Settings } from "~/model/settings";
    import ini from "ini";
    import { responseIndicatorFailure, responseIndicatorSuccess } from "./helpers/responseIndicator";


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



    // Load data
    const serverData = await useFetch<any>("/api/get-settings");

    settings.value = serverData.data.value;

    processRawGitConfig();


    // Processes all current guided inputs to keep raw config up to date
    function processGuidedGitConfig() {

        // Decode raw config
        const obj: GitConfig = ini.decode(settings.value.gitConfig);

        // Restore every key the user deleted
        if (!obj.user) obj.user = { name: "", email: "", signingkey: "" };
        if (!obj.commit) obj.commit = { gpgsign: false };
        if (!obj["remote \"origin\""]) obj["remote \"origin\""] = { url: "" };


        // Write into settings.gitConfig
        obj.user.name  = guidedOptionsInputs.value.name;
        obj.user.email = guidedOptionsInputs.value.email;

        obj.commit.gpgsign  = guidedOptionsInputs.value.enableGpg;
        obj.user.signingkey = guidedOptionsInputs.value.gpgKey;

        obj["remote \"origin\""].url = `https://${guidedOptionsInputs.value.username}:${guidedOptionsInputs.value.password}@${guidedOptionsInputs.value.remoteUrl.replace("https://", "")}`;

        // Encode to raw config and write
        settings.value.gitConfig = ini.encode(obj);

    }

    // Processes the current raw gitconfig to update guided inputs
    function processRawGitConfig() {

        // Decode raw config
        const obj: GitConfig = ini.decode(settings.value.gitConfig);

        // Restore every key the user deleted
        if (!obj.user) obj.user = { name: "", email: "", signingkey: "" };
        if (!obj.commit) obj.commit = { gpgsign: false };
        if (!obj["remote \"origin\""]) obj["remote \"origin\""] = { url: "" };


        // Deconstruct object and fill in guidedOptionsInputs
        guidedOptionsInputs.value.name  = obj.user.name ? obj.user.name : ""; // TODO: Some might fail here when removed from raw gitconfig
        guidedOptionsInputs.value.email = obj.user.email ? obj.user.email : "";

        guidedOptionsInputs.value.enableGpg = obj.commit.gpgsign ? obj.commit.gpgsign : false;
        guidedOptionsInputs.value.gpgKey    = obj.user.signingkey ? obj.user.signingkey : "";

        if (obj["remote \"origin\""]!.url) {
            let remoteUrlArr = obj["remote \"origin\""]!.url.replace("https://", "").split("@"); // Split credentials from repo path

            guidedOptionsInputs.value.remoteUrl = "https://" + remoteUrlArr[1];

            let gitCredentials = remoteUrlArr[0].split(":"); // Split credentials separated by :

            guidedOptionsInputs.value.username = gitCredentials[0];
            guidedOptionsInputs.value.password = gitCredentials[1];
        }

    }


    // Sends changes to the database
    async function saveChanges() {

        // Check for missing name and email fields, which are required by git
        if (!guidedOptionsInputs.value.name || !guidedOptionsInputs.value.email || (settings.value.pushToRemote && !guidedOptionsInputs.value.remoteUrl)) {
            responseIndicatorFailure();
            return;
        }


        // Encode once again, also when user was in raw mode. This ensures all missing values will automatically be added again, hopefully preventing git from breaking
        processGuidedGitConfig();

        const success = await useFetch("/api/set-settings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(settings.value)
        });

        // Indicate success/failure
        if (success.data.value) {
            responseIndicatorSuccess();

            changesMade.value = false;
        } else {
            responseIndicatorFailure();
        }

    }

</script>
