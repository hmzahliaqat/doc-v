<script setup>
import { ref } from 'vue';
import { usePdf } from "@/composables/pdf.js";
const emit = defineEmits(['closeDrawer', 'shareEmail'])


const  {shareDocument} = usePdf();
const props = defineProps({
  employees: Array,
  isSharing: Boolean
})

const close = () => {
  emit('closeDrawer')
}

// Static list of employees with additional data
const employeesList = ref(props.employees);

const shareEmployee = (id) =>{
  emit('shareEmail',id)
}

const  isShared = (employee) =>{
}

</script>

<template>
  <div>
    <!-- Drawer Overlay -->
    <div class="relative z-50" aria-labelledby="drawer-title" role="dialog" aria-modal="true">
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" aria-hidden="true"></div>

      <div class="fixed inset-0 overflow-hidden">
        <div class="absolute inset-0 overflow-hidden">
          <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
            <div class="pointer-events-auto relative w-screen max-w-lg transform transition-transform">

              <!-- Close Button -->
              <div class="absolute top-0 left-0 -ml-8 flex pt-6 pr-2 sm:-ml-10 sm:pr-4">
                <button
                  @click="close"
                  type="button"
                  class="relative rounded-full bg-white/10 p-2 text-white/80 hover:text-white hover:bg-white/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  <span class="sr-only">Close panel</span>
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <!-- Drawer Content -->
              <div class="flex h-full flex-col bg-white shadow-2xl">

                <!-- Header -->
                <div class="bg-gradient-to-r from-teal-600 to-teal-600 px-6 py-6">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                      <div>
                        <h2 class="text-lg font-semibold text-white" id="drawer-title">
                          Share with Team
                        </h2>
                        <p class="text-sm text-indigo-100">
                          {{ employees.length }} team members
                        </p>
                      </div>
                    </div>

                    <button

                      :class="[
                        'inline-flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200',
                        allShared
                          ? 'bg-green-500 text-white cursor-not-allowed'
                          : 'bg-white/20 text-white hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50'
                      ]"
                    >
                      <template v-if="allShared">
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                        <span>All Shared</span>
                      </template>
                      <template v-else>
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                        </svg>
                        <span>Share All</span>
                      </template>
                    </button>
                  </div>
                </div>

                <!-- Employee List -->
                <div class="flex-1 overflow-y-auto p-6">
                  <div class="space-y-3">
                    <div
                      v-for="employee in employeesList"
                      :key="employee.id"
                      :class="[
                        'group relative rounded-xl border transition-all duration-200',
                        isShared(employee.id)
                          ? 'border-green-200 bg-green-50'
                          : 'border-gray-200 bg-white hover:border-indigo-200 hover:shadow-md'
                      ]"
                    >
                      <div class="flex items-center justify-between p-4">
                        <div class="flex items-center space-x-3">
                          <!-- Employee Info -->
                          <div>
                            <h3 :class="[
                              'font-medium',
                              isShared(employee.id) ? 'text-green-900' : 'text-gray-900'
                            ]">
                              {{ employee.name }}
                            </h3>
                            <p :class="[
                              'text-sm',
                              isShared(employee.id) ? 'text-green-600' : 'text-gray-500'
                            ]">
                              {{ employee.role }}
                            </p>
                          </div>
                        </div>

                        <!-- Share Button -->
                        <button
                          @click="shareEmployee(employee.id)"
                          :disabled="isShared(employee.id)"
                          :class="[
                            'inline-flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200',
                            isShared(employee.id)
                              ? 'bg-green-100 text-green-700 cursor-not-allowed'
                              : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                          ]"
                        >
                          <template v-if="isShared(employee.id)">
                            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                            </svg>
                            <span>Shared</span>
                          </template>
                          <template v-else>
                            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-11.314A2.25 2.25 0 1 0 15.75 3.75a2.25 2.25 0 0 0-7.284 6.843Z" />
                            </svg>
                            <span>Share</span>
                          </template>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>


              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>