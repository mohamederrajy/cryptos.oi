<script lang="ts">
    interface Transaction {
        type: string;
        amount: string;
        address: string;
        date: string;
    }

    let selectedTab = 'Deposits';
    const tabs = ['All', 'Withdrawals', 'Deposits'];
    let timeFilter = 'All time';

    let transactions: Transaction[] = []; // Empty for now, would be populated from your API
    
    function handleTabChange(tab: string) {
        selectedTab = tab;
        // Here you would typically fetch filtered data based on the tab
    }

    function handleTimeFilterChange(filter: string) {
        timeFilter = filter;
        // Here you would typically fetch filtered data based on the time range
    }
</script>

<div class="max-w-7xl mx-auto p-8 space-y-8">
    <!-- Header with Tabs and Time Filter -->
    <div class="flex items-center justify-between">
        <!-- Tabs -->
        <div class="flex items-center gap-2">
            {#each tabs as tab}
                <button 
                    class="tab-button {selectedTab === tab ? 'active' : ''}"
                    on:click={() => handleTabChange(tab)}
                >
                    {tab}
                </button>
            {/each}
        </div>

        <!-- Time Filter -->
        <div class="relative">
            <button 
                class="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 
                       hover:bg-gray-50 transition-colors text-sm text-gray-700"
            >
                <svg class="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {timeFilter}
                <svg class="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>
        </div>
    </div>

    <!-- History Section -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="p-6 border-b border-gray-100">
            <h2 class="text-xl font-semibold text-gray-900">History</h2>
        </div>

        <!-- Table Header -->
        <div class="grid grid-cols-4 gap-4 p-4 bg-gray-50 text-sm font-medium text-gray-500 border-b border-gray-100">
            <div>TYPE</div>
            <div>AMOUNT</div>
            <div>ADDRESS / TRANSACTION ID</div>
            <div>DATE</div>
        </div>

        <!-- Table Content -->
        {#if transactions.length === 0}
            <div class="flex flex-col items-center justify-center py-16 text-gray-400">
                <svg class="w-16 h-16 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <span class="text-lg">No results</span>
            </div>
        {:else}
            {#each transactions as transaction}
                <div class="grid grid-cols-4 gap-4 p-4 border-b border-gray-100 text-sm hover:bg-gray-50 transition-colors">
                    <div>{transaction.type}</div>
                    <div>{transaction.amount}</div>
                    <div class="font-mono">{transaction.address}</div>
                    <div>{transaction.date}</div>
                </div>
            {/each}
        {/if}
    </div>
</div>

<style lang="postcss">
    .tab-button {
        @apply px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
               hover:bg-gray-100 hover:text-gray-900;
    }

    .tab-button.active {
        @apply bg-[#3772FF]/10 text-[#3772FF];
    }

    /* Table styles */
    .grid {
        grid-template-columns: 1fr 1fr 2fr 1fr;
    }

    /* Animation for empty state */
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: .7; }
    }

    svg {
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
</style>
