<script lang="ts">
    import { onMount } from 'svelte';
    
    type CryptoData = {
        symbol: string;
        name: string;
        current_price: number;
        price_change_percentage_24h: number;
        image: string;
        sparkline_in_7d: {
            price: number[];
        };
    };

    // Map of crypto symbols to their names and images
    const cryptoInfo = {
        'BTCUSDT': { 
            name: 'Bitcoin', 
            image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png'
        },
        'ETHUSDT': { 
            name: 'Ethereum', 
            image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png'
        },
        'BNBUSDT': { 
            name: 'Binance Coin', 
            image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png'
        },
        'BCHUSDT': { 
            name: 'Bitcoin Cash', 
            image: 'https://assets.coingecko.com/coins/images/780/large/bitcoin-cash-circle.png'
        },
        'TONUSDT': { 
            name: 'Toncoin', 
            image: 'https://assets.coingecko.com/coins/images/17980/large/ton_symbol.png'
        },
        'TRXUSDT': { 
            name: 'TRON', 
            image: 'https://assets.coingecko.com/coins/images/1094/large/tron-logo.png'
        },
        'MATICUSDT': { 
            name: 'Polygon', 
            image: 'https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png'
        },
        'SHIBUSDT': { 
            name: 'Shiba Inu', 
            image: 'https://assets.coingecko.com/coins/images/11939/large/shiba.png'
        }
    };

    let cryptoData: CryptoData[] = [];
    let selectedFilter = 'all';
    let isLoading = true;
    let error: string | null = null;

    const filters = [
        { id: 'all', label: 'All' },
        { id: 'gainers', label: 'Top Gainers' },
        { id: 'losers', label: 'Top Losers' }
    ];

    // Add these type definitions
    type SparklineResult = {
        line: string;
        gradient: string;
    };

    type BinanceTickerData = {
        symbol: string;
        lastPrice: string;
        priceChangePercent: string;
    };

    // Add the createSparkline function
    function createSparkline(prices: number[], isPositive: boolean): SparklineResult {
        if (!prices || prices.length === 0) {
            return { line: '', gradient: '' };
        }
        
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        const range = max - min || 1;
        
        const height = 60;
        const width = 160;
        
        // Create points for the sparkline
        const points = prices.map((price, i) => {
            const x = (i / (prices.length - 1)) * width;
            const y = height - ((price - min) / range) * height * 0.8;
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

    // Update the fetchBinanceData function with proper typing
    async function fetchBinanceData() {
        try {
            isLoading = true;
            error = null;

            // Fetch 24hr ticker price change
            const tickerResponse = await fetch('https://api.binance.com/api/v3/ticker/24hr');
            if (!tickerResponse.ok) throw new Error('Failed to fetch Binance data');
            const tickerData: BinanceTickerData[] = await tickerResponse.json();

            // Fetch kline/candlestick data for sparklines (last 7 days)
            const sparklineData = await Promise.all(
                Object.keys(cryptoInfo).map(async (symbol) => {
                    const response = await fetch(
                        `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1d&limit=7`
                    );
                    if (!response.ok) throw new Error(`Failed to fetch sparkline data for ${symbol}`);
                    return response.json();
                })
            );

            // Process and combine the data
            cryptoData = Object.keys(cryptoInfo).map((symbol, index) => {
                const ticker = tickerData.find((t: BinanceTickerData) => t.symbol === symbol);
                if (!ticker) throw new Error(`No ticker data found for ${symbol}`);

                const prices = sparklineData[index].map((candle: any[]) => parseFloat(candle[4]));

                return {
                    symbol: symbol.replace('USDT', ''),
                    name: cryptoInfo[symbol as keyof typeof cryptoInfo].name,
                    image: cryptoInfo[symbol as keyof typeof cryptoInfo].image,
                    current_price: parseFloat(ticker.lastPrice),
                    price_change_percentage_24h: parseFloat(ticker.priceChangePercent),
                    sparkline_in_7d: {
                        price: prices
                    }
                };
            });

        } catch (err) {
            console.error('Error fetching Binance data:', err);
            error = err instanceof Error ? err.message : 'Failed to fetch data';
        } finally {
            isLoading = false;
        }
    }

    function getFilteredData(filter: string) {
        switch(filter) {
            case 'gainers':
                return [...cryptoData]
                    .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
                    .slice(0, 8);
            case 'losers':
                return [...cryptoData]
                    .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
                    .slice(0, 8);
            default:
                return cryptoData;
        }
    }

    function handleFilterChange(filter: string) {
        selectedFilter = filter;
        cryptoData = getFilteredData(filter);
    }

    function handleImageError(event: Event) {
        const img = event.target as HTMLImageElement;
        img.src = 'https://bin.bnbstatic.com/image/admin_mgs_image_upload/20201110/34a8ed25-ef3c-4f3c-a4f7-0d9e036ec47b.png';
        img.onerror = null;
    }

    onMount(() => {
        fetchBinanceData();
        // Update prices every 10 seconds
        const interval = setInterval(fetchBinanceData, 10000);
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
                    on:click={fetchBinanceData}
                >
                    Try Again
                </button>
            </div>
        {:else}
            <!-- Crypto Grid - Responsive layout -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                {#each cryptoData as crypto, index (crypto.symbol)}
                    <div class="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-sm hover:shadow-md transition-all duration-200">
                        <!-- Crypto Header -->
                        <div class="flex items-center gap-3 lg:gap-4 mb-3 lg:mb-4">
                            <img 
                                src={crypto.image} 
                                alt={crypto.name} 
                                class="w-8 h-8 lg:w-10 lg:h-10 object-contain rounded-full bg-gray-50"
                                on:error={handleImageError}
                            >
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
                                                id="gradient-{crypto.symbol}"
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
                                            fill="url(#gradient-{crypto.symbol})"
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