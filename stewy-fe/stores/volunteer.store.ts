import { defineStore } from "pinia";
import volunteersData from "../data/volunteers.json";
import type { Volunteer } from "~/types/volunteer.type";

export const useVolunteerStore = defineStore("volunteers", () => {
  const volunteers = ref<Volunteer[]>([]);

  const fetchVolunteers = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    volunteers.value = volunteersData;
  };

  const addVolunteer = (volunteer: Volunteer) => {
    volunteers.value.push(volunteer);
  };

  return { volunteers, fetchVolunteers, addVolunteer };
});
