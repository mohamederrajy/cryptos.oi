<script lang="ts">
    import { onMount } from 'svelte';
    import { createChart, CrosshairMode } from 'lightweight-charts';

    let chartContainer: HTMLElement;
    let chart: any;
    let candleSeries: any;

    // Trading pair state
    let selectedPair = {
        symbol: 'BTC/USDT',
        price: '113082.2601',
        change: '-3.039',
        low: '112567.32',
        high: '116662.1766',
        volume: '16,853,543.73'
    };

    // Order book data
    let asks = [
        { price: '113085.9231', amount: '0.01106', total: '1250.730309' },
        { price: '113085.912', amount: '0.0001', total: '11.3085912' },
        { price: '113085.7122', amount: '0.00023', total: '26.0097138' },
        // ... more asks
    ];

    let bids = [
        { price: '113080.584', amount: '0.03925', total: '4438.412922' },
        { price: '113081.3277', amount: '1.14037', total: '128954.5536692' },
        { price: '113081.3832', amount: '0.00024', total: '27.139532' },
        // ... more bids
    ];

    async function fetchCandleData() {
        try {
            // Replace with your actual API endpoint
            const response = await fetch('https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=1000');
            const data = await response.json();
            
            return data.map((d: any[]) => ({
                time: d[0] / 1000,
                open: parseFloat(d[1]),
                high: parseFloat(d[2]),
                low: parseFloat(d[3]),
                close: parseFloat(d[4]),
                volume: parseFloat(d[5])
            }));
        } catch (error) {
            console.error('Error fetching candle data:', error);
            return [];
        }
    }

    onMount(async () => {
        // Create chart
        chart = createChart(chartContainer, {
            width: chartContainer.clientWidth,
            height: 500,
            layout: {
                background: { color: '#ffffff' },
                textColor: '#333',
            },
            grid: {
                vertLines: { color: '#f0f3fa' },
                horzLines: { color: '#f0f3fa' },
            },
            crosshair: {
                mode: CrosshairMode.Normal,
            },
            rightPriceScale: {
                borderColor: '#f0f3fa',
            },
            timeScale: {
                borderColor: '#f0f3fa',
                timeVisible: true,
            },
        });

        // Add candlestick series
        candleSeries = chart.addCandlestickSeries({
            upColor: '#26a69a',
            downColor: '#ef5350',
            borderUpColor: '#26a69a',
            borderDownColor: '#ef5350',
            wickUpColor: '#26a69a',
            wickDownColor: '#ef5350',
        });

        // Add volume series
        const volumeSeries = chart.addHistogramSeries({
            color: '#26a69a',
            priceFormat: {
                type: 'volume',
            },
            priceScaleId: '',
            scaleMargins: {
                top: 0.8,
                bottom: 0,
            },
        });

        // Fetch and set initial data
        const candleData = await fetchCandleData();
        candleSeries.setData(candleData);

        // Handle window resize
        const resizeObserver = new ResizeObserver(entries => {
            if (entries.length === 0 || !chart) return;
            const newRect = entries[0].contentRect;
            chart.applyOptions({ width: newRect.width });
        });

        resizeObserver.observe(chartContainer);

        // Cleanup
        return () => {
            resizeObserver.disconnect();
            if (chart) {
                chart.remove();
            }
        };
    });
</script>

<div class="bg-white rounded-xl shadow-sm border border-gray-200">
    <!-- Trading Pair Info -->
    <div class="p-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
                <img src="/images/crypto-icons/btc.svg" alt="BTC" class="w-8 h-8" />
                <div>
                    <h2 class="text-lg font-semibold">{selectedPair.symbol}</h2>
                    <div class="flex items-center gap-2">
                        <span class="text-2xl font-bold">${selectedPair.price}</span>
                        <span class="text-red-500">
                            {selectedPair.change}%
                            <svg class="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </span>
                    </div>
                </div>
            </div>
            <div class="grid grid-cols-3 gap-8">
                <div>
                    <span class="text-gray-500 text-sm">24h Low</span>
                    <p class="font-medium">${selectedPair.low}</p>
                </div>
                <div>
                    <span class="text-gray-500 text-sm">24h High</span>
                    <p class="font-medium">${selectedPair.high}</p>
                </div>
                <div>
                    <span class="text-gray-500 text-sm">24h Volume</span>
                    <p class="font-medium">${selectedPair.volume}</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Chart -->
    <div class="p-4">
        <div class="flex items-center gap-4 mb-4">
            <div class="flex items-center gap-2 text-sm">
                <button class="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200">1m</button>
                <button class="px-3 py-1 rounded hover:bg-gray-100">5m</button>
                <button class="px-3 py-1 rounded hover:bg-gray-100">15m</button>
                <button class="px-3 py-1 rounded hover:bg-gray-100">1h</button>
                <button class="px-3 py-1 rounded hover:bg-gray-100">4h</button>
                <button class="px-3 py-1 rounded hover:bg-gray-100">1d</button>
            </div>
            <div class="flex items-center gap-2">
                <button class="p-1.5 rounded hover:bg-gray-100">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                </button>
                <button class="p-1.5 rounded hover:bg-gray-100">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                </button>
            </div>
        </div>
        <div bind:this={chartContainer} class="w-full"></div>
    </div>

    <!-- Order Book -->
    <div class="p-4 border-t border-gray-200">
        <div class="flex justify-between mb-4">
            <h3 class="font-semibold">Order Book</h3>
            <div class="flex items-center gap-2 text-sm">
                <button class="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200">0.1</button>
                <button class="px-3 py-1 rounded hover:bg-gray-100">0.01</button>
                <button class="px-3 py-1 rounded hover:bg-gray-100">0.001</button>
            </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
            <!-- Asks -->
            <div>
                <div class="grid grid-cols-3 text-sm text-gray-500 mb-2">
                    <span>Price (USDT)</span>
                    <span>Amount (BTC)</span>
                    <span>Total</span>
                </div>
                <div class="space-y-1">
                    {#each asks as ask}
                        <div class="grid grid-cols-3 text-sm">
                            <span class="text-red-500">{ask.price}</span>
                            <span>{ask.amount}</span>
                            <span>{ask.total}</span>
                        </div>
                    {/each}
                </div>
            </div>
            <!-- Bids -->
            <div>
                <div class="grid grid-cols-3 text-sm text-gray-500 mb-2">
                    <span>Price (USDT)</span>
                    <span>Amount (BTC)</span>
                    <span>Total</span>
                </div>
                <div class="space-y-1">
                    {#each bids as bid}
                        <div class="grid grid-cols-3 text-sm">
                            <span class="text-green-500">{bid.price}</span>
                            <span>{bid.amount}</span>
                            <span>{bid.total}</span>
                        </div>
                    {/each}
                </div>
            </div>
        </div>
    </div>
</div>
