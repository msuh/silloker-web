<script lang="ts">
  import { colorState } from "$lib/states/color.svelte";
</script>

<div
  class="h-[10%] flex space-x-12 font-jws text-md justify-between items-center pr-4"
  style:color={colorState.overlayColor}
>
  <a href={"/aggregation"} class="w-28 text-center">AGGREGATION</a>
  <a href={"/about"} class="w-28 text-center">ABOUT</a>
</div>
