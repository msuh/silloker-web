<script lang="ts">
  import { colorState } from "$lib/states/color.svelte";
  import DarkIcon from "./icons/DarkIcon.svelte";
  import LightIcon from "./icons/LightIcon.svelte";

  function switchMode() {
    if (colorState.mode == "light") {
      [colorState.overlayColor, colorState.backgroundColor] = [
        colorState.backgroundColor,
        colorState.overlayColor,
      ];
      colorState.mode = "dark";
    } else {
      [colorState.overlayColor, colorState.backgroundColor] = [
        colorState.backgroundColor,
        colorState.overlayColor,
      ];
      colorState.mode = "light";
    }
  }

  $inspect(colorState.mode);
</script>

<div
  class="rounded-lg absolute bottom-8 right-8 p-1"
  style:border-color={colorState.overlayColor}
>
  <div class="size-6">
    {#if colorState.mode == "dark"}
      <button onclick={switchMode} class="w-full h-full cursor-pointer">
        <LightIcon overlayColor={colorState.overlayColor} />
      </button>
    {:else}
      <button onclick={switchMode} class="w-full h-full cursor-pointer">
        <DarkIcon overlayColor={colorState.overlayColor} />
      </button>
    {/if}
  </div>
</div>
