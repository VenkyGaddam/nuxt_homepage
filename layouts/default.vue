<script setup lang="ts">
import LastChangesModal from "~/components/common/LastChangesModal.vue";

const colorMode = useColorMode();
const appConfig = useAppConfig();
const { init, isAuth, user, logout } = useAuth();

const modal = useModal();

// initialize auth composable
onBeforeMount(() => {
  if (import.meta.client) init();
});

watch(isAuth, (value) => {
  // checking changed value
  if (!value) {
    navigateTo("/login");
  }
});

const items = [
  [
    {
      label: "ben@example.com",
      slot: "account",
      disabled: true,
    },
  ],
  [
    {
      label: "Settings",
      icon: "i-heroicons-cog-8-tooth",
      click: () => {
        navigateTo("/settings");
      },
    },
  ],
  [
    {
      label: "Documentation",
      icon: "i-heroicons-book-open",
    },
    {
      label: "Changelog",
      icon: "i-heroicons-megaphone",
    },
    {
      label: "Status",
      icon: "i-heroicons-signal",
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
  <div class="min-h-dvh flex flex-col">
    <div
      class="sticky top-0 shadow py-2 lg:py-2 px-2 lg:mr-2 backdrop-blur-md z-10"
    >
      <div class="flex flex-row gap-2 items-center justify-between">
        <ULink to="/">
          <div class="flex flex-row items-end gap-0.5">
            <UIcon
              :name="appConfig.brandIcon"
              class="w-10 h-10 text-primary-500"
            />
            <div class="flex flex-row">
              <span class="text-2xl font-semibold text-primary-500">
                Home
              </span>
              <span class="text-2xl font-semibold"> light </span>
            </div>
          </div>
        </ULink>

        <div v-show="isAuth" class="flex flex-row gap-2.5 items-center">
          <UButton
            icon="i-bx:health"
            size="md"
            square
            variant="ghost"
            @click.stop.prevent="
              () => {
                modal.open(LastChangesModal, {
                  onClose: modal.close,
                });
              }
            "
          />

          <UChip>
            <UIcon name="hugeicons:notification-02" class="w-5 h-5" />
          </UChip>
          <UDropdown
            :items="items"
            :ui="{ item: { disabled: 'cursor-text select-text' } }"
            :popper="{ placement: 'bottom-start' }"
          >
            <UAvatar size="md" src="" :alt="user?.Displayname" />

            <template #account="{ item }">
              <div class="text-left">
                <p>Signed in as</p>
                <p class="truncate font-medium text-gray-900 dark:text-white">
                  {{ user?.Displayname ? user.Displayname : user?.Username }}
                </p>
              </div>
            </template>

            <template #item="{ item }">
              <span class="truncate">{{ item.label }}</span>

              <UIcon
                :name="item.icon"
                class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto"
              />
            </template>
          </UDropdown>
        </div>
      </div>
    </div>
    <div class="relative flex flex-grow rounded-xl">
      <slot />
    </div>
  </div>
</template>
