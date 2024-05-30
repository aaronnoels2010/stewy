<template>
  <q-card style="padding: 20px">
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
  <q-card style="padding: 20px;margin-top: 40px">
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
  <Dialog
    component="VolunteerForm"
    v-model:open="open"
    />

</template>
<script>
export default {
  data(){
    return {
      open: false,
      account: {
        name: "Noels Amadeo",
        email: 'noels.amadeo@gmail.com',
        function: 'ST',
        club: 'KRC Genk'

      }
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