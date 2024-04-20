<!--
/*
 * File: app.vue
 * Project: git-anon
 * Created Date: 2024-03-23 12:52:57
 * Author: 3urobeat
 *
 * Last Modified: 2024-04-20 23:08:34
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
    <!-- Title bar -->
    <PhList :class="!showNavbar ? 'block' : 'opacity-0'" class="fixed z-30 cursor-pointer left-3 top-2 dark:text-text-dark lg:hidden block transition-opacity" size="25px" @click="showNavbar = !showNavbar"></PhList>

    <header
        id="titlebar"
        :class="showNavbar ? 'border-opacity-30 lg:border-opacity-100 dark:text-text-dark dark:bg-[#5d5f5f] lg:bg-bg-light lg:dark:bg-bg-dark lg:opacity-100 lg:dark:opacity-100' : 'dark:bg-bg-dark'"
        class="fixed z-20 top-0 left-0 w-screen h-fit mb-5 pb-1.5 bg-bg-light dark:text-text-dark border-y-2 border-y-border-primary-light dark:border-y-border-primary-dark border-t-0 transition-all duration-500"
    >                                                                                                                                                 <!-- The extra lg: tags in :class fix a bg color bug when the window is resized while the navbar was open. The opacities are applied seperately here to avoid page elements fading through -->
        <!-- Title -->
        <div :class="showNavbar ? 'opacity-30 lg:opacity-100' : ''" class="pt-2 w-full text-center select-none flex items-center justify-center font-semibold transition-opacity duration-500">
            <PhDetective class="mr-2 size-5"></PhDetective>
            Git Anonymous
        </div>

        <!-- Light/Dark Mode toggle -->
        <div class="fixed w-full pr-3 top-1.5 text-center select-none flex items-center justify-end font-semibold">
            <button :class="showNavbar ? 'opacity-30 lg:opacity-100' : ''" class="rounded-sm bg-bg-input-light dark:bg-bg-input-dark outline outline-border-secondary-light dark:outline-border-secondary-dark outline-2 hover:bg-bg-input-hover-light hover:dark:bg-bg-input-hover-dark transition-all" @click="setDarkMode(!darkModeEnabled)">
                <PhMoon :class="darkModeEnabled ? 'opacity-100' : 'opacity-0'" class="fixed size-7 p-0.5 transition-opacity"></PhMoon>
                <PhSun :class="darkModeEnabled ? 'opacity-0' : 'opacity-100'" class="size-7 p-0.5 transition-opacity"></PhSun>
            </button>
        </div>
    </header>


    <!-- Group navbar and main content so that they can share the screen width -->
    <div class="flex overflow-auto">

        <!-- Left navigation bar which offsets everything else to the right on desktop and overlays everything on mobile -->
        <nav
            id="navbar"
            :class="showNavbar ? 'fixed backdrop-blur-sm bg-bg-light/5 dark:bg-bg-dark/50 lg:bg-bg-light lg:dark:bg-bg-dark' : 'fixed invisible lg:visible w-0 min-w-0 opacity-0'"
            class="z-40 top-0 left-0 min-h-screen w-48 min-w-48 lg:relative lg:block lg:opacity-100 bg-bg-light dark:bg-bg-dark dark:text-text-dark border-x-2 border-x-border-primary-light dark:border-x-border-primary-dark border-l-0 select-none duration-500 transition-all"
        >
            <PhCaretLeft :class="showNavbar ? 'block' : 'opacity-0'" class="relative z-30 cursor-pointer left-3 top-2 mb-5 lg:hidden block transition-all" size="25px" @click="showNavbar = !showNavbar"></PhCaretLeft>

            <div class="fixed px-7">
                <div class="my-3"></div> <!-- Add some space above everything-->
                <NuxtLink to="/" class="flex items-center w-full h-full px-2 py-1 rounded-sm hover:bg-bg-input-hover-light hover:dark:bg-bg-input-hover-dark hover:transition-all">
                    <span class="fixed mb-1 text-xl font-bold text-green-600" v-show="route.name === 'index'">|</span>
                    <div class="flex mx-4 items-center justify-center w-full">
                        <PhHouse class="mr-2"></PhHouse> Home
                    </div>
                </NuxtLink>
                <div class="my-2 w-full h-0.5 bg-border-secondary-light dark:bg-border-secondary-dark opacity-50"></div> <!-- Divider to give Home more presence -->
                <NuxtLink to="/projects" class="flex items-center w-full h-full px-2 py-1 rounded-sm hover:bg-bg-input-hover-light hover:dark:bg-bg-input-hover-dark hover:transition-all">
                    <span class="fixed mb-1 text-xl font-bold text-green-600" v-show="route.name === 'projects'">|</span>
                    <div class="flex mx-4 items-center justify-center w-full">
                        <PhGitFork class="mr-2"></PhGitFork> Projects
                    </div>
                </NuxtLink>
                <NuxtLink to="/settings" class="flex items-center w-full h-full px-2 py-1 rounded-sm hover:bg-bg-input-hover-light hover:dark:bg-bg-input-hover-dark hover:transition-all">
                    <span class="fixed mb-1 text-xl font-bold text-green-600" v-show="route.name === 'settings'">|</span>
                    <div class="flex mx-4 items-center justify-center w-full">
                        <PhGear class="mr-2"></PhGear> Settings
                    </div>
                </NuxtLink>
            </div>

            <!-- Footer for project details -->
            <footer class="fixed text-nowrap bottom-0 left-0 h-fit pb-2 px-1.5">
                <div class="flex flex-col text-xs lg:text-sm opacity-50">
                    git-anon v{{ packagejson.version }}

                    <a class="flex w-fit items-center mt-0.5 -ml-1 rounded-full px-2 text-white bg-gray-700 hover:bg-gray-400 hover:transition-all bg-opacity-80" href="http://github.com/3urobeat/git-anon" target="_blank">

                        <!-- GitHub logo -->
                        <svg class="mr-1" width="1em" height="1em" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z" clip-rule="evenodd"/>
                        </svg>

                        <span class="text-white rounded-lg text-xm" href="https://github.com/3urobeat/git-anon" target="_blank">Source Code</span>

                    </a>

                    <p>Licensed under <a class="underline hover:text-gray-500 rounded-lg" href="https://www.gnu.org/licenses/gpl-3.0.html" target="_blank">GPLv3</a></p>
                    <p>Copyright (c) 2024 <a class="underline hover:text-gray-500 rounded-lg" href="https://github.com/3urobeat" target="_blank">3urobeat</a></p>
                </div>
            </footer>
        </nav>

        <!-- The main content itself, pushed to the side by the navbar - The extra lg: tags in :class fix a bg color bug when the window is resized while the navbar was open - The lg:pr-48 param subtracts the navbar (a bit hacky) -->
        <main
            :class="showNavbar ? 'opacity-30 dark:opacity-70 lg:bg-bg-light lg:dark:bg-bg-dark lg:opacity-100 lg:dark:opacity-100' : ''"
            class="z-10 min-w-screen w-screen min-h-screen px-5 pt-3 bg-bg-light dark:bg-bg-dark dark:text-text-dark transition-all duration-500 lg:pr-48"
            @click="showNavbar = false"
        >
            <div :class="showNavbar ? 'fixed w-screen h-screen opacity-0 lg:w-0 lg:h-0' : ''" class="z-50"></div> <!-- Dummy to prevent NuxtPage button presses when the navbar is open -->
            <NuxtPage></NuxtPage> <!-- Links to index.vue -->
        </main>

    </div>

</template>


<script setup lang="ts">
    import { PhList, PhCaretLeft, PhDetective, PhMoon, PhSun, PhHouse, PhGitFork, PhGear } from "@phosphor-icons/vue";
    import packagejson from "./package.json";

    const route = useRoute();


    // Refs
    const showNavbar      = ref(false);
    const darkModeEnabled = ref(false);


    // Executed on page load
    onMounted(() => {

        // Enable dark mode if user had it enabled on the last visit (yeah, it is a string)
        if (localStorage.darkModeEnabled == "true") setDarkMode(true);

    });


    // Enables or disables dark mode
    function setDarkMode(enable: boolean) {
        console.log("setDarkMode: Set to " + enable);

        darkModeEnabled.value = enable;

        // Save to localstorage so that it will be saved when reloading the page
        localStorage.darkModeEnabled = enable;

        // Tell tailwind to get crackin
        if (enable) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }


    // Specify page information
    useSeoMeta({
        title: "Git Anon",
        ogTitle: "Git Anon",
        description: "Track personal commit statistics without sharing company code",
        ogDescription: "Track personal commit statistics without sharing company code",
        //ogImage: ""
    });
</script>
