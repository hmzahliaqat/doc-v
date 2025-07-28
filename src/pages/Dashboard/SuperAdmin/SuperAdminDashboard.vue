<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/modules/user';

const authStore = useAuthStore();
const username = ref('');

onMounted(() => {
  if (authStore.user) {
    username.value = authStore.user.name;
  }
});
</script>

<template>
  <div class="super-admin-dashboard">
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
      
      <div class="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6">
          <h2 class="text-lg leading-6 font-medium text-gray-900">
            Welcome, {{ username }}
          </h2>
          <p class="mt-1 max-w-2xl text-sm text-gray-500">
            You are logged in as a Super Administrator
          </p>
        </div>
        
        <div class="border-t border-gray-200">
          <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <div class="text-sm font-medium text-gray-500">
              Role
            </div>
            <div class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {{ authStore.userRole }}
            </div>
          </div>
        </div>
        
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            Admin Actions
          </h3>
          <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="px-4 py-5 sm:p-6">
                <h4 class="text-lg font-medium text-gray-900">User Management</h4>
                <p class="mt-1 text-sm text-gray-500">
                  Manage users and their permissions
                </p>
                <button type="button" class="mt-3 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Manage Users
                </button>
              </div>
            </div>
            
            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="px-4 py-5 sm:p-6">
                <h4 class="text-lg font-medium text-gray-900">User Reports</h4>
                <p class="mt-1 text-sm text-gray-500">
                  View user activity and registration reports
                </p>
                <router-link 
                  to="/super-admin/reports" 
                  class="mt-3 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  View Reports
                </router-link>
              </div>
            </div>
            
            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="px-4 py-5 sm:p-6">
                <h4 class="text-lg font-medium text-gray-900">System Settings</h4>
                <p class="mt-1 text-sm text-gray-500">
                  Configure system-wide settings
                </p>
                <button type="button" class="mt-3 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.super-admin-dashboard {
  min-height: calc(100vh - 64px);
  background-color: #f9fafb;
}
</style>