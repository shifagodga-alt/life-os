import { createJSONStorage } from 'zustand/middleware'
// Единая точка хранения. Для миграции на IndexedDB замените localStorage
// на async-адаптер (getItem/setItem/removeItem) — сторы менять не нужно.
export const appStorage = createJSONStorage(() => localStorage)
