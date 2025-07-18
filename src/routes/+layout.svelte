<script lang="ts">
  import LightSwitch from "$lib/components/LightSwitch.svelte";
  import "../app.css";

  let { children } = $props();
</script>

<LightSwitch />

{@render children()}
