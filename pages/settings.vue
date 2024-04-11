<!--
/*
 * File: settings.vue
 * Project: git-anon
 * Created Date: 2024-03-25 17:46:47
 * Author: 3urobeat
 *
 * Last Modified: 2024-04-11 18:52:19
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
        <p class="w-full font-semibold underline underline-offset-4">Settings</p>

        <!-- Save button -->
        <div class="flex justify-end items-center">
            <button class="flex items-center justify-center py-1 px-3 rounded-sm bg-gray-100 outline outline-black outline-2 hover:bg-gray-200 hover:transition-all" @click="saveChanges">
                <PhCheck class="mr-2 size-5 text-green-600"></PhCheck>
                Save
            </button>
        </div>
    </div>

    <div class="lg:flex lg:flex-col lg:mx-12"> <!-- Offset content to the right on desktop to give headline more presence -->
        <div id="gitconfig">
            <p class="font-semibold">Git Config:</p>
            <textarea class="lg:w-2/4 w-full h-64 opacity-60 my-1 px-1 bg-slate-200 rounded-sm outline outline-black outline-2" v-model="settings.gitConfig"></textarea>
        </div>
    </div>
</template>


<script setup lang="ts">
    import { PhCheck } from "@phosphor-icons/vue";
    import type { Settings } from "~/model/settings";


    // Refs
    const settings: Ref<Settings> = ref({
        gitConfig: ""
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
