import { defineStore } from 'pinia';
import type { PickPartial } from '@/types/common';
import type { Loading } from '@/types/config';

interface ConfigStore {
  loading: Loading;
  filePassword: string;
  logos: {
    header: string;
    auth: string;
  };
}

const defaultState: ConfigStore = {
  loading: {
    isShow: false,
    title: '',
    content: '',
    isProcess: false,
    completeness: 0,
  },
  filePassword: '',
  logos: {
    header: '/logo-dark.png',
    auth: '/logo-dark.png',
  },
};

export const useConfigStore = defineStore('config', {
  state: () => ({ ...defaultState }),
  actions: {
    toggleLoading({
      isShow,
      title = '',
      content = '',
      isProcess = false,
      completeness = 0,
    }: PickPartial<Loading, 'title' | 'content' | 'isProcess' | 'completeness'>) {
      this.loading = { isShow, title, content, isProcess, completeness };
    },
    setLoadingCompleteness(completeness: number) {
      this.loading.completeness = completeness;
    },
    updateFilePassword(password: string) {
      this.filePassword = password;
    },
    updateLogos(logos: Partial<ConfigStore['logos']>) {
      this.logos = { ...this.logos, ...logos };
    },
  },
});
