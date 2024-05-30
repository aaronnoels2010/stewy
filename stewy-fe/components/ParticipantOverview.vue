<template>
  <q-card class=" text-black" style="width: 300px">
    <q-card-section>
      <div class="text-h6 text-bold text-uppercase">Create new Game</div>
    </q-card-section>
    <q-card-section>
      <q-form>
        <div class="row">
          <div class="col">
            <q-select
                label="homeTeam"
                v-model="game.homeTeam"
            />
          </div>
        </div>
        <div class="row">
          <div class="col">
            <q-select
                label="awayTeam"
                v-model="game.homeTeam"
            />
          </div>
        </div>
        <div class="row" style="max-width: 300px">
          <q-input filled v-model="game.date">
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="game.date" mask="YYYY-MM-DD HH:mm">
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
                  <q-time v-model="game.date" mask="YYYY-MM-DD HH:mm" format24h>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
      </q-form>
    </q-card-section>

    <q-card-actions align="right" class="bg-white text-teal">
      <q-btn flat label="OK" v-close-popup />
    </q-card-actions>
  </q-card>
</template>
<script>
export default {
  name: 'ParticipantOverview'
}
</script>