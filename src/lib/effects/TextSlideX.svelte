<script lang="ts">
  import { onMount } from "svelte";
  import { sineOut } from "svelte/easing";
  import { slide } from "svelte/transition";

  let {
    text,
    letterDelay,
  }: {
    text: string;
    letterDelay?: number;
  } = $props();

  let visible: boolean = $state(false);

  onMount(() => {
    setTimeout(() => {
      visible = true;
    }, 100);
  });
</script>

<div class="flex items-center justify-center relative">
  {#each text as c, i}
    <div class="overflow-hidden">
      <div class="invisible">
        {#if c != " "}
          {c}
        {:else}
          &nbsp;
        {/if}
      </div>

      {#if visible}
        <div
          class="absolute top-0"
          in:slide={{
            axis: "x",
            easing: sineOut,
            duration: 1000,
            delay: i * (letterDelay ?? 50),
          }}
        >
          {#if c != " "}
            {c}
          {:else}
            &nbsp;
          {/if}
        </div>
      {/if}
    </div>
  {/each}
</div>
