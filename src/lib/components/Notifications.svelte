<script lang="ts">
    import { notifications } from '$lib/stores/notifications';
    import { fly, fade } from 'svelte/transition';
    import type { Notification } from '$lib/stores/notifications';

    const icons = {
        success: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>`,
        error: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>`,
        warning: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>`,
        info: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>`
    };
</script>

<div class="fixed top-4 right-4 z-50 space-y-4 w-full max-w-sm">
    {#each $notifications as notification (notification.id)}
        <div
            class="notification-wrapper"
            transition:fly={{ x: 100, duration: 300 }}
            role="alert"
        >
            <div class="bg-white rounded-lg shadow-lg overflow-hidden">
                <div class="p-4 flex items-start space-x-4">
                    <div class="flex-shrink-0">
                        {@html icons[notification.type]}
                    </div>
                    <div class="flex-1 pt-0.5">
                        {#if notification.title}
                            <p class="text-sm font-medium text-gray-900">
                                {notification.title}
                            </p>
                        {/if}
                        <p class="text-sm text-gray-500">
                            {notification.message}
                        </p>
                    </div>
                    {#if notification.dismissible}
                        <button
                            class="flex-shrink-0 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            on:click={() => notifications.remove(notification.id)}
                        >
                            <span class="sr-only">Close</span>
                            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    {/if}
                </div>
                {#if notification.duration !== 0}
                    <div class="h-1 bg-gray-100 relative">
                        <div
                            class="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500"
                            style="animation: notification-progress {notification.duration}ms linear forwards;"
                        ></div>
                    </div>
                {/if}
            </div>
        </div>
    {/each}
</div>

<style>
    @keyframes notification-progress {
        from { width: 100%; }
        to { width: 0%; }
    }

    .notification-wrapper {
        pointer-events: auto;
    }
</style> 