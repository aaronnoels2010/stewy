<script setup>
import { useVolunteerStore } from "~/stores/volunteer.store";

const { volunteers, fetchVolunteers } = useVolunteerStore();
const open = ref(false);

onMounted(async () => {
  await fetchVolunteers();
});
</script>

<template>
  <div
    class="flex flex-col mx-2"
    style="margin-bottom: 20px; justify-content: space-between; display: flex"
  >
    <div class="flex justify-between">
      <h3 class="tex-3xl font-bold">Volunteers</h3>
      <button class="btn" @click="open = true">Add user</button>
    </div>
    <div>
      <div class="overflow-x-auto">
        <table class="table">
          <!-- head -->
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Roles</th>
              <th>KBVB Id</th>
            </tr>
          </thead>
          <tbody>
            <!-- row 1 -->
            <tr v-for="(volunteer, index) in volunteers">
              <th>{{ index + 1 }}</th>
              <td>{{ volunteer.name }}</td>
              <td>{{ volunteer.roles.join(", ") }}</td>
              <td>{{ volunteer.kbvbId }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <Dialog :open="open" component="VolunteerForm" @close-modal="open = false">
      <VolunteerForm />
    </Dialog>
  </div>
</template>

<style scoped></style>
