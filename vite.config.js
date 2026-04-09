import { defineConfig } from "vite"; // Импорт функции конфигурации из Vite

// Экспорт конфигурации для Vite (сборщик проекта)
export default defineConfig({
  server: {
    open: true, // Автоматически открывать браузер при запуске dev-сервера
  },
});
