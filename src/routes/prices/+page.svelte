<script lang="ts">
    import { onMount } from 'svelte';

    interface CryptoData {
        id: string;
        name: string;
        symbol: string;
        current_price: number;
        price_change_percentage_24h: number;
        market_cap: number;
        total_volume: number;
        image: string;
        sparkline_in_7d: {
            price: number[];
        };
    }

    let cryptoData: CryptoData[] = [];
    let isLoading = true;
    let error = null;

    async function fetchCryptoData() {
        try {
            const response = await fetch(
                'https://api.coingecko.com/api/v3/coins/markets?' +
                'vs_currency=usd&' +
                'order=market_cap_desc&' +
                'per_page=100&' +
                'page=1&' +
                'sparkline=true&' +
                'price_change_percentage=24h'
            );
            
            if (!response.ok) throw new Error('Failed to fetch data');
            
            const data = await response.json();
            cryptoData = data;
            isLoading = false;
        } catch (e) {
            error = e.message;
            isLoading = false;
        }
    }

    onMount(() => {
        fetchCryptoData();
        // Refresh data every 60 seconds
        const interval = setInterval(fetchCryptoData, 60000);
        return () => clearInterval(interval);
    });

    // Format number to USD
    const formatUSD = (num: number) => {
        if (num >= 1) {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(num);
        } else {
            return '$' + num.toFixed(8);
        }
    };

    // Format large numbers
    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('en-US').format(num);
    };

    let searchQuery = '';
    
    // Categories data
    const categories = [
        {
            name: 'All',
            icon: '🚀',
            bgColor: 'bg-purple-500',
            selected: true
        },
        {
            name: 'Top Gainers',
            icon: '📈',
            bgColor: 'bg-orange-500',
            selected: false
        },
        {
            name: 'Top Losers',
            icon: '💰',
            bgColor: 'bg-purple-400',
            selected: false
        },
        {
            name: 'Recently Added',
            icon: '🕒',
            bgColor: 'bg-blue-400',
            selected: false
        }
    ];

    function handleSearch() {
        // Implement search functionality
        console.log('Searching for:', searchQuery);
    }
</script>

<div class="bg-gray-50 w-full">
    <!-- Hero Section - Fixed height -->
    <div class="relative bg-purple-500 rounded-3xl p-12 mb-12 overflow-hidden mx-8 mt-8">
        <!-- Content -->
        <div class="relative z-10 max-w-2xl">
            <h1 class="text-5xl font-bold text-white mb-4">
                Search by token name or symbol
            </h1>
            <p class="text-xl text-white/90 mb-8">
                Find the best prices across exchange networks
            </p>
            
            <!-- Search Bar -->
            <div class="relative">
                <input
                    type="text"
                    bind:value={searchQuery}
                    placeholder="Try Bitcoin / BTC"
                    class="w-full px-6 py-4 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-purple-300 shadow-lg"
                />
                <button 
                    class="absolute right-4 top-1/2 -translate-y-1/2"
                    on:click={handleSearch}
                >
                    <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>
            </div>
        </div>

        <!-- Decorative Image -->
        <div class="absolute right-0 top-0 h-full w-1/2 flex items-center justify-center">
            <div class="relative w-[400px] h-[400px]">
                <!-- Rocket -->
                <div class="absolute right-20 top-10 animate-float">
                    <div class="w-24 h-32 bg-pink-300 rounded-3xl relative transform -rotate-12">
                        <div class="absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-pink-200 rounded-full">
                            <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-teal-400 rounded-full"></div>
                        </div>
                        <div class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-8 bg-pink-400 rounded-b-full">
                            <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-4 bg-orange-400 rounded-t-full animate-pulse"></div>
                        </div>
                    </div>
                </div>

                <!-- Balance Scale -->
                <div class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <!-- Vertical Stand -->
                    <div class="w-4 h-64 bg-purple-300 rounded-full"></div>
                    
                    <!-- Horizontal Beam -->
                    <div class="absolute top-4 left-1/2 transform -translate-x-1/2 w-64 h-4 bg-purple-400 rounded-full animate-balance">
                        <!-- Left Bowl -->
                        <div class="absolute -left-8 top-8 w-24 h-24">
                            <div class="w-full h-full bg-pink-400 rounded-full relative overflow-hidden">
                                <!-- Crypto Coins -->
                                <div class="absolute bottom-2 left-2 w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center text-xs">₿</div>
                                <div class="absolute bottom-4 right-2 w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center text-xs">Ξ</div>
                            </div>
                        </div>
                        
                        <!-- Right Bowl -->
                        <div class="absolute -right-8 top-8 w-24 h-24">
                            <div class="w-full h-full bg-pink-400 rounded-full relative overflow-hidden">
                                <!-- Chart Pattern -->
                                <div class="absolute inset-4 bg-black/10 rounded-lg">
                                    <svg viewBox="0 0 100 50" class="w-full h-full">
                                        <path d="M0,25 L20,15 L40,35 L60,5 L80,45 L100,25" 
                                              stroke="white" 
                                              fill="none" 
                                              stroke-width="2"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Categories Section - Fixed height -->
    <div class="px-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Categories</h2>
        <div class="grid grid-cols-4 gap-6 mb-12">
            {#each categories as category}
                <button 
                    class="bg-white rounded-2xl p-6 flex flex-col items-center hover:shadow-lg transition-shadow border-2 {category.selected ? 'border-purple-500' : 'border-transparent'}"
                >
                    <!-- Icon Circle -->
                    <div class="w-16 h-16 {category.bgColor} rounded-full flex items-center justify-center mb-4">
                        <span class="text-2xl">{category.icon}</span>
                    </div>
                    
                    <!-- Category Name -->
                    <span class="text-lg font-medium text-gray-900">
                        {category.name}
                    </span>
                </button>
            {/each}
        </div>
    </div>

    <!-- Price Table Section - Scrollable -->
    <div class="px-8 pb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Today's Cryptocurrency Prices</h2>
        
        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
            <!-- Sticky Header -->
            <div class="sticky top-0 z-10 grid grid-cols-6 gap-4 px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div class="text-sm font-medium text-gray-500">TOKEN</div>
                <div class="text-sm font-medium text-gray-500">PRICE</div>
                <div class="text-sm font-medium text-gray-500">24H</div>
                <div class="text-sm font-medium text-gray-500">MARKET CAP</div>
                <div class="text-sm font-medium text-gray-500">VOLUME</div>
                <div class="text-sm font-medium text-gray-500">CHART</div>
            </div>

            <!-- Table Content -->
            <div class="scroll-container">
                <!-- Loading State -->
                {#if isLoading}
                    <div class="px-6 py-8 text-center">
                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
                        <p class="mt-4 text-gray-500">Loading cryptocurrency data...</p>
                    </div>
                {/if}

                <!-- Error State -->
                {#if error}
                    <div class="px-6 py-8 text-center text-red-500">
                        <p>Error loading data: {error}</p>
                    </div>
                {/if}

                <!-- Updated Data Rows with Mini Charts -->
                {#if !isLoading && !error}
                    {#each cryptoData as crypto}
                        <div class="grid grid-cols-6 gap-4 px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <!-- Token -->
                            <div class="flex items-center">
                                <img src={crypto.image} alt={crypto.name} class="w-8 h-8 mr-3"/>
                                <div>
                                    <div class="font-medium">{crypto.name}</div>
                                    <div class="text-sm text-gray-500">{crypto.symbol.toUpperCase()}</div>
                                </div>
                            </div>

                            <!-- Price -->
                            <div class="flex items-center font-medium">
                                {formatUSD(crypto.current_price)}
                            </div>

                            <!-- 24h Change -->
                            <div class="flex items-center">
                                <span class={crypto.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}>
                                    {crypto.price_change_percentage_24h >= 0 ? '↑' : '↓'}
                                    {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                                </span>
                            </div>

                            <!-- Market Cap -->
                            <div class="flex items-center">
                                {formatUSD(crypto.market_cap)}
                            </div>

                            <!-- Volume -->
                            <div class="flex items-center">
                                {formatUSD(crypto.total_volume)}
                            </div>

                            <!-- Updated Mini Chart -->
                            <div class="flex items-center h-10">
                                <svg 
                                    class="w-full h-full {crypto.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}"
                                    viewBox="0 0 100 30"
                                    preserveAspectRatio="none"
                                >
                                    <path
                                        d="M0 15 L10 10 L20 20 L30 5 L40 25 L50 15 L60 20 L70 10 L80 25 L90 5 L100 15"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        vector-effect="non-scaling-stroke"
                                    />
                                </svg>
                            </div>
                        </div>
                    {/each}
                {/if}
            </div>
        </div>
    </div>
</div>

<style lang="postcss">
    :global(html), :global(body) {
        height: 100%;
        margin: 0;
        padding: 0;
        overflow-y: auto;
        overflow-x: hidden;
    }

    :global(#app) {
        min-height: 100%;
        display: flex;
        flex-direction: column;
    }

    .scroll-container {
        max-height: calc(100vh - 600px);
        min-height: 400px;
        overflow-y: auto;
        scrollbar-width: thin;
        scrollbar-color: #d1d5db #F3F4F6;
    }

    .scroll-container::-webkit-scrollbar {
        width: 8px;
    }

    .scroll-container::-webkit-scrollbar-track {
        background: #F3F4F6;
    }

    .scroll-container::-webkit-scrollbar-thumb {
        background-color: #d1d5db;
        border-radius: 4px;
    }

    /* Prevent horizontal scrollbar */
    .no-horizontal-scroll {
        scrollbar-width: none;
        -ms-overflow-style: none;
    }

    .no-horizontal-scroll::-webkit-scrollbar {
        display: none;
    }

    /* Add any custom styles here */
    :global(body) {
        margin: 0;
        padding: 0;
    }

    /* Add these animations to your existing styles */
    @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(-12deg); }
        50% { transform: translateY(-20px) rotate(-12deg); }
    }

    @keyframes balance {
        0%, 100% { transform: translateX(-50%) rotate(0deg); }
        25% { transform: translateX(-50%) rotate(-2deg); }
        75% { transform: translateX(-50%) rotate(2deg); }
    }

    .animate-float {
        animation: float 3s ease-in-out infinite;
    }

    .animate-balance {
        animation: balance 5s ease-in-out infinite;
    }

    .animate-pulse {
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }
</style>
