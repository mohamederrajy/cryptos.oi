<script lang="ts">
    import { onMount } from 'svelte';
    import { session } from '$lib/stores/session';
    import { notifications } from '$lib/stores/notifications';
    import { PUBLIC_API_URL } from '$env/static/public';
    import { fade, slide } from 'svelte/transition';

    // Update the Withdrawal interface to match the API response
    interface Withdrawal {
        _id?: string;    // MongoDB style
        id?: string;     // REST API style
        amount: number;
        currency: string;
        withdrawalAddress: string;
        networkFee: number;
        status: string;
        createdAt: string;
        user: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
        };
    }

    // Update the state variables with proper types
    let pendingWithdrawals: Withdrawal[] = [];
    let isLoading = true;
    let selectedWithdrawal: Withdrawal | null = null;
    let showConfirmModal = false;
    let actionType: 'approve' | 'reject' = 'approve';

    async function fetchPendingWithdrawals() {
        isLoading = true;
        try {
            const response = await fetch(`${PUBLIC_API_URL}/api/withdrawal/pending`, {
                headers: {
                    'Authorization': `Bearer ${$session.token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Fetched withdrawals:', data); // Debug log
                pendingWithdrawals = data;
            } else {
                notifications.error('Failed to load pending withdrawals');
            }
        } catch (error) {
            console.error('Error fetching withdrawals:', error);
            notifications.error('Failed to load pending withdrawals');
        } finally {
            isLoading = false;
        }
    }

    // Add this for copying addresses
    async function copyToClipboard(text: string) {
        try {
            await navigator.clipboard.writeText(text);
            notifications.success('Copied to clipboard');
        } catch (err) {
            console.error('Failed to copy:', err);
            notifications.error('Failed to copy to clipboard');
        }
    }

    // Update the openConfirmModal function with proper typing
    function openConfirmModal(withdrawal: Withdrawal, type: 'approve' | 'reject') {
        console.log('Opening modal for withdrawal:', withdrawal);
        selectedWithdrawal = withdrawal;
        actionType = type;
        showConfirmModal = true;
    }

    function closeConfirmModal() {
        showConfirmModal = false;
        selectedWithdrawal = null;
    }

    // Update the handleAction function to use the new API
    async function handleAction(type: 'approve' | 'reject') {
        if (!selectedWithdrawal) return;

        // Debug log to check the withdrawal ID
        console.log('Selected withdrawal:', selectedWithdrawal);
        console.log('Withdrawal ID:', selectedWithdrawal._id); // MongoDB usually uses _id

        const withdrawalId = selectedWithdrawal._id || selectedWithdrawal.id;

        if (!withdrawalId) {
            notifications.error('Invalid withdrawal ID');
            return;
        }

        try {
            const response = await fetch(`${PUBLIC_API_URL}/api/withdrawal/${withdrawalId}/process`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${$session.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    status: type === 'approve' ? 'approved' : 'rejected',
                    reason: type === 'approve' ? 
                        'Transaction verified' : 
                        'Withdrawal request rejected by admin'
                })
            });

            if (response.ok) {
                notifications.success(`Withdrawal ${type === 'approve' ? 'approved' : 'rejected'} successfully`);
                closeConfirmModal();
                await fetchPendingWithdrawals();
            } else {
                const error = await response.json();
                notifications.error(error.message || `Failed to ${type} withdrawal`);
            }
        } catch (error) {
            console.error(`Error ${type}ing withdrawal:`, error);
            notifications.error(`Failed to ${type} withdrawal. Please try again.`);
        }
    }

    onMount(fetchPendingWithdrawals);
</script>

<div class="max-w-7xl mx-auto p-8">
    <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
        <div class="flex justify-between items-center mb-6">
            <div>
                <h3 class="text-lg font-semibold text-gray-900">Pending Withdrawals</h3>
                <p class="text-sm text-gray-500 mt-1">Manage withdrawal requests</p>
            </div>
            <div class="flex items-center gap-3">
                <div class="flex items-center gap-2 text-sm text-gray-500">
                    <div class="w-3 h-3 rounded-full bg-orange-500"></div>
                    <span>Pending</span>
                </div>
                <button 
                    class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 
                           flex items-center gap-2 shadow-lg shadow-indigo-500/20"
                    on:click={fetchPendingWithdrawals}
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
                            <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">Network Fee</span>
                        </th>
                        <th class="px-6 py-3 text-left">
                            <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">Address</span>
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
                    {:else if pendingWithdrawals.length === 0}
                        <tr>
                            <td colspan="6" class="py-16">
                                <div class="flex flex-col items-center justify-center text-gray-400">
                                    <svg class="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                    </svg>
                                    <span class="text-lg">No pending withdrawals</span>
                                </div>
                            </td>
                        </tr>
                    {:else}
                        {#each pendingWithdrawals as withdrawal}
                            <tr class="hover:bg-gray-50/50 transition-colors">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center gap-3">
                                        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 
                                                    flex items-center justify-center text-white font-medium">
                                            {withdrawal.user.firstName[0]}{withdrawal.user.lastName[0]}
                                        </div>
                                        <div>
                                            <div class="text-sm font-medium text-gray-900">
                                                {withdrawal.user.firstName} {withdrawal.user.lastName}
                                            </div>
                                            <div class="text-sm text-gray-500">{withdrawal.user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm text-gray-900">
                                        {new Date(withdrawal.createdAt).toLocaleDateString()}
                                    </div>
                                    <div class="text-xs text-gray-500">
                                        {new Date(withdrawal.createdAt).toLocaleTimeString()}
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm font-medium text-gray-900">
                                        {withdrawal.amount} {withdrawal.currency.toUpperCase()}
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm text-gray-500">
                                        {withdrawal.networkFee} {withdrawal.currency.toUpperCase()}
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center gap-2">
                                        <span class="font-mono text-sm text-gray-900 truncate max-w-[120px]">
                                            {withdrawal.withdrawalAddress}
                                        </span>
                                        <button 
                                            class="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                            on:click={() => copyToClipboard(withdrawal.withdrawalAddress)}
                                        >
                                            <svg class="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                                      d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-2M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-right">
                                    <div class="flex items-center justify-end gap-2">
                                        <button 
                                            class="px-3 py-1.5 text-sm font-medium text-green-700 bg-green-100 
                                                   rounded-lg hover:bg-green-200 transition-colors"
                                            on:click={() => openConfirmModal(withdrawal, 'approve')}
                                        >
                                            Approve
                                        </button>
                                        <button 
                                            class="px-3 py-1.5 text-sm font-medium text-red-700 bg-red-100 
                                                   rounded-lg hover:bg-red-200 transition-colors"
                                            on:click={() => openConfirmModal(withdrawal, 'reject')}
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

<!-- Confirmation Modal -->
{#if showConfirmModal}
    <div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div 
            class="bg-white rounded-xl w-full max-w-md shadow-xl"
            in:fade={{ duration: 200 }}
            out:fade={{ duration: 150 }}
        >
            <div class="p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">
                    Confirm {actionType === 'approve' ? 'Approval' : 'Rejection'}
                </h3>
                <p class="text-gray-600 mb-6">
                    Are you sure you want to {actionType} this withdrawal request?
                    <br><br>
                    <span class="font-medium">Amount:</span> {selectedWithdrawal.amount} {selectedWithdrawal.currency.toUpperCase()}<br>
                    <span class="font-medium">User:</span> {selectedWithdrawal.user.email}
                </p>
                <div class="flex justify-end gap-3">
                    <button 
                        class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        on:click={closeConfirmModal}
                    >
                        Cancel
                    </button>
                    <button 
                        class="px-4 py-2 text-white rounded-lg transition-colors
                               {actionType === 'approve' ? 
                               'bg-green-600 hover:bg-green-700' : 
                               'bg-red-600 hover:bg-red-700'}"
                        on:click={() => handleAction(actionType)}
                    >
                        {actionType === 'approve' ? 'Approve' : 'Reject'}
                    </button>
                </div>
            </div>
        </div>
    </div>
{/if}

<style lang="postcss">
    .btn-secondary {
        @apply flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg 
               hover:bg-gray-100 transition-all duration-200
               focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2;
    }
</style>
