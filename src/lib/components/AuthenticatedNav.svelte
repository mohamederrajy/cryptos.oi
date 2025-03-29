<script lang="ts">
    import { authStore } from '$lib/stores/auth';
    import { slide } from 'svelte/transition';
    
    let showProfileMenu = false;

    function handleLogout() {
        authStore.logout();
        window.location.href = '/account/login';
    }
</script>

<div class="relative flex items-center gap-4">
    <!-- Notifications -->
    <button class="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
    </button>

    <!-- Profile -->
    <div class="relative">
        <button 
            class="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100"
            on:click={() => showProfileMenu = !showProfileMenu}
        >
            <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                {$authStore.user?.firstName?.[0]}{$authStore.user?.lastName?.[0]}
            </div>
            <span class="text-sm font-medium text-gray-700">
                {$authStore.user?.firstName} {$authStore.user?.lastName}
            </span>
            <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
        </button>

        {#if showProfileMenu}
            <div 
                class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50"
                transition:slide
            >
                <a 
                    href="/profile" 
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                    Profile Settings
                </a>
                <a 
                    href="/security" 
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                    Security
                </a>
                <button 
                    on:click={handleLogout}
                    class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                    Sign out
                </button>
            </div>
        {/if}
    </div>
</div> 