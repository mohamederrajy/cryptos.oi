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

<footer class="mt-auto bg-white border-t border-gray-200">
    <div class="px-6 py-8">
        <!-- Your footer content -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <!-- Footer sections -->
            <div>
                <h3 class="text-lg font-semibold mb-4">About</h3>
                <ul class="space-y-2">
                    <li><a href="/about" class="text-gray-600 hover:text-blue-600">About Us</a></li>
                    <li><a href="/careers" class="text-gray-600 hover:text-blue-600">Careers</a></li>
                    <li><a href="/blog" class="text-gray-600 hover:text-blue-600">Blog</a></li>
                </ul>
    </div>

            <div>
                <h3 class="text-lg font-semibold mb-4">Products</h3>
                <ul class="space-y-2">
                    <li><a href="/exchange" class="text-gray-600 hover:text-blue-600">Exchange</a></li>
                    <li><a href="/wallets" class="text-gray-600 hover:text-blue-600">Wallet</a></li>
                    <li><a href="/explorer" class="text-gray-600 hover:text-blue-600">Explorer</a></li>
                    </ul>
                </div>
            
            <div>
                <h3 class="text-lg font-semibold mb-4">Support</h3>
                <ul class="space-y-2">
                    <li><a href="/help" class="text-gray-600 hover:text-blue-600">Help Center</a></li>
                    <li><a href="/contact" class="text-gray-600 hover:text-blue-600">Contact Us</a></li>
                    <li><a href="/status" class="text-gray-600 hover:text-blue-600">System Status</a></li>
                </ul>
                        </div>
            
            <div>
                <h3 class="text-lg font-semibold mb-4">Legal</h3>
                <ul class="space-y-2">
                    <li><a href="/privacy" class="text-gray-600 hover:text-blue-600">Privacy Policy</a></li>
                    <li><a href="/terms" class="text-gray-600 hover:text-blue-600">Terms of Service</a></li>
                    <li><a href="/compliance" class="text-gray-600 hover:text-blue-600">Compliance</a></li>
                </ul>
            </div>
        </div>

        <div class="mt-8 pt-8 border-t border-gray-200">
            <div class="flex justify-between items-center">
                <p class="text-gray-500">© 2025 CRYPTONIAX. All rights reserved.</p>
                <div class="flex space-x-6">
                    <a href="#" class="text-gray-400 hover:text-gray-500">
                        <span class="sr-only">Twitter</span>
                        <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                        </svg>
                    </a>
                    <!-- Add other social media icons as needed -->
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