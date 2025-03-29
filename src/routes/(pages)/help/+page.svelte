<script lang="ts">
    import { fade } from 'svelte/transition';

    const faqCategories = [
        {
            title: "Getting Started",
            questions: [
                {
                    q: "How do I create an account?",
                    a: "Sign up with your email, verify your identity through our KYC process, and start trading."
                },
                {
                    q: "How long does verification take?",
                    a: "Basic verification typically takes 1-2 business days. Advanced verification may take 3-5 business days."
                }
            ]
        },
        {
            title: "Trading",
            questions: [
                {
                    q: "What are the trading fees?",
                    a: "Trading fees vary based on your trading volume and VIP level. Basic users start at 0.1% per trade."
                },
                {
                    q: "How do I deposit funds?",
                    a: "You can deposit crypto directly to your wallet address or buy crypto using our fiat payment options."
                }
            ]
        }
    ];
</script>

<div class="max-w-4xl mx-auto px-4 py-12" in:fade>
    <h1 class="text-4xl font-bold text-gray-900 mb-8">Help Center</h1>

    <div class="grid md:grid-cols-2 gap-8 mb-12">
        <div class="bg-blue-50 p-6 rounded-xl">
            <h2 class="text-xl font-semibold mb-4">Need Assistance?</h2>
            <p class="text-gray-600 mb-4">Our support team is available 24/7 to help you.</p>
            <a href="/contact" class="text-blue-600 hover:text-blue-700 font-medium">Contact Support →</a>
        </div>
        <div class="bg-green-50 p-6 rounded-xl">
            <h2 class="text-xl font-semibold mb-4">Trading Guides</h2>
            <p class="text-gray-600 mb-4">Learn how to trade on Coinsna.</p>
            <a href="/guides" class="text-green-600 hover:text-green-700 font-medium">View Guides →</a>
        </div>
    </div>

    <!-- FAQ Sections -->
    <div class="space-y-8">
        {#each faqCategories as category}
            <section>
                <h2 class="text-2xl font-semibold mb-6">{category.title}</h2>
                <div class="space-y-4">
                    {#each category.questions as {q, a}}
                        <div class="bg-white p-6 rounded-xl border border-gray-200">
                            <h3 class="text-lg font-medium text-gray-900 mb-2">{q}</h3>
                            <p class="text-gray-600">{a}</p>
                        </div>
                    {/each}
                </div>
            </section>
        {/each}
    </div>
</div> 