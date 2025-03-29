<script lang="ts">
    import { fade } from 'svelte/transition';
    import { onMount } from 'svelte';

    // Mock data for demonstration
    const recentTransactions = [
        {
            hash: '0x7d3c...8f4e',
            from: '0x1234...5678',
            to: '0x8765...4321',
            amount: '1.5 ETH',
            timestamp: new Date().toISOString(),
            status: 'confirmed'
        },
        // Add more transactions...
    ];

    const recentBlocks = [
        {
            number: 18645321,
            hash: '0x9d2c...7f3e',
            timestamp: new Date().toISOString(),
            transactions: 156,
            miner: '0x3456...7890',
            size: '1.2 MB'
        },
        // Add more blocks...
    ];

    let searchQuery = '';
    let isLoading = false;

    async function handleSearch() {
        if (!searchQuery) return;
        isLoading = true;
        // Implement search functionality
        setTimeout(() => {
            isLoading = false;
        }, 1000);
    }

    function formatAddress(address: string) {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }

    function formatTimestamp(timestamp: string) {
        return new Date(timestamp).toLocaleString();
    }
</script>

<div class="max-w-7xl mx-auto px-4 py-12" in:fade>
    <!-- Header Section -->
    <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Blockchain Explorer</h1>
        <p class="text-gray-600 max-w-2xl mx-auto">
            Explore transactions, blocks, and addresses on the blockchain network.
        </p>
    </div>

    <!-- Search Bar -->
    <div class="max-w-3xl mx-auto mb-12">
        <div class="relative">
            <input
                type="text"
                bind:value={searchQuery}
                placeholder="Search by transaction hash, block number, or address"
                class="w-full px-6 py-4 bg-white rounded-xl border border-gray-200 shadow-sm 
                       focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
            <button
                on:click={handleSearch}
                class="absolute right-2 top-2 px-6 py-2 bg-blue-600 text-white rounded-lg 
                       hover:bg-blue-700 transition-colors"
                disabled={isLoading}
            >
                {#if isLoading}
                    <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {:else}
                    Search
                {/if}
            </button>
        </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid md:grid-cols-4 gap-6 mb-12">
        <div class="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h3 class="text-sm font-medium text-gray-500 mb-1">Latest Block</h3>
            <p class="text-2xl font-bold text-gray-900">18645321</p>
        </div>
        <div class="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h3 class="text-sm font-medium text-gray-500 mb-1">Average Block Time</h3>
            <p class="text-2xl font-bold text-gray-900">13.2s</p>
        </div>
        <div class="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h3 class="text-sm font-medium text-gray-500 mb-1">Active Addresses</h3>
            <p class="text-2xl font-bold text-gray-900">2.1M</p>
        </div>
        <div class="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h3 class="text-sm font-medium text-gray-500 mb-1">Network Hash Rate</h3>
            <p class="text-2xl font-bold text-gray-900">982 TH/s</p>
        </div>
    </div>

    <!-- Recent Transactions & Blocks -->
    <div class="grid lg:grid-cols-2 gap-8">
        <!-- Recent Transactions -->
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div class="p-6 border-b border-gray-100">
                <h2 class="text-xl font-semibold text-gray-900">Recent Transactions</h2>
            </div>
            <div class="divide-y divide-gray-100">
                {#each recentTransactions as tx}
                    <div class="p-4 hover:bg-gray-50 transition-colors">
                        <div class="flex items-center justify-between mb-2">
                            <a href="/tx/{tx.hash}" class="text-blue-600 hover:text-blue-700 font-medium">
                                {tx.hash}
                            </a>
                            <span class="text-sm text-gray-500">{formatTimestamp(tx.timestamp)}</span>
                        </div>
                        <div class="flex items-center gap-2 text-sm text-gray-600">
                            <span>From: {formatAddress(tx.from)}</span>
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                            </svg>
                            <span>To: {formatAddress(tx.to)}</span>
                        </div>
                    </div>
                {/each}
            </div>
        </div>

        <!-- Recent Blocks -->
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div class="p-6 border-b border-gray-100">
                <h2 class="text-xl font-semibold text-gray-900">Recent Blocks</h2>
            </div>
            <div class="divide-y divide-gray-100">
                {#each recentBlocks as block}
                    <div class="p-4 hover:bg-gray-50 transition-colors">
                        <div class="flex items-center justify-between mb-2">
                            <a href="/block/{block.number}" class="text-blue-600 hover:text-blue-700 font-medium">
                                Block #{block.number}
                            </a>
                            <span class="text-sm text-gray-500">{formatTimestamp(block.timestamp)}</span>
                        </div>
                        <div class="grid grid-cols-3 gap-4 text-sm text-gray-600">
                            <div>
                                <span class="text-gray-500">Transactions:</span> {block.transactions}
                            </div>
                            <div>
                                <span class="text-gray-500">Size:</span> {block.size}
                            </div>
                            <div>
                                <span class="text-gray-500">Miner:</span> {formatAddress(block.miner)}
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    </div>
</div>

<style>
    /* Add smooth transitions */
    .hover\:bg-gray-50:hover {
        transition: background-color 0.2s ease;
    }

    /* Enhance link animations */
    a {
        transition: color 0.2s ease;
    }

    /* Add card hover effects */
    .rounded-xl {
        transition: transform 0.2s ease-in-out;
    }

    .rounded-xl:hover {
        transform: translateY(-1px);
    }
</style> 