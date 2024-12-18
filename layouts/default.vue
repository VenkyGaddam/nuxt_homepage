<script setup lang="ts">
import LastChangesModal from "~/components/common/LastChangesModal.vue";

const colorMode = useColorMode();
const appConfig = useAppConfig();
const { user, fetchUser, logout } = useAuth();

const modal = useModal();

onMounted(() => {
  fetchUser();
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
      label: "Dividends",
      icon: "i-emojione-v1:stock-chart",
      click: () => {
        navigateTo("/stocks");
      },
    },
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
      class="sticky top-0 shadow py-2 lg:py-2 px-2 lg:pr-2 backdrop-blur-md z-10"
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

        <div v-if="user" class="flex flex-row gap-2.5 items-center">
          <UTooltip text="last updates">
            <UButton
              icon="i-bx:health"
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
          </UTooltip>

          <UTooltip text="Notifications">
            <UChip inset>
              <UButton
                icon="i-hugeicons:notification-02"
                variant="ghost"
                color="gray"
                suqre
              />
            </UChip>
          </UTooltip>

          <UDropdown
            :items="items"
            :ui="{ item: { disabled: 'cursor-text select-text' } }"
            :popper="{ placement: 'bottom-start' }"
          >
            <UAvatar size="md" src="" :alt="user?.displayname" />

            <template #account="{ item }">
              <div class="text-left">
                <p>Signed in as</p>
                <p class="truncate font-medium text-gray-900 dark:text-white">
                  {{ user?.displayname ? user.displayname : user?.username }}
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
