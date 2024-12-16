// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: false },
  modules: ["@nuxt/ui", "@nuxtjs/color-mode", "@nuxtjs/device"],
  runtimeConfig: {
    apiSecret: "", // can be overridden by NUXT_API_SECRET environment variable
    public: {
      apiBase: "", // can be overridden by NUXT_PUBLIC_API_BASE environment variable
    },
    jwtToken:
      "647ad592b1d1d76a295bafa850409a0079a4a8fe8b3ad1c0feff3b4dd33c3bf6401ef76a823bb24fdd989f75f608bbc4beacefeac44805386ecb94d89c060c691e42225eff57521f433f76776cca4705e02f6c6c9544c7d88d4a4aaae8d84f7e9c830abb563ca2c68bc2a6e25206588ee03226020700cb40d6d2faedcea1018d1f5094e40c45f9f2a3dc10d2417d7e641a9803ecfc9b4b1349a70f405a74e5c08b687b91a1d2c23ffe16730e3cd67db32581ed5422e2d4e95bcebf54817f5c5f7143caf581ef13b0420208f4d5e88a45b3970dfc825c12446301c3db6d52732506a8d52015cf710860b6403dd6ed5c322253e4e554d8bc12ded331636f2f05df",
    jwtRefreshToken:
      "966c092dd9dc640f3b20983d7de1d168f8a16c2ec50cc0d55e3a3d5f116e87edc2a6c6ff17212d20af7855454badf9cdc6f3179acd10861378f115d8811160a8ce5327929f57fb8b48c9831e262d56c11fcaf4073d137f588f50b650971f8ee9998e5431bdc3d3bf9f719d04e38ed137ddf167f0bb2a306e6ef241029d2c000bb377113fa21df58858770ad5fee956d592dbba542bede5716469533a58d33d6fcd29b0d3a8519d526eb0a70643bd8e248cf5269a57475135e0eb0b3830fb8e574dafecd1c140b2e75fccc73ca0eb0136a38ff231a4599dc1ed204ed76c868d6aab847aec507cbbcbe0091f8c5df6fea293a725c792f4be66ccf546fc57826e3f",
  },
  colorMode: {
    preference: "system", // default value of $colorMode.preference
    fallback: "dark", // fallback value if not system preference found
    storage: "sessionStorage", // or 'localStorage' or 'cookie'
    storageKey: "nuxt-color-mode",
  },
  icon: {
    serverBundle: false,
    clientBundle: {
      // list of icons to include in the client bundle
      // icons: ["uil:github", "logos:vitejs"],

      // scan all components in the project and include icons
      scan: true,

      // include all custom collections in the client bundle
      // includeCustomCollections: true,

      // guard for uncompressed bundle size, will fail the build if exceeds
      sizeLimitKb: 256,
    },
  },
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
    },
    pageTransition: { name: "fade-scale", mode: "out-in" },
  },
});
