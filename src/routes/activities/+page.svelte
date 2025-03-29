<script lang="ts">
    import { onMount } from 'svelte';
    import { session } from '$lib/stores/session';
    import { PUBLIC_API_URL } from '$env/static/public';
    import { notifications } from '$lib/stores/notifications';

    interface Transaction {
        _id: string;
        amount: number;
        currency: string;
        status: string;
        withdrawalAddress?: string;
        depositAddress?: string;
        txHash?: string;
        createdAt: string;
    }

    let deposits: Transaction[] = [];
    let withdrawals: Transaction[] = [];
    let isLoading = true;
    let selectedTab = 'Deposits';

    // Fetch deposits and withdrawals
    async function fetchDeposits() {
        try {
            const response = await fetch(`${PUBLIC_API_URL}/api/deposit/my-deposits`, {
                headers: {
                    'Authorization': `Bearer ${$session.token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                deposits = data;
            }
        } catch (error) {
            console.error('Error fetching deposits:', error);
            notifications.error('Failed to load deposits');
        }
    }

    async function fetchWithdrawals() {
        try {
            const response = await fetch(`${PUBLIC_API_URL}/api/withdrawal/my-withdrawals`, {
                headers: {
                    'Authorization': `Bearer ${$session.token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                withdrawals = data;
            }
        } catch (error) {
            console.error('Error fetching withdrawals:', error);
            notifications.error('Failed to load withdrawals');
        }
    }

    function formatDate(dateString: string) {
        return new Date(dateString).toLocaleString();
    }

    // Load data on mount
    onMount(async () => {
        isLoading = true;
        await Promise.all([fetchDeposits(), fetchWithdrawals()]);
        isLoading = false;
    });
</script>

<div class="max-w-7xl mx-auto p-4 sm:p-8">
    <!-- Tabs - Full width on mobile -->
    <div class="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-8">
        <button 
            class="flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-colors text-center
                   {selectedTab === 'Deposits' ? 'bg-[#3772FF]/10 text-[#3772FF]' : 'text-gray-600 hover:bg-gray-100'}"
            on:click={() => selectedTab = 'Deposits'}
        >
            Deposits
        </button>
        <button 
            class="flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-colors text-center
                   {selectedTab === 'Withdrawals' ? 'bg-[#3772FF]/10 text-[#3772FF]' : 'text-gray-600 hover:bg-gray-100'}"
            on:click={() => selectedTab = 'Withdrawals'}
        >
            Withdrawals
        </button>
    </div>

    <!-- Content -->
    <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {#if isLoading}
            <div class="flex justify-center items-center py-12">
                <div class="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        {:else}
            {#if selectedTab === 'Deposits'}
                <!-- Mobile View for Deposits -->
                <div class="block sm:hidden">
                    {#each deposits as deposit}
                        <div class="p-4 border-b border-gray-100 last:border-b-0">
                            <div class="flex justify-between items-start mb-2">
                                <div class="text-sm text-gray-900">{deposit.amount} {deposit.currency}</div>
                                <span class="px-2 py-1 text-xs rounded-full
                                    {deposit.status === 'approved' ? 'bg-green-100 text-green-700' : 
                                     deposit.status === 'rejected' ? 'bg-red-100 text-red-700' : 
                                     'bg-yellow-100 text-yellow-700'}">
                                    {deposit.status}
                                </span>
                            </div>
                            <div class="text-xs text-gray-500 mb-2">{formatDate(deposit.createdAt)}</div>
                            <div class="font-mono text-xs text-gray-600 break-all">
                                {deposit.depositAddress || '-'}
                            </div>
                        </div>
                    {/each}
                </div>

                <!-- Desktop View for Deposits -->
                <div class="hidden sm:block overflow-x-auto">
                    <table class="w-full">
                        <thead>
                            <tr class="text-left bg-gray-50">
                                <th class="px-6 py-3 text-sm font-medium text-gray-500">Date</th>
                                <th class="px-6 py-3 text-sm font-medium text-gray-500">Amount</th>
                                <th class="px-6 py-3 text-sm font-medium text-gray-500">Status</th>
                                <th class="px-6 py-3 text-sm font-medium text-gray-500">Address</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            {#each deposits as deposit}
                                <tr class="hover:bg-gray-50 transition-colors">
                                    <td class="px-6 py-4 text-sm text-gray-900">{formatDate(deposit.createdAt)}</td>
                                    <td class="px-6 py-4 text-sm text-gray-900">{deposit.amount} {deposit.currency}</td>
                                    <td class="px-6 py-4">
                                        <span class="px-2 py-1 text-sm rounded-full
                                            {deposit.status === 'approved' ? 'bg-green-100 text-green-700' : 
                                             deposit.status === 'rejected' ? 'bg-red-100 text-red-700' : 
                                             'bg-yellow-100 text-yellow-700'}">
                                            {deposit.status}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 font-mono text-sm text-gray-900">{deposit.depositAddress || '-'}</td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            {:else}
                <!-- Mobile View for Withdrawals -->
                <div class="block sm:hidden">
                    {#each withdrawals as withdrawal}
                        <div class="p-4 border-b border-gray-100 last:border-b-0">
                            <div class="flex justify-between items-start mb-2">
                                <div class="text-sm text-gray-900">{withdrawal.amount} {withdrawal.currency}</div>
                                <span class="px-2 py-1 text-xs rounded-full
                                    {withdrawal.status === 'approved' ? 'bg-green-100 text-green-700' : 
                                     withdrawal.status === 'rejected' ? 'bg-red-100 text-red-700' : 
                                     'bg-yellow-100 text-yellow-700'}">
                                    {withdrawal.status}
                                </span>
                            </div>
                            <div class="text-xs text-gray-500 mb-2">{formatDate(withdrawal.createdAt)}</div>
                            <div class="font-mono text-xs text-gray-600 break-all">
                                {withdrawal.withdrawalAddress || '-'}
                            </div>
                        </div>
                    {/each}
                </div>

                <!-- Desktop View for Withdrawals -->
                <div class="hidden sm:block overflow-x-auto">
                    <table class="w-full">
                        <thead>
                            <tr class="text-left bg-gray-50">
                                <th class="px-6 py-3 text-sm font-medium text-gray-500">Date</th>
                                <th class="px-6 py-3 text-sm font-medium text-gray-500">Amount</th>
                                <th class="px-6 py-3 text-sm font-medium text-gray-500">Status</th>
                                <th class="px-6 py-3 text-sm font-medium text-gray-500">Address</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            {#each withdrawals as withdrawal}
                                <tr class="hover:bg-gray-50 transition-colors">
                                    <td class="px-6 py-4 text-sm text-gray-900">{formatDate(withdrawal.createdAt)}</td>
                                    <td class="px-6 py-4 text-sm text-gray-900">{withdrawal.amount} {withdrawal.currency}</td>
                                    <td class="px-6 py-4">
                                        <span class="px-2 py-1 text-sm rounded-full
                                            {withdrawal.status === 'approved' ? 'bg-green-100 text-green-700' : 
                                             withdrawal.status === 'rejected' ? 'bg-red-100 text-red-700' : 
                                             'bg-yellow-100 text-yellow-700'}">
                                            {withdrawal.status}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 font-mono text-sm text-gray-900">{withdrawal.withdrawalAddress || '-'}</td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            {/if}
        {/if}
    </div>
</div>

<style>
    /* Ensure smooth transitions */
    .transition-colors {
        transition-property: background-color, border-color, color, fill, stroke;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 150ms;
    }

    /* Improve mobile touch targets */
    @media (max-width: 640px) {
        button {
            min-height: 44px;
        }
    }
</style>
