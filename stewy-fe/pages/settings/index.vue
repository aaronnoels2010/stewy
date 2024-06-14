<template>
  <div class="row text-bold text-h4" style="margin-bottom: 20px; justify-content: space-between; display: flex" >
    <div class="col">
      Settings
    </div>
  </div>
  <div class="row" style="margin-bottom: 20px">
    <div class="col">
      <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="blue"
          indicator-color="blue"
          align="justify"
          narrow-indicator
      >
        <q-tab name="account" label="Account" />
        <q-tab name="club" label="Club" />
        <q-tab name="volunteers" label="Stewards" />
      </q-tabs>
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="account">
          <div class="row" style="margin-bottom: 20px">
            <div class="col">
              <q-card style="padding: 20px">
                <q-card-section class="text-bold text-h6">
                  Access
                </q-card-section>
                <q-card-section class="section">
                  <div class="row">
                    <div class="col-auto">
                      <q-icon name="lock" color="grey" size="32px"></q-icon>
                    </div>
                    <div class="col text-blue-grey" style="margin-left: 20px">
                      Change your password
                    </div>
                    <div class="col-2" style="display: flex;justify-content: end">
                      <q-icon name="navigate_next" color="grey" size="32px"></q-icon>

                    </div>
                  </div>
                </q-card-section>
                <q-card-section class="section">
                  <div class="row">
                    <div class="col-auto">
                      <q-icon name="manage_accounts" color="grey" size="32px"></q-icon>
                    </div>
                    <div class="col text-blue-grey" style="margin-left: 20px">
                      Deactivate Account
                    </div>
                    <div class="col-2" style="display: flex;justify-content: end">
                      <q-icon name="navigate_next" color="grey" size="32px"></q-icon>

                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <q-card>
                <q-card-section class="text-bold text-h6">
                  <div class="row">
                    <div class="col">
                      Account
                    </div>
                    <div class="col-auto">
                      <q-btn label="Edit Profile" outline color="grey" @click="() => open = !open"/>
                    </div>
                  </div>
                </q-card-section>
                <q-card-section>
                  <div class="row flex" style="margin-bottom: 20px;justify-content: end">

                  </div>
                  <div class="row" style="margin-bottom: 20px">
                    <div class="col">
                      <q-input readonly stack-label label="Name" outlined v-model="account.name"/>
                    </div>
                  </div>
                  <div class="row" style="margin-bottom: 20px">
                    <div class="col">
                      <q-input readonly stack-label label="email" outlined v-model="account.email"/>
                    </div>
                  </div><div class="row" style="margin-bottom: 20px">
                  <div class="col">
                    <q-input readonly stack-label label="Function" outlined v-model="account.function"/>
                  </div>
                </div>
                  <div class="row">
                    <div class="col">
                      <q-input readonly stack-label label="Club" outlined v-model="account.club"/>
                    </div>
                  </div>

                </q-card-section>
              </q-card>

            </div>
          </div>
        </q-tab-panel>
        <q-tab-panel name="club">
          <q-card style="padding: 20px;margin-top: 40px">
            <q-card-section class="text-bold text-h6">
              Game
            </q-card-section>
            <q-card-section class="section" @click="changeDeadline">
              <div class="row">
                <div class="col-auto">
                  <q-icon name="schedule" color="grey" size="32px"></q-icon>
                </div>
                <div class="col text-blue-grey" style="margin-left: 20px">
                  Change your deadline
                </div>
                <div class="col-2" style="display: flex;justify-content: end">
                  <q-icon name="navigate_next" color="grey" size="32px"></q-icon>
                </div>
              </div>
            </q-card-section>
            <q-card-section class="section">
              <div class="row">
                <div class="col-auto">
                  <q-icon name="manage_accounts" color="grey" size="32px"></q-icon>
                </div>
                <div class="col text-blue-grey" style="margin-left: 20px">
                  Deactivate Account
                </div>
                <div class="col-2" style="display: flex;justify-content: end">
                  <q-icon name="navigate_next" color="grey" size="32px"></q-icon>

                </div>
              </div>
            </q-card-section>
          </q-card>
        </q-tab-panel>
      </q-tab-panels>
    </div>

  </div>
  <Dialog
    component="VolunteerForm"
    v-model:open="open"
    />
  <Dialog
      component="deadLineForm"
      v-model:open="openChangeDeadline"
  />

</template>
<script>
export default {
  data(){
    return {
      open: false,
      tab: 'account',
      account: {
        name: "Noels Amadeo",
        email: 'noels.amadeo@gmail.com',
        function: 'ST',
        club: 'KRC Genk'

      },
      openChangeDeadline: false,
    }
  },
  methods:{
    changeDeadline(){
      console.log("open change deadline")
      this.openChangeDeadline = true
    }
  }

}
</script>
<style scoped>
.section:hover {
  background: rgba(0, 0, 0, 0.03);
}
.q-field--outlined.q-field--readonly .q-field__control:before {
  border-style: solid;
}
</style>
