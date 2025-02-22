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

            <!-- Right Content -->
            <div class="w-full lg:w-1/2" in:fly={{ x: 50, duration: 1000 }}>
                <div class="relative">
                    <!-- Main Image -->
                    <div class="relative z-10">
                        <img 
                            src="/images/app-light.png" 
                            alt="Trading Platform"
                            class="w-full h-auto"
                        />
                    </div>
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
