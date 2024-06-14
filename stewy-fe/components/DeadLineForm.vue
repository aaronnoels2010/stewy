<template>
  <div>
    <q-card>
      <q-card-section>
        <div class="text-h6 text-bold text-uppercase text-center"> update deadline </div>
      </q-card-section>
      <q-card-section>
        <div class="row">
          <div class="col-auto">
            <IntervalTimer
                label="days"
            />
          </div>
          <div class="col-auto">
            <IntervalTimer
                label="hours"
            />
          </div>
          <div class="col-auto">
            <IntervalTimer
                label="minutes"
                v-model:current-number="minutes"
            />
          </div>
        </div>
      </q-card-section>
      <q-card-actions>
        <div class="row justify-center" style="margin-left: 16px;width: 100%;gap: 10px">
          <div class="col-auto">
            <q-btn label="Cancel" color="red" @click="closeModal" ></q-btn>
          </div>
          <div class="col-auto">
            <q-btn color="green" label="update deadline" @click="updateDeadline" ></q-btn>
          </div>
        </div>
      </q-card-actions>

    </q-card>

  </div>
</template>
<script>
export default {
  name: 'DeadLineForm',
  data(){
    return {
      deadline: {
        days: 0,
        hours: 0,
        minutes: 0
      },
      minutes: 0
    }
  },
  methods:{
    updateDeadline(){
      console.log("nog in te vullen ...")
    },
    closeModal(){
      console.log("nog in te vullen ...")
    }
  }
}
</script>
