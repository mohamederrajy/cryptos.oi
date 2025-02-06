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

<div class="p-6">
    <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Pending Deposits</h1>
        <button class="btn-secondary" on:click={fetchDeposits}>
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
        </button>
    </div>

    <div class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <table class="w-full">
            <thead>
                <tr class="border-b border-gray-100">
                    <th class="text-left py-4 px-6 text-sm font-medium text-gray-500">DATE</th>
                    <th class="text-left py-4 px-6 text-sm font-medium text-gray-500">AMOUNT</th>
                    <th class="text-left py-4 px-6 text-sm font-medium text-gray-500">CURRENCY</th>
                    <th class="text-left py-4 px-6 text-sm font-medium text-gray-500">TX HASH</th>
                    <th class="text-left py-4 px-6 text-sm font-medium text-gray-500">ACTIONS</th>
                </tr>
            </thead>
            <tbody>
                {#if isLoading}
                    <tr>
                        <td colspan="6" class="py-8 text-center text-gray-500">
                            Loading deposits...
                        </td>
                    </tr>
                {:else if deposits.length === 0}
                    <tr>
                        <td colspan="6" class="py-16">
                            <div class="flex flex-col items-center justify-center text-gray-400">
                                <svg class="w-16 h-16 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                                <span class="text-lg">No pending deposits</span>
                            </div>
                        </td>
                    </tr>
                {:else}
                    {#each deposits as deposit}
                        <tr class="hover:bg-gray-50 transition-colors">
                            <td class="py-4 px-6">
                                {new Date(deposit.createdAt).toLocaleString()}
                            </td>
                            <td class="py-4 px-6 font-medium">
                                {deposit.amount}
                            </td>
                            <td class="py-4 px-6">
                                {deposit.currency.toUpperCase()}
                            </td>
                            <td class="py-4 px-6">
                                <span class="font-mono text-sm truncate max-w-[120px]">
                                    {deposit.txHash || '-'}
                                </span>
                            </td>
                            <td class="py-4 px-6">
                                <div class="flex items-center gap-2">
                                    <button 
                                        class="px-3 py-1.5 bg-green-50 text-green-600 rounded-lg text-sm font-medium
                                               hover:bg-green-100 transition-colors"
                                        on:click={() => {
                                            console.log('Approve clicked for deposit:', deposit);
                                            if (deposit?._id) {
                                                processDeposit(deposit._id, 'approved');
                                            } else {
                                                console.error('No deposit ID found:', deposit);
                                                notifications.error('Invalid deposit ID');
                                            }
                                        }}
                                    >
                                        Approve
                                    </button>
                                    <button 
                                        class="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm font-medium
                                               hover:bg-red-100 transition-colors"
                                        on:click={() => {
                                            console.log('Reject clicked for deposit:', deposit);
                                            if (deposit?._id) {
                                                processDeposit(deposit._id, 'rejected');
                                            } else {
                                                console.error('No deposit ID found:', deposit);
                                                notifications.error('Invalid deposit ID');
                                            }
                                        }}
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

<style lang="postcss">
    .btn-secondary {
        @apply flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg 
               hover:bg-gray-100 transition-all duration-200
               focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2;
    }
</style>