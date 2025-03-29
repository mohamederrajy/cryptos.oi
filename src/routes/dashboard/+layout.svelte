<script lang="ts">
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    
    let user = null;

    async function handleLogout() {
        try {
            console.log('Starting logout process...');

            // Call server logout endpoint
            const response = await fetch('/api/auth/logout', {
                method: 'POST'
            });

            // Clear all client-side storage
            localStorage.clear();
            sessionStorage.clear();

            // Clear all cookies
            document.cookie.split(";").forEach(function(c) { 
                document.cookie = c.replace(/^ +/, "")
                    .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
            });

            console.log('Session cleared - redirecting to login');
            
            // Force redirect to login
            window.location.replace('/account/login');
        } catch (error) {
            console.error('Logout error:', error);
            // Redirect anyway
            window.location.replace('/account/login');
        }
    }

    // Check session and log user details on mount
    onMount(() => {
        const token = localStorage.getItem('authToken');
        user = JSON.parse(localStorage.getItem('user') || 'null');

        if (!token || !user) {
            console.log('No valid session found in dashboard');
            handleLogout();
        } else {
            console.log('Logged in user details:', {
                user,
                token,
                pageData: $page.data
            });
        }
    });
</script>

{#if $page.data.isAuthenticated && $page.data.user}
    <div class="min-h-screen bg-gray-50 p-4">
        <button 
            on:click={handleLogout}
            class="fixed top-4 right-4 px-4 py-2 bg-red-500 text-white rounded-lg
                   hover:bg-red-600 transition-colors"
        >
            Sign Out
        </button>
        <slot />
    </div>
{:else}
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
        <div class="text-center">
            <p class="text-gray-600">Redirecting to login...</p>
        </div>
    </div>
{/if} 