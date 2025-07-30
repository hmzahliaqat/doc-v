<script setup>
import { ref, nextTick } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/modules/user.js";
import { useConfigStore } from "@/stores";
const props = defineProps(['currentRoute']);

const authStore = useAuthStore();
const configStore = useConfigStore();
const router = useRouter();

const logoutUser = async () => {
  await authStore.logoutUser();

  window.location.reload();

  // Add a small delay to ensure all state changes are processed
  setTimeout(() => {
    router.push('/'); // Redirect to root path instead of login
  }, 100);
};

const dropdownOpen = ref(false);
const mobileMenuOpen = ref(false);

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

const closeDropdown = () => {
  dropdownOpen.value = false;
};

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
};

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
</script>

<template>
  <nav class="bg-gray-800">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <!-- Logo + Nav Links -->
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <img class="h-12 w-40" :src="configStore.logos.header" alt="eSignature" />
          </div>
          <div class="hidden md:block">
            <div class="ml-10 flex items-baseline space-x-4">
              <router-link to="/dashboard">
                <a :class="[
                  currentRoute === 'home'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                  'rounded-md px-3 py-2 text-sm font-medium'
                ]">Dashboard</a>
              </router-link>

              <router-link v-if="authStore.role !== 'super-admin'" to="/employees">
                <a :class="[
                  currentRoute === 'employees'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                  'rounded-md px-3 py-2 text-sm font-medium'
                ]">Employees</a>
              </router-link>

              <router-link v-if="authStore.role !== 'super-admin'" to="/documents">
                <a :class="[
                  currentRoute === 'documents'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                  'rounded-md px-3 py-2 text-sm font-medium'
                ]">Documents</a>
              </router-link>

              <router-link v-if="authStore.role !== 'super-admin'" to="/track-document">
                <a :class="[
                  currentRoute === 'track-document'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                  'rounded-md px-3 py-2 text-sm font-medium'
                ]">Track</a>
              </router-link>

<!--              <router-link v-if="authStore.role == 'super-admin'" to="/track-document">-->
<!--                <a :class="[-->
<!--                  currentRoute === 'track-document'-->
<!--                    ? 'bg-gray-900 text-white'-->
<!--                    : 'text-gray-300 hover:bg-gray-700 hover:text-white',-->
<!--                  'rounded-md px-3 py-2 text-sm font-medium'-->
<!--                ]">Plans</a>-->
<!--              </router-link>-->
              <router-link v-if="authStore.role == 'super-admin'" to="/company-overview">
                <a :class="[
                  currentRoute === 'company-overview'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                  'rounded-md px-3 py-2 text-sm font-medium'
                ]">Company Overview</a>
              </router-link>
            </div>
          </div>
        </div>

        <!-- Right Side (Profile + Notifications) - Desktop -->
        <div class="hidden md:block">
          <div class="ml-4 flex items-center md:ml-6">
            <!-- Notification -->
            <button type="button" class="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
              <span class="sr-only">View notifications</span>
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9a6 6 0 00-12 0v.75a8.967 8.967 0 01-2.312 6.022 23.848 23.848 0 005.454 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
            </button>

            <!-- Profile Dropdown -->
            <div class="relative ml-3" v-click-outside="closeDropdown">
              <button @click="toggleDropdown" type="button" class="relative flex items-center rounded-md px-3 py-2 text-sm text-white focus:outline-none cursor-pointer">
                <div class="flex flex-col">
                  <span class="font-medium">{{ authStore.user?.name || 'User' }}</span>
                  <span class="text-xs text-gray-300">{{ authStore.user?.email || 'No email' }}</span>
                </div>
                <svg class="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div v-if="dropdownOpen" class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <router-link to="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Profile</router-link>
                <a @click="logoutUser" class="block cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sign out</a>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile Menu Button -->
        <div class="-mr-2 flex md:hidden">
          <button @click="toggleMobileMenu" type="button" class="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
            <span class="sr-only">Open main menu</span>
            <!-- Menu open: "hidden", Menu closed: "block" -->
            <svg v-if="!mobileMenuOpen" class="block h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
            </svg>
            <!-- Menu open: "block", Menu closed: "hidden" -->
            <svg v-if="mobileMenuOpen" class="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-if="mobileMenuOpen" class="md:hidden">
      <div class="space-y-1 px-2 pb-3 pt-2 sm:px-3">
        <!-- Mobile Navigation Links -->
        <router-link to="/dashboard" @click="closeMobileMenu">
          <a :class="[
            currentRoute === 'home'
              ? 'bg-gray-900 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white',
            'block rounded-md px-3 py-2 text-base font-medium'
          ]">Dashboard</a>
        </router-link>

        <router-link v-if="authStore.role !== 'super-admin'" to="/employees" @click="closeMobileMenu">
          <a :class="[
            currentRoute === 'employees'
              ? 'bg-gray-900 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white',
            'block rounded-md px-3 py-2 text-base font-medium'
          ]">Employees</a>
        </router-link>

        <router-link v-if="authStore.role !== 'super-admin'" to="/documents" @click="closeMobileMenu">
          <a :class="[
            currentRoute === 'documents'
              ? 'bg-gray-900 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white',
            'block rounded-md px-3 py-2 text-base font-medium'
          ]">Documents</a>
        </router-link>

        <router-link v-if="authStore.role !== 'super-admin'" to="/track-document" @click="closeMobileMenu">
          <a :class="[
            currentRoute === 'track-document'
              ? 'bg-gray-900 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white',
            'block rounded-md px-3 py-2 text-base font-medium'
          ]">Track</a>
        </router-link>



        <router-link v-if="authStore.role == 'super-admin'" to="/company-overview" @click="closeMobileMenu">
          <a :class="[
            currentRoute === 'company-overview'
              ? 'bg-gray-900 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white',
            'block rounded-md px-3 py-2 text-base font-medium'
          ]">Company Overview</a>
        </router-link>

<!--        <router-link v-if="authStore.role == 'super-admin'" to="/track-document" @click="closeMobileMenu">-->
<!--          <a :class="[-->
<!--            currentRoute === 'track-document'-->
<!--              ? 'bg-gray-900 text-white'-->
<!--              : 'text-gray-300 hover:bg-gray-700 hover:text-white',-->
<!--            'block rounded-md px-3 py-2 text-base font-medium'-->
<!--          ]">Plans</a>-->
<!--        </router-link>-->
      </div>

      <!-- Mobile Profile Section -->
      <div class="border-t border-gray-700 pb-3 pt-4">
        <div class="flex items-center px-5">
          <div class="flex-shrink-0">
            <div class="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center">
              <span class="text-sm font-medium text-white">
                {{ (authStore.user?.name || 'U').charAt(0).toUpperCase() }}
              </span>
            </div>
          </div>
          <div class="ml-3">
            <div class="text-base font-medium leading-none text-white">{{ authStore.user?.name || 'User' }}</div>
            <div class="text-sm font-medium leading-none text-gray-400 mt-1">{{ authStore.user?.email || 'No email' }}</div>
          </div>
          <!-- Mobile Notification Button -->
          <button type="button" class="ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
            <span class="sr-only">View notifications</span>
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9a6 6 0 00-12 0v.75a8.967 8.967 0 01-2.312 6.022 23.848 23.848 0 005.454 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
          </button>
        </div>
        <div class="mt-3 space-y-1 px-2">
          <router-link to="/profile" @click="closeMobileMenu" class="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white">Your Profile</router-link>
          <a @click="logoutUser" class="block cursor-pointer rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white">Sign out</a>
        </div>
      </div>
    </div>
  </nav>

  <!-- Page Header -->
  <header class="bg-white shadow-sm">
    <div class="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
      <h1 class="text-lg font-semibold leading-6 text-gray-900">
        {{ capitalize(currentRoute) }}
      </h1>
    </div>
  </header>
</template>