<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { showToast } from '@/components/common';
import SignIcon from '@/components/SignIcon.vue';
import { useWarnPopup } from '@/hooks/use-warn-popup';
import { useSignatureStore } from '@/stores';
import type { DragOffset } from '@/types/drag';
import type { SignatureTool } from '@/types/menu';
import type { Signature } from '@/types/signature';
import SignatureDrawPopup from './SignatureDrawPopup.vue';
import SignaturePopup from './SignaturePopup.vue';

const emit = defineEmits(['useSignature']);
const currentTool = defineModel<SignatureTool | ''>('currentTool');
const dragOffset = defineModel<DragOffset>('dragOffset', { required: true });

const currentSelect = ref<Signature | null>(null);
const isShowDrawPopup = ref(false);

const signatureStore = useSignatureStore();
const { signatureList } = storeToRefs(signatureStore);
const { t } = useI18n();
const { isShowWarnPopup, SignPopup, toggleWarnPopup } = useWarnPopup();

function useSignature() {
  if (currentSelect.value) {
    emit('useSignature', currentSelect.value.file_path);
  }
  close();
}

function selectSignature(signature: Signature) {
  currentSelect.value = signature;
}

function deleteSignature() {
  if (!currentSelect.value) return;

  signatureStore.deleteSignature(currentSelect.value.id);
  showToast(t('prompt.signature_delete_success'));
  toggleWarnPopup(false);
  currentSelect.value = null;
}

function toggleDrawPopup(isOpen: boolean) {
  isShowDrawPopup.value = isOpen;
}

function dragSignature(event: DragEvent) {
  const { src, offsetHeight, offsetWidth } = event.target as HTMLImageElement;
  const offsetX = event.offsetX / offsetWidth;
  const offsetY = event.offsetY / offsetHeight;

  event.dataTransfer?.setData('text/uri-list', src);
  event.dataTransfer?.setData('custom/offset', JSON.stringify({ offsetX, offsetY }));
  dragOffset.value = { x: event.offsetX, y: event.offsetY, width: offsetWidth, height: offsetHeight };
}

function close() {
  currentTool.value = '';
}

onMounted(async () => {
  await signatureStore.getSignature();
});
</script>

<template>
  <signature-popup
    :is-show-popup="currentTool === 'sign'"
    :title="$t('signature_file')"
    :is-disabled="!currentSelect"
    @close="close"
    @use="useSignature"
  >
    <ul v-if="signatureList.length" class="signature-list">
      <img
        src="@/assets/icon/ic_add_dark.svg"
        alt="add dark icon"
        width="60"
        height="60"
        class="iconScale mb-3"
        @click="toggleDrawPopup(true)"
      />
      <li
        v-for="signature in signatureList"
        :key="signature.id"
        :class="[
          'rounded-[20px] relative w-full flex justify-center cursor-pointer h-[98px]',
          currentSelect?.id === signature.id ? 'bg-primary opacity-70' : 'bg-white',
        ]"
        @click="selectSignature(signature)"
      >
        <img
          :src="signature.file_path"
          alt="signature icon"
          class="object-contain rounded-[20px]"
          @dragstart="dragSignature"
        />
        <sign-icon
          v-show="currentSelect?.id === signature.id"
          name="close_s"
          class="absolute top-1 right-1 w-8 h-8 text-gray-80"
          hover-color="hover:text-danger"
          @click.stop="toggleWarnPopup(true)"
        />
      </li>
    </ul>

    <div v-else class="signature-list justify-center">
      <img
        src="@/assets/icon/ic_add_dark.svg"
        alt=""
        width="80"
        height="80"
        class="iconScale mb-5"
        @click="toggleDrawPopup(true)"
      />
      <h5 class="text-secondary text-center">
        {{ $t('add_signature_file') }}
      </h5>
    </div>
  </signature-popup>

  <signature-draw-popup
    v-if="isShowDrawPopup"
    @close="toggleDrawPopup(false)"
  />

  <sign-popup v-if="isShowWarnPopup" :title="$t('warn')">
    <p class="text-center">
      {{ $t('prompt.sure_delete_signature') }}
    </p>
    <div class="flex justify-between">
      <button class="btn btn-base" @click="toggleWarnPopup(false)">
        {{ $t('not_yet') }}
      </button>
      <button class="btn btn-primary" @click="deleteSignature">
        {{ $t('delete') }}
      </button>
    </div>
  </sign-popup>
</template>
