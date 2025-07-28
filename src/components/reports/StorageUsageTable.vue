<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
});

// Compute total storage used
const totalStorageBytes = computed(() => {
  if (!props.data || !props.data.users) return 0;
  return props.data.users.reduce((total, user) => total + user.storage_used_bytes, 0);
});

const totalStorageFormatted = computed(() => {
  return formatBytes(totalStorageBytes.value);
});

// Function to format date
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
}

// Function to format bytes (copied from backend for consistency)
function formatBytes(bytes, precision = 2) {
  if (bytes === 0) return '0 B';
  
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(precision)) + ' ' + units[i];
}

// Calculate percentage of total storage
function calculatePercentage(bytes) {
  if (!totalStorageBytes.value || !bytes) return 0;
  return (bytes / totalStorageBytes.value) * 100;
}
</script>

<template>
  <div class="bg-white p-4 rounded-lg shadow">
    <div class="mb-4">
      <h3 class="text-lg font-medium text-gray-900">Storage Usage by User</h3>
      <p class="text-sm text-gray-500">
        Sorted by {{ props.data.sort_by === 'desc' ? 'highest' : 'lowest' }} usage first
      </p>
    </div>
    
    <!-- Storage Summary -->
    <div class="mb-6 p-4 bg-gray-50 rounded-lg">
      <div class="text-center">
        <h4 class="text-base font-medium text-gray-700">Total Storage Used</h4>
        <p class="text-2xl font-bold text-indigo-600 mt-1">{{ totalStorageFormatted }}</p>
        <p class="text-sm text-gray-500 mt-1">Across {{ props.data.users ? props.data.users.length : 0 }} users</p>
      </div>
    </div>
    
    <!-- Users Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              User
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Storage Used
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Documents
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              % of Total
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Joined
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="(user, index) in props.data.users" :key="user.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-gray-100 rounded-full">
                  <span class="text-gray-500 font-medium">{{ user.name.charAt(0).toUpperCase() }}</span>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                  <div class="text-sm text-gray-500">{{ user.email }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ user.storage_used_formatted }}</div>
              <div class="text-xs text-gray-500">{{ user.storage_used_bytes.toLocaleString() }} bytes</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ user.document_count }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    class="bg-indigo-600 h-2.5 rounded-full" 
                    :style="{ width: `${calculatePercentage(user.storage_used_bytes)}%` }"
                  ></div>
                </div>
                <span class="ml-2 text-sm text-gray-700">{{ calculatePercentage(user.storage_used_bytes).toFixed(1) }}%</span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(user.created_at) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- No data message -->
    <div v-if="!props.data.users || props.data.users.length === 0" class="py-8 text-center">
      <p class="text-gray-500">No storage usage data available</p>
    </div>
  </div>
</template>

<style scoped>
/* Add any component-specific styles here */
</style>