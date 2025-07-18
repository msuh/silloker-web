<script lang="ts">
  import Logo from "$lib/components/Logo.svelte";
  import SearchBar from "$lib/components/search/SearchBar.svelte";
  import { colorState } from "$lib/states/color.svelte";

  let error: string = $state("");
</script>

<div
  class="h-screen w-screen overflow-hidden transition-colors duration-500 ease-out"
  style:background-color={colorState.backgroundColor}
  style:color={colorState.overlayColor}
>
  <div class="h-full w-full flex flex-col items-center justify-center pb-48">
    <Logo large={true} />
    <SearchBar firstSearch={true} />
  </div>
</div>
