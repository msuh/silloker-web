<script lang="ts">
  import { colorState } from "$lib/states/color.svelte";
  import type { RecordEntity } from "$lib/types/record";
  import { recordTypeToKorean } from "$lib/types/search";
  import DownloadIcon from "../icons/DownloadIcon.svelte";

  let {
    record,
    last,
  }: {
    record: RecordEntity;
    last: boolean;
  } = $props();
</script>

<div
  class="h-60 w-full {!last ? 'border-b' : 'border-0'} relative
  {colorState.mode == 'dark' ? 'border-white/20' : 'border-black/20'}"
>
  <div class="text-2xl pb-4">
    {record.title}
  </div>
  <div class="text-md line-clamp-3 h-[3lh] w-[75ch]">
    {record.content}
  </div>
  <div class="text-md pt-4">
    {record.recordType} / {recordTypeToKorean(record.recordType)}
  </div>
  <div class="text-md">
    {record.bookName} V.{record.bookVolume}.{record.bookNumber}
  </div>
  <div class="text-md">
    {#if record.year}
      {record.year}年
    {/if}
    {#if record.month}
      {record.month}月
    {/if}
    {#if record.day}
      {record.day}日
    {/if}
  </div>

  <button
    class="size-6 absolute bottom-4 right-4 cursor-pointer"
    onclick={() => {}}
  >
    <DownloadIcon overlayColor={colorState.overlayColor} />
  </button>
</div>
