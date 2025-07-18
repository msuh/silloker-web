<script lang="ts">
  import { colorState } from "$lib/states/color.svelte";
  import CloseIcon from "../icons/CloseIcon.svelte";

  let {
    index,
    keyword,
    removeBadge,
  }: {
    index: number;
    keyword: string;
    removeBadge: (index: number) => void;
  } = $props();
</script>

<span
  class="inline-flex items-center rounded-md pl-2 pr-1 py-1 text-sm break-keep
            font-medium ring-1 ring-blue-700/10 ring-inset justify-center space-x-1"
  style:background-color={colorState.overlayColor}
  style:color={colorState.backgroundColor}
>
  <div>
    {keyword}
  </div>
  <button class="size-3 cursor-pointer" onclick={() => removeBadge(index)}>
    <CloseIcon overlayColor={colorState.backgroundColor} />
  </button>
</span>
