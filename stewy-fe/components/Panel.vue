<template>
  <div style="border: 2px solid red">
    test
  </div>
  <q-splitter
      v-model="splitterModel"
  >
    <template v-slot:before>
      <q-tabs
          style="height: 800px;border: 2px solid red"
          v-model="selectedTab"
          vertical
          class="text-teal"
      >
        <q-tab
            v-for="tab in tabs"
            style="height: fit-content"
            @click="clickedTab(tab)">
          <template v-slot:default>
            <div class="row">
              <div class="col" style="margin-right: 10px">
                <q-icon size="2em" :name="tab.icon"></q-icon>
              </div>
              <div class="col flex flex-center">
                {{tab.label}}
              </div>
            </div>
          </template>
        </q-tab>
      </q-tabs>
    </template>
  </q-splitter>
</template>
<script>
import TableComponent from "~/components/Table.vue";

export default {
  name: 'PanelComponent',
  components: {TableComponent},
  data() {
    return {
      selectedTab: 'volunteer',
      splitterModel: 20,
    }
  },
  methods:{
    clickedTab(data,evt){

    }
  },
  computed: {
    tabs(){
      return [
        {
          label: 'Volunteers',
          icon: 'add',
          path: '/'
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