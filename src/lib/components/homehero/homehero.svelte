<script lang="ts">
    import { fade, fly, scale } from 'svelte/transition';
    import { onMount } from 'svelte';

    // Featured cryptocurrencies with updated image paths
    const featuredCryptos = [
        {
            name: 'Bitcoin',
            symbol: 'BTC',
            price: 45123.45,
            change: 2.5,
            volume: '24.5B',
            icon: '₿', // Fallback icon
            image: '/images/crypto-icons/btc.svg',
            color: 'from-orange-500 to-yellow-500'
        },
        {
            name: 'Ethereum',
            symbol: 'ETH',
            price: 2345.67,
            change: 3.2,
            volume: '15.2B',
            icon: 'Ξ', // Fallback icon
            image: '/images/crypto-icons/eth.svg',
            color: 'from-indigo-500 to-blue-500'
        },
        {
            name: 'Solana',
            symbol: 'SOL',
            price: 98.76,
            change: -1.8,
            volume: '5.1B',
            icon: 'S', // Fallback icon
            image: '/images/crypto-icons/sol.svg',
            color: 'from-purple-500 to-pink-500'
        }
    ];

    // Image error handling
    function handleImageError(event: Event, crypto: any) {
        const img = event.target as HTMLImageElement;
        // Replace with gradient background and symbol
        img.outerHTML = `<div class="w-8 h-8 rounded-full bg-gradient-to-r ${crypto.color} 
                              flex items-center justify-center text-white font-bold">
                            ${crypto.icon}
                         </div>`;
    }

    let activeIndex = 0;
    let prices = featuredCryptos.map(c => c.price);

    function updatePrices() {
        prices = prices.map(p => p * (1 + (Math.random() - 0.5) * 0.01));
    }

    onMount(() => {
        const interval = setInterval(updatePrices, 2000);
        return () => clearInterval(interval);
    });

    // Scrolling images
    let currentSlide = 0;
    const slides = [
        '/images/crypto images/Affilliate.png',
        '/images/crypto images/Vip.png',
        '/images/crypto images/Referral.png',
        '/images/crypto images/Trading guide.png',
        '/images/crypto images/App.png'
    ];

    const slidesPerView = 4;
    const maxSlides = slides.length - slidesPerView;

    function nextSlide() {
        currentSlide = Math.min(currentSlide + 1, maxSlides);
    }

    function prevSlide() {
        currentSlide = Math.max(currentSlide - 1, 0);
    }

    onMount(() => {
        const interval = setInterval(() => {
            if (currentSlide >= maxSlides) {
                currentSlide = 0;
            } else {
                nextSlide();
            }
        }, 5000);
        return () => clearInterval(interval);
    });
</script>

<section class="relative py-24 overflow-hidden bg-[#F8FAFC]">
    <!-- Background Elements -->
    <div class="absolute inset-0 overflow-hidden">
        <div class="absolute -top-40 -right-40 w-80 h-80 bg-blue-50 rounded-full blur-3xl opacity-50"></div>
        <div class="absolute top-60 -left-40 w-80 h-80 bg-purple-50 rounded-full blur-3xl opacity-50"></div>
    </div>

    <div class="container mx-auto px-4 relative">
        <div class="flex flex-wrap items-center">
            <!-- Left Content -->
            <div class="w-full lg:w-1/2 mb-12 lg:mb-0" in:fly={{ x: -50, duration: 1000 }}>
                <h1 class="text-5xl md:text-6xl font-bold mb-6 leading-tight bg-clip-text text-transparent 
                           bg-gradient-to-r from-gray-900 to-gray-600">
                    Trade Crypto<br>
                    <span class="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Like a Pro
                    </span>
                </h1>
                
                <p class="text-gray-600 text-lg mb-8 max-w-lg">
                    Experience seamless trading with real-time market data and advanced trading tools.
                </p>

                <!-- Stats Grid -->
                <div class="grid grid-cols-3 gap-6 mb-10">
                    {#each ['24/7 Trading', '100+ Pairs', 'Instant Deposits'] as stat}
                        <div class="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
                            <div class="text-sm text-gray-600">{stat}</div>
                        </div>
                    {/each}
                </div>

                <!-- CTA Button -->
                <button class="px-8 py-4 bg-blue-600 text-white rounded-xl font-medium
                             hover:bg-blue-700 transition-all duration-200 shadow-lg shadow-blue-500/20
                             hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5">
                    Start Trading Now
                </button>
            </div>

            <!-- Right Content: Live Trading Interface -->
            <div class="w-full lg:w-1/2" in:fly={{ x: 50, duration: 1000 }}>
                <div class="relative">
                    <!-- Main Trading Card -->
                    <div class="bg-white rounded-2xl shadow-xl p-6 transform hover:scale-[1.02] transition-all duration-300">
                        <!-- Trading Pairs -->
                        <div class="flex gap-4 mb-8">
                            {#each featuredCryptos as crypto, index}
                                <button 
                                    class="relative group"
                                    class:active={activeIndex === index}
                                    on:click={() => activeIndex = index}
                                >
                                    <div class="flex items-center gap-2 p-3 rounded-xl 
                                                {activeIndex === index ? 'bg-gray-50' : 'hover:bg-gray-50'} 
                                                transition-all duration-200">
                                        <div class="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center
                                                   bg-gradient-to-r {crypto.color}">
                                            <img 
                                                src={crypto.image} 
                                                alt={crypto.name} 
                                                class="w-full h-full object-contain"
                                                on:error={(e) => handleImageError(e, crypto)}
                                            />
                                        </div>
                                        <div>
                                            <div class="font-medium">{crypto.symbol}</div>
                                            <div class={`text-sm ${crypto.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                {crypto.change >= 0 ? '+' : ''}{crypto.change}%
                                            </div>
                                        </div>
                                    </div>
                                    {#if activeIndex === index}
                                        <div class="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></div>
                                    {/if}
                                </button>
                            {/each}
                        </div>

                        <!-- Price Chart -->
                        <div class="bg-gray-50 rounded-xl p-6 mb-6">
                            <div class="flex justify-between items-start mb-6">
                                <div>
                                    <h3 class="text-2xl font-bold">
                                        ${prices[activeIndex].toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })}
                                    </h3>
                                    <div class="text-sm text-gray-500">
                                        Volume: {featuredCryptos[activeIndex].volume}
                                    </div>
                                </div>
                                <div class={`px-3 py-1 rounded-full text-sm font-medium
                                            ${featuredCryptos[activeIndex].change >= 0 
                                                ? 'bg-green-50 text-green-600' 
                                                : 'bg-red-50 text-red-600'}`}>
                                    {featuredCryptos[activeIndex].change >= 0 ? '↑' : '↓'}
                                    {Math.abs(featuredCryptos[activeIndex].change)}%
                                </div>
                            </div>

                            <!-- Live Chart -->
                            <div class="h-40 relative">
                                <svg class="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                                    <path 
                                        d="M0 50 Q 25 {45 + Math.random() * 10}, 50 {55 + Math.random() * 10} T 100 50"
                                        class="stroke-2 fill-none transition-all duration-300"
                                        stroke={featuredCryptos[activeIndex].change >= 0 ? '#22C55E' : '#EF4444'}
                                    />
                                </svg>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="grid grid-cols-2 gap-4">
                            <button class="p-4 rounded-xl bg-green-50 hover:bg-green-100 transition-colors duration-200">
                                <span class="text-green-600 font-medium">Buy {featuredCryptos[activeIndex].symbol}</span>
                            </button>
                            <button class="p-4 rounded-xl bg-red-50 hover:bg-red-100 transition-colors duration-200">
                                <span class="text-red-600 font-medium">Sell {featuredCryptos[activeIndex].symbol}</span>
                            </button>
                        </div>
                    </div>

                    <!-- Floating Cards -->
                    {#each featuredCryptos.filter((_, i) => i !== activeIndex) as crypto, i}
                        <div 
                            class="absolute bg-white p-4 rounded-xl shadow-lg animate-float"
                            style="
                                {i === 0 ? 'right: -2rem; top: 20%;' : 'left: -2rem; bottom: 20%;'}
                                animation-delay: {i * 2}s;
                            "
                            in:fly={{ y: 50, duration: 1000, delay: i * 200 }}
                        >
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center
                                           bg-gradient-to-r {crypto.color}">
                                    <img 
                                        src={crypto.image} 
                                        alt={crypto.name} 
                                        class="w-full h-full object-contain"
                                        on:error={(e) => handleImageError(e, crypto)}
                                    />
                                </div>
                                <div>
                                    <div class="font-medium">{crypto.symbol}</div>
                                    <div class={`text-sm ${crypto.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                        {crypto.change >= 0 ? '+' : ''}{crypto.change}%
                                    </div>
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        </div>

        <!-- Slider Section -->
        <div class="mt-20" in:fade={{ duration: 1000, delay: 500 }}>
            <div class="relative overflow-hidden px-4">
                <!-- Slider Controls -->
                <button 
                    class="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full 
                           bg-white shadow-lg hover:shadow-xl transition-all duration-200 
                           {currentSlide === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}"
                    on:click={prevSlide}
                    disabled={currentSlide === 0}
                >
                    <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                
                <button 
                    class="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full 
                           bg-white shadow-lg hover:shadow-xl transition-all duration-200 
                           {currentSlide === maxSlides ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}"
                    on:click={nextSlide}
                    disabled={currentSlide === maxSlides}
                >
                    <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>

                <!-- Enhanced Slider Container -->
                <div class="overflow-hidden mx-12">
                    <div 
                        class="flex transition-transform duration-500 ease-in-out"
                        style="transform: translateX(-{currentSlide * 25}%)"
                    >
                        {#each slides as slide}
                            <div class="w-1/4 flex-shrink-0 px-3">
                                <div class="bg-white rounded-2xl p-2 shadow-lg hover:shadow-xl 
                                          transition-all duration-300 transform hover:-translate-y-1">
                                    <img 
                                        src={slide} 
                                        alt="Crypto feature" 
                                        class="w-full h-auto rounded-xl"
                                    />
                                </div>
                            </div>
                        {/each}
                    </div>
                </div>

                <!-- Enhanced Slider Dots -->
                <div class="flex justify-center gap-2 mt-8">
                    {#each Array(maxSlides + 1) as _, i}
                        <button 
                            class="w-2 h-2 rounded-full transition-all duration-200 
                                   {i === currentSlide 
                                       ? 'bg-blue-600 w-6' 
                                       : 'bg-gray-300 hover:bg-gray-400'}"
                            on:click={() => currentSlide = i}
                        ></button>
                    {/each}
                </div>
            </div>
        </div>
    </div>
</section>

<style>
    @keyframes float {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-10px) rotate(1deg); }
    }

    .animate-float {
        animation: float 6s ease-in-out infinite;
    }

    /* Enhanced slider animations */
    .slider-item {
        transform: scale(0.95);
        transition: transform 0.3s ease;
    }

    .slider-item:hover {
        transform: scale(1);
    }

    /* Smooth transitions */
    .transition-transform {
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }
</style>
