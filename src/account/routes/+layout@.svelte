<script lang="ts">
    import "../../app.css";
</script>

<slot />

<style>
    :global(html), :global(body) {
        margin: 0;
        padding: 0;
        height: 100%;
        overflow: hidden;
    }

    :global(#app) {
        height: 100%;
    }

    /* Enhanced scrollbar styling */
    :global(::-webkit-scrollbar) {
        width: 8px;
    }

    :global(::-webkit-scrollbar-track) {
        background: transparent;
        margin: 4px 0;
    }

    :global(::-webkit-scrollbar-thumb) {
        background: #e5e7eb;
        border-radius: 100vh;
    }

    :global(::-webkit-scrollbar-thumb:hover) {
        background: #d1d5db;
    }

    /* Firefox scrollbar */
    :global(html) {
        scrollbar-width: thin;
        scrollbar-color: #e5e7eb transparent;
    }
</style> 