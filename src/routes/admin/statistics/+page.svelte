<script lang="ts">
    import Chart from 'chart.js/auto';
    import { onMount, tick } from 'svelte';
    import { session } from '$lib/stores/session';
    import { notifications } from '$lib/stores/notifications';
    import { PUBLIC_API_URL } from '$env/static/public';

    interface Statistics {
        users: {
            total: number;
            admins: number;
            regularUsers: number;
        };
        balance: {
            totalUSDT: number;
        };
        pendingTransactions: {
            deposits: {
                count: number;
                totalAmount: number;
            };
            withdrawals: {
                count: number;
                totalAmount: number;
            };
        };
        completedTransactions: {
            deposits: {
                count: number;
                totalAmount: number;
            };
            withdrawals: {
                count: number;
                totalAmount: number;
            };
        };
    }

    let stats: Statistics | null = null;
    let isLoading = true;
    let error: string | null = null;
    let transactionChartCanvas: HTMLCanvasElement;
    let transactionChart: Chart | null = null;
    let userGrowthChartCanvas: HTMLCanvasElement;
    let userGrowthChart: Chart | null = null;

    // Add time period selection
    let selectedPeriod = '24h';
    const timePeriods = [
        { value: '24h', label: '24 Hours' },
        { value: '7d', label: '7 Days' },
        { value: '30d', label: '30 Days' },
        { value: 'all', label: 'All Time' }
    ];

    // Add a loading state for charts
    let chartsLoading = true;

    // Add this function to initialize charts after component is mounted
    async function initializeCharts() {
        try {
            chartsLoading = true;
            console.log('Starting chart initialization...');

            // Wait for next tick to ensure DOM is updated
            await tick();
            
            // Double check if elements exist
            if (!transactionChartCanvas || !userGrowthChartCanvas) {
                console.log('Canvas elements not ready, retrying...');
                // Try again after a short delay
                setTimeout(initializeCharts, 100);
                return;
            }

            console.log('Canvas elements found, creating charts...');

            // Create Transaction Chart
            const transactionCtx = transactionChartCanvas.getContext('2d');
            if (transactionCtx && stats) {
                if (transactionChart) transactionChart.destroy();
                
                transactionChart = new Chart(transactionCtx, {
                    type: 'bar',
                    data: {
                        labels: ['Deposits', 'Withdrawals'],
                        datasets: [
                            {
                                label: 'Pending',
                                data: [
                                    stats.pendingTransactions.deposits.totalAmount,
                                    stats.pendingTransactions.withdrawals.totalAmount
                                ],
                                backgroundColor: 'rgba(99, 102, 241, 0.8)',
                                borderRadius: 6
                            },
                            {
                                label: 'Completed',
                                data: [
                                    stats.completedTransactions.deposits.totalAmount,
                                    stats.completedTransactions.withdrawals.totalAmount
                                ],
                                backgroundColor: 'rgba(34, 197, 94, 0.8)',
                                borderRadius: 6
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'top'
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    callback: (value) => `${value.toLocaleString()} USDT`
                                }
                            }
                        }
                    }
                });
            }

            // Create User Growth Chart
            const growthCtx = userGrowthChartCanvas.getContext('2d');
            if (growthCtx && stats) {
                if (userGrowthChart) userGrowthChart.destroy();

                const gradient = growthCtx.createLinearGradient(0, 0, 0, 400);
                gradient.addColorStop(0, 'rgba(59, 130, 246, 0.2)');
                gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');

                userGrowthChart = new Chart(growthCtx, {
                    type: 'line',
                    data: {
                        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                        datasets: [{
                            label: 'Total Users',
                            data: [
                                Math.floor(stats.users.total * 0.5),
                                Math.floor(stats.users.total * 0.6),
                                Math.floor(stats.users.total * 0.7),
                                Math.floor(stats.users.total * 0.8),
                                Math.floor(stats.users.total * 0.9),
                                stats.users.total
                            ],
                            borderColor: '#3B82F6',
                            backgroundColor: gradient,
                            fill: true,
                            tension: 0.4
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: false
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            }

            console.log('Charts created successfully');
            chartsLoading = false;
        } catch (error) {
            console.error('Error initializing charts:', error);
            chartsLoading = false;
        }
    }

    // Update the fetchStatistics function
    async function fetchStatistics() {
        try {
            isLoading = true;
            error = null;
            
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch(`${PUBLIC_API_URL}/api/admin/statistics`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch statistics');
            }

            stats = await response.json();
            await tick();
            await initializeCharts();
            
            notifications.success('Statistics updated successfully');
        } catch (err) {
            console.error('Error:', err);
            error = err instanceof Error ? err.message : 'An error occurred';
            notifications.error('Failed to load statistics');
        } finally {
            isLoading = false;
        }
    }

    // Update onMount
    onMount(async () => {
        if (!$session.isAuthenticated || $session.user?.role !== 'admin') {
            notifications.error('Admin access required');
            window.location.href = '/';
            return;
        }
        await fetchStatistics();
    });

    // Add reactive statement for stats updates
    $: if (stats && !isLoading) {
        initializeCharts();
    }
</script>

<div class="min-h-screen bg-gray-50/50 p-6">
    <div class="max-w-7xl mx-auto">
        <!-- Modern Header with Time Period Selection -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p class="text-gray-500 text-sm mt-1">Overview of platform statistics and performance</p>
            </div>
            <div class="flex items-center gap-4">
                <select 
                    bind:value={selectedPeriod}
                    class="px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                    {#each timePeriods as period}
                        <option value={period.value}>{period.label}</option>
                    {/each}
                </select>
                <button 
                    class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 
                           flex items-center gap-2 shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30"
                    on:click={fetchStatistics}
                >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                </button>
            </div>
        </div>

        {#if isLoading}
            <div class="flex justify-center items-center h-64">
                <div class="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
            </div>
        {:else if error}
            <div class="bg-red-50 text-red-600 p-4 rounded-lg text-center">{error}</div>
        {:else if stats}
            <!-- Stats Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <!-- Users Card -->
                <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
                    <div class="flex items-center justify-between mb-4">
                        <div class="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <div class="flex flex-col items-end">
                            <span class="text-xs font-medium text-white/80">↑ 12%</span>
                            <span class="text-xs text-white/60">vs last month</span>
                        </div>
                    </div>
                    <h3 class="text-3xl font-bold">{stats.users.total.toLocaleString()}</h3>
                    <p class="text-white/80">Total Users</p>
                </div>

                <!-- Balance Card -->
                <div class="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                    <div class="flex items-center justify-between mb-4">
                        <div class="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                    <h3 class="text-3xl font-bold">{stats.balance.totalUSDT.toLocaleString()} USDT</h3>
                    <p class="text-white/80">Total Balance</p>
                </div>

                <!-- Pending Transactions -->
                <div class="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
                    <div class="flex items-center justify-between mb-4">
                        <div class="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div class="flex flex-col items-end">
                            <span class="text-xs font-medium text-white/80">
                                {stats.pendingTransactions.deposits.count + stats.pendingTransactions.withdrawals.count} Pending
                            </span>
                            <span class="text-xs text-white/60">Last 24h</span>
                        </div>
                    </div>
                    <h3 class="text-3xl font-bold">
                        {(stats.pendingTransactions.deposits.totalAmount + stats.pendingTransactions.withdrawals.totalAmount).toLocaleString()} USDT
                    </h3>
                    <p class="text-white/80">Pending Volume</p>
                    <div class="mt-4 grid grid-cols-2 gap-2">
                        <div class="bg-white/10 rounded-lg p-2">
                            <div class="flex items-center gap-2">
                                <svg class="w-4 h-4 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                </svg>
                                <span class="text-sm">Deposits</span>
                            </div>
                            <div class="mt-1 text-lg font-semibold">{stats.pendingTransactions.deposits.count}</div>
                        </div>
                        <div class="bg-white/10 rounded-lg p-2">
                            <div class="flex items-center gap-2">
                                <svg class="w-4 h-4 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                </svg>
                                <span class="text-sm">Withdrawals</span>
                            </div>
                            <div class="mt-1 text-lg font-semibold">{stats.pendingTransactions.withdrawals.count}</div>
                        </div>
                    </div>
                </div>

                <!-- Completed Transactions -->
                <div class="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
                    <div class="flex items-center justify-between mb-4">
                        <div class="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div class="flex flex-col items-end">
                            <span class="text-xs font-medium text-white/80">
                                {stats.completedTransactions.deposits.count + stats.completedTransactions.withdrawals.count} Completed
                            </span>
                            <span class="text-xs text-white/60">All time</span>
                        </div>
                    </div>
                    <h3 class="text-3xl font-bold">
                        {(stats.completedTransactions.deposits.totalAmount + stats.completedTransactions.withdrawals.totalAmount).toLocaleString()} USDT
                    </h3>
                    <p class="text-white/80">Total Volume</p>
                    <div class="mt-4 grid grid-cols-2 gap-2">
                        <div class="bg-white/10 rounded-lg p-2">
                            <div class="flex items-center gap-2">
                                <svg class="w-4 h-4 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                </svg>
                                <span class="text-sm">Deposits</span>
                            </div>
                            <div class="mt-1 text-lg font-semibold">{stats.completedTransactions.deposits.count}</div>
                        </div>
                        <div class="bg-white/10 rounded-lg p-2">
                            <div class="flex items-center gap-2">
                                <svg class="w-4 h-4 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                </svg>
                                <span class="text-sm">Withdrawals</span>
                            </div>
                            <div class="mt-1 text-lg font-semibold">{stats.completedTransactions.withdrawals.count}</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Enhanced Charts Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                    <h3 class="text-lg font-semibold text-gray-900 mb-6">Transaction Overview</h3>
                    <div class="h-[400px] w-full relative" style="min-height: 400px;">
                        {#if chartsLoading}
                            <div class="absolute inset-0 flex items-center justify-center">
                                <div class="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent"></div>
                            </div>
                        {/if}
                        <canvas bind:this={transactionChartCanvas}></canvas>
                    </div>
                </div>

                <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                    <h3 class="text-lg font-semibold text-gray-900 mb-6">User Growth</h3>
                    <div class="h-[400px] w-full relative" style="min-height: 400px;">
                        {#if chartsLoading}
                            <div class="absolute inset-0 flex items-center justify-center">
                                <div class="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent"></div>
                            </div>
                        {/if}
                        <canvas bind:this={userGrowthChartCanvas}></canvas>
                    </div>
                </div>
            </div>

            <!-- Add this after your charts grid -->
            <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-lg font-semibold text-gray-900">Recent Users</h3>
                    <div class="flex items-center gap-3">
                        <div class="flex items-center gap-2 text-sm text-gray-500">
                            <div class="w-3 h-3 rounded-full bg-green-500"></div>
                            <span>Active</span>
                        </div>
                        <div class="flex items-center gap-2 text-sm text-gray-500">
                            <div class="w-3 h-3 rounded-full bg-gray-300"></div>
                            <span>Inactive</span>
                        </div>
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
                                    <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</span>
                                </th>
                                <th class="px-6 py-3 text-left">
                                    <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</span>
                                </th>
                                <th class="px-6 py-3 text-left">
                                    <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</span>
                                </th>
                                <th class="px-6 py-3 text-right">
                                    <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-50">
                            {#each Array(5) as _, i}
                                <tr class="hover:bg-gray-50/50 transition-colors">
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex items-center gap-3">
                                            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium">
                                                JD
                                            </div>
                                            <div>
                                                <div class="text-sm font-medium text-gray-900">John Doe {i + 1}</div>
                                                <div class="text-sm text-gray-500">john{i + 1}@example.com</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex items-center gap-2">
                                            <div class="w-2 h-2 rounded-full bg-green-500"></div>
                                            <span class="text-sm text-gray-900">Active</span>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm text-gray-900">${(1000 * (i + 1)).toLocaleString()}</div>
                                        <div class="text-xs text-gray-500">0.05 BTC</div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm text-gray-900">
                                            {new Date(2024, 0, i + 1).toLocaleDateString()}
                                        </div>
                                        <div class="text-xs text-gray-500">
                                            {new Date(2024, 0, i + 1).toLocaleTimeString()}
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-right">
                                        <div class="flex items-center justify-end gap-2">
                                            <button class="p-1 hover:bg-gray-100 rounded-full transition-colors">
                                                <svg class="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            </button>
                                            <button class="p-1 hover:bg-gray-100 rounded-full transition-colors">
                                                <svg class="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button class="p-1 hover:bg-red-50 rounded-full transition-colors">
                                                <svg class="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <div class="flex items-center justify-between mt-6">
                    <div class="text-sm text-gray-500">
                        Showing 1 to 5 of {stats.users.total} users
                    </div>
                    <div class="flex items-center gap-2">
                        <button class="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm text-gray-600 disabled:opacity-50">
                            Previous
                        </button>
                        <button class="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                            1
                        </button>
                        <button class="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm text-gray-600">
                            2
                        </button>
                        <button class="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm text-gray-600">
                            3
                        </button>
                        <button class="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm text-gray-600">
                            Next
                        </button>
                    </div>
                </div>
            </div>
        {/if}
    </div>
</div>
