<script lang="ts">
    import { fade } from 'svelte/transition';

    interface BlogPost {
        id: string;
        title: string;
        excerpt: string;
        category: string;
        author: {
            name: string;
            role: string;
            initials: string;
        };
        icon: string;
        readTime: number;
        publishedAt: string;
        tags: string[];
    }

    const blogPosts: BlogPost[] = [
        {
            id: "crypto-trends-2024",
            title: "Top Cryptocurrency Trends to Watch in 2024",
            excerpt: "Explore the emerging trends shaping the future of cryptocurrency, from DeFi innovations to institutional adoption.",
            category: "Market Analysis",
            author: {
                name: "Sarah Chen",
                role: "Market Analyst",
                initials: "SC"
            },
            icon: `<svg class="w-12 h-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                   </svg>`,
            readTime: 8,
            publishedAt: "2024-03-15",
            tags: ["Cryptocurrency", "Market Trends", "DeFi"]
        },
        {
            id: "trading-strategies",
            title: "Advanced Trading Strategies for Volatile Markets",
            excerpt: "Learn how to navigate volatile crypto markets with these proven trading strategies and risk management techniques.",
            category: "Trading",
            author: {
                name: "Michael Rodriguez",
                role: "Senior Trading Expert",
                initials: "MR"
            },
            icon: `<svg class="w-12 h-12 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                   </svg>`,
            readTime: 12,
            publishedAt: "2024-03-10",
            tags: ["Trading", "Strategy", "Risk Management"]
        },
        {
            id: "security-best-practices",
            title: "Crypto Security: Best Practices for Protecting Your Assets",
            excerpt: "Essential security measures every crypto trader should implement to protect their digital assets.",
            category: "Security",
            author: {
                name: "Alex Thompson",
                role: "Security Expert",
                initials: "AT"
            },
            icon: `<svg class="w-12 h-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                   </svg>`,
            readTime: 10,
            publishedAt: "2024-03-05",
            tags: ["Security", "Best Practices", "Wallet Safety"]
        }
    ];

    const categories = [
        "All",
        "Market Analysis",
        "Trading",
        "Security",
        "Technology",
        "Company News"
    ];

    let selectedCategory = "All";
    let searchQuery = "";

    $: filteredPosts = blogPosts
        .filter(post => selectedCategory === "All" || post.category === selectedCategory)
        .filter(post => 
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
        );

    function formatDate(dateString: string) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
</script>

<div class="max-w-7xl mx-auto px-4 py-12" in:fade>
    <h1 class="text-4xl font-bold text-gray-900 mb-8">Blog</h1>

    <!-- Search and Filter -->
    <div class="mb-12 space-y-6">
        <input
            type="text"
            bind:value={searchQuery}
            placeholder="Search articles..."
            class="w-full max-w-xl px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        />
        <div class="flex gap-2 overflow-x-auto pb-2">
            {#each categories as category}
                <button
                    class="px-4 py-2 rounded-lg whitespace-nowrap transition-colors
                           {selectedCategory === category 
                               ? 'bg-blue-600 text-white' 
                               : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
                    on:click={() => selectedCategory = category}
                >
                    {category}
                </button>
            {/each}
        </div>
    </div>

    <!-- Blog Posts Grid -->
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {#each filteredPosts as post}
            <article class="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-blue-500 transition-colors">
                <a href="/blog/{post.id}" class="block">
                    <div class="p-6">
                        <div class="bg-gray-50 rounded-xl p-6 flex items-center justify-center mb-6">
                            {@html post.icon}
                        </div>
                        <div class="flex items-center gap-2 mb-4">
                            <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                {post.category}
                            </span>
                            <span class="text-sm text-gray-500">
                                {post.readTime} min read
                            </span>
                        </div>
                        <h2 class="text-xl font-semibold text-gray-900 mb-2">
                            {post.title}
                        </h2>
                        <p class="text-gray-600 mb-4">
                            {post.excerpt}
                        </p>
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-3">
                                <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-sm">
                                    {post.author.initials}
                                </div>
                                <div class="text-sm">
                                    <p class="font-medium text-gray-900">{post.author.name}</p>
                                    <p class="text-gray-500">{formatDate(post.publishedAt)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </a>
            </article>
        {/each}
    </div>

    <!-- Newsletter Signup -->
    <div class="mt-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white text-center">
        <h2 class="text-2xl font-bold mb-4">Stay Updated</h2>
        <p class="text-blue-100 mb-6 max-w-2xl mx-auto">
            Subscribe to our newsletter for the latest insights and analysis in the crypto world.
        </p>
        <form class="max-w-md mx-auto flex gap-4">
            <input
                type="email"
                placeholder="Enter your email"
                class="flex-1 px-4 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
                type="submit"
                class="px-6 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
                Subscribe
            </button>
        </form>
    </div>
</div>

<style>
    /* Smooth transitions */
    article {
        transition: all 0.3s ease;
    }

    article:hover {
        transform: translateY(-2px);
    }

    /* Horizontal scroll for categories */
    .overflow-x-auto {
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
        -ms-overflow-style: none;
    }

    .overflow-x-auto::-webkit-scrollbar {
        display: none;
    }
</style> 