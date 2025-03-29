<script lang="ts">
    import { page } from '$app/stores';
    import { fade } from 'svelte/transition';

    // This would typically come from an API/database
    const blogPosts = {
        "crypto-trends-2024": {
            title: "Top Cryptocurrency Trends to Watch in 2024",
            content: `
                <h2>The Evolution of Cryptocurrency in 2024</h2>
                <p>The cryptocurrency landscape continues to evolve at a rapid pace. As we move through 2024, several key trends are shaping the future of digital assets and blockchain technology.</p>
                
                <h3>1. Institutional Adoption</h3>
                <p>Major financial institutions are increasingly embracing cryptocurrency, with many launching their own digital asset services. This institutional adoption is driving market maturity and bringing new levels of legitimacy to the space.</p>
                
                <h3>2. DeFi Innovation</h3>
                <p>Decentralized Finance (DeFi) continues to innovate, with new protocols and services emerging that rival traditional financial systems. The total value locked in DeFi protocols has reached new heights, demonstrating the sector's growing importance.</p>
                
                <h3>3. Regulatory Developments</h3>
                <p>Governments worldwide are developing more comprehensive regulatory frameworks for cryptocurrencies, providing clarity and stability for investors and businesses operating in the space.</p>
            `,
            author: {
                name: "Sarah Chen",
                role: "Market Analyst",
                initials: "SC",
                bio: "Sarah has over 8 years of experience in cryptocurrency market analysis and financial technology research."
            },
            icon: `<svg class="w-12 h-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                   </svg>`,
            publishedAt: "2024-03-15",
            readTime: 8,
            category: "Market Analysis",
            tags: ["Cryptocurrency", "Market Trends", "DeFi", "Analysis"]
        },
        "trading-strategies": {
            title: "Advanced Trading Strategies for Volatile Markets",
            content: `
                <h2>Mastering Crypto Market Volatility</h2>
                <p>Cryptocurrency markets are known for their high volatility, presenting both opportunities and risks for traders. This guide explores advanced strategies for navigating these challenging markets.</p>

                <h3>Risk Management Fundamentals</h3>
                <p>Before implementing any trading strategy, it's crucial to understand and implement proper risk management techniques. This includes position sizing, stop-loss placement, and portfolio diversification.</p>

                <h3>Technical Analysis Strategies</h3>
                <p>Learn how to use advanced technical analysis tools including:</p>
                <ul>
                    <li>Multiple timeframe analysis</li>
                    <li>Volume profile trading</li>
                    <li>Market structure analysis</li>
                    <li>Momentum indicators</li>
                </ul>
            `,
            author: {
                name: "Michael Rodriguez",
                role: "Senior Trading Expert",
                initials: "MR",
                bio: "Michael is a veteran trader with 12+ years of experience in traditional and cryptocurrency markets."
            },
            icon: `<svg class="w-12 h-12 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                   </svg>`,
            publishedAt: "2024-03-10",
            readTime: 12,
            category: "Trading",
            tags: ["Trading", "Strategy", "Risk Management"]
        }
    };

    $: post = blogPosts[$page.params.slug];
    $: formattedDate = post ? new Date(post.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }) : '';
</script>

{#if post}
    <article class="max-w-4xl mx-auto px-4 py-12" in:fade>
        <!-- Header -->
        <header class="mb-12">
            <div class="flex items-center gap-2 mb-6">
                <a 
                    href="/blog" 
                    class="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                    </svg>
                    Back to Blog
                </a>
            </div>
            <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {post.title}
            </h1>
            <div class="flex items-center gap-6 mb-8">
                <div class="flex items-center gap-3">
                    <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                        {post.author.initials}
                    </div>
                    <div>
                        <p class="font-medium text-gray-900">{post.author.name}</p>
                        <p class="text-sm text-gray-500">{post.author.role}</p>
                    </div>
                </div>
                <div class="text-gray-500">
                    <p>{formattedDate}</p>
                    <p class="text-sm">{post.readTime} min read</p>
                </div>
            </div>
            <div class="bg-gray-50 rounded-2xl p-12 flex items-center justify-center">
                {@html post.icon}
            </div>
        </header>

        <!-- Content -->
        <div class="prose prose-lg max-w-none">
            {@html post.content}
        </div>

        <!-- Author Bio -->
        <div class="mt-16 p-8 bg-gray-50 rounded-2xl">
            <h2 class="text-2xl font-bold mb-4">About the Author</h2>
            <div class="flex items-start gap-6">
                <div class="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-xl">
                    {post.author.initials}
                </div>
                <div>
                    <h3 class="font-medium text-lg mb-2">{post.author.name}</h3>
                    <p class="text-gray-600">{post.author.bio}</p>
                </div>
            </div>
        </div>

        <!-- Tags -->
        <div class="mt-12">
            <div class="flex flex-wrap gap-2">
                {#each post.tags as tag}
                    <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {tag}
                    </span>
                {/each}
            </div>
        </div>
    </article>
{:else}
    <div class="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 class="text-2xl font-bold text-gray-900 mb-4">Blog Post Not Found</h1>
        <p class="text-gray-600 mb-8">The blog post you're looking for doesn't exist.</p>
        <a 
            href="/blog" 
            class="text-blue-600 hover:text-blue-700"
        >
            Return to Blog
        </a>
    </div>
{/if}

<style>
    /* Add styles for content formatting */
    :global(.prose) {
        @apply text-gray-800;
    }

    :global(.prose h2) {
        @apply text-2xl font-bold text-gray-900 mt-12 mb-6;
    }

    :global(.prose h3) {
        @apply text-xl font-semibold text-gray-900 mt-8 mb-4;
    }

    :global(.prose p) {
        @apply mb-6 leading-relaxed;
    }

    :global(.prose ul) {
        @apply list-disc pl-6 mb-6;
    }

    :global(.prose li) {
        @apply mb-2;
    }
</style> 