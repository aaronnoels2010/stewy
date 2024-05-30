<template>
  <q-card class=" text-black" style="width: 300px">
    <q-card-section>
      <div class="text-h6 text-bold text-uppercase">Update volunteer</div>
    </q-card-section>
    <q-card-section>
      <q-form>
        <div class="row">
          <div class="col">
            <q-select
                label="First name"
                v-model="volunteer.name"
            />
          </div>
        </div>
      </q-form>
    </q-card-section>
    <q-card-actions>
      <div class="row">
        <div class="col">
          <q-btn label="Cancel" color="red" @click="closeModal" ></q-btn>
        </div>
      </div>
    </q-card-actions>
  </q-card>
</template>
<script>
export default  {
  name: 'VolunteerForm',
  props:{
    close: {
      type: Boolean
    }
  },
  data(){
    return {
      volunteer: {
        name: 'Noels Amadeo'
      },
    }
  },
  methods: {
    closeModal(){
      console.log('updating close from volunteerForm ...')
      this.$emit('closeModal',false)
    }
  }

}
</script>