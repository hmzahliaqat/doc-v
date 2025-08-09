<template>
  <div class="card">
    <!-- View Toggle Controls -->
    <div class="flex justify-end mb-4">
      <div class="flex items-center space-x-6">
        <div class="flex items-center">
          <input
            id="employees"
            type="checkbox"
            :checked="activeView === 'employees'"
            @change="setActiveView('employees')"
            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
          />
          <label for="employees" class="ml-2 text-sm font-medium text-gray-700 cursor-pointer">
            Employees
          </label>
        </div>
        <div class="flex items-center">
          <input
            id="documents"
            type="checkbox"
            :checked="activeView === 'documents'"
            @change="setActiveView('documents')"
            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
          />
          <label for="documents" class="ml-2 text-sm font-medium text-gray-700 cursor-pointer">
            Documents
          </label>
        </div>
      </div>
    </div>

    <!-- DataTable - always show, but handle empty state inside -->
    <DataTable
      v-model:expandedRowGroups="expandedRowGroups"
      :value="tableData"
      tableStyle="min-width: 50rem"
      expandableRowGroups
      rowGroupMode="subheader"
      groupRowsBy="companyName"
      @rowgroup-expand="onRowGroupExpand"
      @rowgroup-collapse="onRowGroupCollapse"
    >
      <template #groupheader="slotProps">
        <div class="flex items-center">
          <i class="pi pi-building text-lg mr-2"></i>
          <span class="align-middle ml-2 font-bold leading-normal">{{ slotProps.data.companyName }}</span>
        </div>
      </template>

      <template #empty>
        <div class="text-center py-8">
          <div class="text-gray-500 text-lg mb-4">
            <i class="pi pi-building text-4xl mb-2"></i>
            <p>No company data available</p>
            <p class="text-sm">Please check back later or contact support.</p>
          </div>
        </div>
      </template>

      <Column field="name" :header="activeView === 'employees' ? 'Employee name' : 'Document name'"></Column>
      <Column field="created_at" :header="activeView === 'employees' ? 'Joined' : 'Created'" style="width: 20%"></Column>

      <template #groupfooter="slotProps">
        <div class="flex justify-end font-bold w-full">
          <span v-if="activeView === 'employees'">
            Total Employees: {{ slotProps.data.companyData?.employees?.length || 0 }}
          </span>
          <span v-else-if="activeView === 'documents'">
            Total Documents: {{ slotProps.data.companyData?.documents?.length || 0 }}
          </span>
        </div>
      </template>
    </DataTable>

    <Toast />
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useSuperAdminApi } from '@/composables/superadmin';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';
import Toast from 'primevue/toast';

const { getCompanyWithDetail } = useSuperAdminApi()
const data = ref([]);
const expandedRowGroups = ref();
const toast = useToast();
const activeView = ref('employees');

// Computed property to transform data for DataTable grouping
const tableData = computed(() => {
  if (!data.value || data.value.length === 0) return [];

  let allItems = [];

  data.value.forEach(company => {
    if (activeView.value === 'employees') {
      if (company.employees && company.employees.length > 0) {
        // Add each employee with company name for grouping
        company.employees.forEach(employee => {
          allItems.push({
            ...employee,
            companyName: company.name,
            companyData: company
          });
        });
      } else {
        // Add a placeholder row to show company name even with no employees
        allItems.push({
          name: 'No employees found',
          created_at: '',
          companyName: company.name,
          companyData: company,
          isEmpty: true
        });
      }
    } else if (activeView.value === 'documents') {
      if (company.documents && company.documents.length > 0) {
        // Add each document with company name for grouping
        company.documents.forEach(document => {
          allItems.push({
            ...document,
            companyName: company.name,
            companyData: company
          });
        });
      } else {
        // Add a placeholder row to show company name even with no documents
        allItems.push({
          name: 'No documents found',
          created_at: '',
          companyName: company.name,
          companyData: company,
          isEmpty: true
        });
      }
    }
  });

  return allItems;
});

// Computed property to get employees from data
const employees = computed(() => {
  if (!data.value || data.value.length === 0) return [];
  return data.value.flatMap(company => company.employees || []);
});

const setActiveView = (view) => {
  activeView.value = view;
};

// const onRowGroupExpand = (event) => {
//   toast.add({
//     severity: 'info',
//     summary: 'Row Group Expanded',
//     detail: 'Value: ' + event.data.representative?.name,
//     life: 3000
//   });
// };
//
// const onRowGroupCollapse = (event) => {
//   toast.add({
//     severity: 'success',
//     summary: 'Row Group Collapsed',
//     detail: 'Value: ' + event.data.representative?.name,
//     life: 3000
//   });
// };

const calculateCustomerTotal = (companyName) => {
  if (!data.value || data.value.length === 0) return 0;
  const company = data.value.find(c => c.name === companyName);
  if (activeView.value === 'employees') {
    return company?.employees?.length || 0;
  } else if (activeView.value === 'documents') {
    return company?.documents?.length || 0;
  }
  return 0;
};

const getSeverity = (status) => {
  switch (status) {
    case 'unqualified':
      return 'danger';
    case 'qualified':
      return 'success';
    case 'new':
      return 'info';
    case 'negotiation':
      return 'warn';
    case 'renewal':
      return null;
    case 'proposal':
      return 'warning';
    default:
      return null;
  }
};

onMounted(async () => {
  try {
    const result = await getCompanyWithDetail();
    // Ensure result is an array
    data.value = Array.isArray(result) ? result : [result];
  } catch (error) {
    console.error('Error fetching company data:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load company data',
      life: 5000
    });
  }
});
</script>

<style scoped>
/* Move PrimeVue's default row group toggle to the right corner */
:deep(.p-datatable .p-rowgroup-header) {
  cursor: pointer;
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  width: 100% !important;
}

:deep(.p-datatable .p-rowgroup-header .p-row-toggler) {
  order: 2 !important;
  margin-left: auto !important;
}
</style>