<script lang="ts">
  import { toURLParams } from "$lib/types/search";
  import SearchIcon from "../icons/SearchIcon.svelte";
  import TuneIcon from "../icons/TuneIcon.svelte";
  import { colorState } from "$lib/states/color.svelte";
  import { goto } from "$app/navigation";
  import { searchBarState } from "$lib/states/search.svelte";
  import Input from "./Input.svelte";
  import Checkbox from "./Checkbox.svelte";

  let {
    firstSearch = true,
  }: {
    firstSearch: boolean;
  } = $props();

  let searchYTransform: number = $state(0);
  let searchSettings: boolean = $state(false);
  let visibleDelay: boolean = $state(false);
  // let searchYTransform: number = $state(8);
  // let searchSettings: boolean = $state(true);
  // let visibleDelay: boolean = $state(true);
  let delayTimeout: boolean = $state(false);

  function runSearch() {
    if (searchBarState.keywords.length == 0) return;
    // if (firstSearch) goto(toURLParams(searchBarState));
    goto(toURLParams(searchBarState));
  }

  function expandSettings() {
    if (delayTimeout) return;

    delayTimeout = true;

    searchSettings = !searchSettings;
    if (!searchSettings) searchYTransform = 0;
    else searchYTransform = 8;

    if (visibleDelay) {
      visibleDelay = false;

      setTimeout(() => {
        delayTimeout = false;
      }, 300);
    } else {
      setTimeout(() => {
        visibleDelay = true;
        delayTimeout = false;
      }, 300);
    }
  }

  const recordTypes = ["Wangjo", "Secretariat", "Pibyun", "Garrison"];
</script>

<div
  class="h-[4rem] w-[50rem] flex flex-col px-6 items-start justify-between rounded-4xl
        transitions-all duration-300 ease-out z-10 relative
        {searchSettings ? 'h-[20rem] shadow-lg' : ''}"
  style:background-color={colorState.mode == "dark" ? "#3B3B3B" : "#D1D1D1"}
  style:transform="translateY({searchYTransform}rem)"
>
  <div class="flex justify-between items-center w-full h-[4rem]">
    <button class="size-6 cursor-pointer" onclick={() => runSearch()}>
      <SearchIcon overlayColor={colorState.overlayColor} />
    </button>

    <Input keywords={searchBarState.keywords} searchCallback={runSearch} />

    {#if !firstSearch}
      <button class="size-6 cursor-pointer" onclick={expandSettings}>
        <TuneIcon overlayColor={colorState.overlayColor} />
      </button>
    {/if}
  </div>

  {#if visibleDelay}
    <div class="w-full h-[16rem] py-4 flex flex-col">
      <div class="w-full h-1/4 flex items-center justify-evenly">
        {#each recordTypes as r, index}
          <Checkbox text={r} {index} />
        {/each}
      </div>
      <div class="w-full h-1/4 flex items-center justify-evenly"></div>
    </div>
  {/if}

  <!-- Settings Top Border -->
  {#if searchSettings}
    <div
      class="h-[1px] w-full absolute pointer-events-none bg-transparent border-b
             z-20 left-0 top-[4rem]
            {colorState.mode == 'dark' ? 'border-white/40' : 'border-black/40'}"
    ></div>
  {/if}
</div>
