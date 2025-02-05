<script lang="ts">
    import { getContext } from 'svelte';
    import { fade } from 'svelte/transition';
    import { page } from "$app/stores";
    
    // Get the sidebar state from the parent layout
    const isSidebarOpen = getContext('sidebarState');
    
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        ABOUT: [
            { title: 'About Us', href: '/about', new: false },
            { title: 'Fee Rate', href: '/fees', new: false },
            { title: 'Careers', href: '/careers', new: true },
            { title: 'Blog', href: '/blog', new: false }
        ],
        SERVICE: [
            { title: 'Buy crypto', href: '/buy', new: false },
            { title: 'Referral', href: '/referral', new: true },
            { title: 'Affiliate', href: '/affiliate', new: false },
            { title: 'VIP', href: '/vip', new: false }
        ],
        LEGAL: [
            { title: 'AML&CFT', href: '/aml', new: false },
            { title: 'Privacy police', href: '/privacy', new: false },
            { title: 'User Agreement', href: '/agreement', new: false },
            { title: 'Terms of service', href: '/terms', new: false }
        ],
        'TRADE CRYPTO': [
            { title: 'BTC/USDT', href: '/trade/btc-usdt', hot: true },
            { title: 'ETH/USDT', href: '/trade/eth-usdt', hot: true },
            { title: 'BNB/USDT', href: '/trade/bnb-usdt', hot: false },
            { title: 'TRX/USDT', href: '/trade/trx-usdt', hot: false }
        ],
        'CONTACT US': [
            { title: 'Business Cooperation', href: '/business', new: false },
            { title: 'Institution Cooperation', href: '/institution', new: false },
            { title: 'Customer Service Email', href: '/support', new: false },
            { title: 'Media support', href: '/media', new: false }
        ]
    };

    let email = '';
    const handleSubmit = () => {
        console.log('Subscribed:', email);
        email = '';
    };
</script>

<footer 
    class="bg-gradient-to-b from-[#F8FAFC] to-white pt-16 pb-8 relative overflow-hidden transition-all duration-300"
    class:ml-72={$isSidebarOpen}
    class:ml-24={!$isSidebarOpen}
>
    <!-- Decorative Background Elements -->
    <div class="absolute inset-0 pointer-events-none">
        <div class="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-blue-50/40 to-purple-50/40 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div class="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-green-50/40 to-blue-50/40 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
    </div>

    <div class="container mx-auto px-6 relative max-w-[1400px]">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-x-8 gap-y-12">
            <!-- Footer Links -->
            {#each Object.entries(footerLinks) as [category, links], index}
                <div class={index >= 5 ? 'lg:col-span-2' : ''}>
                    <h3 class="text-gray-900 font-semibold mb-6 flex items-center gap-2">
                        {category}
                        {#if category === 'TRADE CRYPTO'}
                            <span class="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full font-medium">
                                Live
                            </span>
                        {/if}
                    </h3>
                    <ul class="space-y-3">
                        {#each links as link}
                            <li>
                                <a 
                                    href={link.href}
                                    class="group flex items-center text-gray-500 hover:text-blue-600 transition-all duration-200"
                                >
                                    <span class="relative">
                                        {link.title}
                                        {#if link.new}
                                            <span class="absolute -top-3 -right-6 px-1.5 py-0.5 bg-green-100 text-green-600 text-[10px] rounded-full font-medium">
                                                New
                                            </span>
                                        {/if}
                                        {#if link.hot}
                                            <span class="absolute -top-3 -right-6 px-1.5 py-0.5 bg-orange-100 text-orange-600 text-[10px] rounded-full font-medium">
                                                Hot
                                            </span>
                                        {/if}
                                    </span>
                                    <svg 
                                        class="w-4 h-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </a>
                            </li>
                        {/each}
                    </ul>
                </div>
            {/each}

            <!-- Newsletter Section -->
            <div class="lg:col-span-2 bg-gradient-to-br from-blue-50/80 to-purple-50/80 rounded-2xl p-8 backdrop-blur-xl shadow-lg shadow-blue-500/5">
                <h3 class="text-gray-900 font-semibold mb-2">Submit for updates.</h3>
                <p class="text-gray-500 text-sm mb-6">
                    Subscribe to get update and notify our exchange and products
                </p>
                <form 
                    on:submit|preventDefault={handleSubmit}
                    class="space-y-4"
                >
                    <div class="relative">
                        <input
                            type="email"
                            bind:value={email}
                            placeholder="Enter your email address"
                            class="w-full px-4 py-3 rounded-xl border border-gray-200 
                                   focus:outline-none focus:border-blue-500 focus:ring-2 
                                   focus:ring-blue-500/20 transition-all duration-200
                                   placeholder-gray-400 text-gray-600 text-sm pr-12"
                            required
                        />
                        <div class="absolute right-3 top-1/2 -translate-y-1/2">
                            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                    <button 
                        type="submit"
                        class="w-full px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-medium
                               hover:bg-blue-700 transition-all duration-200
                               shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30
                               transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>

        <!-- Copyright -->
        <div class="mt-16 pt-8 border-t border-gray-200">
            <div class="flex flex-col md:flex-row items-center justify-between gap-4">
                <p class="text-gray-500 text-sm">
                    © {currentYear} XonBIT. All Rights Reserved.
                </p>
                <div class="flex items-center gap-6">
                    <a href="/security" class="text-gray-500 hover:text-blue-600 transition-colors duration-200 text-sm flex items-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Security
                    </a>
                    <a href="/support" class="text-gray-500 hover:text-blue-600 transition-colors duration-200 text-sm flex items-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Support
                    </a>
                </div>
            </div>
        </div>
    </div>
</footer>

<style>
    /* Responsive adjustments */
    @media (max-width: 768px) {
        footer {
            margin-left: 0 !important;
        }
    }
</style> 