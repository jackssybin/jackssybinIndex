import { defineClientConfig } from "vuepress/client";
import SearchPage from "./components/SearchPage.vue";
import SoloPage from "./components/SoloPage.vue";

export default defineClientConfig({
  enhance({ app }) {
    app.component("SoloPage", SoloPage);
    app.component("SearchPage", SearchPage);
  }
});
