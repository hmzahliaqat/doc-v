import { usePdfStore } from '@/stores';
import { loadImage } from '@/utils/image';

export function preloadStorage() {
  const { getCurrentPDF, getPDF } = usePdfStore();

  return Promise.all([getCurrentPDF(), getPDF()]).then(() => {});
}

export function preloadImages() {
  const images = import.meta.glob<string>('@/assets/img/*', {
    eager: true,
    query: '?url',
    import: 'default',
  });
  const promises = Object.values(images).map(loadImage);

  return Promise.allSettled(promises).then(() => {});
}
