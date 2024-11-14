<script setup>
const props = defineProps({
  component: String,
  data: Object,
  open: Boolean,
});

const { open } = toRefs(props);

const emit = defineEmits(["closeModal"]);

const closeModal = () => {
  emit("closeModal", false);
};

watch(
  open,
  () => {
    if (open.value) {
      document.getElementById("my_modal_1").showModal();
    }
  },
  { immediate: true }
);
</script>

<template>
  <dialog
    id="my_modal_1"
    class="modal"
    @click="closeModal"
    @keydown.esc="closeModal"
  >
    <div class="modal-box">
      <div>
        <slot></slot>
      </div>
      <div class="modal-action">
        <form method="dialog">
          <button class="btn" @click="closeModal">Close</button>
        </form>
      </div>
    </div>
  </dialog>
</template>
