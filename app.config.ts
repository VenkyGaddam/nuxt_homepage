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
        sortAscIcon: "i-octicon-sort-asc-24",
        sortDescIcon: "i-octicon-sort-desc-24",
        sortButton: {
          icon: "i-octicon-arrow-switch-24",
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
