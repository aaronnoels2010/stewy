<template>
  <div class="row" style="margin-left: 20px">
    <div class="col-auto">
      <q-btn @click="backToListPeople">
        <template v-slot:default>
          <q-icon name="arrow_back"></q-icon>
        </template>
      </q-btn>
    </div>
    <div class="text-h6 text-bold" style="margin-left: 20px">
      Volunteer details
    </div>
  </div>
  <div class="row" style="margin: 20px">
    <div class="col">
      <q-table :rows="games">
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td auto-width>
              <div class="row">
                <div class="col-1">
                  <q-icon name="sports_soccer" size="2em"/>
                </div>
                <div class="col">
                  <div class="row text-uppercase">
                    {{props.row.game}}
                  </div>
                  <div class="row text-grey">
                    {{props.row.date}}
                  </div>
                </div>
              </div>
            </q-td>
            <q-td auto-width>
              <div class="row">
                <q-badge style="background: #32CD32" rounded>
                  <template v-slot:default>
                    <div class="row">
                      <div class="col-1" style="margin-left: 10px">
                        <q-icon style="margin-right: 0!important" name="checked"></q-icon>
                      </div>
                      <div class="col text-green" style="font-size: small">
                        {{props.row.status}}
                      </div>
                    </div>
                  </template>
                </q-badge>
              </div>
            </q-td>
            <q-td auto-width>
              <div class="row">
                {{props.row.earnt}}
              </div>
            </q-td>
            <q-td auto-width>
              <div class="row">
                {{props.row.earnt}}
              </div>
            </q-td>

            <!--
            <q-td :props="props" auto-width>
              {{ props.row.date }}
            </q-td>
            <q-td :props="props" auto-width>
              <q-btn @click="performAction(props.row)" color="primary" label="Action" />
            </q-td>-->
          </q-tr>
        </template>
      </q-table>
    </div>
  </div>
</template>
<script>
import PanelComponent from "~/components/Panel.vue";
export default {
  data() {
    return {
      games: [{
        game: 'krcgenk - stvv',
        date: ' 2024-04-20 18:15',
        status: "Played",
        earnt: "35",

      }],
      splitterModel: 20,
    }
  },
  methods: {
    backToListPeople(){
      this.$router.push('/')
    }
  },
}
</script>