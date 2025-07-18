<script lang="ts">
  import { searchResult } from "$lib/states/search.svelte";
  import RecordCard from "./RecordCard.svelte";
</script>

<div class="w-full h-full flex flex-col justify-start items-center">
  {#if searchResult.totalCount > 0}
    <!-- <div class="text-xl"> -->
    <!--   {searchResult.totalCount} -->
    <!-- </div> -->
    <div class="w-full flex flex-col justify-center items-center space-y-8">
      {#each searchResult.entities as record, index}
        <RecordCard {record} last={index == searchResult.entities.length - 1} />
      {/each}
    </div>
  {/if}
</div>
