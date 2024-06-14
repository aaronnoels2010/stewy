<template>
  <q-card :class="isSelectable ? 'element' : ''" style="width: 100%;margin-top: 20px" @click="goToVolunteerDetails(volunteer.id)">
    <div class="row" style="display: flex; justify-content: space-between">
      <div class="col-3">
        <q-card-section>
          <div class="text-grey text-center">
            Last name
          </div>
          <div class="text-bold text-center">
            {{volunteer.lastName}}
          </div>
        </q-card-section>
      </div>
      <div class="col-3">
        <q-card-section>
          <div class="text-grey text-center">
            First name
          </div>
          <div class="text-bold text-center">
            {{volunteer.firstName}}

          </div>
        </q-card-section>
      </div>
      <div class="col-auto">
        <q-card-section>
          <div class="text-grey text-center">
            Kbvb id
          </div>
          <div class="text-bold text-center">
            {{volunteer.kbvbId}}

          </div>
        </q-card-section>
      </div>
      <div class="col-3">
        <q-card-section>
          <div class="text-grey text-center">
            Role
          </div>
          <div class="text-bold text-center">
            <q-badge color="green" :label="volunteer.role"/>
          </div>
        </q-card-section>
      </div>
      <div class="col-auto" v-if="editable">
        <q-card-actions style="display: flex;justify-content: end">
          <div class="row">
            <div class="col">
              <q-btn class="editButton" @click="openModal">
                <q-icon name="edit" color="orange"></q-icon>
              </q-btn>
            </div>
            <div class="col-auto">
              <q-btn @click="assignVolunteerToGame()">
                <template v-slot:default>
                  <div class="row">
                    <div class="col-auto">
                      <q-icon name="sports_soccer"></q-icon>
                    </div>
                  </div>
                  <div>
                  </div>
                </template>
              </q-btn>
            </div>
          </div>
        </q-card-actions>
      </div>
    </div>
  </q-card>
  <Dialog
    component="AssignVolunteer"
    :data="getGameAsForm"
    v-model:open="openModal"
    />

</template>
<script>
import AssignVolunteer from "~/components/AssignVolunteer.vue";
import {mapState} from "pinia";

export default {
  name: 'VolunteerOverview',
  computed: {
    ...mapState(useGameStore,['getGameAsForm']),
    AssignVolunteer() {
      return AssignVolunteer
    }
  },
  data(){
    return {
      openModal: false,
    }
  },
  props:{
    volunteer: {
      type: Object,
      required: true,
    },
    editable: {
      type: Boolean,
      default: false
    },
    isSelectable: {
      type: Boolean,
      default: true,
    }
  },
  methods:{
    goToVolunteerDetails(volunteerId){
      this.$router.push(`/volunteers/${volunteerId}`)
    },
    assignVolunteerToGame(){
      this.openModal = true
    }
  }
}
</script>
<style scoped >
.q-btn:before{
  box-shadow: none;
}
.element:hover {
  background: rgba(0, 0, 0, 0.03);
}
</style>
