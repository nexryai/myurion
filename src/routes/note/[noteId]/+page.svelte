<script lang="ts">
    import XEditor from "$lib/components/XEditor.svelte";
    let { data } = $props();
</script>

{#key data.id}
    <XEditor noteId={data.id} title={null} />
{/key}
