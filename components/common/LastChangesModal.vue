<script lang="ts" setup>
import { formatDistanceToNow } from "date-fns";

type LastUpdateEntry = {
  key: string;
  label: string;
  timestamp: string;
};

const lastUpdates = ref<LastUpdateEntry[]>([]);

defineProps({
  onClose: {
    type: Function,
    required: true,
  },
});

const fetchData = async () => {
  const response = await $fetch<{
    success: boolean;
    message?: string;
    data?: LastUpdateEntry[];
  }>("/api/v1/utilities/last-updates");
  console.log(JSON.stringify(response));

  if (response.success && response.data) {
    lastUpdates.value = response.data;
  }
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
            <UButton
              icon="i-solar:refresh-bold"
              square
              variant="ghost"
              color="gray"
              @click="fetchData"
            />
            <UButton
              color="gray"
              variant="ghost"
              square
              icon="i-heroicons-x-mark-20-solid"
              @click="onClose()"
            />
          </div>
        </div>
      </template>

      <div v-if="lastUpdates.length">
        <div class="space-y-2">
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
      <div v-else>
        <p>Loading...</p>
      </div>
    </UCard>
  </UModal>
</template>
