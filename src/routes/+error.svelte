<script>
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { page } from "$app/state";

  onMount(() => {
    if (page.status === 404) {
      goto("/");
    }
  });
</script>
