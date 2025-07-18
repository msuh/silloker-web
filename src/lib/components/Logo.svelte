<script lang="ts">
  import TextSlideX from "$lib/effects/TextSlideX.svelte";
  import { colorState } from "$lib/states/color.svelte";

  const text: string = "SILLOKER";

  let {
    large,
  }: {
    large: boolean;
  } = $props();
</script>

{#if large}
  <div class="font-tny text-[10rem]">
    <TextSlideX {text} />
  </div>
{:else}
  <a
    aria-label="Home Logo Button"
    class="font-tny text-5xl top-8 left-12 z-10"
    href="/"
    style:color={colorState.overlayColor}
  >
    <TextSlideX {text} />
  </a>
{/if}
