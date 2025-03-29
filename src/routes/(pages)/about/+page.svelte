<script lang="ts">
    import { fade } from 'svelte/transition';
</script>

<div class="max-w-7xl mx-auto px-4 py-12" in:fade>
    <div class="text-center mb-16">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About Coinsna
        </h1>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Your trusted partner in the world of cryptocurrency trading and investment. 
            We provide a secure, user-friendly platform for traders worldwide.
        </p>
    </div>

    <!-- Stats Section -->
    <div class="grid md:grid-cols-4 gap-8 mb-16">
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
            <div class="text-3xl font-bold text-blue-600 mb-2">$5B+</div>
            <div class="text-gray-600">Daily Trading Volume</div>
        </div>
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
            <div class="text-3xl font-bold text-blue-600 mb-2">2M+</div>
            <div class="text-gray-600">Active Users</div>
        </div>
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
            <div class="text-3xl font-bold text-blue-600 mb-2">150+</div>
            <div class="text-gray-600">Countries Supported</div>
        </div>
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
            <div class="text-3xl font-bold text-blue-600 mb-2">24/7</div>
            <div class="text-gray-600">Customer Support</div>
        </div>
    </div>

    <!-- Mission & Vision -->
    <div class="grid md:grid-cols-2 gap-12 mb-16">
        <div class="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p class="text-gray-600 leading-relaxed">
                To make cryptocurrency trading accessible and secure for everyone. We strive to provide 
                the most reliable and innovative trading platform while maintaining the highest standards 
                of security and customer service.
            </p>
        </div>
        <div class="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
            <p class="text-gray-600 leading-relaxed">
                To become the world's leading cryptocurrency exchange, driving the adoption of digital 
                assets and blockchain technology. We aim to shape the future of finance through 
                innovation and trust.
            </p>
        </div>
    </div>

    <!-- Features -->
    <div class="mb-16">
        <h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">Why Choose Coinsna</h2>
        <div class="grid md:grid-cols-3 gap-8">
            <div class="bg-white p-6 rounded-xl border border-gray-200">
                <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <svg class="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                </div>
                <h3 class="text-xl font-semibold mb-2">Security First</h3>
                <p class="text-gray-600">
                    Industry-leading security measures including multi-signature wallets, cold storage, 
                    and 2FA protection.
                </p>
            </div>
            <div class="bg-white p-6 rounded-xl border border-gray-200">
                <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <svg class="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                              d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    </svg>
                </div>
                <h3 class="text-xl font-semibold mb-2">High Performance</h3>
                <p class="text-gray-600">
                    Lightning-fast execution, stable platform, and advanced trading features for both 
                    beginners and professionals.
                </p>
            </div>
            <div class="bg-white p-6 rounded-xl border border-gray-200">
                <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <svg class="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                </div>
                <h3 class="text-xl font-semibold mb-2">24/7 Support</h3>
                <p class="text-gray-600">
                    Dedicated customer support team available around the clock to assist you with any 
                    questions or concerns.
                </p>
            </div>
        </div>
    </div>

    <!-- CTA Section -->
    <div class="bg-blue-600 text-white rounded-2xl p-8 text-center">
        <h2 class="text-3xl font-bold mb-4">Start Trading Today</h2>
        <p class="text-blue-100 mb-6 max-w-2xl mx-auto">
            Join millions of users worldwide who trust Coinsna for their cryptocurrency trading needs.
        </p>
        <a 
            href="/account/register" 
            class="inline-block px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
        >
            Create Account
        </a>
    </div>
</div> 