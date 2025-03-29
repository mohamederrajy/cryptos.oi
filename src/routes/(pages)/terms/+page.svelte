<script lang="ts">
    import { fade } from 'svelte/transition';

    const sections = [
        {
            title: "1. Terms Acceptance",
            icon: `<svg class="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                   </svg>`,
            content: [
                "Agreement to be bound by these terms",
                "Acceptance of all conditions and policies",
                "Compliance with applicable laws and regulations",
                "Understanding of service limitations"
            ]
        },
        {
            title: "2. User Eligibility",
            icon: `<svg class="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                   </svg>`,
            content: [
                "Minimum age requirement of 18 years",
                "Legal capacity to form binding contracts",
                "Residency in supported jurisdictions",
                "Compliance with local regulations"
            ]
        },
        {
            title: "3. Account Security",
            icon: `<svg class="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                   </svg>`,
            content: [
                "Responsibility for account credentials",
                "Multi-factor authentication requirements",
                "Immediate notification of security breaches",
                "Regular security review requirements"
            ]
        }
    ];

    const lastUpdated = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
</script>

<div class="max-w-4xl mx-auto px-4 py-12" in:fade>
    <!-- Header Section -->
    <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
        <p class="text-gray-600">
            Last updated: {lastUpdated}
        </p>
    </div>

    <!-- Introduction -->
    <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 mb-12">
        <p class="text-gray-700 leading-relaxed">
            Welcome to Coinsna. By accessing our platform, you agree to these terms of service. 
            Please read them carefully before using our services.
        </p>
    </div>

    <!-- Main Content -->
    <div class="space-y-12">
        {#each sections as section}
            <section class="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                <div class="flex items-start gap-4 mb-6">
                    {@html section.icon}
                    <h2 class="text-2xl font-semibold text-gray-900">{section.title}</h2>
                </div>
                <ul class="space-y-3">
                    {#each section.content as item}
                        <li class="flex items-center gap-3 text-gray-600">
                            <svg class="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                            </svg>
                            <span>{item}</span>
                        </li>
                    {/each}
                </ul>
            </section>
        {/each}

        <!-- Trading Rules Section -->
        <section class="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <h2 class="text-2xl font-semibold text-gray-900 mb-6">Trading Rules & Limitations</h2>
            <div class="grid md:grid-cols-2 gap-6">
                <div class="bg-gray-50 rounded-xl p-6">
                    <h3 class="font-medium text-gray-900 mb-3">Trading Conduct</h3>
                    <p class="text-gray-600">
                        Users must comply with all trading rules and maintain professional conduct during transactions.
                    </p>
                </div>
                <div class="bg-gray-50 rounded-xl p-6">
                    <h3 class="font-medium text-gray-900 mb-3">Risk Disclosure</h3>
                    <p class="text-gray-600">
                        Trading cryptocurrencies involves substantial risk of loss. Trade responsibly.
                    </p>
                </div>
            </div>
        </section>

        <!-- Disclaimer Section -->
        <section class="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">Important Disclaimer</h2>
            <p class="text-gray-600 mb-4">
                Coinsna reserves the right to modify these terms at any time. Users will be notified of significant changes.
            </p>
            <div class="flex gap-4">
                <a 
                    href="/contact" 
                    class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Contact Support
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                    </svg>
                </a>
                <a 
                    href="/privacy" 
                    class="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    Privacy Policy
                </a>
            </div>
        </section>
    </div>
</div>

<style>
    /* Add smooth transitions */
    section {
        transition: transform 0.2s ease-in-out;
    }

    section:hover {
        transform: translateY(-2px);
    }

    /* Enhance list animations */
    li {
        transition: all 0.2s ease;
    }

    li:hover {
        transform: translateX(4px);
        color: #1a56db;
    }
</style> 