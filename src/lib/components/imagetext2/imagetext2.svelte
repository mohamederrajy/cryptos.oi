<script lang="ts">
    import { fly } from 'svelte/transition';

    const benefits = [
        {
            title: 'Monetize your influence',
            description: 'Turn your audience into revenue with our competitive commission rates'
        },
        {
            title: 'Enjoy guaranteed payouts',
            description: 'Get reliable payments on time, every time'
        },
        {
            title: 'Maximize your earnings',
            description: 'Earn more with our tiered commission structure'
        }
    ];
</script>

<section class="relative py-24 bg-[#F8FAFC] overflow-hidden">
    <!-- Background Elements -->
    <div class="absolute inset-0">
        <div class="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-blue-50/40 to-purple-50/40 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div class="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-green-50/40 to-blue-50/40 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
    </div>

    <div class="container mx-auto px-4 relative">
        <div class="flex flex-wrap items-center">
            <!-- Enhanced Left Content -->
            <div class="w-full lg:w-1/2 mb-12 lg:mb-0" in:fly={{ x: -50, duration: 1000 }}>
                <div class="relative w-full max-w-lg mx-auto">
                    <!-- Main Funnel Container -->
                    <div class="relative z-10 animate-float">
                        <!-- Top Floating Elements -->
                        <div class="absolute -top-8 left-0 right-0 flex justify-center space-x-4">
                            <div class="bg-blue-400 w-16 h-12 rounded-lg shadow-lg animate-bounce-slow flex items-center justify-center">
                                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <div class="bg-orange-400 w-12 h-12 rounded-full shadow-lg animate-bounce-slow delay-150 flex items-center justify-center">
                                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div class="bg-purple-400 w-14 h-14 rounded-xl shadow-lg animate-bounce-slow delay-300 flex items-center justify-center">
                                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                        </div>

                        <!-- Main Funnel -->
                        <div class="relative mx-auto w-full max-w-md">
                            <!-- Funnel Shape with Gradient -->
                            <svg class="w-full" viewBox="0 0 400 400" fill="none">
                                <defs>
                                    <linearGradient id="funnelGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" style="stop-color:#4F46E5" />
                                        <stop offset="100%" style="stop-color:#7C3AED" />
                                    </linearGradient>
                                    <filter id="shadow">
                                        <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#4F46E5" flood-opacity="0.3"/>
                                    </filter>
                                </defs>
                                <!-- Funnel Body -->
                                <path d="M80 100 L320 100 L280 300 L120 300 Z" 
                                      fill="url(#funnelGradient)" 
                                      filter="url(#shadow)"
                                      class="transform-origin-center"
                                />
                                <!-- Highlight -->
                                <path d="M80 100 L320 100 L310 130 L90 130 Z" 
                                      fill="white" 
                                      fill-opacity="0.2"
                                />
                            </svg>

                            <!-- Floating Gears -->
                            <div class="absolute top-1/4 -right-8 animate-spin-slow">
                                <svg class="w-12 h-12 text-orange-400" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 8v-2a2 2 0 012-2h2a2 2 0 012 2v2m-6 0h6m-6 0a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2v-8a2 2 0 00-2-2m-6 0H6a2 2 0 00-2 2v8a2 2 0 002 2h2" />
                                </svg>
                            </div>
                            <div class="absolute top-1/3 -left-6 animate-spin-slow-reverse">
                                <svg class="w-10 h-10 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 8v-2a2 2 0 012-2h2a2 2 0 012 2v2m-6 0h6m-6 0a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2v-8a2 2 0 00-2-2m-6 0H6a2 2 0 00-2 2v8a2 2 0 002 2h2" />
                                </svg>
                            </div>

                            <!-- Bottom Coins -->
                            <div class="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-3">
                                <div class="flex items-center">
                                    <div class="w-16 h-16 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 
                                                flex items-center justify-center text-2xl font-bold text-white shadow-lg 
                                                animate-bounce-slow">
                                        $
                                    </div>
                                    <div class="w-14 h-14 -ml-4 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 
                                                flex items-center justify-center text-xl font-bold text-white shadow-lg 
                                                animate-bounce-slow delay-150">
                                        $
                                    </div>
                                    <div class="w-12 h-12 -ml-4 rounded-full bg-gradient-to-r from-yellow-600 to-yellow-700 
                                                flex items-center justify-center text-lg font-bold text-white shadow-lg 
                                                animate-bounce-slow delay-300">
                                        $
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Floating Circles -->
                        <div class="absolute top-1/4 right-0 w-4 h-4 bg-blue-400 rounded-full animate-float delay-150"></div>
                        <div class="absolute top-1/3 left-0 w-6 h-6 bg-purple-400 rounded-full animate-float delay-300"></div>
                        <div class="absolute bottom-1/4 right-1/4 w-5 h-5 bg-orange-400 rounded-full animate-float delay-450"></div>
                    </div>
                </div>
            </div>

            <!-- Right Content -->
            <div class="w-full lg:w-1/2 lg:pl-16" in:fly={{ x: 50, duration: 1000 }}>
                <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 font-medium mb-6">
                    BECOME AN AFFILIATE
                </div>

                <h2 class="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Benefits For You
                </h2>

                <p class="text-gray-600 text-lg mb-8">
                    Referring is a win-win situation.
                </p>

                <!-- Benefits List -->
                <div class="space-y-6 mb-10">
                    {#each benefits as benefit}
                        <div class="flex items-start gap-4">
                            <div class="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mt-1">
                                <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <h3 class="text-lg font-semibold text-gray-900 mb-1">
                                    {benefit.title}
                                </h3>
                                <p class="text-gray-600">
                                    {benefit.description}
                                </p>
                            </div>
                        </div>
                    {/each}
                </div>

                <button 
                    class="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl 
                           hover:bg-blue-700 transition-all duration-200 font-medium
                           shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 
                           transform hover:-translate-y-0.5 active:translate-y-0"
                >
                    <span>Become an Affiliate</span>
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </button>
            </div>
        </div>
    </div>
</section>

<style>
    @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-20px); }
    }

    @keyframes bounce-slow {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
    }

    @keyframes spin-slow {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }

    @keyframes spin-slow-reverse {
        from { transform: rotate(360deg); }
        to { transform: rotate(0deg); }
    }

    .animate-float {
        animation: float 6s ease-in-out infinite;
    }

    .animate-bounce-slow {
        animation: bounce-slow 3s ease-in-out infinite;
    }

    .animate-spin-slow {
        animation: spin-slow 8s linear infinite;
    }

    .animate-spin-slow-reverse {
        animation: spin-slow-reverse 8s linear infinite;
    }

    .delay-150 {
        animation-delay: 150ms;
    }

    .delay-300 {
        animation-delay: 300ms;
    }

    .delay-450 {
        animation-delay: 450ms;
    }
</style>