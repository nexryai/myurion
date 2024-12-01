<script lang="ts">
    import XEditor from "$lib/components/XEditor.svelte";
    let { data } = $props();
</script>

<XEditor noteId={data.id} title={null} />
