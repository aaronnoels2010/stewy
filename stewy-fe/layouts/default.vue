<template>
  <div class="row text-center text-h6 text-bold text-blue" style="margin-bottom: 10px;padding: 10px">
    <div class="col">
      Stewy
    </div>
    <div class="col-auto">
      <q-btn>
        <q-icon name="menu"></q-icon>
        <q-menu>
          <q-list style="min-width: 100px">
            <q-item clickable>
              <q-item-section>
                <div class="row">
                  <div class="col-4">
                    <q-icon name="logout"></q-icon>
                  </div>
                  <div class="col" style="padding-right: 5px" >
                    Logout
                  </div>
                </div>
              </q-item-section>
            </q-item>
            <!-- Content inside default slot -->
          </q-list>
        </q-menu>
      </q-btn>
    </div>
  </div>
  <div class="row" style="align-items: start">
    <div class="col-auto">
      <q-tabs

          style=" height: 100%;margin-left: 10px"
          v-model="selectedTab"
          vertical
          class="text-black"
      >
        <q-tab
            v-for="tab in tabs"
            style="height: fit-content;width: 200px;display: flex"
            @click="clickedTab(tab)">
          <template v-slot:default>
            <div class="row" style="display: flex;justify-content: space-around">
              <div>
                <q-icon size="2em" :name="tab.icon"></q-icon>
              </div>
              <div style="margin-left: 20px">
                {{tab.label}}
              </div>
            </div>
          </template>
        </q-tab>
      </q-tabs>
    </div>
    <div class="col q-pa-md">
      <NuxtPage/>
    </div>
  </div>
</template>
<script>
import TableComponent from "~/components/Table.vue";

export default {
  name: 'PanelComponent',
  components: {TableComponent},
  data() {
    return {
      selectedTab: 'volunteer',
      splitterModel: 8,
    }
  },
  methods:{
    clickedTab(data){
      this.$router.push(data.path)

    }
  },
  computed: {
    tabs(){
      return [
        {
          label: 'Volunteers',
          icon: 'add',
          path: '/volunteers'
        },
        {
          label: 'DashBoard',
          icon: 'dashboard',
          path: '/dashboard'
        },
        {
          label: 'Settings',
          icon: 'settings',
          path: '/settings'
        },
        {
          label: 'Games',
          icon: 'sports_soccer',
          path: '/games'
        }
      ]
    }
  }
}
</script>
<style scoped>
.justify-center, .flex-center {
  justify-content: start;
}
.q-btn:before{
  box-shadow: none;
}
</style>