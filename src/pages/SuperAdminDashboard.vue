<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import {AppHeader } from '@/components/layout';
import { useAuthStore } from '@/stores/modules/user';

const router = useRouter();
const routeCurrent = ref<string>('');
const appKey = ref<string | null>(null);
const authStore = useAuthStore();

// Get the app key from the auth store if available
if (authStore.user && authStore.user.key) {
  appKey.value = authStore.user.key;
}

router.beforeEach((to, from) => {
  routeCurrent.value = String(to.name);
});
</script>

<template>
  <div class="super-admin-dashboard">
    <app-header :currentRoute="routeCurrent" />
    
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
      
      <div class="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6">
          <h2 class="text-lg leading-6 font-medium text-gray-900">Admin Controls</h2>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">
            Welcome to the super admin dashboard. You have access to special administrative functions.
          </p>
        </div>
        <div class="border-t border-gray-200">
          <dl>
            <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Application Key</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {{ appKey }}
              </dd>
            </div>
            <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">User Management</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <button 
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Manage Users
                </button>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.super-admin-dashboard {
  min-height: 100vh;
  background-color: #f3f4f6;
}
</style>