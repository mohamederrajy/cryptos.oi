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
            icon: "grid", 
            label: "Dashboard", 
            href: "/admin",
            description: "Overview & Statistics" 
        },
        { 
            icon: "trending-up", 
            label: "Deposits", 
            href: "/admin/deposits",
            description: "Manage Deposits" 
        },
        { 
            icon: "wallet", 
            label: "Withdrawals", 
            href: "/admin/withdrawals",
            description: "Manage Withdrawals"
        },
        { 
            icon: "wallet", 
            label: "Add cryptocurrency", 
            href: "/admin/cryptocurrency",
            description: "add cryptocurrency"
        },
        { 
            icon: "file-text", 
            label: "Users", 
            href: "/admin/users",
            description: "User Management" 
        },
        
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

    // Add state for mobile menu
    let isMobileMenuOpen = false;
    
    // Function to handle mobile menu
    function toggleMobileMenu() {
        isMobileMenuOpen = !isMobileMenuOpen;
    }

    // Close mobile menu when route changes
    $: if ($page.url.pathname) {
        isMobileMenuOpen = false;
    }

    onMount(async () => {
        // Initialize session from localStorage
        session.initialize();
        if (browser) {
            try {
                const { initFlowbite } = await import('preline/dist/preline.js');
                initFlowbite();
            } catch (error) {
                console.error('Failed to initialize Preline:', error);
            }
        }
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

<!-- Mobile Menu Button (visible only on mobile) -->
<button 
    class="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md"
    on:click={toggleMobileMenu}
>
    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        {#if isMobileMenuOpen}
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        {:else}
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        {/if}
    </svg>
</button>

{#if !isAccountPage}
    <div class="app-layout">
        <!-- Sidebar -->
        <aside class="fixed top-0 left-0 z-40 h-screen bg-white border-r border-gray-200/80 transition-all duration-300 shadow-sm
                    backdrop-blur-sm bg-white/95 flex flex-col
                    lg:translate-x-0 {isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}"
               class:w-72={$isSidebarOpen}
               class:w-20={!$isSidebarOpen}
               class:lg:block={true}>
            <!-- Logo Section -->
            <div class="flex items-center h-16 px-4 border-b border-gray-200/80">
                {#if $isSidebarOpen}
                    <div class="flex items-center justify-between w-full">
                        <a href="/" class="flex items-center space-x-3">
                            <img src="/images/crypto images/LOGOOC.png" alt="XonBiT" class="h-8" />
                        </a>
                        <button 
                            on:click={toggleSidebar} 
                            class="p-2 rounded-lg hover:bg-gray-100/80 transition-all duration-200 text-gray-500 hover:text-gray-700"
                        >
                            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                      d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                            </svg>
                        </button>
                    </div>
                {:else}
                    <button 
                        class="p-2 rounded-lg hover:bg-gray-100/80 transition-all duration-200"
                        on:click={toggleSidebar}
                    >
                        <img 
                            src={sidebarIcon}
                            alt="Menu" 
                            class="w-6 h-6 transition-all duration-300 hover:scale-110"
                        />
                    </button>
                {/if}
            </div>

            <!-- After the logo section and before navigation items -->
            {#if $session.token && $session.user}
                <div class="px-4 py-3 border-b border-gray-200/80">
                    <div class="flex items-center gap-3">
                        <!-- Profile Image -->
                        <div class="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 overflow-hidden flex-shrink-0 ring-2 ring-white/90">
                            {#if $session.user?.profileImage}
                                <img 
                                    src={getProfileImageUrl($session.user.profileImage)} 
                                    alt="Profile" 
                                    class="w-full h-full object-cover"
                                />
                            {:else}
                                <div class="w-full h-full flex items-center justify-center text-white text-sm font-semibold">
                                    {($session.user?.firstName?.[0] || $session.user?.email?.[0] || 'U').toUpperCase()}
                                </div>
                            {/if}
                        </div>
                        
                        {#if $isSidebarOpen}
                            <div class="min-w-0">
                                <!-- User Name -->
                                <div class="flex items-center gap-2">
                                    <p class="text-sm font-semibold text-gray-900 truncate">
                                        {($session.user?.firstName || '')} {($session.user?.lastName || '').toUpperCase()}
                                    </p>
                                    {#if $session.user?.role === 'admin'}
                                        <span class="px-1.5 py-0.5 text-[10px] font-medium bg-blue-50 text-blue-600 rounded">
                                            ADMIN
                                        </span>
                                    {/if}
                                </div>

                                <!-- Email -->
                                <p class="text-xs text-gray-500 truncate mt-0.5">
                                    {$session.user?.email}
                                </p>

                                <!-- Status Badge -->
                                {#if $session.user?.role !== 'admin'}
                                    <div class="flex items-center gap-1 mt-1">
                                        <div class="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                        <span class="text-[10px] font-medium text-emerald-600 uppercase tracking-wide">
                                            Active
                                        </span>
                                    </div>
                                {/if}
                            </div>
                        {/if}
                    </div>

                    <!-- Balance Section (Only when sidebar is open) -->
                    {#if $isSidebarOpen}
                        <div class="mt-3 pt-3 border-t border-gray-200/80">
                            <div class="flex items-center justify-between">
                                <span class="text-xs font-medium text-gray-500">Available Balance</span>
                                <div class="flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
                                    <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                                    </svg>
                                    <span>+2.4%</span>
                                </div>
                            </div>
                            <div class="flex items-baseline gap-1.5 mt-1">
                                <span class="text-base font-semibold text-gray-900">
                                    {$session.user?.wallet?.totalBalance?.USDT || 0}
                                </span>
                                <span class="text-xs font-medium text-gray-500">USDT</span>
                            </div>
                            <div class="text-[10px] text-gray-500 mt-0.5">
                                ≈ ${(($session.user?.wallet?.totalBalance?.USDT || 0) * 1).toFixed(2)} USD
                            </div>
                        </div>
                    {/if}
                </div>
            {/if}

            <!-- Navigation Items -->
            <div class="flex-1 overflow-y-auto">
                <div class="px-3 space-y-1 py-2">
                    <!-- Existing Navigation Items -->
                    {#each navItems as item}
                        <a href={item.href}
                           class="flex items-center px-3 py-4 rounded-xl group relative transition-all duration-200 
                                  {$page.url.pathname === item.href ? 
                                  'bg-blue-50/80 text-blue-600' : 
                                  'hover:bg-gray-50/80 text-gray-600 hover:text-gray-900'}"
                           class:justify-center={!$isSidebarOpen}>
                            <div class="relative flex items-center">
                                <div class="flex items-center justify-center w-10 h-10">
                                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        {#if item.icon === "grid"}
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                        {:else if item.icon === "repeat"}
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        {:else if item.icon === "trending-up"}
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                        {:else if item.icon === "wallet"}
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                        {:else if item.icon === "shopping-cart"}
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                        {:else if item.icon === "activity"}
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        {:else if item.icon === "file-text"}
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        {/if}
                                    </svg>
                                </div>
                                
                                {#if $isSidebarOpen}
                                    <div class="ml-3">
                                        <span class="font-medium text-base block">
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

            <!-- At the bottom of the sidebar, after navigation items, add: -->
            <div class="mt-auto">
                <button 
                    on:click={handleLogout}
                    class="w-full flex items-center gap-3 px-6 py-4 text-red-600 hover:bg-red-50 transition-all duration-200 border-t border-gray-200"
                >
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                    </svg>
                    {#if $isSidebarOpen}
                        <span class="font-medium text-left">Sign Out</span>
                    {/if}
                </button>
            </div>
        </aside>

        <!-- Overlay for mobile menu -->
        {#if isMobileMenuOpen}
            <div 
                class="fixed inset-0 bg-black/50 z-30 lg:hidden"
                on:click={toggleMobileMenu}
                on:keydown={(e) => e.key === 'Escape' && toggleMobileMenu()}
                role="button"
                tabindex="0"
                aria-label="Close mobile menu"
            ></div>
        {/if}

        <!-- Top Navigation Bar -->
        <nav class="fixed top-0 right-0 h-16 bg-white border-b border-gray-200/80 transition-all duration-300 z-20
                    w-full lg:w-[calc(100%-18rem)] lg:ml-72"
             class:lg:w-[calc(100%-5rem)]={!$isSidebarOpen}
             class:lg:ml-20={!$isSidebarOpen}>
            <div class="h-full px-6 flex items-center justify-between w-full">
                <!-- Left side - Breadcrumb -->
                <div class="flex items-center gap-2 text-gray-500">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span class="text-sm font-medium">
                        {#if $page.url.pathname === '/'}
                            Home
                        {:else}
                            {$page.url.pathname.split('/').filter(Boolean).map((part) => 
                                part.charAt(0).toUpperCase() + part.slice(1)
                            ).join(' / ')}
                        {/if}
                    </span>
                </div>

                <!-- Right side - Profile Section -->
                <div class="flex items-center gap-4">
                    {#if $session.token}
                        <!-- Existing authenticated user profile section -->
                        <div class="flex items-center gap-3">
                            <!-- Notifications button -->
                            <button class="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100/80 transition-all duration-200">
                                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                            </button>

                            <!-- Profile button -->
                            <button 
                                class="profile-menu flex items-center gap-2 p-1.5 hover:bg-gray-100/80 rounded-lg transition-all duration-200"
                                on:click={() => showProfileMenu = !showProfileMenu}
                            >
                                <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 
                                          flex items-center justify-center text-white font-medium">
                                    {$session.user?.firstName?.[0]}{$session.user?.lastName?.[0]}
                                </div>
                                <svg class="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            <!-- Add this right after the profile button in the authenticated section -->
                            {#if $session.token && showProfileMenu}
                                <div 
                                    class="absolute top-16 right-4 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
                                    transition:fade
                                >
                                    <!-- User Info -->
                                    <div class="px-4 py-3 border-b border-gray-100">
                                        <div class="font-medium text-gray-900">
                                            {$session.user?.firstName} {$session.user?.lastName}
                                        </div>
                                        <div class="text-sm text-gray-500">
                                            {$session.user?.email}
                                        </div>
                                        <!-- Add Balance Display -->
                                        <div class="mt-3 pt-3 border-t border-gray-100">
                                            <div class="flex items-center justify-between mb-1">
                                                <span class="text-sm text-gray-500">Total Balance</span>
                                                <div class="flex items-center gap-1 text-xs text-green-600">
                                                    <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                                    </svg>
                                                    <span>+2.4%</span>
                                                </div>
                                            </div>
                                            <div class="flex items-center gap-2">
                                                <span class="text-lg font-semibold text-gray-900">
                                                    {$session.user?.wallet?.totalBalance?.USDT || 0}
                                                </span>
                                                <span class="text-sm font-medium text-gray-500">USDT</span>
                                            </div>
                                            <div class="text-xs text-gray-500">
                                                ≈ ${(($session.user?.wallet?.totalBalance?.USDT || 0) * 1).toFixed(2)} USD
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Menu Items -->
                                    <div class="py-1">
                                        <a 
                                            href="/profile" 
                                            class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                            on:click={() => showProfileMenu = false}
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
                                            on:click={() => showProfileMenu = false}
                                        >
                                            <svg class="w-4 h-4 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                            </svg>
                                            Wallet
                                        </a>
                                       
                                        
                                    </div>
                                </div>
                            {/if}
                        </div>
                    {:else}
                        <!-- Login/Signup buttons -->
                        <div class="flex items-center gap-3">
                            <a href="/account/login" class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200">
                                Login
                            </a>
                            <a href="/account/signup    " class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200">
                                Sign Up
                            </a>
                        </div>
                    {/if}
                </div>
            </div>
        </nav>

        <!-- Main Content -->
        <main class="transition-all duration-300 w-full lg:w-auto"
              class:lg:ml-72={$isSidebarOpen}
              class:lg:ml-20={!$isSidebarOpen}>
            <div class="min-h-screen bg-gray-50/50 pt-16 pb-6">
                <div class="px-2 sm:px-6 lg:px-6 py-2 sm:py-4 max-w-[1920px] mx-auto">
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
        padding: 8px; /* Reduced from 16px */
    }

    /* Utility classes for sidebar widths */
    .sidebar-expanded {
        --sidebar-width: 18rem; /* 72px */
    }

    .sidebar-collapsed {
        --sidebar-width: 6rem; /* 24px */
    }

    /* Add responsive styles */
    @media (max-width: 1024px) {
        aside {
            width: 272px !important;
        }

        main {
            margin-left: 0 !important;
            width: 100% !important;
        }

        nav {
            width: 100% !important;
            left: 0;
            padding-left: 4rem;
        }

        /* Adjusted content padding for mobile */
        .content-container {
            padding: 8px;
        }

        /* Adjusted slot container padding for mobile */
        :global(.px-6) {
            padding-left: 0.5rem !important; /* 8px */
            padding-right: 0.5rem !important;
        }

        :global(.py-4) {
            padding-top: 0.5rem !important;
            padding-bottom: 0.5rem !important;
        }
    }

    /* Smaller margins for mobile */
    @media (max-width: 640px) {
        .content-container {
            padding: 8px;
        }

        :global(.px-6) {
            padding-left: 0.5rem !important;
            padding-right: 0.5rem !important;
        }

        :global(.py-4) {
            padding-top: 0.5rem !important;
            padding-bottom: 0.5rem !important;
        }

        :global(.gap-6) {
            gap: 0.5rem !important;
        }

        :global(.mb-8) {
            margin-bottom: 1rem !important;
        }

        :global(.p-4) {
            padding: 0.5rem !important;
        }

        :global(.p-6) {
            padding: 0.75rem !important;
        }

        :global(.m-4) {
            margin: 0.5rem !important;
        }

        :global(.space-y-4) {
            margin-top: 0.5rem !important;
            margin-bottom: 0.5rem !important;
        }
    }
</style>