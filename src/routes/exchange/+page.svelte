<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { notifications } from '$lib/stores/notifications';
    import { PUBLIC_API_URL } from '$env/static/public';
    import { session } from '$lib/stores/session';
    import { fade } from 'svelte/transition';

    let isLoading = true;
    let updateInterval: any;
    let isDropdownOpen = false;

    // Form state
    let limitPrice: number | null = null;
    let amount: number | null = null;
    let total: number | null = null;
    let isPlacingOrder = false;
    let orderType: 'buy' | 'sell' = 'buy';
    let orderMode: 'limit' | 'market' = 'limit';

    // Calculate total when price or amount changes
    $: if (limitPrice && amount) {
        total = limitPrice * amount;
    }

    // Available pairs with icons
    const tradingPairs = [
        { 
            symbol: 'BTC/USDT',
            name: 'Bitcoin',
            icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png'
        },
        { 
            symbol: 'ETH/USDT',
            name: 'Ethereum',
            icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png'
        },
        { 
            symbol: 'BNB/USDT',
            name: 'BNB',
            icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png'
        },
        { 
            symbol: 'SOL/USDT',
            name: 'Solana',
            icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png'
        }
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

    // Order book data
    let orderBookData = {
        asks: [
            { price: '113085.9231', amount: '0.01106', total: '1250.7303095' },
            { price: '113085.912', amount: '0.0001', total: '11.3085912' },
            { price: '113085.7122', amount: '0.00023', total: '26.0097138' },
            { price: '113085.69', amount: '0.00902', total: '1020.0329238' },
            { price: '113085.5124', amount: '0.00017', total: '19.2245371' }
        ],
        bids: [
            { price: '113080.584', amount: '0.03925', total: '4438.412922' },
            { price: '113081.3277', amount: '1.14037', total: '128954.5536692' },
            { price: '113081.3832', amount: '0.00024', total: '27.139532' },
            { price: '113081.5275', amount: '0.00012', total: '13.5697833' },
            { price: '113082.249', amount: '6.83971', total: '773449.7893078' }
        ]
    };

    let chartContainer: HTMLElement;
    let widget: any;
    let chartError: string | null = null;

    async function initTradingView() {
        try {
            if (typeof window === 'undefined') return;

            // Create container if it doesn't exist
            let container = document.getElementById('tradingview_widget');
            if (!container) {
                container = document.createElement('div');
                container.id = 'tradingview_widget';
                container.className = 'h-[600px] w-full';
            }

            // Wait for TradingView script to load
            if (!(window as any).TradingView) {
                const script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = 'https://s3.tradingview.com/tv.js';
                script.async = true;
                
                await new Promise((resolve, reject) => {
                    script.onload = resolve;
                    script.onerror = () => reject(new Error('Failed to load TradingView widget'));
                    document.head.appendChild(script);
                });
            }

            // Make sure we wait for the next tick and DOM update
            await new Promise(resolve => setTimeout(resolve, 100));

            // Initialize widget
            widget = new (window as any).TradingView.widget({
                container_id: 'tradingview_widget',
                autosize: true,
                symbol: "BINANCE:BTCUSDT",
                interval: "D",
                timezone: "exchange",
                theme: "light",
                style: "1",
                toolbar_bg: "#f1f3f6",
                withdateranges: true,
                hide_side_toolbar: false,
                allow_symbol_change: true,
                save_image: false,
                studies: ["Volume@tv-basicstudies"],
                show_popup_button: false,
                popup_width: "1000",
                popup_height: "650",
                locale: "en",
                enable_publishing: false,
                hide_top_toolbar: false,
                hide_legend: false,
                width: "100%",
                height: "100%"
            });

            // Add onready handler
            widget.onChartReady(() => {
                isLoading = false;
            });

        } catch (error) {
            console.error('TradingView initialization error:', error);
            chartError = error instanceof Error ? error.message : 'Failed to load chart';
            isLoading = false;
        }
    }

    async function handlePlaceOrder() {
        if (!limitPrice || !amount || !total) {
            notifications.error('Please fill in all fields');
            return;
        }

        try {
            isPlacingOrder = true;
            const response = await fetch(`${PUBLIC_API_URL}/api/orders/place`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    pair: currentPair.symbol,
                    type: orderType,
                    mode: orderMode,
                    price: limitPrice,
                    amount: amount,
                    total: total
                })
            });

            if (response.ok) {
                notifications.success('Order placed successfully');
                limitPrice = null;
                amount = null;
                total = null;
            } else {
                const error = await response.json();
                notifications.error(error.message || 'Failed to place order');
            }
        } catch (error) {
            console.error('Order error:', error);
            notifications.error('Failed to place order');
        } finally {
            isPlacingOrder = false;
        }
    }

    function selectPair(pair: typeof tradingPairs[0]) {
        currentPair.symbol = pair.symbol;
        isDropdownOpen = false;
    }

    onMount(() => {
        // Delay initialization slightly to ensure DOM is ready
        setTimeout(initTradingView, 0);
    });

    onDestroy(() => {
        if (widget) {
            try {
                widget.remove();
            } catch (error) {
                console.error('Error cleaning up TradingView widget:', error);
            }
        }
        if (updateInterval) clearInterval(updateInterval);
    });
</script>

<div class="min-h-screen bg-gray-50" in:fade>
    <!-- Header Section -->
    <div class="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
        <div class="max-w-7xl mx-auto">
            <div class="flex flex-wrap items-center justify-between gap-4">
                <!-- Pair Selector -->
                <div class="relative">
                    <button 
                        class="flex items-center space-x-2 bg-white/10 hover:bg-white/20 rounded-xl px-4 py-2 text-white transition-colors"
                        on:click={() => isDropdownOpen = !isDropdownOpen}
                    >
                        <img 
                            src={tradingPairs.find(p => p.symbol === currentPair.symbol)?.icon} 
                            alt={currentPair.symbol}
                            class="w-8 h-8"
                        />
                        <span class="font-medium">{currentPair.symbol}</span>
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {#if isDropdownOpen}
                        <div class="absolute z-50 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100">
                            {#each tradingPairs as pair}
                                <button
                                    class="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 first:rounded-t-xl last:rounded-b-xl"
                                    on:click={() => selectPair(pair)}
                                >
                                    <img src={pair.icon} alt={pair.symbol} class="w-8 h-8"/>
                                    <div>
                                        <div class="font-medium text-gray-900">{pair.name}</div>
                                        <div class="text-sm text-gray-500">{pair.symbol}</div>
                                    </div>
                                </button>
                            {/each}
                        </div>
                    {/if}
                </div>

                <!-- Price Stats -->
                <div class="flex flex-wrap items-center gap-8 text-white">
                    <div>
                        <div class="text-sm text-white/80">Last Price</div>
                        <div class="text-lg font-semibold">{currentPair.lastPrice} USDT</div>
                    </div>
                    <div>
                        <div class="text-sm text-white/80">24h Change</div>
                        <div class="text-lg font-semibold text-red-400">{currentPair.change}%</div>
                    </div>
                    <div>
                        <div class="text-sm text-white/80">24h High</div>
                        <div class="text-lg font-semibold">{currentPair.high}</div>
                    </div>
                    <div>
                        <div class="text-sm text-white/80">24h Low</div>
                        <div class="text-lg font-semibold">{currentPair.low}</div>
                    </div>
                    <div>
                        <div class="text-sm text-white/80">24h Volume</div>
                        <div class="text-lg font-semibold">{currentPair.volume}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 py-6">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <!-- Chart Section -->
            <div class="lg:col-span-3 bg-white rounded-xl shadow-sm overflow-hidden">
                <div class="relative h-[600px]">
                    {#if isLoading}
                        <div class="absolute inset-0 flex items-center justify-center bg-white">
                            <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                        </div>
                    {/if}
                    {#if chartError}
                        <div class="absolute inset-0 flex items-center justify-center bg-white">
                            <div class="text-center">
                                <p class="mb-4 text-red-500">{chartError}</p>
                                <button 
                                    class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                    on:click={() => {
                                        isLoading = true;
                                        chartError = null;
                                        initTradingView();
                                    }}
                                >
                                    Retry Loading Chart
                                </button>
                            </div>
                        </div>
                    {/if}
                    <div id="tradingview_widget" class="h-full w-full"></div>
                </div>
            </div>

            <!-- Order Book -->
            <div class="bg-white rounded-xl shadow-sm p-4">
                <h2 class="text-lg font-semibold mb-4">Order Book</h2>
                
                <!-- Asks -->
                <div class="space-y-1 mb-4">
                    {#each orderBookData.asks as ask}
                        <div class="grid grid-cols-3 text-sm py-1 text-red-500">
                            <span>{parseFloat(ask.price).toFixed(2)}</span>
                            <span>{ask.amount}</span>
                            <span>{parseFloat(ask.total).toFixed(2)}</span>
                        </div>
                    {/each}
                </div>

                <!-- Current Price -->
                <div class="text-center py-2 font-semibold text-lg border-y border-gray-100">
                    {parseFloat(currentPair.lastPrice).toFixed(2)} USDT
                </div>

                <!-- Bids -->
                <div class="space-y-1 mt-4">
                    {#each orderBookData.bids as bid}
                        <div class="grid grid-cols-3 text-sm py-1 text-green-500">
                            <span>{parseFloat(bid.price).toFixed(2)}</span>
                            <span>{bid.amount}</span>
                            <span>{parseFloat(bid.total).toFixed(2)}</span>
                        </div>
                    {/each}
                </div>
            </div>
        </div>

        <!-- Trading Form -->
        <div class="mt-6 bg-white rounded-xl shadow-sm p-6">
            <div class="flex justify-between mb-6">
                <div class="flex gap-4">
                    <button 
                        class="px-6 py-2 rounded-lg font-medium transition-colors {orderType === 'buy' ? 'bg-green-500 text-white' : 'text-gray-600 hover:bg-gray-100'}"
                        on:click={() => orderType = 'buy'}
                    >
                        Buy
                    </button>
                    <button 
                        class="px-6 py-2 rounded-lg font-medium transition-colors {orderType === 'sell' ? 'bg-red-500 text-white' : 'text-gray-600 hover:bg-gray-100'}"
                        on:click={() => orderType = 'sell'}
                    >
                        Sell
                    </button>
                </div>
                <div class="flex gap-4">
                    <button 
                        class="px-4 py-2 rounded-lg font-medium transition-colors {orderMode === 'limit' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'}"
                        on:click={() => orderMode = 'limit'}
                    >
                        Limit
                    </button>
                    <button 
                        class="px-4 py-2 rounded-lg font-medium transition-colors {orderMode === 'market' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'}"
                        on:click={() => orderMode = 'market'}
                    >
                        Market
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <!-- Price Input -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Price</label>
                    <div class="relative">
                        <input 
                            type="number"
                            bind:value={limitPrice}
                            class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="0.00"
                            disabled={!$session.isAuthenticated || orderMode === 'market'}
                        />
                        <span class="absolute right-3 top-2.5 text-gray-500">USDT</span>
                    </div>
                </div>

                <!-- Amount Input -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                    <div class="relative">
                        <input 
                            type="number"
                            bind:value={amount}
                            class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="0.00"
                            disabled={!$session.isAuthenticated}
                        />
                        <span class="absolute right-3 top-2.5 text-gray-500">BTC</span>
                    </div>
                </div>

                <!-- Total Input -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Total</label>
                    <div class="relative">
                        <input 
                            type="number"
                            bind:value={total}
                            class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="0.00"
                            disabled={!$session.isAuthenticated}
                        />
                        <span class="absolute right-3 top-2.5 text-gray-500">USDT</span>
                    </div>
                </div>

                <!-- Action Button -->
                <div class="flex items-end">
                    {#if $session.isAuthenticated}
                        <button 
                            class="w-full py-2 rounded-lg font-medium transition-colors disabled:opacity-50 {orderType === 'buy' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} text-white"
                            on:click={handlePlaceOrder}
                            disabled={isPlacingOrder}
                        >
                            {#if isPlacingOrder}
                                <div class="flex items-center justify-center">
                                    <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Processing...
                                </div>
                            {:else}
                                {orderType === 'buy' ? 'Buy' : 'Sell'} {currentPair.symbol.split('/')[0]}
                            {/if}
                        </button>
                    {:else}
                        <button 
                            class="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                            on:click={() => window.location.href = '/account/login'}
                        >
                            Login to Trade
                        </button>
                    {/if}
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    :global(body) {
        background-color: #F3F4F6;
    }

    :global(#tradingview_widget),
    :global(.tradingview-widget-container) {
        height: 100% !important;
        width: 100% !important;
    }

    :global(.tradingview-widget-container iframe) {
        height: 100% !important;
        width: 100% !important;
    }
</style>
