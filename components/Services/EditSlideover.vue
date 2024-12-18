<script lang="ts" setup>
// imports
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";

// props
const props = defineProps({
  service: {
    type: Object as PropType<Service>,
    required: true,
  },
  onClose: {
    type: Function,
    required: true,
  },
});

// declarations
const icons = ref<String[]>([]);
const icons_search_query = ref("");
const icons_loading = ref(false);

type Schema = z.output<typeof service_schema>;
const form = ref();
const toast = useToast();

// Initialize a reactive empty object for service state without default values
const service_state = reactive<Service>({
  id: "",
  service: "",
  description: "",
  address: "",
  reverse_proxy: "",
  active: false,
  icon: "",
});

const service_schema = z.object({
  // id: z.string(),
  service: z.string().min(3, "Service name must be atleast 3 characters"),
  description: z.string().min(5, "Description must be atleast 5 characters"),
  address: z.string(),
  reverse_proxy: z.string(),
  active: z.boolean(),
  icon: z.string(),
});

onMounted(() => {
  service_state.id = props.service.id;
  service_state.service = props.service.service;
  service_state.description = props.service.description;
  service_state.address = props.service.address;
  service_state.reverse_proxy = props.service.reverse_proxy;
  service_state.active = props.service.active;
  service_state.icon = props.service.icon;
});

const labels = computed({
  get: () => service_state.icon,
  set: async (label) => {
    // check if the Icon is already in list
    if (icons.value.includes(label)) {
      service_state.icon = label;
    } else {
      // if icon does not exist in list

      // Add "i-" prefix if it doesn't already exist
      if (!label.startsWith("i-")) {
        label = `i-${label}`;
      }
      console.log("Updated label:", label);
      try {
        // Make the POST request
        const response: any = await $fetch("/api/v1/services/icons", {
          method: "POST",
          body: { icon: label },
        });

        // Update the state only on successful response
        if (response.success) {
          service_state.icon = label;
          console.log("Icon added successfully:", label);
        } else {
          console.error("Failed to add icon:", response.message);
        }
      } catch (error) {
        console.error("Error during API request:", error);
      }
    }
  },
});

// functions or methods
const getIcons = async (query: string) => {
  if (!query) return icons.value;
  icons_loading.value = true;
  icons_search_query.value = String.prototype.toLowerCase
    .apply(query || "")
    .replaceAll(" ", "");
  //Fetch data
  const response = await $fetch<ApiResponse>("/api/v1/services/icons", {
    params: { query },
  });

  icons_loading.value = false;

  if (!response.success) {
    console.error("Error fetching icons:", response.message);
  } else {
    icons.value = response.data || [];
  }
  return icons.value;
};

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    const response: any = await $fetch("/api/v1/services/services", {
      method: "POST",
      body: service_state,
    });

    if (response.success) {
      toast.add({
        id: "notification",
        title: response.message,
        // description: JSON.stringify(service_state),
        icon: "i-mdi:checkbox-marked-circle-outline",
        color: "green",
        timeout: 2500,
      });
      onSuccess(); //emit onSuccess to parent to refresh the data
      props.onClose();
    } else {
      toast.add({
        id: "notification",
        title: response.message,
        description: JSON.stringify(service_state),
        icon: "i-mi:circle-error",
        color: "red",
      });
    }
  } catch (error) {
    console.error(error);
    toast.add({
      id: "notification",
      title: "An unexpected error occurred.",
      description: JSON.stringify(service_state),
      icon: "i-mi:circle-error",
      color: "red",
    });
  }
}

// emits
const emit = defineEmits(["success"]);

function onSuccess() {
  emit("success");
}

// call functions or fetch data
getIcons(icons_search_query.value);
</script>

<template>
  <USlideover
    :side="$device.isMobile ? 'bottom' : 'right'"
    :ui="{
      height: 'h-screen max-h-dvh',
    }"
    prevent-close
  >
    <UCard
      class="flex flex-col flex-1"
      :ui="{
        body: { base: 'flex-1' },
        ring: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
      }"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex flex-row gap-5 items-center">
            <UIcon
              v-if="service_state.icon"
              :name="service_state.icon"
              class="w-16 h-16"
            />
            <div>
              <p class="text-xl font-semibold">{{ service_state.service }}</p>
              <p class="text-sm font-light">{{ service_state.description }}</p>
            </div>
          </div>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="onClose()"
          />
        </div>
      </template>

      <template #default>
        <div class="h-full overflow-auto">
          <UForm ref="form" :schema="service_schema" :state="service_state">
            <div class="flex flex-col gap-5 px-1 md:px-5">
              <div class="flex flex-col gap-5">
                <UFormGroup name="service_name" label="Serive name">
                  <UInput v-model="service_state.service" />
                </UFormGroup>

                <UFormGroup name="description" label="Description">
                  <UInput v-model="service_state.description" />
                </UFormGroup>

                <div class="flex flex-col gap-4 md:grid md:grid-cols-2">
                  <UFormGroup name="address" label="Address">
                    <UInput v-model="service_state.address" disabled />
                  </UFormGroup>

                  <UFormGroup name="reverse_proxy" label="Reverse proxy">
                    <UInput v-model="service_state.reverse_proxy" disabled />
                  </UFormGroup>
                </div>

                <UFormGroup name="icon" label="">
                  <USelectMenu
                    variant="outline"
                    v-model="labels"
                    placeholder="Select a Icon"
                    :options="icons"
                    :leadingIcon="service_state.icon"
                    :loading="icons_loading"
                    :single-select="true"
                    :popper="{
                      placement: 'top-start',
                      adaptive: true,
                      resize: true,
                      locked: false,
                    }"
                    :searchable="getIcons"
                    searchable-placeholder="Search or add icon from icones.js.org"
                    clear-search-on-close
                    v-model:query="icons_search_query"
                    creatable
                    :show-create-option-when="
                      (query, results) => {
                        return results.length == 0;
                      }
                    "
                  >
                    <template #option="{ option: icon }">
                      <UIcon :name="icon" class="w-5 h-5" />
                      <span>{{ icon }}</span>
                    </template>
                    <template #option-create="{ option }">
                      <span class="flex-shrink-0">New icon:</span>
                      <UIcon
                        :name="
                          option.startsWith('i-') ? 'option' : `i-${option}`
                        "
                        class="w-10 h-10"
                      />
                      <span>{{ option }}</span>
                    </template>
                    <template #empty> No Icons </template>
                  </USelectMenu>
                </UFormGroup>
                <UFormGroup name="active" label="Active">
                  <UToggle
                    disabled
                    v-model="service_state.active"
                    on-icon="i-heroicons-check-20-solid"
                    off-icon="i-heroicons-x-mark-20-solid"
                    size="lg"
                  />
                </UFormGroup>
              </div>
            </div>
          </UForm>
        </div>
      </template>

      <template #footer>
        <div class="flex flex-row justify-between">
          <div>
            <UButton size="lg" @click.prevent="onSubmit"> Save </UButton>

            <UButton
              variant="outline"
              color="amber"
              class="ml-2"
              size="lg"
              @click="form.clear()"
            >
              Clear errors
            </UButton>
          </div>
          <UButton
            variant="outline"
            color="red"
            class="ml-2"
            size="lg"
            @click="onClose()"
          >
            Close
          </UButton>
        </div>
      </template>
    </UCard>
  </USlideover>
</template>
