<template>
  <div class="row" style="height: 100vh;background: lightblue">
    <div class="col" style="height: 50vh;margin-left: 40px">
      <img width="100%" height="100%" src="https://quotefancy.com/media/wallpaper/3840x2160/1638004-Sherry-Anderson-Quote-Volunteers-don-t-get-paid-not-because-they.jpg" alt="">
    </div>
    <div class="col" style="height: 50vh;margin-right: 40px;background: white">
      <div class="row text-h4" style="padding:40px 40px 0;color: lightblue">
        Hello!
      </div>
      <div class="row text-h4" style="color: lightblue;padding-left: 40px">
        Volunteer
      </div>
      <div class="row text-h5 text-center text-uppercase" style="display: flex;justify-content: center">
        sign in
      </div>
      <div class="row" style="display: flex;justify-content: center;margin-top: 20px">
        <div class="col-6" >
          <q-input label="KBVB ID" outlined v-model="userName">
          </q-input>
        </div>
      </div>
      <div class="row" style="display: flex;justify-content: center;margin-top: 20px">
        <div class="col-6" >
          <q-input label="PASSWORD" outlined v-model="password">
          </q-input>
        </div>
      </div>
      <div class="row" style="display: flex;justify-content: center;margin-top: 5px">
        <div class="col-6 flex" style="justify-content: end">
         Forgot Password?
        </div>
      </div>
      <div class="row" style="display: flex;justify-content: center;margin-top: 20px">
        <div class="col-6 flex justify-center" >
          <q-btn label="Login" rounded style="background: lightblue"></q-btn>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
definePageMeta({
  layout: false,
})
export default {
  data() {
    return {
      userName: '',
      password: '',
      emailRules: [
        val => !!val || 'E-mail is verplicht',
        val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Ongeldig e-mailadres'
      ],
      passwordRules: [
        val => !!val || 'Wachtwoord is verplicht'
      ]
    }
  },
  methods: {
    login() {
      // Implementeer hier je login logica, bijvoorbeeld met behulp van Vuex en/of Axios
      console.log('Inloggen...');
    }
  }
}
</script>

<style scoped>
.login-card {
  max-width: 400px;
  margin: 100px auto;
  padding: 20px;
}
.full-width {
  width: 100%;
}
</style>
