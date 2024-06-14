<template>
  <q-dialog :model-value="open" persistent>
    <component :is="component" v-model:close="persist" @closeModal="closeModal" :data="data" />
  </q-dialog>
</template>
<script>
import GameForm from "~/components/GameForm.vue";
import ParticipantOverview from "~/components/ParticipantOverview.vue";
import VolunteerForm from "~/components/VolunteerForm.vue";
import ClubForm from "~/components/ClubForm.vue";
import AssignForm from "~/components/AssignForm.vue";
import AssignVolunteer from "~/components/AssignVolunteer.vue";
import DeadLineForm from "~/components/DeadLineForm.vue";
export default {

  name: 'DialogComponent',
  components:{
    GameForm,
    ParticipantOverview,
    VolunteerForm,
    ClubForm,
    AssignForm,
    AssignVolunteer,
    DeadLineForm
  },
  watch: {
    persist: function(newValue){
      this.$emit('update:open',newValue)
    },
  },
  props:{
    component: {
      type: String,
      required:true
    },
    open: {
      type: Boolean,
      required:true
    },
    data: {
      type: Object
    }
  },
  data(){
    return {
      persist: false
    }
  },
  methods: {
    closeModal(data){
      this.$emit('update:open',data)
    }
  }
}
</script>
