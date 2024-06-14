<template>
    <IntervalTimer
        label="days"
    />
  <div class="row text-bold text-h4" style="margin-bottom: 20px; justify-content: space-between; display: flex" >

    <div class="col">
      Volunteers
    </div>
    <div>
      <q-btn style="width: fit-content" color="blue" @click="()=> open = true">
        <template v-slot:default>
          <div>
            user
            <q-icon name="add"/>
          </div>
        </template>
      </q-btn>
    </div>
  </div>
  <q-table
          grid
          :rows="getVolunteers"
      >
        <template v-slot:item="props">
              <VolunteerOverview
                  :volunteer="props.row"
              />
        </template>
        <template v-slot:no-data>
          <div class="col" style="padding-left: 0">
            <q-card style="width: 100%;margin-top: 20px">
              <q-card-section>
                <div class="row justify-between text-bold">
                  <div class="col">
                    no volunteers could be found
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </template>
      </q-table>
  <Dialog
    v-model:open="open"
    component="VolunteerForm"
    />
</template>
<script>

import PanelComponent from "~/components/Panel.vue";
import TableComponent from "~/components/Table.vue";
import {mapActions, mapState} from "pinia";
import {useVolunteerStore} from "~/stores/volunteers.js";

export default {
  components: {TableComponent, PanelComponent},
  data() {
    return {
      searchVolunteers: null,
      open:false,
      searchVolunteer: null
    }
  },
  created() {
    this.fetchAllVolunteers();
  },
  methods: {
    ...mapActions(useVolunteerStore, {fetchAllVolunteers:'fetchAllVolunteers'}),
    ...mapActions(useVolunteerStore, {generateError:'generateError'}),
    test(val){
      this.initialPagination = val
    },
    goToVolunteerDetails(volunteerId){
      console.log("clicked ...")
      this.$router.push(`/volunteers/${volunteerId}`)
    },
    rowClick(data,evt){
      this.$router.push(`/volunteers/${evt.id}`)
    }
  },
  computed:{
    ...mapState(useVolunteerStore,['getVolunteers'])
  },

}
</script>
<style scoped>

</style>
