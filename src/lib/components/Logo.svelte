<script lang="ts">
  import TextSlideX from "$lib/effects/TextSlideX.svelte";

  const text: string = "SILLOKER";

  let {
    overlayColor = "#FFFFFF",
  }: {
    overlayColor: string;
  } = $props();
</script>

<a
  aria-label="Home Logo Button"
  class="absolute font-tny text-5xl top-8 left-12 z-10"
  href="/"
  style:color={overlayColor}
>
  <TextSlideX {text} />
</a>
