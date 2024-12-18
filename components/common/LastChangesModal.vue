<script lang="ts" setup>
import { formatDistanceToNow } from "date-fns";

type LastUpdateEntry = {
  key: string;
  label: string;
  timestamp: string;
};

const lastUpdates = ref<LastUpdateEntry[]>([]);
const isLoading = ref(false);

defineProps({
  preventClose: {
    type: Boolean,
    default: false,
  },
  onClose: {
    type: Function,
    required: false,
  },
});

const fetchData = async () => {
  isLoading.value = true;
  const response = await $fetch<{
    success: boolean;
    message?: string;
    data?: LastUpdateEntry[];
  }>("/api/v1/utilities/last-updates");

  if (response.success && response.data) {
    lastUpdates.value = response.data;
  }
  isLoading.value = false;
};

// Format the timestamp into a readable format (e.g., "5 minutes ago")
const formatDate = (timestamp: string) => {
  const date = new Date(timestamp);
  return formatDistanceToNow(date) + " ago";
};

onMounted(() => {
  fetchData();
});
</script>

<template>
  <UModal prevent-close>
    <UCard>
      <template #header>
        <div class="flex justify-between items-center">
          <span class="text-lg font-semibold text-primary-500"
            >Last Updates</span
          >

          <div class="flex flex-row justify-center gap-2">
            <UTooltip text="Refresh">
              <UButton
                :disabled="isLoading"
                square
                variant="outline"
                color="gray"
                @click="fetchData"
              >
                <UIcon
                  name="i-solar:refresh-bold"
                  :class="{
                    'animate-spin bg-primary-500': isLoading,
                    'h-5 w-5': true,
                  }"
                />
              </UButton>
            </UTooltip>
            <UTooltip text="Close">
              <UButton
                v-show="onClose != undefined && typeof onClose == 'function'"
                color="red"
                variant="outline"
                square
                icon="i-heroicons-x-mark-20-solid"
                @click="
                  () => {
                    if (onClose != undefined && typeof onClose == 'function') {
                      onClose();
                    }
                  }
                "
              />
            </UTooltip>
          </div>
        </div>
      </template>

      <div v-if="isLoading" class="space-y-2 min-h-[5rem]">
        <USkeleton class="h-2" />
        <USkeleton class="h-2" />
        <USkeleton class="h-2" />
      </div>

      <div v-else-if="lastUpdates.length">
        <div class="space-y-2 min-h-[5rem]">
          <ul>
            <li
              v-for="entry in lastUpdates"
              :key="entry.key"
              class="flex justify-between"
            >
              <span class="text-normal">{{ entry.label }}</span>
              <span class="text-sm">{{ formatDate(entry.timestamp) }}</span>
            </li>
          </ul>
        </div>
      </div>

      <div v-else class="min-h-[5rem]">
        <p>No updates available.</p>
      </div>
    </UCard>
  </UModal>
</template>
