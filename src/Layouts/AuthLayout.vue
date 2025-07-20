<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import {AppHeader } from '@/components/layout';
import SignLoading from '@/components/SignLoading.vue';
import SignReload from '@/components/SignReload.vue';
import { emitRouteEvent } from '@/router/events';
import { useAuthStore } from '@/stores/modules/user.ts';

const router = useRouter();
const routeCurrent = ref<string>('');
const routePrevious = ref<string>('');
const authStore = useAuthStore();
router.beforeEach((to, from) => {
  routeCurrent.value = String(to.name);
  routePrevious.value = String(from.name);
});
</script>

<template>

  <div class="min-h-full">

    <app-header  :currentRoute="routeCurrent" />

    <main>
      <div class="mx-auto sm:px-6 lg:px-8 -mt-22">
        <router-view class="mt-30" v-slot="{ Component }">
          <transition
            name="slide-fade"
            mode="out-in"
            @before-enter="emitRouteEvent('onBeforeEnter', routeCurrent)"
            @enter="emitRouteEvent('onEnter', routeCurrent)"
            @after-enter="emitRouteEvent('onAfterEnter', routeCurrent)"
            @before-leave="emitRouteEvent('onBeforeLeave', routePrevious)"
            @leave="emitRouteEvent('onLeave', routePrevious)"
            @after-leave="emitRouteEvent('onAfterLeave', routePrevious)"
          >
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>
  </div>

  <sign-loading />
  <sign-reload />
</template>

<style lang="css">
:root{
  color-scheme: light !important;
}
#app {
  width: 100%;
  overflow-x: hidden;
}

.slide-fade-enter-active {
  transition: all 300ms ease-out;
}

.slide-fade-leave-active {
  transition: all 300ms var(--ease-in-page);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

@media (min-width: 768px) {
  .slide-fade-enter-from,
  .slide-fade-leave-to {
    transform: translateX(40px);
  }
}
</style>
