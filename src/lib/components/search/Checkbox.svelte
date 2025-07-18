<script lang="ts">
  import TextSlideX from "$lib/effects/TextSlideX.svelte";
  import { colorState } from "$lib/states/color.svelte";
  import { fade } from "svelte/transition";
  import { sineOut } from "svelte/easing";
  import { onMount } from "svelte";

  let {
    index,
    text,
  }: {
    index: number;
    text: string;
  } = $props();

  let checked: boolean = $state(true);
  let visible: boolean = $state(false);

  onMount(() => {
    setTimeout(() => {
      visible = true;
    }, 0);
  });
</script>

<div class="inline-flex items-center">
  {#if visible}
    <label
      class="flex items-center cursor-pointer relative"
      for="check-{index}"
      in:fade={{
        duration: 300,
        easing: sineOut,
      }}
    >
      <input
        type="checkbox"
        bind:checked
        class="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border"
        style:background-color={checked
          ? colorState.overlayColor
          : "transparent"}
        style:border-color={colorState.overlayColor}
        id="check-{index}"
      />
      <span
        class="absolute opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        style:color={colorState.backgroundColor}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-3.5 w-3.5"
          viewBox="0 0 20 20"
          fill="currentColor"
          stroke="currentColor"
          stroke-width="1"
        >
          <path
            fill-rule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clip-rule="evenodd"
          ></path>
        </svg>
      </span>
    </label>
  {/if}
  <label
    class="cursor-pointer ml-2 text-sm"
    for="check-{index}"
    style:color={colorState.overlayColor}
  >
    <TextSlideX {text} letterDelay={25} duration={500} />
  </label>
</div>
