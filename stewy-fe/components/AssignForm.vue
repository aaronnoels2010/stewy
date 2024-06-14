<template>
  <q-card class=" text-black" style="width: 300px">
    <q-card-section>
      <div class="text-h6 text-center text-bold text-uppercase">Assign Responsible</div>
    </q-card-section>
    <q-card-section>
      <q-form ref="responsible">
        <div class="row" style="padding-bottom: 10px">
          <div class="col">
            <q-select
                emit-value
                map-options
                :options="getVolunteersAsListWithFullName"
                outlined
                label="Responsible"
                v-model="responsible"
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
import {useVolunteerStore} from "~/stores/volunteers.js";

export default {
  name: 'AssignForm',
  props: {
    close: {
      type: Boolean
    }
  },
  data() {
    return {
      responsible: null,
    }
  },
  methods: {
    ...mapActions(useClubStore,{assignVolunteer:'assignVolunteer'}),
    closeModal() {
      this.$emit('closeModal', false)
    },
    async saveClub(){
      const valid = await this.$refs.responsible.validate();

      if (!valid)return
      console.log(this.$route.params)
      const {slug:clubId} = this.$route.params
      await this.assignVolunteer( clubId, this.responsible)
      this.$emit('closeModal', false)

    }
  },
  computed:{
    ...mapState(useVolunteerStore,['getVolunteersAsListWithFullName'])
  }

}
</script>