<template>
  <div>
    <div class="row text-bold text-h4" style="margin-bottom: 20px; justify-content: space-between; display: flex" >
      <div class="col">
        Games
      </div>
      <div>
        <q-btn style="width: fit-content" color="blue" @click="()=> open = true">
          <template v-slot:default>
            <div>
              game
              <q-icon name="add"/>
            </div>
          </template>
        </q-btn>
      </div>
    </div>
    <q-table
        grid
        :rows="getGames"
    >
      <template v-slot:item="props">
        <GameOverview
            @updateGame="updateEvents"
            place="games"
            :game="props.row"
          />
      </template>
      <template v-slot:no-data>
        there are no upcomming events
      </template>
    </q-table>
    <Dialog
        component="GameForm"
        v-model:open="open"
    />

  </div>
</template>
<script>
import DialogComponent from "~/components/Dialog.vue";
import {mapActions, mapState} from "pinia";

export default {
  components: {DialogComponent},
  data(){
    return {
      participantOpen: false,
      open: false,
      game: {},
      date: null
    }
  },
  methods: {
    ...mapActions(useGameStore,{fetchAllGames:'fetchAllGames'}),
    ...mapActions(useGameStore,{updateGames:'updateGame'}),

    openParticipantDetails({id}){
      this.$router.push(`/games/${id}`)
    },
    async updateEvents(){

    }
  },
  computed: {
    ...mapState(useGameStore,['getGames']),
  },
  async created() {
    await this.fetchAllGames();

  },
}
</script>
<style scoped>

.element:hover {
  background: rgba(0, 0, 0, 0.03);
}
</style>
