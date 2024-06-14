<template>
  <div class="q-pa-md">
      <div class="row" style="margin-bottom: 20px; justify-content: space-between; display: flex" >
        <div>
          <q-input v-model="searchVolunteers" filled/>
        </div>
        <div>
          <q-btn style="width: fit-content" color="blue" @click="persistent = true">
            <template v-slot:default>
              <div>
                user
                <q-icon name="add"/>
              </div>

            </template>
          </q-btn>
        </div>
      </div>
      <q-table :rows="getVolunteers"
               @row-click="rowClick"
               @update:pagination="(val) => test(val)"
               :pagination="initialPagination"
               />
    <q-dialog style="width: fit-content" v-model="persistent" persistent transition-show="scale" transition-hide="scale">

    </q-dialog>
  </div>
</template>
<script>
import volunteers from "~/data/volunteers.js";
import NuxtLink from "#app/components/nuxt-link.js";
import {mapActions, mapState} from "pinia";
export default {
  name: 'TableComponent',
  data() {
    return {
      persistent: false,
      searchVolunteers: null,
      volunteer: {
        volunteerRole: 'ST'
      },
      users: [],
      initialPagination: {
        sortBy: 'name',
        descending: false,
        page: 1,
        rowsPerPage: 5
        // rowsNumber: xx if getting data from a server
      },
    };
  },
  computed: {
    ...mapState(useVolunteerStore,['getVolunteers']),
    ...mapState(useClubStore,['getClubs'])
  },
  methods: {
    ...mapActions(useVolunteerStore,{addVolunteer:'addVolunteers'}),
    ...mapActions(useClubStore,{fetchAllClubs:'fetchAllClubs'}),
    async createNewUser() {
      const isValid = await this.$refs.volunteer.validate()
      if (!isValid) return
      await this.addVolunteer(this.volunteer)

    },
    test(val){
      this.initialPagination = val
    },
    rowClick(data,evt){
      this.$router.push(`/volunteers/${evt.id}`)
    }
  },
  async created() {
    await this.fetchAllClubs();
  }
};
</script>
<style>
.row {
  display: flex;
  align-items: center;
}

.col {
  display: flex;
  flex-direction: column;
}
</style>