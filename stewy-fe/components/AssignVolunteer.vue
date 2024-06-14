<template>
  <q-card class=" text-black" style="width: 300px">
    <q-card-section>
      <div class="text-h6 text-bold text-uppercase">Assign volunteer to game</div>
    </q-card-section>
    <q-card-section>
      <q-form>
        <div class="row" style="margin-bottom: 10px">
          <div class="col">
            <q-select
                emit-value
                map-options
                filled
                option-disable="subscribed"
                :options="getVolunteerGameParticipations"
                label="Game"
                v-model="game"
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.label }}</q-item-label>
                  </q-item-section>
                  <q-item-section v-if="scope.opt.subscribed" avatar>
                    <q-icon name="sports_soccer" />
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
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
          <q-btn label="Save" color="red" @click="assignVolunteerToGame" ></q-btn>
        </div>
      </div>
    </q-card-actions>
  </q-card>
</template>
<script>
import {mapActions, mapState} from "pinia";

export default {
  name: 'GameForm',
  props:{
    data: {
      type: Object
    }
  },
  data(){
    return{
      game: null
    }
  },
  computed:{
    ...mapState(useVolunteerStore,['getVolunteerGameParticipations'])
  },
  methods:{
    ...mapActions(useVolunteerStore,{fetchAllGames:'findGamesWithParticipationStatus'}),
    ...mapActions(useVolunteerStore,{subscribeVolunteerToGame:'subscribeVolunteerToGame'}),
    closeModal(){
      this.$emit('closeModal', false)
    },
    async assignVolunteerToGame(){
      await this.subscribeVolunteerToGame(this.data.id,this.game)
      this.$emit('closeModal', false)

    }
  },
  async created() {
    await this.fetchAllGames(this.data.id)
  }
}
</script>
<style>
.col:focus {
  display: flex;
  flex-direction: row;
}
</style>
