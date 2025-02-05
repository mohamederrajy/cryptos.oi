<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    let isLoading = true;
    let updateInterval: any;
    let isDropdownOpen = false;

    // Available pairs
    const tradingPairs = [
        { symbol: 'BTC/USDT', icon: '₿' },
        { symbol: 'ETH/USDT', icon: 'Ξ' },
        { symbol: 'BNB/USDT', icon: 'BNB' },
        { symbol: 'SOL/USDT', icon: 'SOL' },
        { symbol: 'XRP/USDT', icon: 'XRP' }
    ];

    // Current pair info
    let currentPair = {
        symbol: 'BTC/USDT',
        lastPrice: '104090.6829',
        change: '-6.477',
        low: '101266.41',
        high: '111308.0694',
        volume: '60,488,272.93'
    };

    // Order book data with reactive binding
    let orderBookData = {
        asks: [
            { price: '113085.9231', amount: '0.01106', total: '1250.7303095' },
            { price: '113085.912', amount: '0.0001', total: '11.3085912' },
            { price: '113085.7122', amount: '0.00023', total: '26.0097138' },
            { price: '113085.69', amount: '0.00902', total: '1020.0329238' },
            { price: '113085.5124', amount: '0.00017', total: '19.2245371' },
            { price: '113085.4125', amount: '0.00012', total: '13.5702495' },
            { price: '113085.2682', amount: '0.00751', total: '849.2703642' }
        ],
        bids: [
            { price: '113080.584', amount: '0.03925', total: '4438.412922' },
            { price: '113081.3277', amount: '1.14037', total: '128954.5536692' },
            { price: '113081.3832', amount: '0.00024', total: '27.139532' },
            { price: '113081.5275', amount: '0.00012', total: '13.5697833' },
            { price: '113082.249', amount: '6.83971', total: '773449.7893078' },
            { price: '113081.9382', amount: '0.00018', total: '20.3547489' },
            { price: '113081.9493', amount: '0.00018', total: '20.3547509' }
        ]
    };

    function toggleDropdown() {
        isDropdownOpen = !isDropdownOpen;
    }

    function selectPair(pair: any) {
        currentPair.symbol = pair.symbol;
        isDropdownOpen = false;
        // Here you would typically update other data based on the new pair
    }

    // Function to generate random trade data
    function generateNewTrade() {
        const basePrice = parseFloat(currentPair.lastPrice);
        const randomChange = (Math.random() - 0.5) * 10;
        const newPrice = (basePrice + randomChange).toFixed(4);
        const amount = (Math.random() * 0.1).toFixed(6);
        const total = (parseFloat(newPrice) * parseFloat(amount)).toFixed(7);

        // Update current price
        currentPair.lastPrice = newPrice;
        
        // Add to asks or bids based on price movement
        if (randomChange > 0) {
            orderBookData.asks = [
                { price: newPrice, amount, total },
                ...orderBookData.asks.slice(0, 6)
            ];
        } else {
            orderBookData.bids = [
                { price: newPrice, amount, total },
                ...orderBookData.bids.slice(0, 6)
            ];
        }

        // Force update
        orderBookData = { ...orderBookData };
    }

    onMount(() => {
        const loadTradingView = () => {
            try {
                new (window as any).TradingView.widget({
                    "container_id": "tradingview_chart",
                    "autosize": true,
                    "symbol": "BINANCE:BTCUSDT",
                    "interval": "D",
                    "timezone": "exchange",
                    "theme": "light",
                    "style": "1",
                    "toolbar_bg": "#f1f3f6",
                    "withdateranges": true,
                    "hide_side_toolbar": false,
                    "allow_symbol_change": true,
                    "save_image": false,
                    "studies": [
                        "Volume@tv-basicstudies"
                    ],
                    "show_popup_button": false,
                    "popup_width": "1000",
                    "popup_height": "650",
                    "locale": "en"
                });
                isLoading = false;
            } catch (error) {
                console.error('TradingView widget error:', error);
                isLoading = false;
            }
        };

        // Load TradingView script
        const script = document.createElement('script');
        script.src = "https://s3.tradingview.com/tv.js";
        script.async = true;
        script.onload = loadTradingView;
        script.onerror = () => {
            console.error('Failed to load TradingView script');
            isLoading = false;
        };
        document.head.appendChild(script);

        // Start auto-updating
        updateInterval = setInterval(generateNewTrade, 1000);
    });

    onDestroy(() => {
        if (updateInterval) {
            clearInterval(updateInterval);
        }
    });
</script>

<div class="min-h-screen bg-gray-50">
    <!-- Updated Header -->
    <div class="bg-white border-b border-gray-200">
        <div class="container mx-auto">
            <div class="flex items-center h-16 px-4">
                <!-- Pair Selector with Dropdown -->
                <div class="relative">
                    <button 
                        class="flex items-center space-x-2 hover:bg-gray-50 rounded-lg px-3 py-2"
                        on:click={toggleDropdown}
                    >
                        <div class="flex items-center">
                            <img 
                                src="https://s2.coinmarketcap.com/static/img/coins/64x64/1.png" 
                                alt="BTC" 
                                class="w-8 h-8 mr-2"
                            />
                            <span class="font-semibold">BTC/USDT</span>
                            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </button>

                    {#if isDropdownOpen}
                        <div class="absolute z-50 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200">
                            {#each tradingPairs as pair}
                                <button
                                    class="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
                                    on:click={() => selectPair(pair)}
                                >
                                    <span class="w-6">{pair.icon}</span>
                                    <span>{pair.symbol}</span>
                                </button>
                            {/each}
                        </div>
                    {/if}
                </div>

                <!-- Price Info -->
                <div class="flex items-center ml-8 space-x-12">
                    <div>
                        <div class="text-sm text-gray-500">Last Price</div>
                        <div class="font-semibold text-red-500">{currentPair.lastPrice} USDT</div>
                    </div>
                    <div>
                        <div class="text-sm text-gray-500">24h Change</div>
                        <div class="flex items-center text-red-500">
                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                            {currentPair.change}%
                        </div>
                    </div>
                    <div>
                        <div class="text-sm text-gray-500">24h Low</div>
                        <div class="font-semibold">{currentPair.low} USDT</div>
                    </div>
                    <div>
                        <div class="text-sm text-gray-500">24h High</div>
                        <div class="font-semibold">{currentPair.high} USDT</div>
                    </div>
                    <div>
                        <div class="text-sm text-gray-500">Volume</div>
                        <div class="font-semibold">{currentPair.volume} USDT</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Main Content -->
    <div class="flex flex-col h-screen">
        <!-- Top Section with Chart and Order Book -->
        <div class="flex flex-1">
            <!-- Chart Container - Takes 70% of the width -->
            <div class="w-[70%] relative">
                {#if isLoading}
                    <div class="absolute inset-0 flex items-center justify-center bg-white">
                        <div class="flex flex-col items-center">
                            <div class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            <p class="mt-4 text-gray-600">Loading chart...</p>
                        </div>
                    </div>
                {/if}
                <div 
                    id="tradingview_chart"
                    class="tradingview-chart"
                ></div>
            </div>

            <!-- Order Book - Takes 30% of the width -->
            <div class="w-[30%] bg-white border-l border-gray-200">
                <div class="p-4">
                    <div class="flex justify-between mb-4">
                        <button class="font-semibold text-blue-600">Order Book</button>
                        <button class="text-gray-500">Market Trades</button>
                    </div>

                    <!-- Order Book Table -->
                    <div class="text-sm">
                        <div class="grid grid-cols-3 gap-4 font-medium text-gray-500 mb-2">
                            <div>PRICE (USDT)</div>
                            <div>AMOUNT (BTC)</div>
                            <div>TOTAL (USDT)</div>
                        </div>

                        <!-- Asks (Sell Orders) -->
                        <div class="space-y-1">
                            {#each orderBookData.asks as ask}
                                <div class="grid grid-cols-3 gap-4 text-red-500 bg-red-50 transition-all duration-200">
                                    <div>{parseFloat(ask.price).toFixed(4)}</div>
                                    <div>{ask.amount}</div>
                                    <div>{ask.total}</div>
                                </div>
                            {/each}
                        </div>

                        <!-- Current Price -->
                        <div class="text-center py-2 font-semibold text-lg">
                            {parseFloat(currentPair.lastPrice).toFixed(4)} USDT
                        </div>

                        <!-- Bids (Buy Orders) -->
                        <div class="space-y-1">
                            {#each orderBookData.bids as bid}
                                <div class="grid grid-cols-3 gap-4 text-green-500 bg-green-50 transition-all duration-200">
                                    <div>{parseFloat(bid.price).toFixed(4)}</div>
                                    <div>{bid.amount}</div>
                                    <div>{bid.total}</div>
                                </div>
                            {/each}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Bottom Section - Trading Form -->
        <div class="bg-white border-t border-gray-200">
            <!-- Order Type Tabs -->
            <div class="border-b border-gray-200">
                <div class="flex">
                    <button class="px-6 py-3 text-blue-600 border-b-2 border-blue-600 font-medium">
                        Open Orders
                    </button>
                    <button class="px-6 py-3 text-gray-500 hover:text-gray-700 font-medium">
                        Trade history
                    </button>
                </div>
            </div>

            <!-- Trading Form -->
            <div class="p-4">
                <!-- Buy/Sell and Order Type Tabs -->
                <div class="flex justify-between mb-6">
                    <div class="flex space-x-4">
                        <button class="px-8 py-2 bg-emerald-500 text-white rounded-lg font-medium">
                            Buy
                        </button>
                        <button class="px-8 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium">
                            Sell
                        </button>
                    </div>
                    <div class="flex space-x-2">
                        <button class="px-4 py-2 text-blue-600 border-b-2 border-blue-600 font-medium">
                            Limit
                        </button>
                        <button class="px-4 py-2 text-gray-500 hover:text-gray-700 font-medium">
                            Market
                        </button>
                    </div>
                </div>

                <!-- Order Form Grid -->
                <div class="grid grid-cols-4 gap-4">
                    <!-- Limit Price -->
                    <div>
                        <label class="block text-gray-600 mb-2">Limit Price</label>
                        <div class="relative">
                            <input 
                                type="number" 
                                class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="0"
                            />
                            <span class="absolute right-4 top-2.5 text-gray-500">USDT</span>
                        </div>
                    </div>

                    <!-- Amount -->
                    <div>
                        <label class="block text-gray-600 mb-2">Amount</label>
                        <div class="relative">
                            <input 
                                type="number" 
                                class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="0"
                            />
                            <span class="absolute right-4 top-2.5 text-gray-500">BTC</span>
                        </div>
                    </div>

                    <!-- Total -->
                    <div>
                        <label class="block text-gray-600 mb-2">Total</label>
                        <div class="relative">
                            <input 
                                type="number" 
                                class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="0"
                            />
                            <span class="absolute right-4 top-2.5 text-gray-500">USDT</span>
                        </div>
                    </div>

                    <!-- Login/Signup Button -->
                    <div class="flex flex-col justify-end">
                        <button class="w-full py-2 bg-white border border-emerald-500 text-emerald-500 rounded-lg font-medium hover:bg-emerald-50">
                            Log In or Sign Up
                        </button>
                    </div>
                </div>

                <!-- Percentage Slider -->
                <div class="mt-4">
                    <div class="flex justify-between items-center">
                        <span class="text-sm font-medium">0%</span>
                        <div class="h-2 w-2 rounded-full bg-blue-600"></div>
                        <div class="h-2 w-2 rounded-full bg-gray-300"></div>
                        <div class="h-2 w-2 rounded-full bg-gray-300"></div>
                        <div class="h-2 w-2 rounded-full bg-gray-300"></div>
                        <span class="text-sm font-medium">Fee: 0%</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
        overflow: hidden;
    }

    .tradingview-chart {
        height: calc(100vh - 84px);
    }

    :global(#tradingview_chart) {
        height: 100% !important;
    }

    :global(.tradingview-widget-container) {
        height: 100% !important;
    }

    :global(.tradingview-widget-container iframe) {
        height: 100% !important;
        width: 100% !important;
    }

    /* Add animation for new trades */
    .grid {
        transition: background-color 0.3s ease;
    }
    
    .grid:hover {
        background-color: rgba(0, 0, 0, 0.05);
    }

    .dropdown-shadow {
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
</style>
