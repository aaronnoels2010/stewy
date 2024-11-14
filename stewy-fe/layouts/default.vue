<script setup>
const selectedTab = ref("volunteer");
const splitterModel = ref(8);
const { data, signOut } = useAuth();

const clickedTab = (data) => {
  const router = useRouter();
  router.push(data.path);
};

const tabs = [
  {
    label: "Volunteers",
    icon: "add",
    path: "/volunteers",
  },
  {
    label: "DashBoard",
    icon: "dashboard",
    path: "/dashboard",
  },
  {
    label: "Settings",
    icon: "settings",
    path: "/settings",
  },
  {
    label: "Games",
    icon: "sports_soccer",
    path: "/games",
  },
  {
    label: "Clubs",
    icon: "sports_soccer",
    path: "/clubs",
  },
  {
    label: "Chat",
    icon: "chat",
    path: "/chat",
  },
];
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <div class="flex navbar bg-base-100 justify-between">
      <div>
        <label
          for="my-drawer-2"
          class="btn btn-primary drawer-button lg:hidden"
        >
          Open drawer
        </label>
        <a class="btn btn-ghost text-xl">Stewy</a>
      </div>
      <div>
        <span class="mr-4">Hey, {{ data.user.name }}</span>
        <button class="btn" @click="signOut">Logout</button>
      </div>
    </div>
    <div class="drawer lg:drawer-open flex-1">
      <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
      <div class="drawer-content flex flex-col">
        <div>
          <NuxtPage />
        </div>
      </div>
      <div class="drawer-side">
        <label
          for="my-drawer-2"
          aria-label="close sidebar"
          class="drawer-overlay"
        ></label>
        <div class="flex flex-col mx-4">
          <button v-for="tab in tabs" class="btn mb-4" @click="clickedTab(tab)">
            {{ tab.label }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.justify-center,
.flex-center {
  justify-content: start;
}
.q-btn:before {
  box-shadow: none;
}
</style>
