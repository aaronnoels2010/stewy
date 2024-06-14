<template>
  <div style="padding-left: 10px;padding-right: 10px">
    <div class="row">
      <div class="col text-center text-bold text-grey text-uppercase" style="padding: 10px">
        {{label}}
      </div>
    </div>
    <div class="row">
      <div class="col-auto">
        <q-btn @click="substract">
          <template v-slot:default>
            <q-icon name="remove"></q-icon>
          </template>
        </q-btn>
      </div>
      <div class="text-bold text-center" style="padding: 10px;width: 40px;font-size: 20px">
        {{currentNumber}}
      </div>
      <div class="col-auto">
        <q-btn @click="add">
          <template v-slot:default>
            <q-icon name="add" />
          </template>
        </q-btn>
      </div>
    </div>

  </div>
</template>
<script>
export default {
  name: 'IntervalTimer',
  props: {
    label:{
      type: String
    },
    currentNumber:{
      type: Number
    }
  },

  data(){
    return{
    }
  },
  methods:{
    add(){
      console.log("execute")
      const updatedValue = this.currentNumber++
      this.$emit("update", updatedValue)
    },
    substract(){
      this.data = this.data === 0 ? 0 : this.data - 1
    }
  }
}
</script>
