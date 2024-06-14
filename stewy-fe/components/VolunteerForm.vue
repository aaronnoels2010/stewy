<template>
  <q-card class="text-black text-bold text-uppercase" style="width: 300px">
    <q-card-section>
      <div>Create new user</div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <q-form ref="volunteer" greedy>
        <div class="row">
          <div class="col-12">
            <q-input
                v-model="currentVolunteer.firstName"
                filled
                label="firstName"
                :rules="[value => !!value || 'required']"
            />
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <q-input
                v-model="currentVolunteer.lastName"
                filled
                label="lastName"
                :rules="[value => !!value || 'required']"
            />
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <q-input
                v-model="currentVolunteer.kbvbId"
                filled
                label="kbvb id"
                :rules="[value => !!value || 'required']"
            />
          </div>
        </div>
        <div class="row" style="padding-bottom: 10px">
          <div class="col-auto">
            <q-radio v-model="currentVolunteer.volunteerRole" val="VV" label="VV" />
            <q-radio v-model="currentVolunteer.volunteerRole" val="HS" label="HS" />
            <q-radio v-model="currentVolunteer.volunteerRole" val="DC" label="DC" />
            <q-radio v-model="currentVolunteer.volunteerRole" val="ST" label="ST" />
          </div>
        </div>
        <div class="row">
          <div class="col">
            <q-select
                emit-value
                map-options
                outlined
                v-model="currentVolunteer.clubId"
                :options="getClubsAsListOptions"
                label="club"
            />
          </div>
        </div>
      </q-form>
    </q-card-section>

    <q-card-actions>
      <div class="row justify-center" style="margin-left: 16px;width: 100%;gap: 10px">
        <div class="col-auto">
          <q-btn label="Cancel" color="red" @click="closeModal" ></q-btn>
        </div>
        <div class="col-auto">
          <q-btn label="Save" color="red" @click="saveUser" ></q-btn>
        </div>
      </div>
    </q-card-actions>
  </q-card>
  <Dialog
    component="VolunteerForm"
    :open="this.open"
    />
</template>
<script>
import {mapActions, mapState} from "pinia";
import {useVolunteerStore} from "~/stores/volunteers.js";

export default  {
  name: 'VolunteerForm',
  props:{
    close: {
      type: Boolean
    },
    data: {
      type: Object
    }
  },
  data(){
    return {
      open:false,
      currentVolunteer: {
        volunteerRole: 'ST'
      },
    }
  },
  methods: {
    ...mapActions(useVolunteerStore,{addVolunteer:'addVolunteer'}),
    ...mapActions(useClubStore,{fetchAllClubs:'fetchAllClubs'}),
    closeModal(){
      this.$emit('closeModal',false)
    },
    async saveUser(){
      await this.addVolunteer(this.currentVolunteer)
      this.$emit('closeModal',false)

    }
  },
  computed:{
    ...mapState(useClubStore,['getClubsAsListOptions'])
  },
  async created() {
    await this.fetchAllClubs();
    console.log(this.data)
    this.currentVolunteer = {...this.data}
  }

}
</script>
