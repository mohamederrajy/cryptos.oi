<script lang="ts">
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import { PUBLIC_API_URL } from '$env/static/public';

    interface Cryptocurrency {
        _id: string;
        name: string;
        symbol: string;
        logo: string;
        price: number;
        change24h: number;
        marketCap: number;
        volume24h: number;
        volumeChange24h: number;
        isActive: boolean;
        createdAt: string;
        updatedAt: string;
        // Additional fields from CoinGecko
        geckoId?: string;
        sparkline?: number[];
        rank?: number;
        ath?: number;
        athChange?: number;
        source: string;
        sourceLabel: string;
        imageUrl: string;
    }

    let cryptocurrencies: Cryptocurrency[] = [];
    let isLoading = true;
    let error: string | null = null;
    let searchQuery = '';
    let selectedCategory = 'All';
    let currentPage = 1;
    let itemsPerPage = 10;

    // Categories with modern design
    const categories = [
        {
            name: 'All',
            icon: '🌐',
            bgColor: 'from-blue-500 to-blue-600',
            description: 'View all cryptocurrencies'
        },
        {
            name: 'Top Gainers',
            icon: '📈',
            bgColor: 'from-green-500 to-green-600',
            description: 'Best performing assets'
        },
        {
            name: 'Top Losers',
            icon: '📉',
            bgColor: 'from-red-500 to-red-600',
            description: 'Largest price drops'
        },
        {
            name: 'Trending',
            icon: '🔥',
            bgColor: 'from-orange-500 to-orange-600',
            description: 'Most popular tokens'
        }
    ];

    // Replace the existing defaultCryptoImage with this one
    const defaultCryptoImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAF8WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNy4yLWMwMDAgNzkuMWI2NWE3OWI0LCAyMDIyLzA2LzEzLTIyOjAxOjAxICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjQuMCAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjMtMDMtMjdUMTU6NDA6MzItMDQ6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjMtMDMtMjdUMTU6NDA6MzItMDQ6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDIzLTAzLTI3VDE1OjQwOjMyLTA0OjAwIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjNlZDI5ZmQwLWU1ZDYtNDRkNC1hMmM1LTU3ODNiYmM4N2E4NCIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjIzYjFiMjIwLTM2ZjYtYzU0Ny05OWE2LWYxZjJjNDQ2ZTAwYyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjNhOWZkZjUyLTU5MDYtNDRkMy05YzIwLTNlYWQ4YzI5YTk4ZiIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjNhOWZkZjUyLTU5MDYtNDRkMy05YzIwLTNlYWQ4YzI5YTk4ZiIgc3RFdnQ6d2hlbj0iMjAyMy0wMy0yN1QxNTo0MDozMi0wNDowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDI0LjAgKE1hY2ludG9zaCkiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjNlZDI5ZmQwLWU1ZDYtNDRkNC1hMmM1LTU3ODNiYmM4N2E4NCIgc3RFdnQ6d2hlbj0iMjAyMy0wMy0yN1QxNTo0MDozMi0wNDowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDI0LjAgKE1hY2ludG9zaCkiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+4pzY6AAAAodJREFUWIXFl01IVFEUx3/3vWk+dXQ+HDWxD6LSIisyKoKIFhVRQVC0CyKICKJatKpFQQupXS0jKGgRFBRUEBRZkBQURBsLgmgxFjSNOuQ4zrzXu/e2mOt7b5zxzYzvDx7vvnvPPf//nHPvfUcYY1gPlFLtwDEgD7wGPq8HsS3iZ4BbQMJ+PwYcBt6uNbkQQnQAo0D1Iq9uAKeB6FoSG2PMG6XULiADJIEfwBPgJ7AXaABOAknWGEIIEQEOAe+Bz0qpk0qpiFLKKKX+/ZRSt4UQu9eaPGiRhxFCxIFbxphzxpgpIcQzoAs4COwH3gEfrTXGmhAXQQgRBW4CvcaYd0KIfqADOA90SymllPIZcBF4uNrEQQvEgH1AH4BSahZ4DLwEUsaY+8aYGaXUMPAXmF5t4qAFZoEBpdSwlDINYIyZBN4AKaXUqFJqQko5BRwHniul8qtJbC8SBfYAV4BjQojdxpgfQoiYMWZOSpkBJqSUE1LKz8aYz1LKDNAHvF8tcgAR9IwXQsSBA8BFoA2YBt4CSSAONAIpoB6YA34BA8aYwdUkXxJCiAhQBzQBe4FW27UZqAUMkAO+Ad+VUjNrQbokhBBRoBVoBZrtX5P9TQIJwGWxVeeBaWDMGPMXQCk1txLyoGX4EtABHLEWqLE9YkAVUGkJfUAeyNo2C0wBk8aYrO2bBT4AQ8aYzHLJgxaIA93ARaAZiNu+MksuKCQPOLbNWaIZ4BcwbIyZWA55EPk2oA9osPPLAhNSyqwxJmvt7toyXEq+EsRB5FXAeWC/nV8emATGlVJTgC+EqLTWqsKW4VJyB8gDOWPM/ErJF0II4QK1QNr2+2uJ/wPd9BXHcd5EvQAAAABJRU5ErkJggg==";

    // Add this function to handle image loading
    let loadedImages = new Set();
    
    function handleImageLoad(crypto: Cryptocurrency) {
        loadedImages.add(crypto.symbol);
    }

    // Function to fetch data from CoinGecko
    async function fetchCoinGeckoData() {
        try {
            const response = await fetch(
                'https://api.coingecko.com/api/v3/coins/markets?' +
                new URLSearchParams({
                    vs_currency: 'usd',
                    order: 'market_cap_desc',
                    per_page: '250',
                    page: '1',
                    sparkline: 'true',
                    price_change_percentage: '24h',
                    locale: 'en'
                })
            );
            
            if (!response.ok) throw new Error('Failed to fetch CoinGecko data');
            const data = await response.json();
            
            return data.map(coin => ({
                geckoId: coin.id,
                name: coin.name,
                symbol: coin.symbol.toUpperCase(),
                logo: coin.image,
                price: coin.current_price,
                change24h: coin.price_change_percentage_24h || 0,
                marketCap: coin.market_cap,
                volume24h: coin.total_volume,
                volumeChange24h: coin.price_change_percentage_24h || 0,
                rank: coin.market_cap_rank,
                ath: coin.ath,
                athChange: coin.ath_change_percentage,
                sparkline: coin.sparkline_in_7d?.price || [],
                source: 'coingecko',
                sourceLabel: 'CoinGecko',
                isActive: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                _id: coin.id,
                imageUrl: coin.image // Use the direct image URL from CoinGecko
            }));
        } catch (error) {
            console.error('CoinGecko fetch error:', error);
            return [];
        }
    }

    // Function to fetch data from your backend
    async function fetchBackendData() {
        try {
            const response = await fetch(`${PUBLIC_API_URL}/api/cryptocurrencies`);
            if (!response.ok) throw new Error('Failed to fetch backend data');
            return await response.json();
        } catch (error) {
            console.error('Backend fetch error:', error);
            return [];
        }
    }

    // Update the mergeCryptoData function
    function mergeCryptoData(backendData: Cryptocurrency[], geckoData: any[]) {
        const mergedData = new Map();

        // Add backend data first
        backendData.forEach(coin => {
            mergedData.set(coin.symbol.toLowerCase(), {
                ...coin,
                source: 'backend',
                sourceLabel: 'Internal',
                imageUrl: null // We'll construct the full URL in the template
            });
        });

        // Merge with CoinGecko data
        geckoData.forEach(coin => {
            const existingCoin = mergedData.get(coin.symbol.toLowerCase());
            if (existingCoin) {
                // Update existing coin with additional CoinGecko data
                mergedData.set(coin.symbol.toLowerCase(), {
                    ...existingCoin,
                    geckoId: coin.geckoId,
                    sparkline: coin.sparkline,
                    rank: coin.rank,
                    ath: coin.ath,
                    athChange: coin.athChange
                });
            } else {
                // Add new coin from CoinGecko
                mergedData.set(coin.symbol.toLowerCase(), {
                    _id: coin.geckoId,
                    ...coin,
                    source: 'coingecko',
                    sourceLabel: 'CoinGecko'
                });
            }
        });

        return Array.from(mergedData.values());
    }

    // Add image preloading
    function preloadImage(url: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve();
            img.onerror = () => reject();
            img.src = url;
        });
    }

    // Update the fetchCryptoData function with better image handling
    async function fetchCryptoData() {
        try {
            isLoading = true;
            error = null;

            // Create an image cache Map
            const imageCache = new Map<string, string>();

            const [backendData, geckoData] = await Promise.all([
                fetchBackendData(),
                fetchCoinGeckoData()
            ]);

            // Process backend data first
            backendData.forEach(coin => {
                if (coin.logo) {
                    const imageUrl = `${PUBLIC_API_URL}${coin.logo}`;
                    imageCache.set(coin.symbol, imageUrl);
                }
            });

            // Process CoinGecko data
            geckoData.forEach(coin => {
                if (coin.image && !imageCache.has(coin.symbol)) {
                    imageCache.set(coin.symbol, coin.image);
                }
            });

            // Preload images in chunks of 10
            const preloadImagesInChunks = async () => {
                const chunks = Array.from(imageCache.entries()).reduce((acc, curr, i) => {
                    const chunkIndex = Math.floor(i / 10);
                    if (!acc[chunkIndex]) acc[chunkIndex] = [];
                    acc[chunkIndex].push(curr);
                    return acc;
                }, [] as Array<[string, string][]>);

                for (const chunk of chunks) {
                    await Promise.allSettled(
                        chunk.map(([symbol, url]) => 
                            preloadImage(url)
                                .then(() => loadedImages.add(symbol))
                                .catch(() => {
                                    loadedImages.add(symbol);
                                    imageCache.set(symbol, defaultCryptoImage);
                                })
                        )
                    );
                }
            };

            // Start preloading images but don't wait for completion
            preloadImagesInChunks();

            cryptocurrencies = mergeCryptoData(backendData, geckoData);
        } catch (e) {
            error = e instanceof Error ? e.message : 'An error occurred';
        } finally {
            isLoading = false;
        }
    }

    onMount(() => {
        fetchCryptoData();
        const interval = setInterval(fetchCryptoData, 60000);
        return () => clearInterval(interval);
    });

    // Format helpers
    const formatUSD = (num: number) => {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
            currency: 'USD',
            minimumFractionDigits: num < 1 ? 4 : 2,
            maximumFractionDigits: num < 1 ? 8 : 2
            }).format(num);
    };

    const formatNumber = (num: number) => {
        if (num >= 1e9) {
            return `${(num / 1e9).toFixed(2)}B`;
        } else if (num >= 1e6) {
            return `${(num / 1e6).toFixed(2)}M`;
        }
        return new Intl.NumberFormat('en-US').format(num);
    };

    // Filter cryptos based on search and category
    $: filteredCryptos = cryptocurrencies.filter(crypto => {
        const matchesSearch = searchQuery.toLowerCase() === '' || 
            crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory = selectedCategory === 'All' ||
            (selectedCategory === 'Top Gainers' && crypto.change24h > 0) ||
            (selectedCategory === 'Top Losers' && crypto.change24h < 0) ||
            (selectedCategory === 'Trending' && crypto.marketCap > 1e9); // Assuming trending are those with market cap > $1B

        return matchesSearch && matchesCategory;
    });

    // Add this computed property for pagination
    $: totalPages = Math.ceil(filteredCryptos.length / itemsPerPage);

    // Add this computed property for paginated data
    $: paginatedCryptos = filteredCryptos.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Update the tableRows computation to remove sourceLabel
    $: tableRows = paginatedCryptos;

    // Add this function to generate mock graph data points
    function generateGraphPoints(volume: number, change: number): number[] {
        const points = [];
        const baseValue = volume;
        const volatility = Math.abs(change) / 100;
        
        for (let i = 0; i < 24; i++) {
            const randomFactor = 1 + (Math.random() - 0.5) * volatility;
            points.push(baseValue * randomFactor);
        }
        return points;
    }

    // Add this to normalize values between 0 and 1
    function normalizeValue(value: number, min: number, max: number): number {
        return (value - min) / (max - min);
    }

    // Add this function to handle page changes
    function changePage(page: number) {
        currentPage = page;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
</script>

<div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 lg:py-10" in:fade>
    <!-- Header Section - Reduced margins for mobile -->
    <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl lg:rounded-2xl shadow-lg p-3 lg:p-8 mb-4 lg:mb-8">
        <div class="flex flex-col md:flex-row justify-between items-center gap-3 lg:gap-6">
            <div class="text-white text-center md:text-left w-full md:w-auto">
                <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 lg:mb-2">Cryptocurrency Prices</h1>
                <p class="text-blue-100 text-sm lg:text-base">Track real-time cryptocurrency prices and market movements</p>
            </div>
            <div class="w-full md:w-96">
            <div class="relative">
                <input
                    type="text"
                    bind:value={searchQuery}
                        placeholder="Search by name or symbol..."
                        class="w-full px-4 py-2 lg:py-3 rounded-lg bg-white/10 text-white placeholder-blue-100 
                               border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50
                               text-sm lg:text-base"
                    />
                    <svg class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-blue-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>
        </div>
    </div>

    <!-- Categories Grid - Reduced gaps for mobile -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-6 mb-4 lg:mb-8">
            {#each categories as category}
                <button 
                class="bg-gradient-to-r {category.bgColor} rounded-lg lg:rounded-xl p-3 lg:p-6 text-white hover:shadow-lg 
                       transition-all transform hover:-translate-y-1 
                       {selectedCategory === category.name ? 'ring-2 lg:ring-4 ring-blue-200' : ''}"
                on:click={() => selectedCategory = category.name}
            >
                <div class="flex items-center gap-3 lg:gap-4">
                    <span class="text-xl lg:text-2xl">{category.icon}</span>
                    <div class="text-left">
                        <h3 class="font-semibold text-sm lg:text-base">{category.name}</h3>
                        <p class="text-xs lg:text-sm text-white/80">{category.description}</p>
                    </div>
                </div>
                </button>
            {/each}
    </div>

    <!-- Crypto Table - Adjusted padding for mobile -->
    <div class="bg-white rounded-lg lg:rounded-xl shadow-lg overflow-hidden">
        <!-- Table Header - Reduced padding for mobile -->
        <div class="grid grid-cols-3 lg:grid-cols-6 gap-2 lg:gap-4 px-3 lg:px-6 py-2 lg:py-4 bg-gray-50 border-b border-gray-200">
            <div class="text-xs lg:text-sm font-medium text-gray-500">Asset</div>
            <div class="text-xs lg:text-sm font-medium text-gray-500">Price</div>
            <div class="text-xs lg:text-sm font-medium text-gray-500">24h Change</div>
            <div class="hidden lg:block text-sm font-medium text-gray-500">Market Cap</div>
            <div class="hidden lg:block text-sm font-medium text-gray-500">Volume (24h)</div>
            <div class="hidden lg:block text-sm font-medium text-gray-500">Volume Graph</div>
        </div>

                <!-- Loading State -->
                {#if isLoading}
            <div class="p-8 text-center">
                <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
                <p class="text-gray-500">Loading cryptocurrency data...</p>
                    </div>
                <!-- Error State -->
        {:else if error}
            <div class="p-8 text-center">
                <div class="bg-red-50 text-red-600 p-4 rounded-lg inline-block">
                    <p>Error: {error}</p>
                    <button 
                        class="mt-2 text-sm text-red-700 hover:text-red-800"
                        on:click={fetchCryptoData}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        <!-- Data Display - Make responsive -->
        {:else}
            {#each tableRows as crypto}
                <div class="grid grid-cols-3 lg:grid-cols-6 gap-2 lg:gap-4 px-3 lg:px-6 py-2 lg:py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <!-- Asset -->
                    <div class="flex items-center gap-2 lg:gap-3">
                        <div class="w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-gray-100 shadow-sm overflow-hidden flex-shrink-0">
                            <img 
                                src={crypto.source === 'backend' ? 
                                    (crypto.logo ? `${PUBLIC_API_URL}${crypto.logo}` : defaultCryptoImage) : 
                                    (crypto.imageUrl || defaultCryptoImage)}
                                alt={crypto.name} 
                                class="w-full h-full object-cover"
                                loading="lazy"
                                decoding="async"
                                onerror="this.onerror=null; this.src=defaultCryptoImage;"
                            />
                    </div>
                                <div>
                            <div class="font-medium text-gray-900 text-sm lg:text-base truncate">{crypto.name}</div>
                            <div class="text-xs lg:text-sm text-gray-500">{crypto.symbol.toUpperCase()}</div>
                                </div>
                            </div>

                            <!-- Price -->
                    <div class="flex items-center text-sm lg:text-base font-medium text-gray-900">
                        {formatUSD(crypto.price)}
                            </div>

                            <!-- 24h Change -->
                            <div class="flex items-center">
                        <span class={`text-sm lg:text-base font-medium ${crypto.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {crypto.change24h >= 0 ? '↑' : '↓'}
                            {Math.abs(crypto.change24h).toFixed(2)}%
                                </span>
                            </div>

                            <!-- Market Cap -->
                    <div class="hidden lg:flex items-center text-sm text-gray-900">
                        ${formatNumber(crypto.marketCap)}
                            </div>

                            <!-- Volume -->
                    <div class="hidden lg:flex items-center text-sm text-gray-900">
                        ${formatNumber(crypto.volume24h)}
                            </div>

                    <!-- Volume Graph -->
                    <div class="hidden lg:block">
                        <div class="relative h-12 w-full bg-gray-50 rounded-lg overflow-hidden group">
                            {#if crypto.volume24h > 0}
                                {@const points = [
                                    crypto.volume24h * 0.95,
                                    crypto.volume24h * 1.02,
                                    crypto.volume24h * 0.98,
                                    crypto.volume24h * 1.01,
                                    crypto.volume24h * 0.97,
                                    crypto.volume24h * 1.03,
                                    crypto.volume24h * 0.99,
                                    crypto.volume24h
                                ]}
                                {@const maxPoint = Math.max(...points)}
                                {@const minPoint = Math.min(...points)}
                                
                                <svg 
                                    class="w-full h-full"
                                    viewBox="0 0 100 40"
                                    preserveAspectRatio="none"
                                >
                                    <!-- Gradient definition -->
                                    <defs>
                                        <linearGradient id="graph-gradient-{crypto._id}" x1="0" x2="0" y1="0" y2="1">
                                            <stop 
                                                offset="0%" 
                                                stop-color={crypto.change24h >= 0 ? '#22C55E' : '#EF4444'} 
                                                stop-opacity="0.2"
                                            />
                                            <stop 
                                                offset="100%" 
                                                stop-color={crypto.change24h >= 0 ? '#22C55E' : '#EF4444'} 
                                                stop-opacity="0"
                                            />
                                        </linearGradient>
                                    </defs>

                                    <!-- Area under the line -->
                                    <path
                                        d={`
                                            M 0 40
                                            ${points.map((point, i) => {
                                                const x = (i / (points.length - 1)) * 100;
                                                const y = 40 - (normalizeValue(point, minPoint, maxPoint) * 35);
                                                return `L ${x} ${y}`;
                                            }).join(' ')}
                                            L 100 40
                                            Z
                                        `}
                                        fill={`url(#graph-gradient-${crypto._id})`}
                                    />

                                    <!-- Line -->
                                    <path
                                        d={`M ${points.map((point, i) => {
                                            const x = (i / (points.length - 1)) * 100;
                                            const y = 40 - (normalizeValue(point, minPoint, maxPoint) * 35);
                                            return `${x} ${y}`;
                                        }).join(' L ')}`}
                                        fill="none"
                                        stroke={crypto.change24h >= 0 ? '#22C55E' : '#EF4444'}
                                        stroke-width="1.5"
                                        class="transition-all duration-300"
                                    />
                                </svg>
                            {/if}
                        </div>
                    </div>
                </div>
            {/each}
        {/if}
    </div>

    <!-- Add this pagination component after the table but before the closing div -->
    {#if totalPages > 1}
        <div class="flex justify-center items-center gap-2 py-4 px-3 border-t border-gray-100">
            <!-- Previous button -->
            <button 
                class="px-3 py-1 rounded-lg text-sm font-medium
                       {currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}"
                on:click={() => changePage(currentPage - 1)}
                disabled={currentPage === 1}
            >
                Previous
            </button>

            <!-- Page numbers -->
            {#each Array(totalPages) as _, i}
                {@const pageNum = i + 1}
                <button 
                    class="w-8 h-8 rounded-lg text-sm font-medium
                           {currentPage === pageNum ? 
                               'bg-blue-600 text-white' : 
                               'bg-gray-50 text-gray-600 hover:bg-gray-100'}"
                    on:click={() => changePage(pageNum)}
                >
                    {pageNum}
                </button>
            {/each}

            <!-- Next button -->
            <button 
                class="px-3 py-1 rounded-lg text-sm font-medium
                       {currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}"
                on:click={() => changePage(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                Next
            </button>

            <!-- Page info -->
            <span class="ml-4 text-sm text-gray-500">
                Page {currentPage} of {totalPages}
            </span>
        </div>
    {/if}

    <!-- Add this info text above the table -->
    <div class="px-3 lg:px-6 py-2 text-sm text-gray-500 border-b border-gray-200">
        Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredCryptos.length)} of {filteredCryptos.length} cryptocurrencies
    </div>
</div>