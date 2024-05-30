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
      <q-table :rows="users"
               @row-click="rowClick"
               @update:pagination="(val) => test(val)"
               :pagination="initialPagination"
               />
    <q-dialog style="width: fit-content" v-model="persistent" persistent transition-show="scale" transition-hide="scale">
      <q-card class="text-black text-bold text-uppercase" style="width: 300px">
        <q-card-section>
          <div>Create new user</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form>
            <div class="row">
              <div class="col-12">
                <q-input
                    v-model="volunteer.firstName"
                    filled
                    label="firstName"
                    :rules="[value => !!value || 'required']"
                />
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <q-input
                    v-model="volunteer.lastName"
                    filled
                    label="lastName"
                    :rules="[value => !!value || 'required']"
                />
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <q-input
                    v-model="volunteer.kbvbId"
                    filled
                    label="kbvb id"
                    :rules="[value => !!value || 'required']"
                />
              </div>
            </div>
            <div class="row">
              <div class="col">
                <q-select
                    v-model="volunteer.club"
                    :options="['krcgenk','rafc','stvv']"
                    label="club"
                />
              </div>


            </div>
          </q-form>
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="OK" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import volunteers from "~/data/volunteers.js";
import NuxtLink from "#app/components/nuxt-link.js";
export default {
  name: 'TableComponent',
  data() {
    return {
      persistent: false,
      searchVolunteers: null,
      volunteer: {
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
  methods: {
    createNewUser() {
      console.log("clicked on button ...")
    },
    test(val){
      this.initialPagination = val
      console.log(this.initialPagination)
      console.log(val)
      console.log("clicked pagination ...")
    },
    rowClick(data,evt){
      this.$router.push(`/volunteer/${evt.kbvbId}`)
    }
  },
  created() {
    this.users = volunteers
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