<script setup lang="ts">
import { onServerPrefetch, ref, watch } from "vue";
import { pages } from "../page-data.js";

const props = defineProps<{
  id: string;
}>();

const html = ref("");

async function loadPage(id: string) {
  html.value = pages[id] ? (await pages[id]()).default : "";
}

onServerPrefetch(() => loadPage(props.id));

if (typeof window !== "undefined") {
  watch(() => props.id, loadPage, { immediate: true });
}
</script>

<template>
  <div class="solo-static" v-html="html" />
</template>
