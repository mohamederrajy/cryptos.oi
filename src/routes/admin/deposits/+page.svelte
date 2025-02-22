<script lang="ts">
    import { onMount } from 'svelte';
    import { session } from '$lib/stores/session';
    import { PUBLIC_API_URL } from '$env/static/public';
    import { notifications } from '$lib/stores/notifications';

    interface User {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
    }

    interface Deposit {
        _id: string;
        amount: number;
        currency: string;
        status: string;
        depositAddress: string;
        txHash: string;
        createdAt: string;
        user: User;
    }

    let deposits: Deposit[] = [];
    let isLoading = true;

    async function fetchDeposits() {
        isLoading = true;
        try {
            console.log('Fetching pending deposits...');
            const response = await fetch(`${PUBLIC_API_URL}/api/deposit/pending`, {
                headers: {
                    'Authorization': `Bearer ${$session.token}`
                }
            });

            const data = await response.json();
            console.log('Fetched deposits:', data);

            if (response.ok) {
                deposits = data;
            } else {
                notifications.error('Failed to load pending deposits');
                console.error('Failed to fetch deposits:', data);
            }
        } catch (error) {
            console.error('Error fetching pending deposits:', error);
            notifications.error('Failed to load pending deposits');
        } finally {
            isLoading = false;
        }
    }

    async function processDeposit(depositId: string, status: 'approved' | 'rejected') {
        console.log('Processing deposit:', { depositId, status });
        if (!depositId) {
            notifications.error('Invalid deposit ID');
            return;
        }

        try {
            console.log('Making API request to:', `${PUBLIC_API_URL}/api/deposit/${depositId}/process`);
            console.log('Request payload:', { status });
            const response = await fetch(`${PUBLIC_API_URL}/api/deposit/${depositId}/process`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${$session.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status })
            });

            const responseData = await response.json();
            console.log('API Response:', { status: response.status, data: responseData });

            if (response.ok) {
                notifications.success(`Deposit ${status} successfully`);
                await fetchDeposits();
            } else {
                notifications.error(responseData.message || `Failed to ${status} deposit`);
                console.error('API Error:', responseData);
            }
        } catch (error) {
            console.error(`Error ${status}ing deposit:`, error);
            console.error('Full error details:', {
                name: error.name,
                message: error.message,
                stack: error.stack
            });
            notifications.error(`Failed to ${status} deposit: ${error.message}`);
        }
    }

    onMount(fetchDeposits);
</script>

<div class="p-8">
    <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
        <div class="flex justify-between items-center mb-6">
            <div>
                <h3 class="text-lg font-semibold text-gray-900">Pending Deposits</h3>
                <p class="text-sm text-gray-500 mt-1">Manage deposit requests</p>
            </div>
            <div class="flex items-center gap-3">
                <div class="flex items-center gap-2 text-sm text-gray-500">
                    <div class="w-3 h-3 rounded-full bg-orange-500"></div>
                    <span>Pending</span>
                </div>
                <button 
                    class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 
                           flex items-center gap-2 shadow-lg shadow-indigo-500/20"
                    on:click={fetchDeposits}
                >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
        </button>
            </div>
    </div>

        <div class="overflow-x-auto">
        <table class="w-full">
            <thead>
                <tr class="border-b border-gray-100">
                        <th class="px-6 py-3 text-left">
                            <div class="flex items-center gap-2">
                                <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">User</span>
                                <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                                </svg>
                            </div>
                        </th>
                        <th class="px-6 py-3 text-left">
                            <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">Date</span>
                        </th>
                        <th class="px-6 py-3 text-left">
                            <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</span>
                        </th>
                        <th class="px-6 py-3 text-left">
                            <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">Currency</span>
                        </th>
                        <th class="px-6 py-3 text-left">
                            <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">TX Hash</span>
                        </th>
                        <th class="px-6 py-3 text-right">
                            <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</span>
                        </th>
                </tr>
            </thead>
                <tbody class="divide-y divide-gray-50">
                {#if isLoading}
                    <tr>
                            <td colspan="6" class="py-8">
                                <div class="flex justify-center">
                                    <div class="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent"></div>
                                </div>
                        </td>
                    </tr>
                {:else if deposits.length === 0}
                    <tr>
                        <td colspan="6" class="py-16">
                            <div class="flex flex-col items-center justify-center text-gray-400">
                                    <svg class="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                                <span class="text-lg">No pending deposits</span>
                            </div>
                        </td>
                    </tr>
                {:else}
                    {#each deposits as deposit}
                            <tr class="hover:bg-gray-50/50 transition-colors">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center gap-3">
                                        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 
                                                    flex items-center justify-center text-white font-medium">
                                            {deposit.user.firstName[0]}{deposit.user.lastName[0]}
                                        </div>
                                        <div>
                                            <div class="text-sm font-medium text-gray-900">
                                                {deposit.user.firstName} {deposit.user.lastName}
                                            </div>
                                            <div class="text-sm text-gray-500">{deposit.user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm text-gray-900">
                                        {new Date(deposit.createdAt).toLocaleDateString()}
                                    </div>
                                    <div class="text-xs text-gray-500">
                                        {new Date(deposit.createdAt).toLocaleTimeString()}
                                    </div>
                            </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm font-medium text-gray-900">
                                        {deposit.amount} {deposit.currency.toUpperCase()}
                                    </div>
                            </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                {deposit.currency.toUpperCase()}
                                    </span>
                            </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center gap-2">
                                        <span class="font-mono text-sm text-gray-900 truncate max-w-[120px]">
                                    {deposit.txHash || '-'}
                                </span>
                                        {#if deposit.txHash}
                                            <button 
                                                class="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                                on:click={() => copyToClipboard(deposit.txHash)}
                                            >
                                                <svg class="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                                          d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-2M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                </svg>
                                            </button>
                                        {/if}
                                    </div>
                            </td>
                                <td class="px-6 py-4 whitespace-nowrap text-right">
                                    <div class="flex items-center justify-end gap-2">
                                    <button 
                                            class="px-3 py-1.5 text-sm font-medium text-green-700 bg-green-100 
                                                   rounded-lg hover:bg-green-200 transition-colors"
                                            on:click={() => processDeposit(deposit._id, 'approved')}
                                    >
                                        Approve
                                    </button>
                                    <button 
                                            class="px-3 py-1.5 text-sm font-medium text-red-700 bg-red-100 
                                                   rounded-lg hover:bg-red-200 transition-colors"
                                            on:click={() => processDeposit(deposit._id, 'rejected')}
                                    >
                                        Reject
                                    </button>
                                </div>
                            </td>
                        </tr>
                    {/each}
                {/if}
            </tbody>
        </table>
        </div>
    </div>
</div>

<style lang="postcss">
    .btn-secondary {
        @apply flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg 
               hover:bg-gray-100 transition-all duration-200
               focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2;
    }
</style>