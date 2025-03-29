<script lang="ts">
    import { fade } from 'svelte/transition';
    import { notifications } from '$lib/stores/notifications';

    interface PaymentProvider {
        id: string;
        name: string;
        description: string;
        logo: string;
        buttonText: string;
        processingTime: string;
        supportedCountries: number;
        features: string[];
        popularIn: string[];
        url: string;
    }

    const providers: PaymentProvider[] = [
        {
            id: 'wise',
            name: 'Buy with Wise',
            description: 'Fast and secure international transfers with competitive exchange rates.',
            logo: '/images/crypto images/wise.svg',
            buttonText: 'Continue with Wise',
            processingTime: '~1-2 business days',
            supportedCountries: 170,
            features: ['Low Transfer Fees', 'Real Exchange Rate', 'Secure Transfers'],
            popularIn: ['UK', 'EU', 'USA', 'Australia'],
            url: 'https://wise.com'
        },
        {
            id: 'payoneer',
            name: 'Buy with Payoneer',
            description: 'Global payment platform for international money transfers and digital payments.',
            logo: '/images/crypto images/payonner.png',
            buttonText: 'Continue with Payoneer',
            processingTime: '~1-3 business days',
            supportedCountries: 200,
            features: ['Global Payments', 'Multiple Currencies', 'Business Friendly'],
            popularIn: ['USA', 'Asia', 'Europe', 'Middle East'],
            url: 'https://www.payoneer.com'
        },
        {
            id: 'bank',
            name: 'Buy with Bank Transfer',
            description: 'Traditional bank wire transfer for secure and reliable transactions.',
            logo: '/images/crypto images/BankIcon.svg',
            buttonText: 'Continue with Bank Transfer',
            processingTime: '~2-4 business days',
            supportedCountries: 180,
            features: ['No Transfer Limits', 'Highly Secure', 'Wide Availability'],
            popularIn: ['Worldwide', 'EU', 'USA', 'Asia'],
            url: '#'
        }
    ];

    const paymentMethods = [
        { 
            name: 'Visa',
            logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons@develop/icons/visa.svg',
            popular: true
        },
        { 
            name: 'PayPal',
            logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons@develop/icons/paypal.svg',
            popular: true
        },
        { 
            name: 'Apple Pay',
            logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons@develop/icons/applepay.svg',
            popular: true
        },
        { 
            name: 'Google Pay',
            logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons@develop/icons/googlepay.svg',
            popular: false
        }
    ];

    let selectedProvider: PaymentProvider | null = null;

    // Function to handle provider selection
    async function handleProviderSelect(provider: PaymentProvider) {
        try {
            // You can add additional logic here (e.g., tracking, validation)
            notifications.info(`Redirecting to ${provider.name}...`);
            
            // Open provider in new window
            window.open(provider.url, '_blank', 'noopener,noreferrer');
        } catch (error) {
            console.error('Error redirecting to provider:', error);
            notifications.error('Failed to connect to payment provider');
        }
    }
</script>

<div class="min-h-screen bg-gray-50" in:fade>
    <!-- Hero Section -->
    <div class="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 relative overflow-hidden">
        <div class="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
        <div class="max-w-6xl mx-auto px-4 py-20 relative">
            <div class="text-center mb-12">
                <h1 class="text-5xl font-bold text-white mb-6">
                    Buy Crypto Instantly
                    <span class="inline-block animate-bounce ml-2">💳</span>
                </h1>
                <p class="text-xl text-blue-100 max-w-2xl mx-auto">
                    Fast, secure, and convenient payment options with the lowest fees in the market
                </p>
            </div>
            
            <!-- Stats -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
                <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                    <div class="text-3xl font-bold text-white mb-2">$50M+</div>
                    <div class="text-blue-100">Daily Volume</div>
                </div>
                <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                    <div class="text-3xl font-bold text-white mb-2">150+</div>
                    <div class="text-blue-100">Countries Supported</div>
                </div>
                <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                    <div class="text-3xl font-bold text-white mb-2">1M+</div>
                    <div class="text-blue-100">Happy Customers</div>
                </div>
            </div>

            <!-- Payment Methods -->
            <div class="flex flex-wrap items-center justify-center gap-6">
                {#each paymentMethods as method}
                    <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all duration-200 group relative">
                        <img 
                            src={method.logo} 
                            alt={method.name}
                            class="h-8 w-auto object-contain invert"
                            loading="lazy"
                        />
                        {#if method.popular}
                            <span class="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                                Popular
                            </span>
                        {/if}
                    </div>
                {/each}
            </div>
        </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-6xl mx-auto px-4 -mt-10">
        <!-- Provider Cards -->
        <div class="grid grid-cols-1 gap-6">
            {#each providers as provider}
                <div class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 relative overflow-hidden">
                    <!-- Background Pattern -->
                    <div class="absolute inset-0 opacity-5">
                        <div class="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                    </div>

                    <div class="relative flex flex-col md:flex-row items-start md:items-center gap-8">
                        <div class="flex-1">
                            <div class="flex items-center gap-4 mb-6">
                                <div class="bg-blue-50 p-3 rounded-xl">
                                    <img 
                                        src={provider.logo} 
                                        alt={provider.name}
                                        class="h-12 w-12 object-contain"
                                    />
                                </div>
                                <div>
                                    <h3 class="text-2xl font-bold text-gray-900">
                                        {provider.name}
                                    </h3>
                                    <div class="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                        <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                                        </svg>
                                        <span>Verified Provider</span>
                                    </div>
                                </div>
                            </div>

                            <p class="text-gray-600 text-lg mb-6">
                                {provider.description}
                            </p>

                            <!-- Features -->
                            <div class="grid grid-cols-2 gap-4 mb-6">
                                {#each provider.features as feature}
                                    <div class="flex items-center gap-2 text-gray-600">
                                        <svg class="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                                        </svg>
                                        <span>{feature}</span>
                                    </div>
                                {/each}
                            </div>

                            <div class="flex flex-wrap items-center gap-6 text-sm">
                                <div class="flex items-center gap-2 text-gray-500">
                                    <svg class="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                    <span>Processing Time: {provider.processingTime}</span>
                                </div>
                                <div class="flex items-center gap-2 text-gray-500">
                                    <svg class="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"/>
                                    </svg>
                                    <span>{provider.supportedCountries}+ Countries</span>
                                </div>
                            </div>
                        </div>

                        <div class="w-full md:w-auto flex flex-col gap-4">
                            <button 
                                class="w-full md:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium 
                                       transition-all duration-200 flex items-center justify-center gap-2 group shadow-lg 
                                       hover:shadow-blue-500/25"
                                on:click={() => handleProviderSelect(provider)}
                            >
                                <span>{provider.buttonText}</span>
                                <svg class="w-5 h-5 transform group-hover:translate-x-1 transition-transform" 
                                     fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                >
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                          d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                                </svg>
                            </button>
                            <div class="text-center text-sm text-gray-500">
                                Popular in: {provider.popularIn.join(', ')}
                            </div>
                        </div>
                    </div>
                </div>
            {/each}
        </div>

        <!-- Info Section -->
        <div class="mt-12 mb-20">
            <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100 relative overflow-hidden">
                <div class="absolute inset-0 bg-grid-blue-500/[0.025] bg-[size:20px_20px]"></div>
                <div class="relative flex items-start gap-6">
                    <div class="p-3 bg-blue-600 rounded-xl text-white shadow-lg">
                        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                    </div>
                    <div>
                        <h4 class="text-xl font-bold text-gray-900 mb-3">Important Information</h4>
                        <p class="text-gray-600 leading-relaxed">
                            Payment methods and availability may vary based on your location and the provider's services. 
                            All transactions are processed securely through our trusted partners with industry-standard encryption.
                            We ensure the best rates and fastest processing times in the market.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    :global(body) {
        background-color: #F3F4F6;
    }

    /* Add subtle animation for hover effects */
    .provider-card {
        transform: translateY(0);
        transition: all 0.3s ease;
    }

    .provider-card:hover {
        transform: translateY(-2px);
    }

    /* Background grid pattern */
    .bg-grid-white {
        background-image: linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                         linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px);
    }

    .bg-grid-blue-500 {
        background-image: linear-gradient(to right, #3B82F6 1px, transparent 1px),
                         linear-gradient(to bottom, #3B82F6 1px, transparent 1px);
    }
</style>
