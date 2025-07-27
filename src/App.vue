<script setup lang="ts">
import LoadingOverlay from '@/components/LoadingOverlay.vue';
import { useLoading } from '@/composables/loading';

const { isLoading, loadingMessage } = useLoading();
</script>

<template>
  <router-view></router-view>
  <LoadingOverlay :visible="isLoading" :message="loadingMessage" />
</template>

