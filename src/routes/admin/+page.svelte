<script lang="ts">
    import { onMount } from 'svelte';
    import { session } from '$lib/stores/session';
    import { notifications } from '$lib/stores/notifications';
    import { PUBLIC_API_URL } from '$env/static/public';

    interface Statistics {
        totalUsers: number;
        totalAdmins: number;
        totalBalance: {
            btc: number;
            usd: number;
        };
    }

    let stats: Statistics = {
        totalUsers: 0,
        totalAdmins: 0,
        totalBalance: {
            btc: 0,
            usd: 0
        }
    };
    let isLoading = true;

    async function fetchStatistics() {
        try {
            if (import.meta.env.DEV) {
                // Mock data for development
                await new Promise(resolve => setTimeout(resolve, 1000));
                stats = {
                    totalUsers: 100,
                    totalAdmins: 2,
                    totalBalance: {
                        btc: 25.5,
                        usd: 750000
                    }
                };
                return;
            }

            const response = await fetch(`${PUBLIC_API_URL}/api/admin/statistics`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                stats = await response.json();
            } else {
                notifications.error('Failed to fetch statistics');
            }
        } catch (error) {
            console.error('Statistics error:', error);
            notifications.error('Failed to load statistics');
        } finally {
            isLoading = false;
        }
    }

    onMount(fetchStatistics);
</script>

<div class="p-8 space-y-8">
    <!-- Header -->
    <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <button 
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            on:click={() => {
                fetchStatistics();
            }}
        >
            Refresh Data
        </button>
    </div>

    {#if isLoading}
        <div class="flex items-center justify-center py-12">
            <div class="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    {:else}
        <!-- Statistics Cards -->
        <div class="grid grid-cols-4 gap-6">
            <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div class="text-sm font-medium text-gray-500">Total Users</div>
                <div class="mt-2 text-3xl font-bold text-gray-900">{stats.totalUsers}</div>
            </div>
            
            <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div class="text-sm font-medium text-gray-500">Total Admins</div>
                <div class="mt-2 text-3xl font-bold text-gray-900">{stats.totalAdmins}</div>
            </div>
            
            <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div class="text-sm font-medium text-gray-500">Total BTC Balance</div>
                <div class="mt-2 text-3xl font-bold text-gray-900">{stats.totalBalance.btc.toFixed(8)}</div>
            </div>
            
            <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div class="text-sm font-medium text-gray-500">Total USD Balance</div>
                <div class="mt-2 text-3xl font-bold text-gray-900">${stats.totalBalance.usd.toFixed(2)}</div>
            </div>
        </div>

        <!-- Users Table -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200">
                <h2 class="text-lg font-medium text-gray-900">Users</h2>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead>
                        <tr class="bg-gray-50">
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">BTC Balance</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">USD Balance</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        {#each users as user}
                            <tr class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm font-medium text-gray-900">
                                        {user.firstName} {user.lastName}
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm text-gray-500">{user.email}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                               {user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}">
                                        {user.role}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {user.wallet.totalBalance.btc.toFixed(8)}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    ${user.wallet.totalBalance.usd.toFixed(2)}
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>
    {/if}
</div> 