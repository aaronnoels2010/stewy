<template>
 <div class="row flex justify-between" style="margin-left: 20px">
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
         Game details
       </div>
     </div>
   </div>
   <div class="col-auto">
     <q-btn @click="exportFile"
            outline
     >
       <template v-slot:default>
         <div class="row">
           <div class="col">
             <q-icon name="attach_file"/>
           </div>
           <div class="col-auto">
             {{getSelectedGame.game}}
           </div>
         </div>
       </template>
     </q-btn>
   </div>
  </div>
  <div class="row" style="margin-left: 20px">
      <GameOverview
          :is-selectable="false"
          :editable="true"
          :game="getSelectedGame"
        />
    </div>
  <div class="row text-bold text-h4" style="margin-left: 20px;margin-top: 20px">
    Organizer
  </div>
  <div class="row" style="margin-left: 20px">
     <q-card class="element" style="width: 100%;margin-top: 20px">
       <div class="row" style="display: flex; justify-content: space-between">
         <div class="col-3">
           <q-card-section>
             <div class="text-grey text-center">
               Last name
             </div>
             <div class="text-bold text-center">
               {{ !!getSelectedGame.responsible ? getSelectedGame.responsible.lastName : null }}
             </div>
           </q-card-section>
         </div>
         <div class="col-3">
           <q-card-section>
             <div class="text-grey text-center">
               First name
             </div>
             <div class="text-bold text-center">
               {{ !!getSelectedGame.responsible ? getSelectedGame.responsible.firstName : null}}
             </div>
           </q-card-section>
         </div>
         <div class="col-auto">
           <q-card-section>
             <div class="text-grey text-center">
               Kbvb id
             </div>
             <div class="text-bold text-center">
               {{ !!getSelectedGame.responsible ?getSelectedGame.responsible.kbvbId : null }}
             </div>
           </q-card-section>
         </div>
         <div class="col-3">
           <q-card-section>
             <div class="text-grey text-center">
               Role
             </div>
             <div class="text-bold text-center">
               <q-badge color="green" :label="!!getSelectedGame.responsible ? getSelectedGame.responsible.role : null"/>
             </div>
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
      :rows="!!getSelectedGame.participants ? getSelectedGame.participants : []"
  >
    <template v-slot:item="props">
      <VolunteerOverview
          :volunteer="props.row"
        />
    </template>
  </q-table>
</template>
<script>
import {mapActions, mapState} from "pinia";

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
      ],
      file: 'test'
    }
  },
  methods: {
    ...mapActions(useGameStore,{fetchGameById:'fetchGameById'}),
    backToGamesList(){
      this.$router.push('/games')
    },
    async exportFile(){
      const pdfContent = `
    <html>
      <head>
        <title>PDF Document</title>
      </head>
      <body>
        <h1>Hello</h1>
        <p>Hoe gaat ie</p>
      </body>
    </html>
  `;


      event.res.setHeader('Content-Type', 'application/pdf');
      event.res.end(buffer);
      const url = URL.createObjectURL(pdfContent);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'document.pdf';
      link.click();
      console.log("export ...")
    }
  },
  computed:{
    ...mapState(useGameStore,['getSelectedGame'])
  },

  async created() {
    const {id} = this.$route.params;

    await this.fetchGameById(id);
  }
}
</script>
<style scoped>
</style>
