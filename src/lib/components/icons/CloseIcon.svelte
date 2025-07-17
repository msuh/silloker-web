<script lang="ts">
  let {
    overlayColor,
  }: {
    overlayColor: string;
  } = $props();
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 -960 960 960"
  fill={overlayColor}
>
  <path
    d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"
  />
</svg>
