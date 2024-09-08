import { useLocalStorage } from '../store/session';

export async function getToken() {
  const sessionStore = useLocalStorage();
  await sessionStore.fetchToken();
  return sessionStore.token;
}

export async function resetToken() {
  const sessionStore = useLocalStorage();
  await sessionStore.resetToken();
}