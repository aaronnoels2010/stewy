<template>
  <div>
    <div class="row">
      <q-btn label="Add game" @click="open = !open"></q-btn>
    </div>
    <q-table
        grid
        :rows="games"
    >
      <template v-slot:item="props">
        <q-card style="width: 100%;margin-top: 20px" class="element" @click="openParticipantDetails(props.row)" >
          <div class="row" style="display: flex; justify-content: space-between">
            <div class="col-5">
              <q-card-section>
                <div class="text-grey text-center">
                  Game
                </div>
                <div class="text-bold text-center">
                  {{ props.row.game }}
                </div>
              </q-card-section>
            </div>
            <div class="col-auto">
              <q-card-section>
                <div class="text-grey text-center">
                  Date
                </div>
                <div class="text-bold">
                  {{ props.row.date.split(" ")[0] }}
                </div>
              </q-card-section>
            </div>
            <div class="col-auto">
              <q-card-section>
                <div class="text-grey text-center">
                  Hour
                </div>
                <div class="text-bold">
                  {{ props.row.date.split(" ")[1]}}
                </div>
              </q-card-section>
            </div>

            <div class="col-auto">
              <q-card-section>
                <div class="text-grey text-center">
                  Status
                </div>
                <div class="text-bold">
                  <q-badge color="green" label="Create"/>
                </div>
              </q-card-section>
            </div>
            <div class="col-auto">
              <q-card-section>
                <div class="text-grey text-center">
                  Participants
                </div>
                <div class="text-bold text-center">
                  {{props.row.participants}}
                </div>
              </q-card-section>
            </div>
          </div>
        </q-card>
      </template>
    </q-table>
    <DialogComponent
        component="GameForm"
        v-model:open="open"
    />

  </div>
</template>
<script>
import DialogComponent from "~/components/Dialog.vue";
import {mapState} from "pinia";

export default {
  components: {DialogComponent},
  data(){
    return {
      participantOpen: false,
      open: false,
      game: {},
    }
  },
  methods: {
    openParticipantDetails({id}){
      this.$router.push(`/games/${id}`)
    },
    mouseOver(){
      console.log("mouseover ...")
    }
  },
  computed: {
    ...mapState(useGameStore,['games'])
  },
  created() {
    console.log('test')
    console.log(this.games)
  }
}
</script>
<style scoped>

.element:hover {
  background: rgba(0, 0, 0, 0.03);
}
</style>