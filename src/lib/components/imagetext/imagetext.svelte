<script lang="ts">
    import { fly } from 'svelte/transition';

    // Mock trading data
    const tradingData = {
        currentPrice: '45,123.45',
        change: '+2.5%',
        volume: '24.5B',
        high: '46,892.30',
        low: '44,125.70'
    };
</script>

<section class="relative py-24 bg-[#F8FAFC] overflow-hidden">
    <!-- Background Elements -->
    <div class="absolute inset-0">
        <div class="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-blue-50/40 to-purple-50/40 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div class="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-green-50/40 to-blue-50/40 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
    </div>

    <div class="container mx-auto px-4 relative">
        <div class="flex flex-wrap items-center">
            <!-- Left Content -->
            <div class="w-full lg:w-1/2 pr-0 lg:pr-16 mb-12 lg:mb-0" in:fly={{ x: -50, duration: 1000 }}>
                <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 font-medium mb-6">
                    <span class="relative flex h-2 w-2">
                        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span class="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                    </span>
                    COMING MARCH 2025
                </div>

                <h2 class="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                    Build your
                    <br />
                    <span class="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                        crypto portfolio
                    </span>
                    <br />
                    anywhere.
                </h2>

                <p class="text-gray-600 text-lg mb-8 max-w-lg">
                    A powerful cryptocurrency exchange in your pocket.
                    Buy, sell and trade crypto on the go.
                </p>

                <button 
                    class="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl 
                           hover:bg-blue-700 transition-all duration-200 font-medium
                           shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 
                           transform hover:-translate-y-0.5 active:translate-y-0"
                >
                    <span>Get App</span>
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                </button>
            </div>

            <!-- Right Content - Phone Mockups -->
            <div class="w-full lg:w-1/2" in:fly={{ x: 50, duration: 1000 }}>
                <div class="relative">
                    <!-- Trading Screen Phone -->
                    <div class="absolute top-0 right-0 w-72 transform translate-x-1/4 -rotate-12 animate-float">
                        <div class="bg-white rounded-[3rem] p-4 shadow-2xl">
                            <div class="relative rounded-[2.5rem] overflow-hidden aspect-[9/19.5] bg-[#F8FAFC]">
                                <!-- Trading Screen UI -->
                                <div class="p-4">
                                    <!-- Header -->
                                    <div class="flex items-center justify-between mb-6">
                                        <div class="flex items-center gap-2">
                                            <div class="w-8 h-8 rounded-lg bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold">
                                                ₿
                                            </div>
                                            <div>
                                                <div class="font-bold text-gray-900">BTC/USDT</div>
                                                <div class="text-sm text-green-500">{tradingData.change}</div>
                                            </div>
                                        </div>
                                        <div class="text-right">
                                            <div class="font-bold text-gray-900">${tradingData.currentPrice}</div>
                                            <div class="text-sm text-gray-500">Volume: ${tradingData.volume}</div>
                                        </div>
                                    </div>

                                    <!-- Chart -->
                                    <div class="h-40 mb-6 relative">
                                        <svg class="w-full h-full" viewBox="0 0 100 50" preserveAspectRatio="none">
                                            <path 
                                                d="M0 35 Q 25 25, 50 35 T 100 30" 
                                                fill="none" 
                                                stroke="url(#gradient)" 
                                                stroke-width="2"
                                                class="animate-draw"
                                            />
                                            <defs>
                                                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                    <stop offset="0%" style="stop-color:#3772FF" />
                                                    <stop offset="100%" style="stop-color:#6C5DD3" />
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                    </div>

                                    <!-- Trading Actions -->
                                    <div class="grid grid-cols-2 gap-3">
                                        <button class="py-3 px-4 bg-green-500 text-white rounded-xl font-medium text-sm">
                                            Buy BTC
                                        </button>
                                        <button class="py-3 px-4 bg-red-500 text-white rounded-xl font-medium text-sm">
                                            Sell BTC
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Sign Up Screen Phone -->
                    <div class="relative w-72 transform translate-y-12">
                        <div class="bg-white rounded-[3rem] p-4 shadow-2xl">
                            <div class="relative rounded-[2.5rem] overflow-hidden aspect-[9/19.5] bg-white">
                                <!-- Sign Up Screen UI -->
                                <div class="p-6">
                                    <!-- Gift Icon -->
                                    <div class="w-20 h-20 mx-auto mb-6">
                                        <div class="w-full h-full bg-blue-50 rounded-2xl flex items-center justify-center">
                                            <svg class="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                                    d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                                            </svg>
                                        </div>
                                    </div>

                                    <!-- Sign Up Form -->
                                    <div class="text-center mb-8">
                                        <h3 class="text-xl font-bold mb-2">Sign up now</h3>
                                        <p class="text-sm text-gray-600 mb-6">to claim bonus 0.41 BTC</p>
                                        
                                        <div class="space-y-4">
                                            <input 
                                                type="email" 
                                                placeholder="Email address"
                                                class="w-full px-4 py-3 rounded-xl border border-gray-200 
                                                       focus:outline-none focus:border-blue-500 focus:ring-2 
                                                       focus:ring-blue-500/20"
                                            />
                                            <button class="w-full py-3 bg-blue-600 text-white rounded-xl font-medium
                                                         hover:bg-blue-700 transition-colors duration-200">
                                                Sign Up
                                            </button>
                                        </div>
                                    </div>

                                    <!-- Terms -->
                                    <p class="text-xs text-gray-500 text-center">
                                        By signing up, you agree to our Terms of Service and Privacy Policy
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Decorative Elements -->
                    <div class="absolute -top-12 left-12 w-20 h-20 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
                    <div class="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
                </div>
            </div>
        </div>
    </div>
</section>

<style>
    /* Phone mockup animations */
    @keyframes float {
        0%, 100% { transform: translateY(0) rotate(-12deg); }
        50% { transform: translateY(-10px) rotate(-10deg); }
    }

    .animate-float {
        animation: float 6s ease-in-out infinite;
    }

    /* Gradient animation */
    @keyframes gradient-shift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }

    .animate-gradient {
        background-size: 200% 200%;
        animation: gradient-shift 6s ease infinite;
    }

    @keyframes draw {
        to {
            stroke-dashoffset: 0;
        }
    }

    .animate-draw {
        stroke-dasharray: 1000;
        stroke-dashoffset: 1000;
        animation: draw 3s ease-out forwards;
    }
</style>
