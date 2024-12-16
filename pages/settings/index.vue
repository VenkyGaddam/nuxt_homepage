<script setup lang="ts">
import Account from "~/components/Settings/Account.vue";
import Notifications from "~/components/Settings/Notifications.vue";
import type { Component } from "vue";

const { logout } = useAuth();
const label = ref("Account");
const component = shallowRef<Component>(Account);
const device = useDevice();
const hideOptions = ref<boolean>(false);

hideOptions.value = device.isMobile ? true : false;

const links = [
  [
    {
      label: "Account",
      icon: "i-material-symbols-light:account-circle",
      click: () => {
        label.value = "Account";
        component.value = Account;
        device.isMobile ? (hideOptions.value = true) : "";
      },
    },
    {
      label: "Notifications",
      icon: "i-material-symbols:notifications-unread-rounded",
      click: () => {
        label.value = "Notifications";
        component.value = Notifications;
        device.isMobile ? (hideOptions.value = true) : "";
      },
    },
    {
      label: "Vertical Navigation",
      icon: "i-heroicons-chart-bar",
    },
    {
      label: "Command Palette",
      icon: "i-heroicons-command-line",
    },
  ],
  [
    {
      label: "Examples",
      icon: "i-heroicons-light-bulb",
    },
    {
      label: "Help",
      icon: "i-heroicons-question-mark-circle",
    },
  ],
  [
    {
      label: "Sign out",
      labelClass: "font-semibold text-red-400",
      icon: "i-heroicons-arrow-left-on-rectangle",
      click: () => {
        logout();
      },
    },
  ],
];
</script>

<template>
  <div class="flex flex-col gap-5 mx-0 my-5 lg:mx-5 overflow-auto md:flex-row">
    <div class="w-full md:w-[24rem]">
      <div
        class="w-full px-2.5"
        @click="$device.isMobile ? (hideOptions = !hideOptions) : ''"
      >
        <span class="text-2xl font-semibold tracking-tighter text-primary-500">
          Settings
        </span>
      </div>
      <transition
        enter-active-class="transition ease-out duration-500"
        enter-from-class="opacity-0 transform -translate-y-4"
        enter-to-class="opacity-100 transform translate-y-0"
        leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100 transform translate-y-0"
        leave-to-class="opacity-0 transform -translate-y-4"
      >
        <UVerticalNavigation
          v-if="!hideOptions"
          :links="links"
          :ui="{
            font: 'font-small',
            size: 'text-lg',
            padding: 'px-3 py-1.5',
            active:
              'text-gray-900 dark:text-white before:bg-primary-100 dark:before:bg-primary-800',
            inactive:
              'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:before:bg-gray-50 dark:hover:before:bg-gray-800/50',
          }"
        >
          <template #badge="{ link, isActive }">
            <div class="flex-1 flex justify-between relative truncate">
              <div>{{ isActive }}</div>
            </div>
          </template>
        </UVerticalNavigation>
      </transition>
    </div>

    <div
      :class="
        $device.isMobile
          ? {
              'mt-16': !hideOptions,
              'mt-2': hideOptions,
            }
          : 'mt-4'
      "
      class="transition-all ease-in-out delay-120 duration-500 flex flex-col px-3 gap-5 overflow-auto w-screen"
    >
      <h1 class="text-xl font-semibold tracking-tighter">
        {{ label }}
      </h1>
      <component :is="component"></component>
    </div>
  </div>
</template>
