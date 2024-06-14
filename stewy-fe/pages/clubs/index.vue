<template>
  <div>
    <div class="row">
      <q-btn label="Add club" @click="open = !open"></q-btn>
    </div>
    <q-table
        grid
        :rows="getClubs"
    >
      <template v-slot:item="props">
        <q-card style="width: 100%;margin-top: 20px" class="element" @click="openClubDetails(props.row)" >
          <div class="row" style="display: flex; justify-content: space-between">
            <div class="col">
              <q-card-section>
                <div class="text-grey text-center">
                  Club
                </div>
                <div class="text-bold text-center">
                  {{ props.row.clubName }}
                </div>
              </q-card-section>
            </div>
            <div class="col">
              <q-card-section>
                <div class="text-grey text-center">
                  Responsible
                </div>
                <div class="text-bold text-center">
                  {{ !!props.row.responsible ? `${props.row.responsible.lastName} ${props.row.responsible.firstName}`: 'Onbekend'}}
                </div>
              </q-card-section>
            </div>
            <div class="col">
              <q-card-section>
                <div class="text-grey text-center">
                  Volunteers
                </div>
                <div class="text-bold text-center">
                  {{!!props.row.volunteerList ? props.row.volunteerList.length : 0}}
                </div>
              </q-card-section>
            </div>
          </div>
        </q-card>
      </template>
    </q-table>
    <DialogComponent
        component="ClubForm"
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
    }
  },
  methods: {
    ...mapActions(useClubStore,{fetchClubs:'fetchAllClubs'}),
    openClubDetails({id}){
      this.$router.push(`/clubs/${id}`)
    },
  },
  computed: {
    ...mapState(useClubStore,['getClubs'])
  },
  created() {
    this.fetchClubs();
    console.log(this.getClubs)
  }
}
</script>
<style scoped>

.element:hover {
  background: rgba(0, 0, 0, 0.03);
}
</style>
