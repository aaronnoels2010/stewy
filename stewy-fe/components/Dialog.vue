<template>
  <q-dialog :model-value="open">
    <component :is="component" v-model:close="persist" @closeModal="closeModal" />
  </q-dialog>
</template>
<script>
import GameForm from "~/components/GameForm.vue";
import ParticipantOverview from "~/components/ParticipantOverview.vue";
import VolunteerForm from "~/components/VolunteerForm.vue";
export default {

  name: 'DialogComponent',
  components:{
    GameForm,
    ParticipantOverview,
    VolunteerForm
  },
  watch: {
    persist: function(newValue){
      console.log('new value voor open ...')
      this.$emit('update:open',newValue)
    },
  },
  props:{
    component: {
      type: String
    },
    open: {
      type: Boolean
    }
  },
  data(){
    return {
      persist: false
    }
  },
  methods: {
    closeModal(data){
      console.log('sluiten van het modal ...')
      this.$emit('update:open',data)
    }
  }
}
</script>