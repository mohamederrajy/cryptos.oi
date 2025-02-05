<script lang="ts">
    import { fly } from 'svelte/transition';
    
    let email = '';
    
    const handleSubmit = () => {
        // Handle form submission
        console.log('Email submitted:', email);
    };
</script>

<section class="relative py-24 bg-[#F8FAFC] overflow-hidden">
    <!-- Background Elements -->
    <div class="absolute inset-0">
        <div class="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-blue-50/40 to-purple-50/40 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div class="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-green-50/40 to-blue-50/40 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
    </div>

    <div class="container mx-auto px-4 relative">
        <div class="max-w-3xl mx-auto text-center">
            <!-- Header -->
            <div class="mb-12" in:fly={{ y: -20, duration: 1000 }}>
                <h3 class="text-xl text-gray-900 font-medium mb-6 text-center">
                    Ready to start trading cryptocurrency?
                </h3>
                <h2 class="text-center">
                    <span class="text-4xl md:text-5xl font-bold leading-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                        New users can earn up to
                    </span>
                    <br />
                    <span class="text-4xl md:text-5xl font-bold leading-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent inline-flex items-center justify-center mt-2 mb-2">
                        $200
                        <span class="relative ml-2">
                            <div class="absolute -top-2 -right-2 w-4 h-4">
                                <div class="absolute animate-ping inline-flex h-full w-full rounded-full bg-blue-400 opacity-20"></div>
                                <div class="relative inline-flex rounded-full h-4 w-4 bg-blue-500"></div>
                            </div>
                        </span>
                    </span>
                    <br />
                    <span class="text-4xl md:text-5xl font-bold leading-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                        in crypto rewards.
                    </span>
                </h2>
            </div>

            <!-- Email Form -->
            <div class="max-w-xl mx-auto relative" in:fly={{ y: 20, duration: 1000, delay: 200 }}>
                <form 
                    on:submit|preventDefault={handleSubmit}
                    class="flex flex-col sm:flex-row gap-4 items-center justify-center"
                >
                    <div class="relative flex-1 w-full">
                        <input
                            type="email"
                            bind:value={email}
                            placeholder="Enter your email address"
                            class="w-full px-6 py-4 rounded-xl border border-gray-200 text-center
                                   focus:outline-none focus:border-blue-500 focus:ring-2 
                                   focus:ring-blue-500/20 transition-all duration-200
                                   placeholder-gray-400 text-gray-600"
                            required
                        />
                        <!-- Decorative Elements -->
                        <div class="absolute -top-2 -left-2 w-4 h-4 bg-blue-500/10 rounded-full animate-pulse"></div>
                        <div class="absolute -bottom-2 -right-2 w-4 h-4 bg-purple-500/10 rounded-full animate-pulse delay-300"></div>
                    </div>

                    <button 
                        type="submit"
                        class="px-8 py-4 bg-blue-600 text-white rounded-xl font-medium w-full sm:w-auto
                               hover:bg-blue-700 transition-all duration-200
                               shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 
                               transform hover:-translate-y-0.5 active:translate-y-0
                               whitespace-nowrap"
                    >
                        Get Started
                    </button>
                </form>

                <!-- Decorative Dots -->
                <div class="absolute -left-12 top-1/2 transform -translate-y-1/2 hidden sm:block">
                    <div class="flex flex-col gap-2">
                        <div class="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                        <div class="w-2 h-2 rounded-full bg-purple-400 animate-pulse delay-150"></div>
                        <div class="w-2 h-2 rounded-full bg-indigo-400 animate-pulse delay-300"></div>
                    </div>
                </div>
                <div class="absolute -right-12 top-1/2 transform -translate-y-1/2 hidden sm:block">
                    <div class="flex flex-col gap-2">
                        <div class="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></div>
                        <div class="w-2 h-2 rounded-full bg-blue-400 animate-pulse delay-150"></div>
                        <div class="w-2 h-2 rounded-full bg-purple-400 animate-pulse delay-300"></div>
                    </div>
                </div>
            </div>

            <!-- Trust Indicators -->
            <div class="mt-10 flex justify-center gap-8 text-sm text-gray-500" in:fly={{ y: 20, duration: 1000, delay: 400 }}>
                <div class="flex items-center gap-2">
                    <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>Secure & Encrypted</span>
                </div>
                <div class="flex items-center gap-2">
                    <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Instant Rewards</span>
                </div>
            </div>
        </div>
    </div>
</section>

<style>
    /* Enhance input focus effect */
    input:focus {
        box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
    }

    /* Pulse animation for decorative elements */
    @keyframes pulse {
        0%, 100% { opacity: 0.4; }
        50% { opacity: 0.8; }
    }

    .animate-pulse {
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    .delay-150 {
        animation-delay: 150ms;
    }

    .delay-300 {
        animation-delay: 300ms;
    }
</style>
