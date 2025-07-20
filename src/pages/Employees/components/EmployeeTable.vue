<template>
    <div>
        <div class="card p-2">
            <Toolbar class="mb-2">
                <template #start>
                    <Button label="New" icon="pi pi-plus" class="mr-2" @click="openNew" />
                    <Button label="Delete" icon="pi pi-trash" severity="danger" outlined @click="confirmDeleteSelected"
                        :disabled="!selectedEmployees || !selectedEmployees.length
                            " />
                </template>

                <template #end>
                    <FileUpload mode="basic" accept=".csv" :maxFileSize="1000000" label="Import" customUpload
                        chooseLabel="Import" class="mr-2" auto :chooseButtonProps="{ severity: 'secondary' }"
                        @uploader="uploadCSV" />
                    <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
                </template>
            </Toolbar>

            <DataTable ref="dt" v-model:selection="selectedEmployees" :value="employees" dataKey="id" :paginator="true"
                :rows="8" :filters="filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[8, 20, 45]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} employees">
                <template #header>
                    <div class="flex flex-wrap gap-2 items-center justify-between">
                        <h4 class="m-0">Manage Employees</h4>
                        <IconField>
                            <InputIcon>
                                <i class="pi pi-search" />
                            </InputIcon>
                            <InputText v-model="filters['global'].value" placeholder="Search..." />
                        </IconField>
                    </div>
                </template>

                <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
                <Column field="id" header="Employee ID" sortable style="min-width: 12rem"></Column>
                <Column field="name" header="Name" sortable style="min-width: 16rem"></Column>

                <Column field="email" header="Email" sortable style="min-width: 10rem"></Column>

                <Column field="created_at" header="Created At" sortable style="min-width: 10rem"></Column>

                <Column :exportable="false" style="min-width: 12rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2"
                            @click="editEmployee(slotProps.data)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger"
                            @click="confirmDeleteEmployee(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="employeeDialog" :style="{ width: '450px' }" header="Employee Details" :modal="true">
            <div class="flex flex-col gap-6">
                <!-- <img src="/api/placeholder/200/200" alt="Employee" class="block m-auto pb-4" /> -->
                <div>
                    <label for="name" class="block font-bold mb-3">Name</label>
                    <InputText id="name" v-model="employee.name" required="true" autofocus
                        :invalid="submitted && !employee.name" fluid />
                    <small v-if="submitted && !employee.name" class="text-red-500">Name is required.</small>
                </div>
                <div>
                    <label for="email" class="block font-bold mb-3">Email</label>
                    <InputText id="email" v-model="employee.email" required="true" autofocus
                        :invalid="submitted && !employee.email" fluid />
                    <small v-if="submitted && !employee.email" class="text-red-500">Email is required.</small>
                </div>
                <!-- <div>
                    <label for="description" class="block font-bold mb-3">Job Description</label>
                    <Textarea id="description" v-model="employee.description" required="true" rows="3" cols="20" fluid />
                </div>
                <div>
                    <label for="status" class="block font-bold mb-3">Employment Status</label>
                    <Select id="status" v-model="employee.status" :options="statuses" optionLabel="label" placeholder="Select a Status" fluid></Select>
                </div>

                <div>
                    <span class="block font-bold mb-4">Department</span>
                    <div class="grid grid-cols-12 gap-4">
                        <div class="flex items-center gap-2 col-span-6">
                            <RadioButton id="department1" v-model="employee.department" name="department" value="IT" />
                            <label for="department1">IT</label>
                        </div>
                        <div class="flex items-center gap-2 col-span-6">
                            <RadioButton id="department2" v-model="employee.department" name="department" value="HR" />
                            <label for="department2">HR</label>
                        </div>
                        <div class="flex items-center gap-2 col-span-6">
                            <RadioButton id="department3" v-model="employee.department" name="department" value="Finance" />
                            <label for="department3">Finance</label>
                        </div>
                        <div class="flex items-center gap-2 col-span-6">
                            <RadioButton id="department4" v-model="employee.department" name="department" value="Marketing" />
                            <label for="department4">Marketing</label>
                        </div>
                    </div>
                </div> -->

                <!-- <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-6">
                        <label for="salary" class="block font-bold mb-3">Salary</label>
                        <InputNumber id="salary" v-model="employee.salary" mode="currency" currency="USD" locale="en-US" fluid />
                    </div>
                    <div class="col-span-6">
                        <label for="performance" class="block font-bold mb-3">Performance (1-5)</label>
                        <InputNumber id="performance" v-model="employee.performance" :min="1" :max="5" integeronly fluid />
                    </div>
                </div> -->
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Save" icon="pi pi-check" @click="saveEmployee" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteEmployeeDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="employee">Are you sure you want to delete <b>{{ employee.name }}</b>?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteEmployeeDialog = false" />
                <Button label="Yes" icon="pi pi-check" @click="deleteEmployee(employee.id)" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteEmployeesDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="employee">Are you sure you want to delete the selected
                    employees?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteEmployeesDialog = false" />
                <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedEmployees" />
            </template>
        </Dialog>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
// import { FilterMatchMode } from 'primevue/api';
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import RadioButton from "primevue/radiobutton";
import InputNumber from "primevue/inputnumber";
import Toolbar from "primevue/toolbar";
import FileUpload from "primevue/fileupload";
import Rating from "primevue/rating";
import Tag from "primevue/tag";
import Select from "primevue/select";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import axios from "axios";
import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";
import { useEmployeesApi } from "@/composables/employees";

const { getEmployees, storeEmployee, importEmployees, destroyEmployee } = useEmployeesApi();
const dt = ref();
const employees = ref();
const $toast = useToast();
const employeeDialog = ref(false);
const deleteEmployeeDialog = ref(false);
const deleteEmployeesDialog = ref(false);
const employee = ref({
    name: "",
    email: "",
});
const selectedEmployees = ref();
const filters = ref({
    global: { value: null },
});
const submitted = ref(false);
const statuses = ref([
    { label: "ACTIVE", value: "ACTIVE" },
    { label: "LEAVE", value: "LEAVE" },
    { label: "INACTIVE", value: "INACTIVE" },
]);

const openNew = () => {
    employee.value = {};
    submitted.value = false;
    employeeDialog.value = true;
};

const hideDialog = () => {
    employeeDialog.value = false;
    submitted.value = false;
};

const saveEmployee = async () => {
    submitted.value = true;


    const res = await storeEmployee(employee.value);

    const isEdit = employees.value.find(emp => emp.id == res.data.id);
    if (isEdit) {
        const index = isEdit ? employees.value.indexOf(isEdit) : -1;
        if (index != -1) {
            employees.value[index] = res.data;
            $toast.info("Employee Updated!", {
                position: "top-right",
            });
        }
    } else {
        employees.value.push(res.data);
        $toast.info("Employee Added!", {
            position: "top-right",
        });
    }
    employeeDialog.value = false;
};

const editEmployee = (emp) => {
    employee.value = { ...emp };
    employeeDialog.value = true;
};

const confirmDeleteEmployee = (emp) => {
    employee.value = emp;
    deleteEmployeeDialog.value = true;
};

const deleteEmployee = async (id) => {
    employees.value = employees.value.filter(emp => emp.id !== id);

    deleteEmployeeDialog.value = false;
    employee.value = {};

    await destroyEmployee(id);

    $toast.info("Employee deleted!", {
        position: "top-right",
    });

};

const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < employees.value.length; i++) {
        if (employees.value[i].id === id) {
            index = i;
            break;
        }
    }

    return index;
};

const createId = () => {
    let id = "";
    var chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 5; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
};

const exportCSV = () => {
    dt.value.exportCSV();
};

const uploadCSV = async (event) => {
    const file = event.files[0]; // Get uploaded file
    if (!file) return;

    let formData = new FormData();
    formData.append("file", file);

  const emp =    await importEmployees(formData);
  console.log(emp);
  
    employees.value.push(...emp); 
    $toast.success("Employees imported!", {
        position: "top-right",
    });

};

const confirmDeleteSelected = () => {
    deleteEmployeesDialog.value = true;
};

const deleteSelectedEmployees = async () => {
    if (selectedEmployees.value && selectedEmployees.value.length) {
        const Employees_ids = selectedEmployees.value.map((emp) => emp.id);
        console.log("Selected Employee IDs:", Employees_ids);

        try {

            await destroyEmployee(Employees_ids);

            employees.value = employees.value.filter(
                (emp) => !Employees_ids.includes(emp.id)
            );

            selectedEmployees.value = null;
            deleteEmployeesDialog.value = false;
            $toast.info("Employees deleted!", {
                position: 'top-right'
            });
        } catch (error) {
            console.error("Error deleting employees:", error);
        }

        employees.value = employees.value.filter(
            (val) => !selectedEmployees.value.includes(val)
        );
        deleteEmployeesDialog.value = false;
        selectedEmployees.value = null;
    } else {
        $toast.error("Something Went Wrong!", {
            position: "top-right",
        });
    }
};
onMounted(async () => {

    const emp = await getEmployees();

    employees.value = emp;

});
</script>
