<template>
  <div class="row" style="margin-left: 20px">
    <div class="col-auto">
      <q-btn @click="backToGamesList">
        <template v-slot:default>
          <q-icon name="arrow_back"></q-icon>
        </template>
      </q-btn>
    </div>
    <div class="text-h6 text-bold" style="margin-left: 20px">
      Game details
    </div>
  </div>
  <div class="row" style="margin-left: 20px">
      <q-card style="width: 100%;margin-top: 20px">
        <div class="row" style="display: flex; justify-content: space-between">
          <div class="col-5">
            <q-card-section>
              <div class="text-grey text-center">
                Game
              </div>
              <div class="text-bold text-center">
                {{ game.game }}
              </div>
            </q-card-section>
          </div>
          <div class="col-auto">
            <q-card-section>
              <div class="text-grey text-center">
                Date
              </div>
              <div class="text-bold">
                {{ game.date.split(" ")[0] }}
              </div>
            </q-card-section>
          </div>
          <div class="col-auto">
            <q-card-section>
              <div class="text-grey text-center">
                Hour
              </div>
              <div class="text-bold">
                {{ game.date.split(" ")[1]}}
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
              <div class="text-bold text-center cursor-pointer" @click="openParticipantDetails(game)">
                {{game.participants}}
              </div>
            </q-card-section>
          </div>

          <div class="col-auto" >
            <q-card-section style="display: flex;justify-content: end">
              <q-btn class="editButton" >
                <q-icon name="edit" color="orange"></q-icon>
              </q-btn>
            </q-card-section>
          </div>
        </div>
      </q-card>
    </div>
  <div class="row text-bold text-h4" style="margin-left: 20px;margin-top: 20px">
      Participants
    </div>
    <q-table
        style="margin-left: 20px"
      grid
      :rows="participants"
  >
    <template v-slot:item="props">
      <q-card style="width: 100%;margin-top: 20px">
        <div class="row" style="display: flex; justify-content: space-between">
          <div class="col-3">
            <q-card-section>
              <div class="text-grey text-center">
                Name
              </div>
              <div class="text-bold text-center">
                {{ props.row.name }}
              </div>
            </q-card-section>
          </div>
          <div class="col-auto">
            <q-card-section>
              <div class="text-grey text-center">
                Position
              </div>
              <div class="text-bold text-center">
                {{ props.row.responsible}}
              </div>
            </q-card-section>
          </div>

          <div class="col-auto">
            <q-card-section>
              <div class="text-grey text-center">
                Status
              </div>
              <div class="text-bold">
                <q-badge color="green" :label="props.row.status"/>
              </div>
            </q-card-section>
          </div>
          <div class="col-auto" >
            <q-card-section style="display: flex;justify-content: end">
              <div class="row">
                <div class="col">
                  <q-btn>
                    <q-icon name="done" color="green"/>
                  </q-btn>
                </div>
                <div class="col">
                  <q-btn>
                    <q-icon name="close" color="red"/>
                  </q-btn>
                </div>
              </div>
            </q-card-section>
          </div>
        </div>
      </q-card>
    </template>
  </q-table>
</template>
<script>
export default {
  data(){
    return {
      game: {
    id: 1, game: 'Club Brugge - Anderlecht', date: "2024-04-01 20:30", participants: 45

      },
      participants:[
        {
          name: 'Amadeo Noels',
          status: 'Pending',
          responsible: 'ST',
        }
      ]
    }
  },
  methods: {
    backToGamesList(){
      this.$router.push('/games')
    }
  }
}
</script>
<style scoped>
.q-btn:before{
  box-shadow: none;
}
</style>