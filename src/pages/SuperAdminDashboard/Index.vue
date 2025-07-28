<script setup>
import { ref, onMounted } from "vue";
import { useDashboardApi } from "@/composables/dashboard";

const { getData } = useDashboardApi();   
const documents = ref();
const employees = ref();
const pending_signatures = ref();
const completed_signatures = ref();
const documents_shared = ref();
const recent_documents = ref();
const logs = ref();

onMounted(async() => {
  const DocumentData = await getData();

  documents.value = DocumentData.total_documents;
  employees.value = DocumentData.total_employees;
  pending_signatures.value = DocumentData.pending_signatures;
  completed_signatures.value = DocumentData.completed_signatures;
  documents_shared.value = DocumentData.documents_shared;
  recent_documents.value = DocumentData.recent_documents;
  logs.value = DocumentData.logs;
});
</script>

<template>
  <div class="">
    <!-- Main Content -->
    <div class="">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-2xl font-bold text-gray-800">Super Admin Dashboard</h1>
        <div class="flex items-center">
          <div class="relative">
            <input
              type="text"
              placeholder="Search..."
              class="px-4 py-2 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <svg
              class="w-5 h-5 text-gray-400 absolute right-3 top-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <h2 class="text-sm font-medium text-gray-500">Total Documents</h2>
            <div class="p-2 bg-blue-100 rounded-md">
              <svg
                class="w-6 h-6 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                ></path>
              </svg>
            </div>
          </div>
          <div class="mt-4">
            <span class="text-3xl font-bold text-gray-800">{{ documents }}</span>
            <p class="mt-1 text-sm text-gray-500">Total documents in system</p>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <h2 class="text-sm font-medium text-gray-500">Pending Signatures</h2>
            <div class="p-2 bg-orange-100 rounded-md">
              <svg
                class="w-6 h-6 text-orange-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                ></path>
              </svg>
            </div>
          </div>
          <div class="mt-4">
            <span class="text-3xl font-bold text-gray-800">{{ pending_signatures }}</span>
            <p class="mt-1 text-sm text-gray-500">Awaiting signatures</p>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <h2 class="text-sm font-medium text-gray-500">Active Employees</h2>
            <div class="p-2 bg-green-100 rounded-md">
              <svg
                class="w-6 h-6 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                ></path>
              </svg>
            </div>
          </div>
          <div class="mt-4">
            <span class="text-3xl font-bold text-gray-800">{{ employees }}</span>
            <p class="mt-1 text-sm text-gray-500">Total employees</p>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <h2 class="text-sm font-medium text-gray-500">Completed Signatures</h2>
            <div class="p-2 bg-purple-100 rounded-md">
              <svg
                class="w-6 h-6 text-purple-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
          </div>
          <div class="mt-4">
            <span class="text-3xl font-bold text-gray-800">{{ completed_signatures }}</span>
            <p class="mt-1 text-sm text-gray-500">Completed signatures</p>
          </div>
        </div>
      </div>

      <!-- Super Admin Controls -->
      <div class="bg-white rounded-lg shadow p-6 mb-8">
        <h2 class="text-lg font-medium text-gray-800 mb-4">Super Admin Controls</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button class="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Add New User
          </button>
          <button class="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            System Settings
          </button>
          <button class="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
            Purge Logs
          </button>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="bg-white rounded-lg shadow-md">
        <div class="flex items-center justify-between p-6 border-b">
          <h2 class="text-lg font-medium text-gray-800">System Activity</h2>
        </div>
        <div class="p-6">
          <div class="space-y-4">
            <div v-for="log in logs" class="flex items-start">
              <div class="flex-shrink-0">
                <div
                  class="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-medium"
                >
                  SA
                </div>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-gray-800">
                  {{ log?.user?.name }} {{ log?.action }}
                  <span class="font-semibold">{{ log?.document?.name }}</span>
                </p>
                <p class="text-xs text-gray-500">{{ log?.created_at }}</p>
              </div>
            </div>
          </div>
          <button
            class="mt-4 w-full py-2 text-sm text-indigo-600 hover:text-indigo-800 text-center"
          >
            View All Activity
          </button>
        </div>
      </div>
    </div>
  </div>
</template>