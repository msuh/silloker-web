<script lang="ts">
  import CloseIcon from "../icons/CloseIcon.svelte";
  import { colorState } from "$lib/states/color.svelte";
  import KeywordBadge from "./KeywordBadge.svelte";
  import { tick } from "svelte";

  let {
    keywords,
    searchCallback,
  }: {
    keywords: Array<string>;
    searchCallback: () => void;
  } = $props();

  let keyword: string = $state("");
  let isComposing: boolean = false;

  async function handleKeyPress(e: KeyboardEvent) {
    if (e.key === "Enter") {
      // Register keyword on Enter (composition check for int. languages)
      if (keyword.length > 0 && !isComposing) {
        keywords.push(keyword);
        keyword = "";

        // Run Search if valid keywords and no keyword being inputted
      } else if (keyword.length == 0 && keywords.length > 0) {
        searchCallback();
      }
    } else if (e.key === "Backspace") {
      if (keyword.length == 0 && keywords.length > 0) {
        keywords.pop();
      }
    }
  }

  function removeBadge(index: number) {
    keywords.splice(index, 1);
  }
</script>

<div class="w-full h-full px-4 flex items-center justify-between">
  <div class="w-full space-x-2 flex items-center">
    {#each keywords as keyword, index}
      <KeywordBadge {index} {keyword} {removeBadge} />
    {/each}
    <input
      type="search"
      bind:value={keyword}
      oncompositionstart={() => (isComposing = true)}
      oncompositionend={() => (isComposing = false)}
      class="w-full h-full focus:ring-0 focus:ring-offset-0 appearance-none outline-none
          [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden [&::-ms-clear]:hidden [&::-ms-reveal]:hidden"
      onkeydown={handleKeyPress}
    />
  </div>

  <button class="size-6 cursor-pointer" onclick={() => (keyword = "")}>
    {#if keyword.length > 0}
      <CloseIcon overlayColor={colorState.overlayColor} />
    {/if}
  </button>
</div>
