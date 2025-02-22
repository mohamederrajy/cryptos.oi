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
            <!-- Left Content -->
            <div class="w-full lg:w-1/2 mb-12 lg:mb-0" in:fly={{ x: -50, duration: 1000 }}>
                <div class="relative">
                    <!-- Main Image -->
                    <div class="relative z-10">
                        <img 
                            src="/images/benefit-a.png" 
                            alt="Trading Benefits"
                            class="w-full h-auto"
                        />
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