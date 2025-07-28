<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
});

// Computed properties for chart data
const chartLabels = computed(() => {
  if (!props.data || !props.data.data) return [];
  return props.data.data.map(item => item.period);
});

const chartData = computed(() => {
  if (!props.data || !props.data.data) return [];
  return props.data.data.map(item => item.count);
});

const chartColors = computed(() => {
  return {
    borderColor: '#4f46e5',
    backgroundColor: 'rgba(79, 70, 229, 0.1)',
    pointBackgroundColor: '#4f46e5',
    pointBorderColor: '#fff'
  };
});

// Chart rendering
const chartCanvas = ref(null);
let chart = null;

function renderChart() {
  if (!chartCanvas.value || !props.data || !props.data.data) return;
  
  const ctx = chartCanvas.value.getContext('2d');
  
  // Destroy previous chart instance if it exists
  if (chart) {
    chart.destroy();
  }
  
  // Import Chart.js dynamically to avoid SSR issues
  import('chart.js').then((ChartModule) => {
    const { Chart, registerables } = ChartModule;
    Chart.register(...registerables);
    
    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: chartLabels.value,
        datasets: [{
          label: 'User Registrations',
          data: chartData.value,
          borderColor: chartColors.value.borderColor,
          backgroundColor: chartColors.value.backgroundColor,
          pointBackgroundColor: chartColors.value.pointBackgroundColor,
          pointBorderColor: chartColors.value.pointBorderColor,
          tension: 0.3,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          },
          tooltip: {
            mode: 'index',
            intersect: false
          },
          title: {
            display: true,
            text: `User Registration Trends (${props.data.period})`
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0
            }
          }
        }
      }
    });
  });
}

// Watch for data changes and re-render chart
watch(() => props.data, () => {
  renderChart();
}, { deep: true });

onMounted(() => {
  renderChart();
});
</script>

<template>
  <div class="bg-white p-4 rounded-lg shadow">
    <div class="flex justify-between items-center mb-4">
      <div>
        <h3 class="text-lg font-medium text-gray-900">Registration Trends</h3>
        <p class="text-sm text-gray-500">
          {{ props.data.period }} data from {{ props.data.start_date }} to {{ props.data.end_date }}
        </p>
      </div>
    </div>
    
    <div class="chart-container" style="position: relative; height: 400px;">
      <canvas ref="chartCanvas"></canvas>
    </div>
    
    <!-- Data table -->
    <div class="mt-6 overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Period
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Registrations
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="(item, index) in props.data.data" :key="index">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ item.period }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ item.count }}
            </td>
          </tr>
        </tbody>
        <tfoot class="bg-gray-50">
          <tr>
            <td class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total
            </td>
            <td class="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
              {{ props.data.data.reduce((sum, item) => sum + item.count, 0) }}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>

<style scoped>
.chart-container {
  margin: 0 auto;
}
</style>