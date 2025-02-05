<script lang="ts">
    interface PaymentProvider {
        id: string;
        name: string;
        description: string;
        logo: string;
        buttonText: string;
    }

    const providers: PaymentProvider[] = [
        {
            id: 'transak',
            name: 'Buy Crypto with Transak',
            description: 'Transak supports credit & debit cards, Apple Pay, MobiKwik, and bank transfers (depending on location) in 100+ countries.',
            logo: '/images/payment-providers/transak.svg',
            buttonText: 'Continue to Transak'
        },
        {
            id: 'wyre',
            name: 'Buy Crypto with Wyre',
            description: 'Easy onboarding for purchases up to $ 1000. Fast interactive high limit purchase verification. Supports Debit/Credit Card, Apple Pay, Bank Transfers. Available in 100+ countries.',
            logo: '/images/payment-providers/wyre.svg',
            buttonText: 'Continue to Wyre'
        },
        {
            id: 'moonpay',
            name: 'Buy Crypto with MoonPay',
            description: 'MoonPay supports popular payment methods, including Visa, Mastercard, Apple / Google / Samsung Pay, and bank transfers in 145+ countries.',
            logo: '/images/payment-providers/moonpay.svg',
            buttonText: 'Continue to MoonPay'
        }
    ];

    const paymentMethods = [
       
        { 
            name: 'Visa', 
            logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons@develop/icons/visa.svg'
        },
        { 
            name: 'PayPal', 
            logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons@develop/icons/paypal.svg'
        },
       
        { 
            name: 'Apple Pay', 
            logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons@develop/icons/applepay.svg'
        },
        { 
            name: 'Google Pay', 
            logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons@develop/icons/googlepay.svg'
        }
    ];
</script>

<div class="max-w-5xl mx-auto p-8 space-y-12">
    <!-- Header Section -->
    <div class="text-center space-y-4">
        <h1 class="text-4xl font-bold text-gray-900">Buy Crypto in One Click</h1>
        <p class="text-lg text-gray-600">Pay with the currency and payment method of your choice.</p>
        
        <!-- Payment Methods -->
        <div class="flex items-center justify-center gap-8 mt-8 flex-wrap">
            {#each paymentMethods as method}
                <div class="payment-method-container">
                    <img 
                        src={method.logo} 
                        alt={method.name}
                        class="h-8 w-auto object-contain transition-transform duration-200 hover:scale-110"
                        loading="lazy"
                    />
                </div>
            {/each}
        </div>
    </div>

    <!-- Payment Providers -->
    <div class="space-y-4">
        {#each providers as provider}
            <div class="provider-card group">
                <div class="flex items-center gap-6">
                    <div class="flex-1 space-y-2">
                        <div class="flex items-center gap-3">
                            <h3 class="text-xl font-semibold text-gray-900 group-hover:text-[#3772FF] transition-colors">
                                {provider.name}
                            </h3>
                            <span class="px-3 py-1 bg-[#3772FF]/10 text-[#3772FF] text-sm font-medium rounded-full">
                                Recommended
                            </span>
                        </div>
                        <p class="text-gray-600 text-sm leading-relaxed">
                            {provider.description}
                        </p>
                        <div class="flex items-center gap-2 text-sm text-gray-500">
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            <span>Verified Provider</span>
                        </div>
                    </div>
                    <div class="flex flex-col items-end gap-2">
                        <button class="provider-button">
                            <span>{provider.buttonText}</span>
                            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                      d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </button>
                        <span class="text-xs text-gray-500">Processing time: ~5 mins</span>
                    </div>
                </div>
            </div>
        {/each}
    </div>

    <!-- Additional Information -->
    <div class="bg-gray-50 rounded-xl p-6 border border-gray-100">
        <div class="flex items-start gap-4">
            <div class="p-2 bg-[#3772FF]/10 rounded-lg">
                <svg class="w-6 h-6 text-[#3772FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <div>
                <h4 class="text-lg font-medium text-gray-900">Important Information</h4>
                <p class="text-gray-600 mt-1">
                    Payment methods and availability may vary based on your location and the provider's services. 
                    All transactions are processed securely through our trusted partners.
                </p>
            </div>
        </div>
    </div>
</div>

<style lang="postcss">
    .provider-card {
        @apply bg-white rounded-xl p-6 border border-gray-100 
               hover:shadow-lg hover:border-[#3772FF]/20
               transition-all duration-200;
    }

    .provider-button {
        @apply flex items-center gap-2 px-6 py-3 bg-[#3772FF] text-white rounded-lg font-medium
               hover:bg-[#2952cc] transform hover:-translate-y-0.5
               transition-all duration-200 whitespace-nowrap
               focus:outline-none focus:ring-2 focus:ring-[#3772FF]/20 focus:ring-offset-2;
    }

    /* Enhanced hover effects */
    .provider-card:hover {
        @apply bg-gradient-to-br from-white to-gray-50;
    }

    .provider-card:hover .provider-button {
        @apply shadow-md;
    }

    /* Animation for payment methods */
    @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
    }

    img {
        @apply transition-all duration-300;
    }

    img:hover {
        @apply transform scale-110;
    }

    .payment-method-container {
        @apply flex items-center justify-center h-12 w-24 bg-white rounded-lg 
               shadow-sm hover:shadow-md transition-all duration-200;
    }

    .payment-method-container img {
        @apply max-w-full max-h-full object-contain p-2;
    }
</style>
