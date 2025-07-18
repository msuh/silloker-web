<script lang="ts">
  import { onMount } from "svelte";
  import { sineOut } from "svelte/easing";
  import { slide } from "svelte/transition";

  let {
    text,
    letterDelay,
    delay = 0,
    load = true,
    duration = 1000,
  }: {
    text: string;
    letterDelay?: number;
    delay?: number;
    load?: boolean;
    duration?: number;
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

      {#if visible && load}
        <div
          class="absolute top-0"
          in:slide={{
            axis: "x",
            easing: sineOut,
            duration: duration,
            delay: i * (letterDelay ?? 50) + delay,
          }}
          out:slide={{
            axis: "x",
            easing: sineOut,
            duration: duration / 4,
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
