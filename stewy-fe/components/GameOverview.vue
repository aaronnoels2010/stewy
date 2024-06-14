<template>
  <q-card :class="isSelectable ? 'element' : ''" style="width: 100%;margin-top: 20px"  @click="openGameDetails(game.id)" >
    <div :class="isVisible ? 'justify-between row' : 'justify-around row'" style="display: flex">
      <div class="col-3">
        <q-card-section>
          <div class="text-grey text-center">
            Game
          </div>
          <div class="text-bold text-center">
            {{game.game }}
          </div>
        </q-card-section>
      </div>
      <div class="col-2">
        <q-card-section>
          <div class="text-grey text-center">
            Date
          </div>
          <div class="text-bold text-center">
            {{!!game.appointment ? game.appointment.split(" ")[0] : ''}}
          </div>
        </q-card-section>
      </div>
      <div class="col-1">
        <q-card-section>
          <div class="text-grey text-center">
            Hour
          </div>
          <div class="text-bold text-center">
            {{!!game.appointment ? game.appointment.split(" ")[1] : ''}}

          </div>
        </q-card-section>
      </div>
      <div class="col-1" v-if="isVisible">
        <q-card-section>
          <div class="text-grey text-center">
            Status
          </div>
          <div class="text-bold text-center">
            <q-badge :color="game.status === 'OPEN' ? 'green' : 'red'" :label="game.status"/>
          </div>
        </q-card-section>
      </div>
      <div class="col-1" v-if="isVisible">
        <q-card-section>
          <div class="text-grey text-center">
            Participants
          </div>
          <div class="text-bold text-center">
            {{!!game.participants ? game.participants.length : 0}}
          </div>
        </q-card-section>
      </div>
      <div class="col-1">
        <q-card-section  v-if="isOpen">
          <div class="text-grey text-center">
            Deadline
          </div>
          <div :class=" `text-bold text-center ${calculate(game.deadline).status}`">
            {{calculate(game.deadline).deadline}}
          </div>
        </q-card-section>
      </div>
      <div class="col-2 test">
        <q-card-section>
          <div class="test justify-end flex">
            <q-btn v-if="!editable" style="width: 140px" color="blue" @click.stop="clickSubscribe()" :label="!isOpen ? 'publish' : isSubscribed ? 'unsubscribe' : 'subscribe' "></q-btn>
            <q-btn v-else @click="this.openGameForm = true">
              <q-icon color="orange" name="edit"></q-icon>
            </q-btn>
          </div>
        </q-card-section>
      </div>


    </div>
  </q-card>
  <div>
  </div>
  <Dialog
      component="GameForm"
      :data="getGameAsForm"
      v-model:open="openGameForm"
  />
</template>
<script>
import {mapActions, mapState} from "pinia";

export default {
  name: 'GameOverview',
  props:{
    game:{
      type: Object
    },
    isSelectable: {
      type: Boolean,
      default: true
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
    isSubscribed: {
      type: Boolean,
      default: false
    },
    place:{
      type: String
    },
    editable: {
      type: Boolean,
      default: false,
    }
  },
  data(){
    return {
      date: null,
      test: false,
      interval: null,
      openGameForm: false,
    }

  },
  methods: {
    ...mapActions(useGameStore,{openSubscriptionsToGame:'openSubscriptionsToGame'}),
    calculate(d) {
      const eindDatum = new Date(d)
      const startDatum = new Date(this.date)

      let verschil = Math.abs(startDatum - eindDatum);

      // Bereken het aantal dagen, uren, minuten en seconden
      const dagen = Math.floor(verschil / (1000 * 60 * 60 * 24));
      verschil -= dagen * (1000 * 60 * 60 * 24);

      const uren = Math.floor(verschil / (1000 * 60 * 60));
      verschil -= uren * (1000 * 60 * 60);

      const minuten = Math.ceil(verschil / (1000 * 60));
      const e = Math.floor(verschil / (1000 * 60));

      verschil -= e * (1000 * 60);


      const seconden = Math.floor(verschil / 1000);

      let status;

      if (dagen > 0) {
        status = "status-ok"
      } else if (uren >= 2) {
        status = "status-warning"
      } else {
        status = "status-critical"
      }

      this.test = startDatum >= eindDatum


      // Return een object met de berekende waarden
      return {deadline: `${dagen} : ${uren} : ${minuten}`, status: status}
    },
    openGameDetails(gameId) {
      this.showDetails ? this.$router.push(`/games/${gameId}`) : null
    },
    async clickSubscribe(){
      await this.openSubscriptionsToGame(this.game);
    },
    async closeGame(gameId){
      console.log('execute close game')
      this.$emit('updateGame',gameId)
    }
  },
  mounted() {
    if (process.client) {
      if (this.isOpen){
        this.interval = setInterval(() => {
          this.date = new Date()
          if (this.subscriptionDeadlinePast){
            console.log('deadline has been pased')
            this.closeGame(this.game.id)
            window.clearTimeout(this.interval)
            this.interval = null
          }
        }, 1000);
      }
      }
  },
  computed:{
    ...mapState(useGameStore,['getGameAsForm']),
    isOpen(){
      return this.game.status === 'OPEN';
    },
    showDetails(){
      return this.game.status !== 'CREATE';

    },
    subscriptionDeadlinePast(){
      return this.test
    }
  },
  unmounted() {
    window.clearInterval(this.interval)
    this.interval = null
  },
  created() {
    this.date = new Date();
  }
}
</script>
<style scoped>
.q-btn:before{
  box-shadow: none;
}
.element:hover {
  background: rgba(0, 0, 0, 0.03);
}
.status-ok{
  color: green;
}
.status-warning{
  color: orange;
}
.status-critical{
  color:red
}
</style>
