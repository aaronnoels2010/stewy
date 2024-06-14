<template>
  <q-card class=" text-black" style="width: 300px">
    <q-card-section>
      <div class="text-h6 text-bold text-uppercase text-center"> {{exisitingGame ? 'Update game' : 'Create new Game'}} </div>
    </q-card-section>
    <q-card-section>
      <q-form ref="form" greedy>
        <div class="row" style="margin-bottom: 10px">
          <div class="col">
            <q-select
                emit-value
                map-options
                filled
                :options="getClubsAsListOptions"
                label="homeTeam"
                v-model="game.homeTeam"
                :rules="[ value => !!value || 'This field need to be filled in' ]"
            />
          </div>
        </div>
        <div class="row" style="margin-bottom: 10px">
          <div class="col">
            <q-select
                emit-value
                map-options
                filled
                :options="getClubsAsListOptions"
                label="homeTeam"
                v-model="game.awayTeam"
                :rules="[ value => !!value || 'This field need to be filled in' ]"
            />
          </div>
        </div>
        <div class="row" style="margin-bottom: 10px" >
          <div class="col">
            <q-input
                filled
                v-model="game.appointment"
                label="Appointment"
                :rules="[ value => !!value || 'This field need to be filled in' ]"
            >
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date :options="dateOptions" v-model="game.appointment" mask="YYYY-MM-DD HH:mm">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>

              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-time v-model="game.appointment" mask="YYYY-MM-DD HH:mm" format24h>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>

        </div>
        <div class="row" style="margin-bottom: 10px" >
          <div class="col">
            <q-input
                filled
                v-model="game.deadline"
                label="Deadline"
                :rules="[ value => !!value || 'This field need to be filled in' ]"
            >
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="game.deadline" mask="YYYY-MM-DD HH:mm">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>

              <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-time v-model="game.deadline" mask="YYYY-MM-DD HH:mm" format24h>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>

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
          <q-btn :label="exisitingGame ? 'Update' : 'Save'" color="red" @click="saveGame" ></q-btn>
        </div>
      </div>
    </q-card-actions>
  </q-card>
</template>
<script>
import {mapActions, mapState} from "pinia";
import date from 'date-and-time';
export default {
  props: {
    data: {
      type: Object,
      default: () => []
    }
  },
  name: 'GameForm',
  data(){
    return{
      game: {}
    }
  },
  computed:{
    ...mapState(useClubStore,['getClubsAsListOptions']),
    exisitingGame(){
      return !!this.game.id
    },
    getCurrentDate(){
      return new Date()
    }

},
  methods:{
    ...mapActions(useGameStore,{addGame:'addGame'}),
    ...mapActions(useGameStore,{updateGame:'updateGame'}),
    ...mapActions(useClubStore,{fetchAllClubs:'fetchAllClubs'}),
    closeModal(){
      this.$emit('closeModal', false)
    },
    async saveGame(){
      const res = await this.$refs.form.validate()
      if (!res) return
      console.log(res)
      this.$emit('closeModal', false)
      if (this.exisitingGame){
        await this.updateGame(this.game)
      } else {
        await this.addGame(this.game)
      }
    },
    dateOptions(date){
      const currentDate = new Date();
      const optionDate = new Date(date)
      return optionDate > currentDate
    }
  },
  async created() {
    await this.fetchAllClubs()
    this.game = {...this.data}
    this.game.appointment = date.format(new Date(),"YYYY-MM-DD HH:mm");
  },

}
</script>
<style>
.col:focus {
  display: flex;
  flex-direction: row;
}
</style>
