<template>
  <div class="row flex justify-between">
    <div class="col">
      <div class="row">
        <div class="col-auto">
          <q-btn @click="backToGamesList">
            <template v-slot:default>
              <q-icon name="arrow_back"></q-icon>
              <div>
              </div>
            </template>
          </q-btn>
        </div>
        <div class="text-h6 text-bold" style="margin-left: 20px">
          Volunteer details
        </div>
      </div>
    </div>
    <div class="col-auto">
      <q-btn @click="assignToGame">
        <template v-slot:default>
          <div class="row">
            <div class="col-auto">
              <q-icon name="add"></q-icon>
            </div>
            <div class="col" style="font-size: 16px">
              Add Game
            </div>
          </div>
          <div>
          </div>
        </template>
      </q-btn>
    </div>
  </div>
  <div class="row" style="margin-top: 20px">
    <q-tabs
        style="width: 100%"
        v-model="tab"
        align="justify"
        narrow-indicator
        class="q-mb-lg"
    >
      <q-tab class="text-purple" name="details" label="Details" />
      <q-tab class="text-orange" name="upComingGames" label="Subscribed Games" />
    </q-tabs>
  </div>
  <div class="row">
    <q-tab-panels
        style="width: 100%"
        v-model="tab"
        animated
        transition-prev="scale"
        transition-next="scale"
        class="text-black text-center"
    >
      <q-tab-panel name="details">
        <div class="row text-bold text-h4" style="margin-top: 20px">
          Details
        </div>
        <div class="row">
          <div class="col">
            <VolunteerOverview
                :editable="true"
                :volunteer="getVolunteer"
            />
          </div>
        </div>
      </q-tab-panel>
      <q-tab-panel name="upComingGames">
        <div class="row text-bold text-h4" style="margin-top: 20px">
          Subscribed games
        </div>
        <div class="row">
          <div class="col">
            <q-table
                grid
                :rows="getVolunteer.games"
            >
              <template v-slot:item="props">
                <GameOverview
                    :is-subscribed="true"
                    :is-visible="false"
                    :game="props.row"
                />
              </template>
              <template v-slot:no-data>
                <div class="col" style="padding-left: 0">
                  <q-card style="width: 100%;margin-top: 20px">
                    <q-card-section>
                      <div class="row justify-between text-bold">
                        <div class="col">
                          no games planned in the future
                        </div>
                      </div>
                    </q-card-section>
                  </q-card>
                </div>
              </template>
            </q-table>
          </div>
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </div>
  <Dialog
    component="AssignVolunteer"
    v-model:open="openAssignGameModal"
    />
</template>

<script>
import {mapActions, mapState} from "pinia";

export default {
  name: 'VolunteerDetails',
  data(){
    return {
      openAssignGameModal: false,
      tab: 'details'
    }
  },
  computed:{
    ...mapState(useVolunteerStore,['getVolunteer'])
  },
  methods:{
    ...mapActions(useVolunteerStore,{fetchVolunteerById:'fetchVolunteerById'}),
    backToGamesList(){
      this.$router.push('/')
    },
    assignToGame(){
      this.openAssignGameModal = true
    }
  },
  async created() {
    const {id} = this.$route.params
    await this.fetchVolunteerById(id)
  }
}
</script>
