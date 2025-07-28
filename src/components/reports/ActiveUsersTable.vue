<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
});

// Computed property to get activity types for the legend
const activityTypes = computed(() => {
  if (!props.data || !props.data.users) return [];
  
  // Collect all unique activity types from all users
  const types = new Set();
  props.data.users.forEach(user => {
    if (user.activity_breakdown) {
      Object.keys(user.activity_breakdown).forEach(type => {
        types.add(type);
      });
    }
  });
  
  return Array.from(types);
});

// Function to get activity count for a specific type
function getActivityCount(user, type) {
  if (!user.activity_breakdown || !user.activity_breakdown[type]) {
    return 0;
  }
  return user.activity_breakdown[type];
}

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
</script>

<template>
  <div class="bg-white p-4 rounded-lg shadow">
    <div class="mb-4">
      <h3 class="text-lg font-medium text-gray-900">Most Active Users</h3>
      <p class="text-sm text-gray-500">
        {{ props.data.activity_type === 'all' ? 'All activities' : props.data.activity_type }} from 
        {{ formatDate(props.data.start_date) }} to {{ formatDate(props.data.end_date) }}
      </p>
    </div>
    
    <!-- Activity Legend -->
    <div v-if="activityTypes.length > 0" class="mb-4 flex flex-wrap gap-4">
      <div v-for="type in activityTypes" :key="type" class="flex items-center">
        <span class="w-3 h-3 rounded-full mr-2" :style="{ backgroundColor: getActivityColor(type) }"></span>
        <span class="text-sm text-gray-700 capitalize">{{ type }}</span>
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
              Total Activity
            </th>
            <th v-for="type in activityTypes" :key="type" scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {{ type }}
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
              <div class="text-sm text-gray-900 font-medium">{{ user.total_activity }}</div>
            </td>
            <td v-for="type in activityTypes" :key="`${user.id}-${type}`" class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ getActivityCount(user, type) }}</div>
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
      <p class="text-gray-500">No active users data available</p>
    </div>
  </div>
</template>

<script lang="ts">
// Activity type color mapping
function getActivityColor(type) {
  const colorMap = {
    uploaded: '#4f46e5', // indigo
    shared: '#10b981',   // emerald
    viewed: '#f59e0b',   // amber
    downloaded: '#ef4444', // red
    signed: '#8b5cf6',   // purple
    default: '#6b7280'   // gray
  };
  
  return colorMap[type] || colorMap.default;
}
</script>

<style scoped>
/* Add any component-specific styles here */
</style>