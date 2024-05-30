<template>
  <TableComponent/>

</template>
<script>

import PanelComponent from "~/components/Panel.vue";
import TableComponent from "~/components/Table.vue";

export default {
  components: {TableComponent, PanelComponent},
  data() {
    return {
      tab: 'volunteer',
      splitterModel: 20,
    }
  },
  created() {

  }
}
</script>