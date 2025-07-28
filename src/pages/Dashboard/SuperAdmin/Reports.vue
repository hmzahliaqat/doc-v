<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUserApi } from '@/composables/user';
import { useLoading } from '@/composables/loading';
import RegistrationTrendsChart from '@/components/reports/RegistrationTrendsChart.vue';
import ActiveUsersTable from '@/components/reports/ActiveUsersTable.vue';
import StorageUsageTable from '@/components/reports/StorageUsageTable.vue';

// Loading state
const isLoading = ref(false);

const { getRegistrationTrends, getActiveUsers, getStorageUsage } = useUserApi();
const { showLoading, hideLoading } = useLoading();

// State for registration trends
const registrationData = ref(null);
const selectedPeriod = ref('monthly');
const periodOptions = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' }
];

// State for active users
const activeUsersData = ref(null);
const userLimit = ref(10);
const activityType = ref(null);
const activityTypeOptions = [
  { value: null, label: 'All Activities' },
  { value: 'uploads', label: 'Uploads' },
  { value: 'shares', label: 'Shares' }
];

// State for storage usage
const storageData = ref(null);
const storageLimit = ref(10);
const sortOrder = ref('desc');

// Date range filters
const startDate = ref(null);
const endDate = ref(null);

// Active tab
const activeTab = ref('registration');

// Fetch registration trends data
async function fetchRegistrationTrends() {
  try {
    isLoading.value = true;
    showLoading('Loading registration trends...');
    const data = await getRegistrationTrends(selectedPeriod.value, startDate.value, endDate.value);
    registrationData.value = data;
  } catch (error) {
    console.error('Error fetching registration trends:', error);
  } finally {
    hideLoading();
    isLoading.value = false;
  }
}

// Fetch active users data
async function fetchActiveUsers() {
  try {
    isLoading.value = true;
    showLoading('Loading active users...');
    const data = await getActiveUsers(userLimit.value, startDate.value, endDate.value, activityType.value);
    activeUsersData.value = data;
  } catch (error) {
    console.error('Error fetching active users:', error);
  } finally {
    hideLoading();
    isLoading.value = false;
  }
}

// Fetch storage usage data
async function fetchStorageUsage() {
  try {
    isLoading.value = true;
    showLoading('Loading storage usage...');
    const data = await getStorageUsage(storageLimit.value, sortOrder.value);
    storageData.value = data;
  } catch (error) {
    console.error('Error fetching storage usage:', error);
  } finally {
    hideLoading();
    isLoading.value = false;
  }
}

// Handle period change
function handlePeriodChange() {
  fetchRegistrationTrends();
}

// Handle activity type change
function handleActivityTypeChange() {
  fetchActiveUsers();
}

// Handle sort order change
function handleSortOrderChange() {
  fetchStorageUsage();
}

// Handle tab change
function setActiveTab(tab) {
  activeTab.value = tab;
  
  // Fetch data for the selected tab if not already loaded
  if (tab === 'registration' && !registrationData.value) {
    fetchRegistrationTrends();
  } else if (tab === 'activeUsers' && !activeUsersData.value) {
    fetchActiveUsers();
  } else if (tab === 'storage' && !storageData.value) {
    fetchStorageUsage();
  }
}

// Apply date filters
function applyDateFilters() {
  if (activeTab.value === 'registration') {
    fetchRegistrationTrends();
  } else if (activeTab.value === 'activeUsers') {
    fetchActiveUsers();
  }
}

// Reset date filters
function resetDateFilters() {
  startDate.value = null;
  endDate.value = null;
  applyDateFilters();
}

onMounted(() => {
  // Load initial data for the active tab
  setActiveTab('registration');
});
</script>

<template>
  <div class="reports-dashboard">
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <!-- Breadcrumbs -->
      <nav class="flex mb-4" aria-label="Breadcrumb">
        <ol class="inline-flex items-center space-x-1 md:space-x-3">
          <li class="inline-flex items-center">
            <router-link to="/super-admin-dashboard" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-indigo-600">
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
              </svg>
              Dashboard
            </router-link>
          </li>
          <li aria-current="page">
            <div class="flex items-center">
              <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
              </svg>
              <span class="ml-1 text-sm font-medium text-gray-500 md:ml-2">User Reports</span>
            </div>
          </li>
        </ol>
      </nav>
      
      <h1 class="text-3xl font-bold text-gray-900">User Reports</h1>
      
      <!-- Tabs -->
      <div class="mt-6 border-b border-gray-200">
        <nav class="-mb-px flex flex-wrap md:flex-nowrap space-x-0 md:space-x-8" aria-label="Tabs">
          <button
            @click="setActiveTab('registration')"
            :class="[
              activeTab === 'registration'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex-1 md:flex-none text-center md:text-left'
            ]"
          >
            Registration Trends
          </button>
          <button
            @click="setActiveTab('activeUsers')"
            :class="[
              activeTab === 'activeUsers'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex-1 md:flex-none text-center md:text-left'
            ]"
          >
            Active Users
          </button>
          <button
            @click="setActiveTab('storage')"
            :class="[
              activeTab === 'storage'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex-1 md:flex-none text-center md:text-left'
            ]"
          >
            Storage Usage
          </button>
        </nav>
      </div>
      
      <!-- Date Range Filters (for Registration and Active Users) -->
      <div v-if="activeTab !== 'storage'" class="mt-4 bg-white p-4 rounded-lg shadow">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label for="start-date" class="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              id="start-date"
              v-model="startDate"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label for="end-date" class="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              id="end-date"
              v-model="endDate"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div class="flex space-x-2">
            <button
              @click="applyDateFilters"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Apply
            </button>
            <button
              @click="resetDateFilters"
              class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
      
      <!-- Registration Trends Tab -->
      <div v-if="activeTab === 'registration'" class="mt-4">
        <div class="bg-white p-4 rounded-lg shadow mb-4">
          <div class="flex justify-between items-center">
            <h2 class="text-lg font-medium text-gray-900">Registration Trends</h2>
            <div>
              <label for="period" class="sr-only">Period</label>
              <select
                id="period"
                v-model="selectedPeriod"
                @change="handlePeriodChange"
                class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option v-for="option in periodOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </div>
          </div>
        </div>
        
        <RegistrationTrendsChart v-if="registrationData" :data="registrationData" />
        
        <div v-else-if="isLoading" class="bg-white p-8 rounded-lg shadow text-center">
          <div class="flex justify-center items-center">
            <svg class="animate-spin -ml-1 mr-3 h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="text-gray-500">Loading registration data...</p>
          </div>
        </div>
        
        <div v-else class="bg-white p-8 rounded-lg shadow text-center">
          <p class="text-gray-500">No registration data available</p>
        </div>
      </div>
      
      <!-- Active Users Tab -->
      <div v-if="activeTab === 'activeUsers'" class="mt-4">
        <div class="bg-white p-4 rounded-lg shadow mb-4">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <h2 class="text-lg font-medium text-gray-900">Most Active Users</h2>
            <div class="flex space-x-4">
              <div>
                <label for="activity-type" class="sr-only">Activity Type</label>
                <select
                  id="activity-type"
                  v-model="activityType"
                  @change="handleActivityTypeChange"
                  class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option v-for="option in activityTypeOptions" :key="option.value" :value="option.value">
                    {{ option.label }}
                  </option>
                </select>
              </div>
              <div>
                <label for="user-limit" class="sr-only">Limit</label>
                <select
                  id="user-limit"
                  v-model="userLimit"
                  @change="fetchActiveUsers"
                  class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option :value="5">Top 5</option>
                  <option :value="10">Top 10</option>
                  <option :value="20">Top 20</option>
                  <option :value="50">Top 50</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        <ActiveUsersTable v-if="activeUsersData" :data="activeUsersData" />
        
        <div v-else-if="isLoading" class="bg-white p-8 rounded-lg shadow text-center">
          <div class="flex justify-center items-center">
            <svg class="animate-spin -ml-1 mr-3 h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="text-gray-500">Loading active users data...</p>
          </div>
        </div>
        
        <div v-else class="bg-white p-8 rounded-lg shadow text-center">
          <p class="text-gray-500">No active users data available</p>
        </div>
      </div>
      
      <!-- Storage Usage Tab -->
      <div v-if="activeTab === 'storage'" class="mt-4">
        <div class="bg-white p-4 rounded-lg shadow mb-4">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <h2 class="text-lg font-medium text-gray-900">Storage Usage by User</h2>
            <div class="flex space-x-4">
              <div>
                <label for="sort-order" class="sr-only">Sort Order</label>
                <select
                  id="sort-order"
                  v-model="sortOrder"
                  @change="handleSortOrderChange"
                  class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="desc">Highest First</option>
                  <option value="asc">Lowest First</option>
                </select>
              </div>
              <div>
                <label for="storage-limit" class="sr-only">Limit</label>
                <select
                  id="storage-limit"
                  v-model="storageLimit"
                  @change="fetchStorageUsage"
                  class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option :value="5">Top 5</option>
                  <option :value="10">Top 10</option>
                  <option :value="20">Top 20</option>
                  <option :value="50">Top 50</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        <StorageUsageTable v-if="storageData" :data="storageData" />
        
        <div v-else-if="isLoading" class="bg-white p-8 rounded-lg shadow text-center">
          <div class="flex justify-center items-center">
            <svg class="animate-spin -ml-1 mr-3 h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="text-gray-500">Loading storage usage data...</p>
          </div>
        </div>
        
        <div v-else class="bg-white p-8 rounded-lg shadow text-center">
          <p class="text-gray-500">No storage usage data available</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.reports-dashboard {
  min-height: calc(100vh - 64px);
  background-color: #f9fafb;
}
</style>