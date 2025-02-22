<script lang="ts">
    import "../app.css";
    import { page } from "$app/stores";
    import { browser, dev } from '$app/environment';
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import { fade, fly } from 'svelte/transition';
    import Footer from "$lib/components/footer/footer.svelte";
    import { session } from '$lib/stores/session';
    import { notifications } from '$lib/stores/notifications';
    import { slide } from 'svelte/transition';
    import AuthenticatedNav from '$lib/components/AuthenticatedNav.svelte';
    import { getProfileImageUrl } from '$lib/utils/image';
    import Notifications from '$lib/components/Notifications.svelte';

    const isSidebarOpen = writable(true);
    const toggleSidebar = () => isSidebarOpen.update(n => !n);

    $: ({ user, isAuthenticated, isAdmin } = $page.data);

    // Updated admin navigation items with better organization
    $: navItems = $session.user?.role === 'admin' ? [
        { 
            icon: "chart-bar", 
            label: "Dashboard", 
            href: "/admin",
            description: "Overview & Statistics" 
        },
        { 
            icon: "cash", 
            label: "Deposits", 
            href: "/admin/deposits",
            description: "Manage Deposits" 
        },
        { 
            icon: "credit-card", 
            label: "Withdrawals", 
            href: "/admin/withdrawals",
            description: "Manage Withdrawals"
        },
        { 
            icon: "users", 
            label: "Users", 
            href: "/admin/users",
            description: "User Management" 
        },
        { 
            icon: "cog", 
            label: "Settings", 
            href: "/admin/settings",
            description: "System Settings" 
        }
    ] : [
        { 
            icon: "grid", 
            label: "Home", 
            href: "/", 
            description: "Dashboard Overview"
        },
        { 
            icon: "repeat", 
            label: "Exchange", 
            href: "/exchange", 
            description: "Trade Crypto"
        },
        { 
            icon: "trending-up", 
            label: "Prices", 
            href: "/prices", 
            description: "Market Prices"
        },
        { 
            icon: "wallet", 
            label: "Wallets", 
            href: "/wallets", 
            description: "Manage Wallets"
        },
        { 
            icon: "shopping-cart", 
            label: "Buy crypto", 
            href: "/buy-crypto", 
            description: "Purchase Crypto"
        },
        { 
            icon: "activity", 
            label: "Activities", 
            href: "/activities", 
            description: "Transaction History"
        },
        { 
            icon: "file-text", 
            label: "Blog", 
            href: "/blog", 
            description: "News & Updates"
        }
    ];

    // Add TypeScript interface for navigation items
    interface NavItem {
        icon: string;
        label: string;
        href: string;
        description: string;
    }

    // Update the type annotation
    let navItems: NavItem[];

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

    // Update the route check to exclude profile and wallets
    $: isAccountPage = $page.url.pathname.includes('/account') && 
        !$page.url.pathname.includes('/profile') && 
        !$page.url.pathname.includes('/wallets');

    // Check if user is admin
    $: isAdmin = $session.user?.role === 'admin';
    $: isAdminRoute = $page.url.pathname.startsWith('/admin');
</script>

<Notifications />

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
        <aside class="fixed top-0 left-0 z-50 h-screen bg-white border-r border-gray-200/80 transition-all duration-300 shadow-sm
                    backdrop-blur-sm bg-white/95"
               class:w-72={$isSidebarOpen}
               class:w-20={!$isSidebarOpen}>
            <!-- Updated Logo Section -->
            <div class="flex items-center h-16 px-4 border-b border-gray-200/80">
                {#if $isSidebarOpen}
                    <div class="flex items-center justify-between w-full">
                        <a href="/" class="flex items-center space-x-3">
                            <img src="/images/crypto images/LOGOOC.png" alt="XonBiT" class="h-8" />
                            <span class="font-semibold text-gray-900">XonBiT</span>
                        </a>
                        <button 
                            on:click={toggleSidebar} 
                            class="p-2 rounded-lg hover:bg-gray-100/80 transition-all duration-200 text-gray-500 hover:text-gray-700
                                   focus:outline-none focus:ring-2 focus:ring-gray-200/50"
                        >
                            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                      d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                            </svg>
                        </button>
                    </div>
                {:else}
                    <div class="w-full flex justify-center">
                        <button 
                            class="p-2 rounded-lg hover:bg-gray-100/80 transition-all duration-200"
                            on:click={toggleSidebar}
                        >
                            <img 
                                src={sidebarIcon}
                                alt="Menu" 
                                class="w-10 h-10 transition-all duration-300 hover:scale-110"
                            />
                        </button>
                    </div>
                {/if}
            </div>

            <!-- Updated Navigation Items -->
            <div class="h-[calc(100vh-4rem)] overflow-y-auto py-4">
                <div class="px-3 space-y-1">
                    {#each navItems as item}
                        <a href={item.href}
                           class="flex items-center px-3 py-3 rounded-xl group relative transition-all duration-200 
                                  {$page.url.pathname === item.href ? 
                                  'bg-blue-50/80 text-blue-600' : 
                                  'hover:bg-gray-50/80 text-gray-600 hover:text-gray-900'}"
                           class:justify-center={!$isSidebarOpen}>
                            <div class="relative flex items-center">
                                <!-- Updated icons with better styling -->
                                <div class="flex items-center justify-center w-10 h-10 rounded-lg 
                                          {$page.url.pathname === item.href ? 
                                          'bg-blue-100/50' : 'bg-gray-100/50 group-hover:bg-gray-200/50'}
                                          transition-colors duration-200">
                                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        {#if item.icon === 'chart-bar'}
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                                                  d="M8 13v-1m4 1v-3m4 3V8M12 21l9-9-9-9-9 9 9 9z"/>
                                        {:else if item.icon === 'cash'}
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                                                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
                                        {:else if item.icon === 'credit-card'}
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                                                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                                        {:else if item.icon === 'users'}
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                                                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                                        {:else if item.icon === 'cog'}
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                                                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                        {:else if item.icon === 'grid'}
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                                                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                                        {:else if item.icon === 'repeat'}
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                                                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                                        {:else if item.icon === 'trending-up'}
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                                                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                                        {:else if item.icon === 'wallet'}
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                                                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
                                        {:else if item.icon === 'shopping-cart'}
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                                                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                                        {:else if item.icon === 'activity'}
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                                                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                                        {:else if item.icon === 'file-text'}
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                        {/if}
                                    </svg>
                                </div>
                                
                                {#if $isSidebarOpen}
                                    <div class="ml-3">
                                        <span class="text-sm font-medium">
                                            {item.label}
                                        </span>
                                        <p class="text-xs text-gray-500">
                                            {item.description}
                                        </p>
                                    </div>
                                {:else}
                                    <div class="absolute left-full ml-4 hidden group-hover:block z-50">
                                        <div class="bg-white px-4 py-3 rounded-lg shadow-xl border border-gray-100/80 
                                                  min-w-[200px]"
                                             in:fly="{{ y: 20, duration: 200 }}"
                                             out:fade
                                        >
                                            <div class="text-sm font-medium text-gray-900">
                                                {item.label}
                                            </div>
                                            <div class="text-xs text-gray-500 mt-1">
                                                {item.description}
                                            </div>
                                        </div>
                                    </div>
                                {/if}
                            </div>
                        </a>
                    {/each}
                </div>
            </div>
        </aside>

        <!-- Top Navigation Bar -->
        <nav class="fixed top-0 z-40 right-0 bg-white border-b border-gray-200/80 transition-all duration-300"
             class:left-72={$isSidebarOpen}
             class:left-20={!$isSidebarOpen}>
            <div class="h-16 px-6 flex items-center justify-between">
                <!-- Left side -->
                <div class="flex items-center gap-4">
                    <div class="text-sm font-medium text-gray-600">
                        Welcome back, {$session.user?.firstName || 'User'}!
                    </div>
                </div>

                <!-- Right side -->
                <div class="flex items-center gap-4">
                    <!-- Notifications -->
                    <button class="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 rounded-lg transition-all duration-200">
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                    </button>

                    <!-- Profile Menu -->
                    <div class="relative profile-menu">
                        <button 
                            class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100/80 transition-all duration-200"
                            on:click={() => showProfileMenu = !showProfileMenu}
                        >
                            <div class="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 
                                       flex items-center justify-center text-white text-sm font-medium">
                                {$session.user?.firstName?.[0]}{$session.user?.lastName?.[0]}
                            </div>
                            <svg class="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        <!-- Profile Dropdown -->
                        {#if showProfileMenu}
                            <div 
                                class="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-100/80 py-1 z-50"
                                transition:slide={{ duration: 200 }}
                                on:click|stopPropagation
                            >
                                <!-- User Info Section -->
                                <div class="px-4 py-3 border-b border-gray-100">
                                    <div class="flex items-center gap-3 mb-3">
                                        <div class="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 
                                                   flex items-center justify-center text-white font-medium">
                                            {$session.user?.firstName?.[0]}{$session.user?.lastName?.[0]}
                                        </div>
                                        <div>
                                            <div class="text-sm font-medium text-gray-900">
                                                {$session.user?.firstName} {$session.user?.lastName}
                                            </div>
                                            <div class="text-xs text-gray-500">
                                                {$session.user?.email}
                                            </div>
                                        </div>
                                    </div>

                                    {#if $session.user?.wallet}
                                        <div class="mt-2 pt-2 border-t border-gray-100">
                                            <div class="text-xs font-medium text-gray-500">Total Balance</div>
                                            <div class="flex justify-between items-center mt-1">
                                                <div class="text-sm font-medium text-blue-600">
                                                    {$session.user.wallet.totalBalance.USDT || 0} USDT
                                                </div>
                                                <div class="text-xs text-gray-500">
                                                    ≈ ${($session.user.wallet.totalBalance.USDT || 0).toFixed(2)}
                                                </div>
                                            </div>
                                        </div>
                                    {/if}
                                </div>

                                <!-- Menu Items -->
                                <div class="py-1">
                                    <a 
                                        href="/profile" 
                                        class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                        on:click|preventDefault={(e) => {
                                            console.log('Navigating to profile...');
                                            showProfileMenu = false;
                                            window.location.href = '/profile';
                                        }}
                                    >
                                        <svg class="w-4 h-4 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Profile Settings
                                    </a>
                                    <a 
                                        href="/wallets" 
                                        class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                        on:click|preventDefault={(e) => {
                                            console.log('Navigating to wallets...');
                                            showProfileMenu = false;
                                            window.location.href = '/wallets';
                                        }}
                                    >
                                        <svg class="w-4 h-4 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                        </svg>
                                        Wallet
                                    </a>
                                    <a 
                                        href="/security" 
                                        class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                        on:click={() => showProfileMenu = false}
                                    >
                                        <svg class="w-4 h-4 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                        Security
                                    </a>
                                    <a 
                                        href="/settings" 
                                        class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                        on:click={() => showProfileMenu = false}
                                    >
                                        <svg class="w-4 h-4 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                        </svg>
                                        Account Settings
                                    </a>
                                </div>

                                <!-- Logout Section -->
                                <div class="py-1 border-t border-gray-100">
                                    <button 
                                        on:click={handleLogout}
                                        class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
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
                </div>
            </div>
        </nav>

        <!-- Main Content -->
        <main class="transition-all duration-300"
              class:ml-72={$isSidebarOpen}
              class:ml-20={!$isSidebarOpen}>
            <div class="min-h-screen bg-gray-50/50 pt-16 pb-8">
                <div class="px-6 py-4 max-w-[1920px] mx-auto">
                    <slot />
                </div>
                {#if !(isAdmin && isAdminRoute)}
                    <Footer />
                {/if}
            </div>
        </main>
    </div>
{:else}
    <slot />
{/if}

<!-- Add this debug section to show current route info -->
{#if dev}
    <div class="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs z-50">
        <div>Current Path: {$page.url.pathname}</div>
        <div>Is Account Page: {isAccountPage}</div>
        <div>Is Admin: {isAdmin}</div>
        <div>Is Admin Route: {isAdminRoute}</div>
    </div>
{/if}

<style lang="postcss">
    :global(body) {
        margin: 0;
        padding: 0;
        overflow-x: hidden;
    }

    .app-layout {
        display: flex;
        min-height: 100vh;
    }

    /* Sidebar styles */
    aside {
        position: fixed;
        height: 100vh;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch; /* For smooth scrolling on iOS */
    }

    /* Main content styles */
    main {
        flex: 1;
        margin-top: 64px; /* Height of the top nav */
        width: 100%;
        min-height: calc(100vh - 64px);
        overflow-x: hidden;
        background-color: #F8FAFC; /* Light background color */
    }

    /* Navigation bar styles */
    nav {
        position: fixed;
        top: 0;
        right: 0;
        height: 64px;
        width: calc(100% - var(--sidebar-width));
        z-index: 40;
    }

    /* Content container */
    .content-container {
        width: 100%;
        max-width: 100%;
        overflow-x: hidden;
        padding-top: 24px;
        padding-bottom: 24px;
    }

    /* Utility classes for sidebar widths */
    .sidebar-expanded {
        --sidebar-width: 18rem; /* 72px */
    }

    .sidebar-collapsed {
        --sidebar-width: 6rem; /* 24px */
    }
</style>

