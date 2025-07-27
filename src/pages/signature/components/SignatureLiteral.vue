<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { showToast } from '@/components/common';
import SignIcon from '@/components/SignIcon.vue';
import { useWarnPopup } from '@/hooks/use-warn-popup';
import { useLiteralStore } from '@/stores';
import type { DragOffset } from '@/types/drag';
import type { SignatureTool } from '@/types/menu';
import type { LiteralItem } from '@/types/literal';
import SignaturePopup from './SignaturePopup.vue';

const emit = defineEmits(['useLiteral']);
const currentTool = defineModel<SignatureTool | ''>('currentTool');
const dragOffset = defineModel<DragOffset>('dragOffset', { required: true });

const currentSelect = ref<LiteralItem | null>(null);
const isShowLiteralPopup = ref(false);
const literal = ref('');
const isEditing = ref(false);

const literalStore = useLiteralStore();
const { literalList } = storeToRefs(literalStore);
const { t } = useI18n();
const { isShowWarnPopup, SignPopup, toggleWarnPopup } = useWarnPopup();

function useLiteral() {
  if (currentSelect.value) {
    emit('useLiteral', currentSelect.value.file_path, 'text');
  }
  close();
}

function selectLiteral(item: LiteralItem) {
  currentSelect.value = item;
}

function addLiteral() {
  const exists = literalList.value.some(item => item.file_path === literal.value);
  if (exists) {
    showToast({ message: t('prompt.text_already_exists'), type: 'error' });
    return;
  }

  literalStore.addLiteral(literal.value);
  showToast(t('prompt.text_add_success'));
  toggleLiteralPopup(false);
}

function editLiteral() {
  if (!currentSelect.value) return;

  if (currentSelect.value.file_path === literal.value) {
    toggleLiteralPopup(false);
    return;
  }

  const exists = literalList.value.some(item => item.file_path === literal.value);
  if (exists) {
    showToast({ message: t('prompt.text_already_exists'), type: 'error' });
    return;
  }

  literalStore.addLiteral(literal.value);
  literalStore.deleteLiteral(currentSelect.value.id);
  showToast(t('prompt.text_edit_success'));
  currentSelect.value = { id: Date.now(), file_path: literal.value };
  toggleLiteralPopup(false);
}

function deleteLiteral() {
  if (!currentSelect.value) return;

  literalStore.deleteLiteral(currentSelect.value.id);
  showToast(t('prompt.text_delete_success'));
  toggleWarnPopup(false);
  currentSelect.value = null;
}

function toggleLiteralPopup(isOpen: boolean, isEdit = false) {
  isEditing.value = isEdit;
  isShowLiteralPopup.value = isOpen;
  literal.value = isEdit && currentSelect.value ? currentSelect.value.file_path : '';
}

function dragLiteral(event: DragEvent) {
  const { textContent, offsetHeight, offsetWidth } = event.target as HTMLParagraphElement;
  const offsetX = event.offsetX / offsetWidth;
  const offsetY = event.offsetY / offsetHeight;

  event.dataTransfer?.setData('text/plain', textContent ?? '');
  event.dataTransfer?.setData('custom/offset', JSON.stringify({ offsetX, offsetY }));
  dragOffset.value = {
    x: event.offsetX,
    y: event.offsetY,
    width: offsetWidth,
    height: offsetHeight,
  };
}

function close() {
  currentTool.value = '';
}

onMounted(() => {
  literalStore.getLiteral();
});
</script>

<template>
  <signature-popup
    :is-show-popup="currentTool === 'literal'"
    :title="$t('text_library')"
    :is-disabled="!currentSelect"
    @close="close"
    @use="useLiteral"
  >
    <ul v-if="literalList.length" class="signature-list">
      <img
        src="@/assets/icon/ic_add_dark.svg"
        alt="add dark icon"
        width="60"
        height="60"
        class="iconScale mb-3"
        @click="toggleLiteralPopup(true)"
      />
      <li
        v-for="word in literalList"
        :key="word.id"
        :class="[
          'rounded-[20px] relative w-full flex cursor-pointer px-3 py-4',
          currentSelect?.id === word.id ? 'bg-primary opacity-70' : 'bg-white',
        ]"
        draggable="true"
        @dragstart="dragLiteral"
        @click="selectLiteral(word)"
      >
        <p class="whitespace-pre-wrap w-full text-ellipsis overflow-hidden">
          <span class="inline">{{ word.file_path }}</span>
          <sign-icon
            v-show="currentSelect?.id === word.id"
            name="edit"
            class="w-5 h-5 text-gray-80 inline relative scale-150 -top-[2px]"
            hover-color="hover:text-green-600"
            @click.stop="toggleLiteralPopup(true, true)"
          />
        </p>
        <sign-icon
          v-show="currentSelect?.id === word.id"
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
        alt="add dark icon"
        width="80"
        height="80"
        class="iconScale mb-5"
        @click="toggleLiteralPopup(true)"
      />
      <h5 class="text-secondary text-center">
        {{ $t('add_commonly_use_text') }}
      </h5>
    </div>
  </signature-popup>

  <sign-popup v-if="isShowLiteralPopup" :title="isEditing ? $t('edit_text') : $t('add_text')">
    <textarea
      v-model="literal"
      class="input my-5 h-[40dvh] rounded-[20px]"
    ></textarea>

    <div class="flex justify-between md:justify-evenly">
      <button class="btn btn-base" @click="toggleLiteralPopup(false)">
        {{ $t('cancel') }}
      </button>
      <button class="btn btn-primary" :disabled="!literal" @click="() => (isEditing ? editLiteral() : addLiteral())">
        {{ $t('confirm') }}
      </button>
    </div>
  </sign-popup>

  <sign-popup v-if="isShowWarnPopup" :title="$t('warn')">
    <p class="text-center">
      {{ $t('prompt.sure_delete_text') }}
    </p>
    <div class="flex justify-between md:justify-evenly">
      <button class="btn btn-base" @click="toggleWarnPopup(false)">
        {{ $t('not_yet') }}
      </button>
      <button class="btn btn-primary" @click="deleteLiteral">
        {{ $t('delete') }}
      </button>
    </div>
  </sign-popup>
</template>
