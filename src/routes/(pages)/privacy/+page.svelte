<script lang="ts">
    import { fade } from 'svelte/transition';

    const sections = [
        {
            title: "Information Collection",
            icon: `<svg class="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                   </svg>`,
            content: [
                "Personal identification information (Name, email, phone)",
                "KYC documentation (Government ID, proof of address)",
                "Transaction data and trading history",
                "Device and usage information",
                "Communication records and preferences"
            ]
        },
        {
            title: "Data Usage & Processing",
            icon: `<svg class="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                   </svg>`,
            content: [
                "Account management and service provision",
                "Transaction processing and verification",
                "Risk assessment and fraud prevention",
                "Service improvement and personalization",
                "Legal compliance and regulatory reporting"
            ]
        },
        {
            title: "Data Protection",
            icon: `<svg class="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                   </svg>`,
            content: [
                "Industry-standard encryption protocols",
                "Multi-factor authentication systems",
                "Regular security audits and penetration testing",
                "Employee data handling training",
                "Incident response procedures"
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
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
        <p class="text-gray-600">
            Last updated: {lastUpdated}
        </p>
    </div>

    <!-- Introduction -->
    <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 mb-12">
        <p class="text-gray-700 leading-relaxed">
            At Coinsna, we are committed to protecting your privacy and ensuring the security of your personal information. 
            This Privacy Policy outlines our practices for collecting, using, and safeguarding your data when you use our platform.
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

        <!-- Your Rights Section -->
        <section class="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <h2 class="text-2xl font-semibold text-gray-900 mb-6">Your Rights</h2>
            <div class="grid md:grid-cols-2 gap-6">
                <div class="bg-gray-50 rounded-xl p-6">
                    <h3 class="font-medium text-gray-900 mb-3">Access & Control</h3>
                    <p class="text-gray-600">
                        You have the right to access, correct, or delete your personal information at any time.
                    </p>
                </div>
                <div class="bg-gray-50 rounded-xl p-6">
                    <h3 class="font-medium text-gray-900 mb-3">Data Portability</h3>
                    <p class="text-gray-600">
                        You can request a copy of your data in a structured, commonly used format.
                    </p>
                </div>
            </div>
        </section>

        <!-- Contact Section -->
        <section class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">Questions or Concerns?</h2>
            <p class="text-gray-600 mb-4">
                If you have any questions about our Privacy Policy or how we handle your data, please contact our Data Protection Officer.
            </p>
            <a 
                href="/contact" 
                class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
                Contact Us
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                </svg>
            </a>
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