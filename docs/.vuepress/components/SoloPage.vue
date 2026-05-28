<script setup lang="ts">
import { computed } from "vue";
import { pages } from "../page-data.js";

const props = defineProps<{
  id: string;
}>();

const html = computed(() => pages[props.id] || "");
</script>

<template>
  <div class="solo-static" v-html="html" />
</template>
