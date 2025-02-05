<script lang="ts">
    import "../app.css";
    import { page } from "$app/stores";
    import { browser } from '$app/environment';
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import { fade, fly } from 'svelte/transition';
    import Footer from "$lib/components/footer/footer.svelte";
    import { session } from '$lib/stores/session';
    import { notifications } from '$lib/stores/notifications';
    import { slide } from 'svelte/transition';
    import AuthenticatedNav from '$lib/components/AuthenticatedNav.svelte';
    import { getProfileImageUrl } from '$lib/utils/image';

    const isSidebarOpen = writable(true);
    const toggleSidebar = () => isSidebarOpen.update(n => !n);

    $: ({ user, isAuthenticated } = $page.data);

    // Sidebar navigation items
    const navItems = [
        { icon: "grid", label: "Home", href: "/" },
        { icon: "repeat", label: "Exchange", href: "/exchange" },
        { icon: "trending-up", label: "Prices", href: "/prices" },
        { icon: "wallet", label: "Wallets", href: "/wallets" },
        { icon: "shopping-cart", label: "Buy crypto", href: "/buy-crypto" },
        { icon: "activity", label: "Activities", href: "/activities" },
        { icon: "file-text", label: "Blog", href: "/blog" }
    ];

    let sidebarIcon = "/images/crypto images/icoco.png";

    $: console.log('Sidebar state:', $isSidebarOpen);
    $: console.log('Icon path:', sidebarIcon);

    let showProfileMenu = false;

    onMount(() => {
        // Initialize session from localStorage
        session.initialize();
    });

    function handleLogout() {
        showProfileMenu = false;
        session.logout();
        notifications.success('Successfully logged out');
        window.location.href = '/account/login';
    }

    // Close profile menu when clicking outside
    function handleClickOutside(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (!target.closest('.profile-menu')) {
            showProfileMenu = false;
        }
    }

    // Simpler route check
    $: isAccountPage = $page.url.pathname.includes('/account');
</script>

<svelte:head>
    <meta content="A fully responsive Tailwind CSS Multipurpose agency, application, business, clean, creative, cryptocurrency, it solutions, startup, career, blog, modern, creative, multipurpose, portfolio, saas, software, tailwind css, etc."
          name="description"/>
    <meta content="coderthemes" name="author"/>
    <link rel="shortcut icon" href="/favicon.ico"/>
</svelte:head>

<svelte:window on:click={handleClickOutside} />

{#if !isAccountPage}
    <div class="app-layout">
        <!-- Sidebar -->
        <aside class="fixed top-0 left-0 z-50 h-screen bg-white border-r border-gray-200 transition-all duration-300 shadow-sm"
               class:w-72={$isSidebarOpen}
               class:w-24={!$isSidebarOpen}>
            <!-- Logo and Toggle Section -->
            <div class="flex items-center p-4 border-b border-gray-200">
                {#if $isSidebarOpen}
                    <div class="flex items-center justify-between w-full">
                        <a href="/" class="flex items-center">
                            <img src="/images/crypto images/LOGOOC.png" alt="XonBiT" class="h-8" />
                        </a>
                        <button 
                            on:click={toggleSidebar} 
                            class="p-2 rounded-lg hover:bg-blue-50 transition-all duration-200 hover:text-[#3772FF]"
                        >
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                            </svg>
                        </button>
                    </div>
                {:else}
                    <div class="w-full flex justify-center">
                        <img 
                            src={sidebarIcon}
                            alt="Menu" 
                            class="w-12 h-12 cursor-pointer transition-all duration-300 hover:scale-110"
                            on:click={toggleSidebar}
                            on:error={(e) => console.error('Image failed to load:', e)}
                        />
                    </div>
                {/if}
            </div>

            <!-- Navigation Items -->
            <div class="h-[calc(100vh-4rem)] overflow-y-auto">
                <ul class="space-y-3 p-4">
                    {#each navItems as item}
                        <li>
                            <a href={item.href}
                               class="flex items-center p-4 rounded-xl group relative transition-all duration-200 hover:bg-blue-50/60"
                               class:justify-center={!$isSidebarOpen}>
                                <div class="relative flex items-center">
                                    <svg class="w-7 h-7 transition-all duration-200 {$page.url.pathname === item.href 
                                        ? 'text-[#3772FF]' 
                                        : 'text-gray-500 group-hover:text-[#3772FF]'}" 
                                         fill="none" 
                                         stroke="currentColor" 
                                         viewBox="0 0 24 24">
                                        {#if item.icon === 'grid'}
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                        {:else if item.icon === 'repeat'}
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        {:else if item.icon === 'trending-up'}
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                        {:else if item.icon === 'wallet'}
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                        {:else if item.icon === 'shopping-cart'}
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                        {:else if item.icon === 'activity'}
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        {:else if item.icon === 'file-text'}
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        {/if}
                                    </svg>
                                    
                                    {#if $isSidebarOpen}
                                        <span class="ml-4 text-base whitespace-nowrap transition-all duration-200 {$page.url.pathname === item.href 
                                            ? 'text-[#3772FF] font-medium' 
                                            : 'text-gray-700 group-hover:text-[#3772FF]'}"
                                        >
                                            {item.label}
                                        </span>
                                    {:else}
                                        <div class="absolute left-full ml-7 hidden group-hover:block">
                                            <div class="bg-white px-5 py-3 rounded-xl shadow-lg border border-gray-100 text-sm font-medium text-gray-700"
                                                 in:fly="{{ y: 20, duration: 200 }}"
                                                 out:fade
                                            >
                                                {item.label}
                                            </div>
                                        </div>
                                    {/if}
                                </div>

                                {#if $page.url.pathname === item.href}
                                    <div class="absolute inset-y-0 left-0 w-1.5 bg-[#3772FF] rounded-r-lg transition-all duration-200"
                                         in:fly="{{ x: -10, duration: 200 }}"
                                    ></div>
                                {/if}
                            </a>
                        </li>
                    {/each}
                </ul>
            </div>
        </aside>

        <!-- Top Navigation Bar -->
        <nav class="fixed top-0 z-40 right-0 bg-white border-b border-gray-200 shadow-sm transition-all duration-300"
             class:left-72={$isSidebarOpen}
             class:left-24={!$isSidebarOpen}>
            <div class="px-6 py-4">
                <div class="flex items-center justify-between w-full">
                    <!-- Left side navigation items -->
                    <div class="flex items-center">
                        <a href="/" 
                           class="px-4 py-2 text-gray-700 hover:text-[#3772FF] font-medium transition-colors hover:bg-blue-50/40 rounded-lg">
                            Trade
                        </a>
                        <a href="/markets" 
                           class="px-4 py-2 text-gray-700 hover:text-[#3772FF] font-medium transition-colors hover:bg-blue-50/40 rounded-lg">
                            Markets
                        </a>
                        <a href="/buy-crypto" 
                           class="px-4 py-2 text-gray-700 hover:text-[#3772FF] font-medium transition-colors hover:bg-blue-50/40 rounded-lg">
                            Buy crypto
                        </a>
                        <a href="/rewards" 
                           class="px-4 py-2 text-gray-700 hover:text-[#3772FF] font-medium transition-colors hover:bg-blue-50/40 rounded-lg">
                            Rewards
                        </a>
                        <a href="/referral" 
                           class="px-4 py-2 text-gray-700 hover:text-[#3772FF] font-medium transition-colors hover:bg-blue-50/40 rounded-lg">
                            Referral
                        </a>
                        <a href="/affiliate" 
                           class="px-4 py-2 text-gray-700 hover:text-[#3772FF] font-medium transition-colors hover:bg-blue-50/40 rounded-lg">
                            Affiliate
                        </a>
                        <a href="/vip" 
                           class="px-4 py-2 text-gray-700 hover:text-[#3772FF] font-medium transition-colors hover:bg-blue-50/40 rounded-lg">
                            VIP
                        </a>
                    </div>
                    
                    <!-- Right side items -->
                    <div class="flex items-center gap-2">
                        <button class="p-2 rounded-lg hover:bg-blue-50/40 transition-all duration-200 hover:text-[#3772FF]">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                        </button>
                        <button class="p-2 rounded-lg hover:bg-blue-50/40 transition-all duration-200 hover:text-[#3772FF]">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                        </button>
                        <button class="p-2 rounded-lg hover:bg-blue-50/40 transition-all duration-200 hover:text-[#3772FF]">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                            </svg>
                        </button>
                        <div class="h-6 w-px bg-gray-200 mx-2"></div>

                        {#if $session.isAuthenticated}
                            <div class="relative profile-menu">
                                <button 
                                    class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-50/40"
                                    on:click={() => showProfileMenu = !showProfileMenu}
                                >
                                    <div class="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-blue-500">
                                        {#if $session.user?.profileImage}
                                            <img 
                                                src={getProfileImageUrl($session.user.profileImage)}
                                                alt="Profile"
                                                class="w-full h-full object-cover"
                                                on:error={(e) => {
                                                    // Fallback to initials if image fails to load
                                                    e.currentTarget.style.display = 'none';
                                                    e.currentTarget.nextElementSibling.style.display = 'flex';
                                                }}
                                            />
                                            <div class="hidden w-full h-full text-white text-sm font-medium items-center justify-center">
                                                {$session.user?.firstName?.[0]}{$session.user?.lastName?.[0]}
                                            </div>
                                        {:else}
                                            <div class="w-full h-full text-white text-sm font-medium flex items-center justify-center">
                                                {$session.user?.firstName?.[0]}{$session.user?.lastName?.[0]}
                                            </div>
                                        {/if}
                                    </div>
                                    <div class="flex flex-col items-start">
                                        <span class="text-sm font-medium text-gray-700">
                                            {$session.user?.firstName} {$session.user?.lastName}
                                        </span>
                                        <span class="text-xs text-gray-500">
                                            {$session.user?.role}
                                        </span>
                                    </div>
                                    <svg class="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {#if showProfileMenu}
                                    <div 
                                        class="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg py-1 z-50"
                                        transition:slide
                                    >
                                        <div class="px-4 py-3 border-b border-gray-100">
                                            <div class="text-sm font-medium text-gray-900">
                                                {$session.user?.firstName} {$session.user?.lastName}
                                            </div>
                                            <div class="text-xs text-gray-500">
                                                {$session.user?.email}
                                            </div>
                                            {#if $session.user?.wallet}
                                                <div class="mt-2 pt-2 border-t border-gray-100">
                                                    <div class="text-xs font-medium text-gray-500">Total Balance</div>
                                                    <div class="flex justify-between items-center mt-1">
                                                        <div class="text-sm font-medium">
                                                            {$session.user.wallet.totalBalance.btc.toFixed(8)} BTC
                                                        </div>
                                                        <div class="text-sm text-gray-500">
                                                            ≈ ${$session.user.wallet.totalBalance.usd.toFixed(2)}
                                                        </div>
                                                    </div>
                                                </div>
                                            {/if}
                                        </div>
                                        <div class="py-1">
                                            <a 
                                                href="/profile" 
                                                class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                <svg class="w-4 h-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                Profile Settings
                                            </a>
                                            <a 
                                                href="/wallets" 
                                                class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                <svg class="w-4 h-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                                </svg>
                                                Wallet
                                            </a>
                                            <a 
                                                href="/security" 
                                                class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                <svg class="w-4 h-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                                Security
                                            </a>
                                        </div>
                                        <div class="py-1 border-t border-gray-100">
                                            <button 
                                                on:click={handleLogout}
                                                class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                            >
                                                <svg class="w-4 h-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                </svg>
                                                Sign out
                                            </button>
                                        </div>
                                    </div>
                                {/if}
                            </div>
                        {:else}
                            <a href="/account/login" 
                               class="px-4 py-2 text-gray-700 hover:text-[#3772FF] font-medium transition-colors hover:bg-blue-50/40 rounded-lg">
                                Log In
                            </a>
                            <a href="/account/signup" 
                               class="px-4 py-2 text-white bg-[#3772FF] rounded-lg hover:bg-[#2952cc] transition-all duration-200 font-medium hover:shadow-md">
                                Sign Up
                            </a>
                        {/if}
                    </div>
                </div>
            </div>
        </nav>

        <!-- Main Content -->
        <main class="transition-all duration-300 relative w-full"
              class:pl-72={$isSidebarOpen}
              class:pl-24={!$isSidebarOpen}>
            <div class="px-8 pt-20 pb-8 min-h-screen w-full max-w-[100vw]">
                <slot />
            </div>
            <Footer />
        </main>
    </div>
{:else}
    <slot />
{/if}

<style lang="postcss">
    /* Your styles here */
</style>

