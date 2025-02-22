<script lang="ts">
    import { page } from '$app/stores';
    import { session } from '$lib/stores/session';
</script>

{#if import.meta.env.DEV}
    <div class="fixed bottom-4 right-4 p-4 bg-black/80 text-white rounded-lg text-xs">
        <pre>
Session Role: {$session.user?.role}
Page Role: {$page.data.user?.role}
IsAdmin: {$page.data.isAdmin}
Path: {$page.url.pathname}
        </pre>
    </div>
{/if} 