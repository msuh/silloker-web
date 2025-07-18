<script lang="ts">
  import Logo from "$lib/components/Logo.svelte";
  import RecordList from "$lib/components/search-results/RecordList.svelte";
  import SearchBar from "$lib/components/search/SearchBar.svelte";
  import Tabs from "$lib/components/Tabs.svelte";
  import { colorState } from "$lib/states/color.svelte";
  import { searchResult } from "$lib/states/search.svelte";

  $inspect(searchResult);
</script>

<div
  class="h-screen w-screen overflow-y-scroll overrflow-x-hidden flex flex-col
        items-center scrollbar-hidden transition-colors duration-500 ease-out"
  style:background-color={colorState.backgroundColor}
  style:color={colorState.overlayColor}
>
  <div
    class="w-full h-[10%] flex justify-between items-center border-b
           {colorState.mode == 'dark' ? 'border-white/20' : 'border-black/20'}"
  >
    <div class="flex justify-start items-center">
      <div class="pr-24 pl-8">
        <Logo large={false} />
      </div>
      <!-- <div class="flex items-start justify-start bg-gray-400"> -->
      <SearchBar firstSearch={false} />
      <!-- </div> -->
    </div>
    <Tabs />
  </div>

  <div class="w-[75%] h-[90%] pt-16">
    <RecordList />
  </div>
</div>
