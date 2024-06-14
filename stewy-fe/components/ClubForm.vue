<template>
  <q-card class=" text-black" style="width: 300px">
    <q-card-section>
      <div class="text-h6 text-center text-bold text-uppercase">create club</div>
    </q-card-section>
    <q-card-section>
      <q-form ref="form" greedy>
        <div class="row" style="padding-bottom: 10px">
          <div class="col">
            <q-input
                outlined
                label="Club name"
                v-model="club.clubName"
                :rules="[value => !!value || 'this field is required']"
            />
          </div>
        </div>
        <div class="row" style="padding-bottom: 10px">
          <div class="col">
            <q-select
                outlined
                :options="responsibles"
                label="Responsible"
                v-model="club.responsible"
            />
          </div>
        </div>
        <div class="row" style="padding-bottom: 10px">
          <div class="col">
            <q-input
                outlined
                autogrow
                label="Parking instructions"
                v-model="club.parkingInstructions"
                :rules="[value => !!value || 'this field is required']"

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
          <q-btn label="Save" color="red" @click="saveClub" ></q-btn>
        </div>
      </div>
    </q-card-actions>
  </q-card>
</template>
<script>
import {mapActions, mapState} from "pinia";
import {useClubStore} from "~/stores/clubs.js";

export default {
  name: 'ClubForm',
  props: {
    close: {
      type: Boolean
    }
  },
  data() {
    return {
      club: {
        clubName: null,
        responsible: null,
        parkingInstructions: null
      },
    }
  },
  methods: {
    ...mapActions(useClubStore,{fetchAllClubs:'fetchAllClubs'}),
    ...mapActions(useClubStore,{addClub:'addClub'}),
    closeModal() {
      this.$emit('closeModal', false)
    },
    async saveClub(){
      const isValid = await this.$refs.form.validate()
      if (!isValid)return
      this.addClub(this.club)
      this.$emit('closeModal', false)
    },
  },
  async created() {
    await this.fetchAllClubs()
  },
  computed:{
  }

}
</script>
