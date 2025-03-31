<script lang="ts">
    import { onMount } from 'svelte';
    import { session } from '$lib/stores/session';
    import { notifications } from '$lib/stores/notifications';
    import { PUBLIC_API_URL } from '$env/static/public';
    import { fade, slide } from 'svelte/transition';

    // Update the Withdrawal interface to match the API response
    interface Withdrawal {
        _id: string;
        id?: string;
        amount: number;
        networkFee: number;
        currency: string;
        status: string;
        withdrawalAddress: string;
        createdAt: string;
        approvedAt?: string;
        approvedBy?: string;
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
    let showActionModal = false;
    let actionType: 'approve' | 'cancel' = 'approve';
    let isProcessing = false;

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
    function openActionModal(withdrawal: Withdrawal, type: 'approve' | 'cancel') {
        if (!withdrawal._id) {
            notifications.error('Invalid withdrawal');
            return;
        }
        console.log('Opening modal for withdrawal:', withdrawal);
        selectedWithdrawal = withdrawal;
        actionType = type;
        showActionModal = true;
    }

    function closeConfirmModal() {
        showActionModal = false;
        selectedWithdrawal = null;
    }

    // Update the handleAction function to use the correct API endpoint and method
    async function handleAction(type: 'approve' | 'cancel') {
        if (!selectedWithdrawal?._id) {
            notifications.error('Invalid withdrawal ID');
            return;
        }
        
        try {
            isProcessing = true;
            const response = await fetch(`${PUBLIC_API_URL}/api/withdrawal/${selectedWithdrawal._id}/process`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${$session.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    status: type === 'approve' ? 'approved' : 'rejected',
                    ...(type === 'cancel' && { reason: 'Withdrawal request cancelled by admin' })
                })
            });

            if (response.ok) {
                const result = await response.json();
                notifications.success(result.message || `Withdrawal ${type}d successfully`);
                await fetchPendingWithdrawals();
                showActionModal = false;
                selectedWithdrawal = null;
            } else {
                const error = await response.json();
                notifications.error(error.message || `Failed to ${type} withdrawal`);
            }
        } catch (error) {
            console.error(`Error ${type}ing withdrawal:`, error);
            notifications.error(`Failed to ${type} withdrawal`);
        } finally {
            isProcessing = false;
        }
    }

    onMount(fetchPendingWithdrawals);
</script>

<div class="bg-white rounded-xl shadow-lg p-6">
    <h1 class="text-2xl font-bold mb-6">Manage Withdrawals</h1>
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
                                                class="px-3 py-1.5 text-sm font-medium text-green-700 bg-green-100 rounded-lg hover:bg-green-200 transition-colors"
                                                on:click={() => openActionModal(withdrawal, 'approve')}
                                            >
                                                Approve
                                            </button>
                                            <button 
                                                class="px-3 py-1.5 text-sm font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
                                                on:click={() => openActionModal(withdrawal, 'cancel')}
                                            >
                                                Cancel
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
</div>

<!-- Approval/Cancel Modal -->
{#if showActionModal && selectedWithdrawal}
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-xl w-full max-w-md" transition:fade>
            <!-- Modal Header -->
            <div class="flex items-center justify-between p-5 border-b border-gray-100">
                <h3 class="text-lg font-semibold text-gray-900">
                    {actionType === 'approve' ? 'Approve' : 'Cancel'} Withdrawal
                </h3>
                <button 
                    class="text-gray-400 hover:text-gray-500"
                    on:click={() => showActionModal = false}
                >
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <!-- Modal Content -->
            <div class="p-5 space-y-5">
                <!-- Withdrawal Details -->
                <div class="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div class="flex justify-between items-center">
                        <span class="text-gray-600">Amount</span>
                        <span class="text-lg font-semibold text-gray-900">
                            {selectedWithdrawal.amount} {selectedWithdrawal.currency.toUpperCase()}
                        </span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-gray-600">User</span>
                        <span class="text-gray-900">{selectedWithdrawal.user.email}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-gray-600">Wallet Address</span>
                        <span class="font-mono text-sm text-gray-900 truncate max-w-[200px]">
                            {selectedWithdrawal.withdrawalAddress}
                        </span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-gray-600">Date</span>
                        <span class="text-gray-900">
                            {new Date(selectedWithdrawal.createdAt).toLocaleString()}
                        </span>
                    </div>
                </div>

                <!-- Warning Message -->
                <div class={`bg-${actionType === 'approve' ? 'blue' : 'red'}-50 border border-${actionType === 'approve' ? 'blue' : 'red'}-100 rounded-lg p-4`}>
                    <div class="flex gap-3">
                        <svg class={`w-5 h-5 text-${actionType === 'approve' ? 'blue' : 'red'}-600 flex-shrink-0`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                        </svg>
                        <div class={`text-${actionType === 'approve' ? 'blue' : 'red'}-700`}>
                            <p class="font-medium">Confirmation Required</p>
                            <p class="text-sm mt-1">
                                Are you sure you want to {actionType} this withdrawal request? 
                                This action cannot be undone.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal Footer -->
            <div class="p-5 border-t border-gray-100">
                <div class="flex justify-end gap-3">
                    <button 
                        class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        on:click={() => showActionModal = false}
                    >
                        Cancel
                    </button>
                    <button 
                        class={`px-4 py-2 text-white rounded-lg transition-colors
                            ${actionType === 'approve' 
                                ? 'bg-blue-600 hover:bg-blue-700' 
                                : 'bg-red-600 hover:bg-red-700'}`}
                        on:click={() => handleAction(actionType)}
                        disabled={isProcessing}
                    >
                        {#if isProcessing}
                            <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        {:else}
                            {actionType === 'approve' ? 'Approve' : 'Cancel'} Withdrawal
                        {/if}
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