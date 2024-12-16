<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";

const schema = z.object({
  username: z.string().min(3, "Invalid username"),
  password: z.string().min(8, "Must be at least 8 characters"),
  rememberMe: z.boolean(),
});

const state = reactive({
  username: "demo",
  password: "YHgVhz88",
  rememberMe: false,
});

type Schema = z.output<typeof schema>;
const toast = useToast();
const { login, isLoading, error } = useAuth();

async function onSubmit() {
  let response = await login(state.username, state.password);

  if (!response) {
    toast.add({
      id: "login-error",
      title: "Login error",
      description: error.value ? error.value : "",
      icon: "i-mdi:checkbox-marked-circle-outline",
      color: "red",
      timeout: 2500,
    });
  }

  // navigate to the home page
  await navigateTo("/");
}
</script>

<template>
  <UContainer
    :ui="{
      base: 'mx-auto',
      padding: 'px-4 sm:px-6 lg:px-8',
      constrained: 'min-w-[24rem] max-w-7xl',
    }"
  >
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <div class="flex flex-col gap-2 mt-24">
        <UFormGroup label="Username" name="username">
          <UInput
            v-model="state.username"
            placeholder="Enter your username"
            :disabled="isLoading"
          />
        </UFormGroup>

        <UFormGroup label="Password" name="password">
          <UInput
            v-model="state.password"
            type="password"
            placeholder="Enter your password"
            :disabled="isLoading"
          />
        </UFormGroup>

        <UCheckbox
          v-model="state.rememberMe"
          label="remeber me?"
          :ui="{
            label: 'text-sm font-light',
          }"
          :disabled="isLoading"
        />
      </div>

      <div class="flex flex-row items-end gap-5">
        <UButton type="submit" :disabled="isLoading" @click.prevent="onSubmit">
          <span v-if="!isLoading">Sign In</span>
          <span v-else>
            <i class="i-mdi:loading animate-spin mr-2"></i>Logging in...
          </span>
        </UButton>
        <UButton variant="link" :disabled="isLoading">Forgot Password</UButton>
      </div>
    </UForm>
  </UContainer>
</template>
