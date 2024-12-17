export default defineAppConfig({
  title: "Homelight",
  description: "Personal home site",
  brandIcon: "i-token:rainbow",
  loginCheck: false,
  ui: {
    primary: "green",
    gray: "neutral",
    strategy: "override",
    input: {
      size: {
        "2xs": "text-xs",
        xs: "text-xs",
        sm: "text-base",
        md: "text-base",
        lg: "text-base",
        xl: "text-base",
      },
      default: {
        loadingIcon: "i-octicon-sync-24",
        size: "sm",
      },
    },
    select: {
      default: {
        size: "xl",
        loadingIcon: "i-hugeicons:loading-03",
      },
    },
    selectMenu: {
      default: {
        size: "xl",
        selectedIcon: "i-carbon:dot-mark",
        loadingIcon: "i-hugeicons:loading-03",
      },
    },
    table: {
      wrapper: "",
      thead: "",

      default: {
        sortAscIcon: "i-heroicons-arrow-up-20-solid",
        sortDescIcon: "i-heroicons-arrow-down-20-solid",
        sortButton: {
          icon: "i-heroicons-sparkles-20-solid",
        },
        loadingState: {
          icon: "i-hugeicons:loading-03",
        },
        emptyState: {
          icon: "i-octicon-database-24",
        },
      },
    },
  },
});
