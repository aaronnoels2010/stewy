<template>
  <div>
    <div class="row text-bold text-h4" style="margin-bottom: 20px; justify-content: space-between; display: flex" >
      <div class="col">
        Upcoming Events
      </div>
    </div>
    <q-table
        grid
        :rows="getOpenGames"
    >
      <template v-slot:item="props">
        <GameOverview
            @updateGame="updateEvents"
            place="dashboard"
            :game="props.row"
        />
      </template>
      <template v-slot:no-data>
        <q-card style="width: 100%">
          <div class="row">
            <div class="col flex text-center text-bold text-h5 text-uppercase">
              there are no upcomming events

            </div>
          </div>
        </q-card>
      </template>
    </q-table>

  </div>
</template>
<script>
import {mapActions, mapState} from "pinia";

export default {
  data(){
    return {
      data:null
    }
  },
  methods:{
    ...mapActions(useGameStore,{fetchAvailableGames:'fetchAllOpenGames'}),
    ...mapActions(useGameStore,{updateGames:'updateGamesReturnOpenGames'}),
    async updateEvents(gameId){
      await this.updateGames(gameId)
    }
  },
  async created() {
    await this.fetchAvailableGames();
  },
  computed:{
    ...mapState(useGameStore,['getOpenGames'])
  },
}
</script>
<style>
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
