import { jwtDecode } from "jwt-decode";

// Auth state
const isAuth = ref(true);
const isLoading = ref(false);
const error = ref(null);
const user = ref<ClientUser | null>({ Id: "", Username: "" });
const storageKey = "auth-jwt-token";
var token: string | null = null;

export const useAuth = () => {
  // init method to initialze the auth data
  const init = () => {
    if (isValidToken() && token) {
      decodeToken(token);
    }
  };

  // login method
  const login = async (
    username: string,
    password: string,
    rememberMe?: boolean
  ): Promise<boolean> => {
    isLoading.value = true;
    error.value = null;
    isAuth.value = false;

    try {
      // Perform the login API request
      const response = await $fetch<ApiResponse>("/api/v1/auth/login", {
        method: "POST",
        body: {
          username,
          password,
        },
      });

      if (!response.success) {
        throw new Error(response.message || "Login failed.");
      }

      // If login is successful, handle token
      token = response.data?.token;
      if (token) {
        if (rememberMe) {
          // Store the token persistently
          localStorage.setItem(storageKey, token);
          sessionStorage.removeItem(storageKey);
        } else {
          // Store the token temporarily
          sessionStorage.setItem(storageKey, token);
          localStorage.removeItem(storageKey);
        }
      }

      // TODO: To make a inflight call to server to read the user details
      // Currently passing the user details in token
      if (token) decodeToken(token); //decode the token to get the user details
      isAuth.value = true;
      return true; // Indicate login success
    } catch (e: any) {
      error.value = e.message || "An unexpected error occurred.";
      logout(); // Ensure cleanup
      return false; // Indicate login failure
    } finally {
      isLoading.value = false;
    }
  };

  const register = (username: string, password: string): boolean => {
    isLoading.value = true;
    error.value = null;
    // TODO: Implement register post call here
    return true;
  };

  const refresh = (): boolean => {
    isLoading.value = true;
    error.value = null;
    let remember = false;

    return false;
    // TODO: Implement the refresh token
    // if (localStorage.getItem(storageKey)) {
    //   remember = true;
    //   options.axiosInstance.defaults.headers.common["Authorization"] =
    //     options.authorizationScheme +
    //     " " +
    //     localStorage.getItem(options.storageKey);
    // } else {
    //   options.axiosInstance.defaults.headers.common["Authorization"] =
    //     options.authorizationScheme +
    //     " " +
    //     sessionStorage.getItem(options.storageKey);
    // }

    // return options.axiosInstance
    //   .get<T>(url)
    //   .then((response: { data: T | any }) => {
    //     options.axiosInstance.defaults.headers.common["Authorization"] =
    //       options.authorizationScheme + response.data[options.tokenKey];
    //     remember
    //       ? localStorage.setItem(
    //           options.storageKey,
    //           response.data[options.tokenKey]
    //         )
    //       : sessionStorage.setItem(
    //           options.storageKey,
    //           response.data[options.tokenKey]
    //         );
    //     isAuth.value = true;
    //     return response;
    //   })
    //   .catch((response) => {
    //     logout();
    //     return response;
    //   })
    //   .finally(() => (isLoading.value = false));
  };

  const logout = () => {
    // options.axiosInstance.defaults.headers.common["Authorization"] = false;
    localStorage.removeItem(storageKey);
    sessionStorage.removeItem(storageKey);
    isAuth.value = false;
  };

  const isValidToken = (): boolean => {
    if (import.meta.client) {
      if (localStorage.getItem(storageKey)) {
        // Store the token persistently
        token = localStorage.getItem(storageKey);
      } else {
        // Store the token temporarily
        token = sessionStorage.getItem(storageKey);
      }
    }

    if (token) {
      console.log(`Token: ${token}`);
      try {
        // Decode the token with type checking
        const decodedToken = jwtDecode<DecodedToken>(token);

        if (!decodedToken.exp) {
          throw new Error("Token does not have an expiry field");
        }

        const currentTime = Date.now() / 1000; // Current time in seconds

        if (decodedToken.exp < currentTime) {
          console.log("auth: " + "Token expired");
          // TODO: refresh the token later if refresh token is present and valid

          // Token has expired
          localStorage.removeItem(storageKey);
          throw new Error("Token expired");
        }

        isAuth.value = true;
        return true;
      } catch (e: any) {
        console.info("Error decoding token:", e.message);
        // Handle token decoding errors
        localStorage.removeItem(storageKey);
        error.value = e.message || "An unexpected error occurred.";
        isAuth.value = false;
        return false;
      }
    }
    isAuth.value = false;
    return false;
  };

  const decodeToken = (token: string) => {
    try {
      const decodedToken = jwtDecode<DecodedToken>(token);
      user.value = {
        Id: decodedToken.id,
        Username: decodedToken.username,
        Displayname: decodedToken.displayname || "",
      };
    } catch (err) {
      console.error("Error decoding token:", err);
      user.value = null;
    }
  };

  isAuth.value = isValidToken();

  return {
    init,
    login,
    register,
    refresh,
    logout,
    isAuth,
    isValidToken,
    isLoading,
    error,
    user,
  };
};
