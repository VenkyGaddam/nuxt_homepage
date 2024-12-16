<script setup lang="ts">
import ServiceEditSlideover from "./ServiceEditSlideover.vue";

// replaced with global auth
// definePageMeta({
//   middleware: ["auth"],
// });

// varibale declarations
const toast = useToast();
const modal = useModal();
const slideover = useSlideover();

const services = ref<Service[]>([]);
const columns = ref<Column[]>([]);
const loading = ref(true);

const openServiceEditSlideover = (service: Service) => {
  slideover.open(ServiceEditSlideover, {
    service: service,
    onClose: slideover.close,
    onSuccess() {
      // refresh services as data is changed in edit
      getServices();
    },
  });
};

// methods
const getServices = async () => {
  try {
    const response = await $fetch<ApiResponse>(
      "/api/v1/services/services?q=services"
    );
    loading.value = false;
    // Check if the response is successful and contains the expected data
    if (response.success) {
      services.value = response.data?.services || [];
    } else {
      console.error("Error in response: ", response.message || "Unknown error");
      // Handle error accordingly, maybe display a user-friendly message
    }
  } catch (err) {
    console.error("Error fetching services:", err);
    // Optionally, update the UI to inform the user about the error
  }
};

const getColoums = async () => {
  try {
    const response = await $fetch<ApiResponse>(
      "/api/v1/services/services?q=columns"
    );
    loading.value = false;
    // Check if the response is successful and contains the expected data
    if (response.success) {
      columns.value = response.data?.columns || [];
    } else {
      console.error("Error in response: ", response.message || "Unknown error");
      // Handle error accordingly, maybe display a user-friendly message
    }
  } catch (err) {
    console.error("Error fetching services:", err);
    // Optionally, update the UI to inform the user about the error
  }
};

onBeforeMount(() => {
  getColoums();
});

onMounted(() => {
  getServices();
});

getServices();
</script>

<template>
  <UContainer
    class="relative"
    :ui="{
      base: 'mx-auto',
      padding: 'px-0',
      constrained: 'max-w-dvw min-h-dvh',
    }"
  >
    <UTable :columns="columns" :rows="services" :loading="loading">
      <template #service-data="{ row }">
        <div class="flex flex-row items-center gap-2 divide-x">
          <UIcon v-if="row.icon" :name="row.icon" class="w-8 h-8" />
          <div class="flex flex-col items-start pl-2">
            <UTooltip :text="row.description" :popper="{ placement: 'right' }">
              <span class="text-black dark:text-white">{{ row.service }}</span>
            </UTooltip>
            <ULink
              :to="row.address"
              target="_blank"
              active-class="text-primary"
              inactive-class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              <span class="text-xs font-light"> {{ row.address }} </span>
            </ULink>
          </div>
        </div>
      </template>
      <template #address-data="{ row }" class="hidden">
        <ULink
          :to="row.address"
          target="_blank"
          active-class="text-primary"
          inactive-class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
        >
          {{ row.address }}
        </ULink>
      </template>
      <template #active-data="{ row }">
        <UBadge
          class=""
          size="xs"
          :label="row.active ? 'Active' : 'Inactive'"
          :color="row.active ? 'emerald' : 'orange'"
          variant="soft"
        />
      </template>
      <template #edit-data="{ row }">
        <UButton
          icon="i-heroicons-pencil-square"
          size="xs"
          color="primary"
          square
          variant="ghost"
          @click="openServiceEditSlideover(row)"
        />
      </template>
    </UTable>
  </UContainer>
</template>
