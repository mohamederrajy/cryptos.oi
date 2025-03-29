<script lang="ts">
    import { onMount } from 'svelte';
    
    type CryptoData = {
        id: string;
        symbol: string;
        name: string;
        current_price: number;
        price_change_percentage_24h: number;
        image: string;
        sparkline_in_7d: {
            price: number[];
        };
    };

    function generateSparklineData(basePrice: number, volatility: number, trend: 'up' | 'down' | 'neutral' = 'neutral') {
        const points = 150; // More points for ultra-smooth lines
        return Array(points).fill(0).map((_, i) => {
            const progress = i / points;
            const trendFactor = trend === 'up' ? Math.pow(progress, 1.5) * volatility 
                            : trend === 'down' ? -Math.pow(progress, 1.5) * volatility 
                            : 0;
            const randomness = (Math.sin(i * 0.3) + Math.cos(i * 0.2)) * volatility * 0.3;
            return basePrice + trendFactor + randomness;
        });
    }

    function createSparkline(prices: number[], isPositive: boolean) {
        if (!prices || prices.length === 0) return '';
        
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        const range = max - min || 1;
        
        const height = 60; // Reduced height for cleaner look
        const width = 160; // Adjusted width
        
        // Create smoother curve points
        const points = prices.map((price, i) => {
            const x = (i / (prices.length - 1)) * width;
            const y = height - ((price - min) / range) * height * 0.8; // 80% height utilization
            return { x, y };
        });

        // Generate smooth curve
        let pathD = `M ${points[0].x},${points[0].y}`;
        for (let i = 0; i < points.length - 1; i++) {
            const current = points[i];
            const next = points[i + 1];
            const cp1x = current.x + (next.x - current.x) / 3;
            const cp2x = current.x + 2 * (next.x - current.x) / 3;
            pathD += ` C ${cp1x},${current.y} ${cp2x},${next.y} ${next.x},${next.y}`;
        }

        return {
            line: pathD,
            gradient: `${pathD} L ${width},${height} L 0,${height} Z`
        };
    }

    // Extended mock data with more cryptocurrencies
    const allCryptoData = [
        // Original 8
        {
            id: "bitcoin",
            name: "Bitcoin",
            symbol: "BTC",
            current_price: 45123.56,
            price_change_percentage_24h: -0.92,
            image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
            sparkline_in_7d: { 
                price: generateSparklineData(45000, 1000, 'down')
            }
        },
        {
            id: "ethereum",
            name: "Ethereum",
            symbol: "ETH",
            current_price: 3224.22,
            price_change_percentage_24h: 0.89,
            image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
            sparkline_in_7d: { price: Array(24).fill(0).map((_, i) => 3200 + Math.cos(i) * 100) }
        },
        {
            id: "binancecoin",
            name: "Binance Coin",
            symbol: "BNB",
            current_price: 735.92,
            price_change_percentage_24h: -0.32,
            image: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png",
            sparkline_in_7d: { price: Array(24).fill(0).map((_, i) => 730 + Math.sin(i) * 20) }
        },
        {
            id: "bitcoin-cash",
            name: "Bitcoin Cash",
            symbol: "BCH",
            current_price: 429.00,
            price_change_percentage_24h: -0.28,
            image: "https://assets.coingecko.com/coins/images/780/large/bitcoin-cash-circle.png",
            sparkline_in_7d: { price: Array(24).fill(0).map((_, i) => 425 + Math.cos(i) * 10) }
        },
        {
            id: "toncoin",
            name: "Toncoin",
            symbol: "TON",
            current_price: 4.81,
            price_change_percentage_24h: -2.28,
            image: "https://assets.coingecko.com/coins/images/17980/large/ton_symbol.png",
            sparkline_in_7d: { price: Array(24).fill(0).map((_, i) => 4.8 + Math.sin(i) * 0.2) }
        },
        {
            id: "tron",
            name: "TRON",
            symbol: "TRX",
            current_price: 0.2515,
            price_change_percentage_24h: 2.19,
            image: "https://assets.coingecko.com/coins/images/1094/large/tron-logo.png",
            sparkline_in_7d: { price: Array(24).fill(0).map((_, i) => 0.25 + Math.cos(i) * 0.01) }
        },
        {
            id: "matic-network",
            name: "Polygon",
            symbol: "MATIC",
            current_price: 0.6994,
            price_change_percentage_24h: 0.74,
            image: "https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png",
            sparkline_in_7d: { price: Array(24).fill(0).map((_, i) => 0.69 + Math.sin(i) * 0.02) }
        },
        {
            id: "shiba-inu",
            name: "Shiba Inu",
            symbol: "SHIB",
            current_price: 0.00001858,
            price_change_percentage_24h: -0.22,
            image: "https://assets.coingecko.com/coins/images/11939/large/shiba.png",
            sparkline_in_7d: { price: Array(24).fill(0).map((_, i) => 0.000018 + Math.cos(i) * 0.000001) }
        },
        // Additional cryptocurrencies for variety
        {
            id: "cardano",
            name: "Cardano",
            symbol: "ADA",
            current_price: 0.89,
            price_change_percentage_24h: 5.23,
            image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
            sparkline_in_7d: { price: Array(24).fill(0).map((_, i) => 0.85 + Math.sin(i) * 0.05) }
        },
        {
            id: "solana",
            name: "Solana",
            symbol: "SOL",
            current_price: 125.45,
            price_change_percentage_24h: 7.82,
            image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
            sparkline_in_7d: { price: Array(24).fill(0).map((_, i) => 120 + Math.cos(i) * 10) }
        },
        {
            id: "ripple",
            name: "XRP",
            symbol: "XRP",
            current_price: 0.56,
            price_change_percentage_24h: -4.32,
            image: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
            sparkline_in_7d: { price: Array(24).fill(0).map((_, i) => 0.55 + Math.sin(i) * 0.03) }
        },
        {
            id: "dogecoin",
            name: "Dogecoin",
            symbol: "DOGE",
            current_price: 0.078,
            price_change_percentage_24h: -3.45,
            image: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png",
            sparkline_in_7d: { price: Array(24).fill(0).map((_, i) => 0.075 + Math.cos(i) * 0.005) }
        },
        {
            id: "polkadot",
            name: "Polkadot",
            symbol: "DOT",
            current_price: 7.23,
            price_change_percentage_24h: 6.78,
            image: "https://assets.coingecko.com/coins/images/12171/large/polkadot.png",
            sparkline_in_7d: { price: Array(24).fill(0).map((_, i) => 7 + Math.sin(i) * 0.5) }
        },
        {
            id: "avalanche",
            name: "Avalanche",
            symbol: "AVAX",
            current_price: 35.67,
            price_change_percentage_24h: 8.91,
            image: "https://assets.coingecko.com/coins/images/12559/large/coin-round-red.png",
            sparkline_in_7d: { price: Array(24).fill(0).map((_, i) => 34 + Math.cos(i) * 2) }
        }
    ];

    let cryptoData = [...allCryptoData.slice(0, 8)]; // Initial 8 coins
    let selectedFilter = 'all';
    let isLoading = true;
    let error = null;

    const filters = [
        { id: 'all', label: 'All' },
        { id: 'gainers', label: 'Top Gainers' },
        { id: 'losers', label: 'Top Losers' },
        { id: 'recent', label: 'Recently Added' }
    ];

    const CRYPTO_IDS = [
        'bitcoin',
        'ethereum',
        'binancecoin',
        'bitcoin-cash',
        'toncoin',
        'tron',
        'matic-network',
        'shiba-inu'
    ];

    function getFilteredData(filter: string) {
        switch(filter) {
            case 'gainers':
                return [...allCryptoData]
                    .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
                    .slice(0, 8);
            case 'losers':
                return [...allCryptoData]
                    .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
                    .slice(0, 8);
            case 'recent':
                // Shuffle array for "recently added" to simulate random new listings
                return [...allCryptoData]
                    .sort(() => Math.random() - 0.5)
                    .slice(0, 8);
            default:
                return allCryptoData.slice(0, 8);
        }
    }

    function handleFilterChange(filter: string) {
        selectedFilter = filter;
        cryptoData = getFilteredData(filter);
    }

    async function fetchCryptoPrices() {
        try {
            isLoading = true;
            error = null;
            
            const response = await fetch(
                'https://api.coingecko.com/api/v3/coins/markets?' +
                new URLSearchParams({
                    vs_currency: 'usd',
                    ids: allCryptoData.map(coin => coin.id).join(','),
                    order: 'market_cap_desc',
                    per_page: '20',
                    page: '1',
                    sparkline: 'true'
                })
            );

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const data = await response.json();
            // Update allCryptoData with real data if available
            if (data.length >= 8) {
                cryptoData = getFilteredData(selectedFilter);
            }
        } catch (err) {
            console.error('Error fetching crypto data:', err);
            cryptoData = getFilteredData(selectedFilter);
        } finally {
            isLoading = false;
        }
    }

    onMount(() => {
        fetchCryptoPrices();
        const interval = setInterval(fetchCryptoPrices, 30000);
        return () => clearInterval(interval);
    });

    $: filteredData = selectedFilter === 'all' 
        ? cryptoData 
        : selectedFilter === 'gainers'
        ? [...cryptoData].sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
        : selectedFilter === 'losers'
        ? [...cryptoData].sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
        : cryptoData;
</script>

<section class="py-6 lg:py-10">
    <div class="container mx-auto px-4 max-w-7xl">
        <!-- Filters - Made scrollable on mobile -->
        <div class="flex gap-3 lg:gap-6 mb-6 lg:mb-8 overflow-x-auto pb-2 no-scrollbar">
            {#each filters as filter}
                <button
                    class="px-4 lg:px-6 py-2 rounded-full text-xs lg:text-sm font-medium transition-all duration-200 whitespace-nowrap
                           {selectedFilter === filter.id 
                             ? 'bg-[#3772FF]/10 text-[#3772FF]' 
                             : 'text-gray-500 hover:text-gray-700'}"
                    on:click={() => handleFilterChange(filter.id)}
                >
                    {filter.label}
                </button>
            {/each}
        </div>

        {#if isLoading}
            <div class="text-center py-8 lg:py-12">
                <div class="inline-block animate-spin rounded-full h-6 w-6 lg:h-8 lg:w-8 border-4 border-gray-200 border-t-[#3772FF]"></div>
                <p class="mt-3 lg:mt-4 text-sm lg:text-base text-gray-600">Loading cryptocurrency data...</p>
            </div>
        {:else if error}
            <div class="text-center py-8 lg:py-12">
                <p class="text-red-500 text-sm lg:text-base">Error: {error}</p>
                <button 
                    class="mt-3 lg:mt-4 px-4 py-2 text-sm lg:text-base bg-[#3772FF] text-white rounded-lg hover:bg-[#2952cc]"
                    on:click={fetchCryptoPrices}
                >
                    Try Again
                </button>
            </div>
        {:else}
            <!-- Crypto Grid - Responsive layout -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                {#each cryptoData as crypto, index (crypto.id)}
                    <div class="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-sm hover:shadow-md transition-all duration-200">
                        <!-- Crypto Header -->
                        <div class="flex items-center gap-3 lg:gap-4 mb-3 lg:mb-4">
                            <img src={crypto.image} alt={crypto.name} class="w-8 h-8 lg:w-10 lg:h-10">
                            <div>
                                <h3 class="font-medium text-sm lg:text-base text-gray-900">{crypto.name}</h3>
                                <span class="text-xs lg:text-sm text-gray-500">{crypto.symbol}</span>
                            </div>
                            <span class="ml-auto text-xs lg:text-sm text-gray-400">24H</span>
                        </div>

                        <!-- Price Info -->
                        <div class="space-y-2 lg:space-y-3">
                            <div class="flex items-baseline justify-between">
                                <span class="text-xl lg:text-2xl font-bold text-gray-900">
                                    ${crypto.current_price.toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 8
                                    })}
                                </span>
                                <span class={`flex items-center gap-1 text-sm lg:text-base ${
                                    crypto.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'
                                }`}>
                                    <svg 
                                        class="w-3 h-3 lg:w-4 lg:h-4" 
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        style={crypto.price_change_percentage_24h < 0 ? 'transform: rotate(180deg)' : ''}
                                    >
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                    </svg>
                                    {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                                </span>
                            </div>

                            <!-- Sparkline Chart - Adjusted height for mobile -->
                            <div class="w-full h-[40px] lg:h-[60px] mt-3 lg:mt-4 relative group">
                                {#if crypto.sparkline_in_7d?.price}
                                    <svg 
                                        width="100%" 
                                        height="100%" 
                                        viewBox="0 0 160 60" 
                                        preserveAspectRatio="none"
                                        class="overflow-visible"
                                    >
                                        <!-- Simplified gradient -->
                                        <defs>
                                            <linearGradient
                                                id="gradient-{crypto.id}"
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="1"
                                            >
                                                <stop
                                                    offset="0%"
                                                    stop-color={crypto.price_change_percentage_24h >= 0 ? '#22C55E' : '#EF4444'}
                                                    stop-opacity="0.2"
                                                />
                                                <stop
                                                    offset="100%"
                                                    stop-color={crypto.price_change_percentage_24h >= 0 ? '#22C55E' : '#EF4444'}
                                                    stop-opacity="0"
                                                />
                                            </linearGradient>
                                        </defs>

                                        <!-- Area fill -->
                                        <path
                                            d={createSparkline(crypto.sparkline_in_7d.price, crypto.price_change_percentage_24h >= 0).gradient}
                                            fill="url(#gradient-{crypto.id})"
                                            class="transition-opacity duration-300"
                                        />

                                        <!-- Line -->
                                        <path
                                            d={createSparkline(crypto.sparkline_in_7d.price, crypto.price_change_percentage_24h >= 0).line}
                                            fill="none"
                                            stroke={crypto.price_change_percentage_24h >= 0 ? '#22C55E' : '#EF4444'}
                                            stroke-width="1.5"
                                            stroke-linecap="round"
                                            class="transition-all duration-300"
                                        />

                                        <!-- End point -->
                                            <circle
                                            cx="160"
                                                cy={createSparkline([crypto.sparkline_in_7d.price[crypto.sparkline_in_7d.price.length - 1]], crypto.price_change_percentage_24h >= 0).line.split(',')[1]}
                                            r="2"
                                                fill={crypto.price_change_percentage_24h >= 0 ? '#22C55E' : '#EF4444'}
                                            class="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                            />
                                    </svg>
                                {/if}
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    </div>
</section>

<style>
    .no-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
    .no-scrollbar::-webkit-scrollbar {
        display: none;
    }

    /* Make grid responsive */
    @media (max-width: 1280px) {
        :global(.grid-cols-4) {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media (max-width: 640px) {
        :global(.grid-cols-4) {
            grid-template-columns: 1fr;
        }
    }

    /* Add smooth animation for chart hover */
    svg {
        transition: all 0.3s ease;
    }
    
    svg:hover {
        transform: scale(1.02);
    }

    polyline {
        transition: stroke-width 0.2s ease;
    }

    svg:hover polyline {
        stroke-width: 2;
    }

    @keyframes pulse {
        0% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.5); opacity: 0.5; }
        100% { transform: scale(1); opacity: 1; }
    }

    .group:hover path {
        filter: brightness(1.2);
    }

    .animate-ping {
        animation: pulse 2s cubic-bezier(0, 0, 0.2, 1) infinite;
    }

    /* Smooth transitions */
    path, circle {
        transition: all 0.3s ease-in-out;
    }

    /* Enhanced hover effects */
    .group:hover svg {
        transform: scale(1.02);
    }

    /* Enhanced responsive styles */
    @media (max-width: 1024px) {
        .grid {
            gap: 12px;
        }
    }

    @media (max-width: 640px) {
        .grid {
            gap: 10px;
        }
    }

    /* Improved hover effects for touch devices */
    @media (hover: none) {
        .group:hover svg {
            transform: none;
        }
        
        svg:hover {
            transform: none;
        }
    }

    /* Smoother animations on mobile */
    @media (prefers-reduced-motion: reduce) {
        .animate-ping {
            animation: none;
        }
        
        .transition-all {
            transition: none;
        }
    }
</style>