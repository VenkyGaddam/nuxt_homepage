import { jwtDecode } from "jwt-decode";

export const useAuth = () => {
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const user = useState<UserPayload | null>("user", () => null);

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    isLoading.value = true;
    error.value = null;

    try {
      const response: ApiResponse = await $fetch<ApiResponse>(
        "/api/v1/auth/login",
        {
          method: "POST",
          body: { username, password },
        }
      );

      if (!response.success) throw new Error(response.message);

      // Fetch the user data after successful login
      await fetchUser();

      return true;
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : "Login failed";
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await $fetch<ApiResponse>("/api/v1/auth/logout", { method: "POST" });
      user.value = null; // Clear user data on logout
    } catch (e) {
      console.error("Logout failed:", e);
    }
    navigateTo("/login");
  };

  const refresh = async (): Promise<void> => {
    try {
      const response: ApiResponse = await $fetch<ApiResponse>(
        "/api/v1/auth/refresh",
        { method: "POST" }
      );

      if (!response.success) throw new Error("Refresh failed");

      // Fetch the user data after successful login
      await fetchUser();
    } catch (e: unknown) {
      await logout();
    }
  };

  const fetchUser = async () => {
    try {
      const response: ApiResponse = await $fetch<ApiResponse>(
        "/api/v1/auth/user",
        {
          method: "GET",
        }
      );
      console.log(`fetchUser: ${JSON.stringify(response)}`);
      if (response.success) {
        user.value = response.data as UserPayload;
      } else {
        user.value = null;
      }
    } catch (e) {
      user.value = null;
      console.error("Failed to fetch user data:", e);
    }
  };

  return {
    login,
    logout,
    refresh,
    fetchUser,
    user,
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
  };
};
