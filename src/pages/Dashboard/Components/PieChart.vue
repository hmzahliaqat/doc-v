<template>
  <div class="card flex justify-center">
    <Chart
      v-if="hasData"
      type="pie"
      :data="chartData"
      :options="chartOptions"
      class="w-full md:w-[30rem]"
    />
    <div v-else class="text-center text-gray-500 mt-4">
      No signature or document data to display.
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect } from "vue";
import Chart from "primevue/chart";

const props = defineProps([
  "completed_signatures",
  "pending_signatures",
  "documents_shared",
]);

const chartData = ref();
const chartOptions = ref();

const setChartData = () => {
  const documentStyle = getComputedStyle(document.body);

  return {
    labels: ["Documents shared", "Completed signatures", "Pending signatures"],
    datasets: [
      {
        data: [
          Number(props.documents_shared) || 0,
          Number(props.completed_signatures) || 0,
          Number(props.pending_signatures) || 0,
        ],
        backgroundColor: [
          documentStyle.getPropertyValue("--p-cyan-500"),
          documentStyle.getPropertyValue("--p-orange-500"),
          documentStyle.getPropertyValue("--p-gray-500"),
        ],
        hoverBackgroundColor: [
          documentStyle.getPropertyValue("--p-cyan-400"),
          documentStyle.getPropertyValue("--p-orange-400"),
          documentStyle.getPropertyValue("--p-gray-400"),
        ],
      },
    ],
  };
};

const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue("--p-text-color");

  return {
    plugins: {
      legend: {
        labels: {
          usePointStyle: true,
          color: textColor,
        },
      },
    },
  };
};

const hasData = computed(() => {
  const shared = Number(props.documents_shared) || 0;
  const completed = Number(props.completed_signatures) || 0;
  const pending = Number(props.pending_signatures) || 0;
  return shared + completed + pending > 0;
});

// Move watchEffect AFTER functions are declared
watchEffect(() => {
  chartData.value = setChartData();
  chartOptions.value = setChartOptions();
});
</script>

