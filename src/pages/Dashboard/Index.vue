<script setup>
import { ref, onMounted } from "vue";
import LineStyleChart from "./Components/LineStyleChart.vue";
import PieChart from "./Components/PieChart.vue";
import { useDashboardApi } from "@/composables/dashboard";
import EmailVerificationBanner from '@/components/EmailVerificationBanner.vue';

const { getData } = useDashboardApi();   
const documents = ref();
const employees = ref();
const  pending_signatures = ref();
const completed_signatures = ref();
const documents_shared = ref();
const recent_documents = ref();
const logs = ref();

// const props = defineProps([
//   "documents",
//   "employees",
//   "pending_signatures",
//   "completed_signatures",
//   "documents_shared",
//   "recent_documents",
//   "logs",
// ]);

const getLogsMessages = (action, user) => {
  switch (action) {
    case "uploaded":
      return `${user} uploaded `;
    case "shared":
      return `${user} shared`;
    case "signed":
      return `${user} signed `;
    case "downloaded":
      return `${user} downloaded`;
    default:
      return "";
  }
};

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
        <h1 class="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
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

      <!-- Email Verification Banner -->
      <EmailVerificationBanner class="mb-8" />

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
            <!-- <span class="ml-2 text-sm text-green-500">+12%</span> -->
            <p class="mt-1 text-sm text-gray-500">Since last month</p>
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
            <span class="text-3xl font-bold text-gray-800">{{
              pending_signatures
            }}</span>
            <!-- <span class="ml-2 text-sm text-red-500">+4%</span> -->
            <p class="mt-1 text-sm text-gray-500">Since last week</p>
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
            <!-- <span class="ml-2 text-sm text-green-500">+2%</span> -->
            <p class="mt-1 text-sm text-gray-500">Since last month</p>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <h2 class="text-sm font-medium text-gray-500">Documents Shared</h2>
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
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                ></path>
              </svg>
            </div>
          </div>
          <div class="mt-4">
            <span class="text-3xl font-bold text-gray-800">{{
              documents_shared
            }}</span>
            <!-- <span class="ml-2 text-sm text-green-500">+18%</span> -->
            <p class="mt-1 text-sm text-gray-500">Since last month</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="md:col-span-1">
          <PieChart
            :pending_signatures="pending_signatures"
            :completed_signatures="completed_signatures"
            :documents_shared="documents_shared"
          />
        </div>
        <div class="md:col-span-2">
          <LineStyleChart
            :pending_signatures="pending_signatures"
            :completed_signatures="completed_signatures"
            :total_documents="documents"
          />
        </div>
      </div>

      <!-- Recent Documents and Signature Activity -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <!-- Recent Documents -->
<!--        <div class="bg-white rounded-lg shadow col-span-2">-->
<!--          <div class="flex items-center justify-between p-6 border-b">-->
<!--            <h2 class="text-lg font-medium text-gray-800">Recent Documents</h2>-->
<!--            <button class="text-sm text-indigo-600 hover:text-indigo-800">-->
<!--              View All-->
<!--            </button>-->
<!--          </div>-->
<!--          <div class="p-6">-->
<!--            <div class="overflow-x-auto">-->
<!--              <table class="min-w-full">-->
<!--                <thead>-->
<!--                  <tr>-->
<!--                    <th-->
<!--                      class="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"-->
<!--                    >-->
<!--                      Document-->
<!--                    </th>-->
<!--                    <th-->
<!--                      class="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"-->
<!--                    >-->
<!--                      Status-->
<!--                    </th>-->
<!--                    <th-->
<!--                      class="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"-->
<!--                    >-->
<!--                      Owner-->
<!--                    </th>-->
<!--                    <th-->
<!--                      class="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"-->
<!--                    >-->
<!--                      Last Updated-->
<!--                    </th>-->
<!--                  </tr>-->
<!--                </thead>-->
<!--                <tbody class="divide-y divide-gray-200">-->
<!--                  <tr v-for="documents in recent_documents" :key="documents.id">-->
<!--                    <td class="py-3 px-4">-->
<!--                      <div class="flex items-center">-->
<!--                        <svg-->
<!--                          class="w-5 h-5 mr-3 text-gray-500"-->
<!--                          fill="none"-->
<!--                          stroke="currentColor"-->
<!--                          viewBox="0 0 24 24"-->
<!--                          xmlns="http://www.w3.org/2000/svg"-->
<!--                        >-->
<!--                          <path-->
<!--                            stroke-linecap="round"-->
<!--                            stroke-linejoin="round"-->
<!--                            stroke-width="2"-->
<!--                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"-->
<!--                          ></path>-->
<!--                        </svg>-->
<!--                        <span class="text-gray-800">{{ documents?.name }}</span>-->
<!--                      </div>-->
<!--                    </td>-->
<!--                    <td class="py-3 px-4">-->
<!--                      <span-->
<!--                        class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs"-->
<!--                        >Uploaded</span-->
<!--                      >-->
<!--                    </td>-->
<!--                    <td class="py-3 px-4 text-gray-500">{{ documents?.user?.name }}</td>-->
<!--                    <td class="py-3 px-4 text-gray-500">-->
<!--                      {{-->
<!--                        documents?.updated_at-->
<!--                          ? documents?.updated_at-->
<!--                          : documents?.created_at-->
<!--                      }}-->
<!--                    </td>-->
<!--                  </tr>-->
<!--                </tbody>-->
<!--              </table>  -->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->

        <!-- Signature Activity -->
        <div class="bg-white rounded-lg shadow-md mt-4">
          <div class="flex items-center justify-between p-6 border-b">
            <h2 class="text-lg font-medium text-gray-800">Signature Activity</h2>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div v-for="log in logs" class="flex items-start">
                <div class="flex-shrink-0">
                  <div
                    class="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-medium"
                  >
                    JD
                  </div>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-800">
                    {{ getLogsMessages(log?.action, log?.user?.name) }}
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

      <!-- Document Categories and Pending Signatures -->
    </div>
  </div>
</template>


