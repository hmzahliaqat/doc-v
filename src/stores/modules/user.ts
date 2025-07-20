import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useUserApi } from '@/composables/user';
export const useAuthStore = defineStore('auth', () => {
  const user = ref(null as null | { name: string; email: string });

  const { getUser: fetchUser, login, logout } = useUserApi();

  const isAuthenticated = computed(() => !!user.value);

  async function getUser() {
    try {
      const response = await fetchUser();
      user.value = response;
    } catch {
      user.value = null;
    }
  }

  async function loginUser(email: string, password: string) {
    await login(email, password);
    await getUser();
  }

  async function logoutUser() {
    await logout();
    user.value = null;
  }

  return {
    user,
    isAuthenticated,
    getUser,
    loginUser,
    logoutUser,
  };
});
