<script setup lang="ts">
const appConfig = useAppConfig();

useHead({
  title: appConfig.title,
  meta: [
    { charset: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
  ],
  bodyAttrs: {
    class: "no-scrollbar",
  },
  link: [{ rel: "icon", href: "/favicon.ico" }],
  htmlAttrs: {
    lang: "en",
  },
});
useSeoMeta({
  title: appConfig.title,
  ogTitle: appConfig.title,
  description: appConfig.description,
  ogDescription: appConfig.description,
  ogImage: "https://blog.myhive.in/favicon-96x96.png",
  twitterCard: "summary_large_image",
});
</script>

<template>
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <USlideovers />
  <UModals />
  <UNotifications />
</template>

<style>
/* Fade and Scale Animation */

/* Entering page */
.fade-scale-enter-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.fade-scale-enter-from {
  opacity: 0;
  transform: scale(0.95);
}
.fade-scale-enter-to {
  opacity: 1;
  transform: scale(1);
}

/* Leaving page */
.fade-scale-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.fade-scale-leave-from {
  opacity: 1;
  transform: scale(1);
}
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
/* Hide scrollbar for Chrome, Safari and Opera */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
/* Hide scrollbar for IE, Edge and Firefox */
.no-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: 0; /* Firefox */
}
</style>
