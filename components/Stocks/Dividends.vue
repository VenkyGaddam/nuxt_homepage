<script setup lang="ts">
// varibale declarations
const toast = useToast();
const modal = useModal();

const dividends = ref<Dividends[]>([]);
const columns = ref<Column[]>([]);

// methods
const getDividends = async () => {
  try {
    const response = await $fetch<ApiResponse>("api/v1/stocks?year=2024");

    // Check if the response is successful and contains the expected data
    if (response.success) {
      dividends.value = response.data.dividends || [];
    } else {
      console.error("Error in response: ", response.message || "Unknown error");
      // Handle error accordingly, maybe display a user-friendly message
    }
  } catch (err) {
    console.error("Error fetching dividends:", err);
    // Optionally, update the UI to inform the user about the error
  }
};

const toCamelCase = (str: string) => {
  if (str)
    return (
      str
        .replace(/(?:^\w|[A-Z]|\b\w|\s+|\b\w)/g, (match, index) =>
          index === 0 ? match.toUpperCase() : match.toLowerCase()
        )
        .replace(/\s+/g, "") || ""
    );
};

//Fetch data
const { data, error } = await useAsyncData("dividend_columns", () =>
  $fetch<ApiResponse>("/api/v1/stocks?q=columns")
);

if (error.value) {
  console.error("Error fetching columns:", error.value);
} else {
  // Check if the response is successful
  if (data.value?.success) {
    // Ensure `data.value?.data?.columns` exists and assign it to `columns`
    columns.value = data.value?.data.columns || [];
  } else {
    // Handle the case when success is false, and log the message
    console.error(
      "Failed to fetch columns:",
      data.value?.message || "Unknown error"
    );
  }
}

// Fetch data once the component is mounted
// fetch columns
onMounted(() => {});

// fetch services
onMounted(async () => {});

getDividends();
</script>

<template>
  <UCard
    class="w-full overflow-scroll overscroll-contain shadow h-[30rem] lg:w-1/2"
    :ui="{
      base: '',
      ring: '',
      divide: 'divide-y divide-gray-200 dark:divide-gray-700',
      header: { padding: 'px-4 py-3' },
      body: {
        padding: '',
        base: 'divide-y divide-gray-200 dark:divide-gray-700',
      },
      footer: { padding: 'p-4' },
    }"
  >
    <UTable :columns="columns" :rows="dividends">
      <template #symbol-data="{ row }">
        <div class="flex flex-col items-start justify-start">
          <span class="text-black dark:text-white">{{
            row.co_name?.trim()
          }}</span>
          <span class="text-xs font-light"
            >{{ row.symbol?.trim() || "" }}
          </span>
        </div>
      </template>
      <template #actions-data="{ row }" class="flex flex-col gap-5">
        <UButton
          color="blue"
          icon="i-heroicons-pencil-square-20-solid"
          @click=""
        />
        <UButton color="red" icon="i-heroicons-trash-20-solid" @click="" />
      </template>
    </UTable>
  </UCard>
</template>
