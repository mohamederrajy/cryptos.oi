<script lang="ts">
    import "../../app.css";
    import { page } from "$app/stores";
    import { session } from '$lib/stores/session';
    import { notifications } from '$lib/stores/notifications';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    
    onMount(() => {
        if (!$session.isAuthenticated || $session.user?.role !== 'admin') {
            goto('/');
        }
    });
</script>

<div class="flex-1 p-6">
    <slot />
</div>

<style lang="postcss">
    :global(body) {
        margin: 0;
        padding: 0;
        overflow-x: hidden;
    }
</style> 