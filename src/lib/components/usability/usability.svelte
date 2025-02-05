<script lang="ts">
    import { fade, fly } from 'svelte/transition';

    const features = [
        {
            title: 'Design',
            description: 'UI design makes it easy to buy crypto. You will understand how to use our platform without much effort',
            gradient: 'from-blue-500 to-indigo-500',
            icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />`
        },
        {
            title: 'Apps',
            description: 'Stay on top of the markets with the XonBIT app for Android, iOS and Windows',
            gradient: 'from-indigo-500 to-purple-500',
            icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z M9 7h6 M9 11h6" />`
        },
        {
            title: 'Community',
            description: 'We supports the crypto community, putting data in the hands which need it most',
            gradient: 'from-purple-500 to-pink-500',
            icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />`
        },
        {
            title: 'Portfolio',
            description: 'Buy and sell popular digital currencies, keep track of them in the one place',
            gradient: 'from-blue-500 to-cyan-500',
            icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />`
        },
        {
            title: 'Confidence',
            description: 'Our markets are always up to date, sparking curiosity with real-world relevance',
            gradient: 'from-cyan-500 to-teal-500',
            icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />`
        },
        {
            title: 'Protection',
            description: 'For added security, store your funds in a vault with time delayed withdrawals',
            gradient: 'from-teal-500 to-green-500',
            icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />`
        }
    ];
</script>

<section class="relative py-24 bg-[#F8FAFC]" in:fade={{ duration: 800 }}>
    <!-- Background Elements -->
    <div class="absolute inset-0 overflow-hidden">
        <div class="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-blue-50/40 to-purple-50/40 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div class="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-green-50/40 to-blue-50/40 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
    </div>

    <div class="container mx-auto px-4 relative">
        <!-- Header -->
        <div class="text-center max-w-3xl mx-auto mb-20">
            <h2 class="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                We are the most usability cryptocurrency platform.
            </h2>
            <p class="text-gray-600 text-lg">
                We believe XonBIT is here to stay — and that a future worth building is one which opens its doors and invites everyone in.
            </p>
        </div>

        <!-- Features Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {#each features as feature, index}
                <div 
                    class="group"
                    in:fly={{ y: 20, duration: 800, delay: index * 100 }}
                >
                    <div class="flex flex-col items-center text-center p-8 rounded-2xl bg-white/50 backdrop-blur-sm
                               border border-gray-100 hover:border-gray-200 transition-all duration-300
                               hover:shadow-xl hover:shadow-blue-500/5">
                        <!-- Icon Container -->
                        <div class="w-20 h-20 mb-6 relative">
                            <div class="absolute inset-0 bg-gradient-to-r {feature.gradient} opacity-10 rounded-2xl 
                                      transform rotate-6 transition-transform group-hover:rotate-12 group-hover:scale-110"></div>
                            <div class="absolute inset-0 bg-white rounded-2xl shadow-sm flex items-center justify-center
                                      transform transition-transform group-hover:-translate-y-1">
                                <div class="w-12 h-12 bg-gradient-to-r {feature.gradient} rounded-xl p-2.5 flex items-center justify-center">
                                    <svg class="w-full h-full text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        {@html feature.icon}
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <!-- Content -->
                        <h3 class="text-xl font-bold mb-4 text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                            {feature.title}
                        </h3>
                        <p class="text-gray-600 leading-relaxed">
                            {feature.description}
                        </p>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</section>

<style>
    /* Enhanced hover animations */
    .group {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .group:hover {
        transform: translateY(-5px);
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
</style>
