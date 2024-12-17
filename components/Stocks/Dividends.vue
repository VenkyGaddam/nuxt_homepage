<script setup lang="ts">
// varibale declarations
import { format } from "date-fns";

const modal = useModal();

const dividends = ref<Dividends[]>([]);
const columns = ref<Column[]>([]);

const expand = ref({
  openedRows: [],
  row: null,
});

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
  <UContainer
    class="relative"
    :ui="{
      base: 'mx-auto',
      padding: 'px-0',
      constrained: 'max-w-dvw min-h-dvh',
    }"
  >
    <UTable
      v-model:expand="expand"
      :columns="columns"
      :rows="dividends"
      :multiple-expand="false"
      :ui="{
        th: {
          base: 'text-left rtl:text-right',
          padding: 'px-1 py-4',
          color: 'text-gray-900 dark:text-white',
          font: 'font-semibold',
          size: 'text-sm',
        },
        td: {
          base: 'whitespace-nowrap',
          padding: 'px-1 py-3',
          color: 'text-gray-900 dark:text-gray-100',
          font: '',
          size: 'text-sm',
        },
        expandButton: {
          icon: 'i-heroicons-chevron-down',
          color: 'gray',
          variant: 'ghost',
          size: 'xs',
          class: '',
        },
      }"
    >
      <template #symbol-data="{ row }">
        <div class="flex flex-col items-start justify-start w-36">
          <span class="truncate">{{ row.co_name?.trim() }}</span>
          <span class="text-xs font-light"
            >{{ row.symbol?.trim() || "" }}
          </span>
        </div>
      </template>
      dividend_amount
      <template #dividend_amount-data="{ row }">
        <span>{{ row.dividend_amount }}</span>
        <span class="text-xs">({{ row.dividend_percentage }}%)</span>
      </template>
      <template #announcementdate-data="{ row }">
        <span>{{ format(new Date(row.announcementdate), "dd MMM yy") }}</span>
      </template>
      <template #dividend_date-data="{ row }">
        <span>{{ format(new Date(row.dividend_date), "dd MMM yy") }}</span>
      </template>
      <template #record_date-data="{ row }">
        <span>{{ format(new Date(row.record_date), "dd MMM yy") }}</span>
      </template>
      <template #actions-data="{ row }" class="flex flex-col gap-5">
        <UButton
          color="blue"
          icon="i-heroicons-pencil-square-20-solid"
          @click=""
        />
        <UButton color="red" icon="i-heroicons-trash-20-solid" @click="" />
      </template>

      <template #expand="{ row }">
        <pre
          class="bg-gray-100 dark:bg-gray-800 text-xs p-4 whitespace-pre-wrap"
        >
          <code>{{ JSON.stringify(row, null, 2) }}</code>
        </pre>
      </template>
    </UTable>
  </UContainer>
</template>
