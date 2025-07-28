<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/modules/user';

const authStore = useAuthStore();

onMounted(() => {
  // Any initialization logic for the super admin dashboard
  console.log('Super Admin Dashboard mounted');
});
</script>

<template>
  <div class="super-admin-dashboard">
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="border-4 border-dashed border-gray-200 rounded-lg p-6">
          <h1 class="text-2xl font-semibold text-gray-900 mb-4">Super Admin Dashboard</h1>
          
          <div class="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <div class="px-4 py-5 sm:px-6">
              <h2 class="text-lg leading-6 font-medium text-gray-900">Welcome, {{ authStore.user?.name }}</h2>
              <p class="mt-1 max-w-2xl text-sm text-gray-500">You are logged in as a Super Admin</p>
            </div>
            <div class="border-t border-gray-200">
              <dl>
                <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">Email</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ authStore.user?.email }}</dd>
                </div>
                <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">Role</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ authStore.role }}</dd>
                </div>
              </dl>
            </div>
          </div>
          
          <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <!-- Admin Dashboard Cards -->
            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="px-4 py-5 sm:p-6">
                <h3 class="text-lg font-medium text-gray-900">Users Management</h3>
                <p class="mt-1 text-sm text-gray-500">Manage system users and permissions</p>
              </div>
            </div>
            
            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="px-4 py-5 sm:p-6">
                <h3 class="text-lg font-medium text-gray-900">System Settings</h3>
                <p class="mt-1 text-sm text-gray-500">Configure application settings</p>
              </div>
            </div>
            
            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="px-4 py-5 sm:p-6">
                <h3 class="text-lg font-medium text-gray-900">Reports</h3>
                <p class="mt-1 text-sm text-gray-500">View system reports and analytics</p>
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
}
</style>