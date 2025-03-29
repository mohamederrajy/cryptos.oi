<script lang="ts">
    import Chart from 'chart.js/auto';
    import { onMount, tick } from 'svelte';
    import { session } from '$lib/stores/session';
    import { notifications } from '$lib/stores/notifications';
    import { PUBLIC_API_URL } from '$env/static/public';
    // Import the users table component
    import UsersTable from '../users/+page.svelte';

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
    let transactionOverviewCanvas: HTMLCanvasElement;
    let userGrowthCanvas: HTMLCanvasElement;
    let depositsWithdrawalsCanvas: HTMLCanvasElement;
    let userActivityCanvas: HTMLCanvasElement;
    
    let depositsWithdrawalsChart: Chart | null = null;
    let userActivityChart: Chart | null = null;
    let transactionOverviewChart: Chart | null = null;
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

    async function initializeCharts() {
        try {
            chartsLoading = true;
            await tick();

            // Transaction Overview Chart
            if (transactionOverviewCanvas && stats) {
                const ctx = transactionOverviewCanvas.getContext('2d');
                if (ctx) {
                    if (transactionOverviewChart) transactionOverviewChart.destroy();
                    
                    transactionOverviewChart = new Chart(ctx, {
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
            }

            // User Growth Chart
            if (userGrowthCanvas && stats) {
                const ctx = userGrowthCanvas.getContext('2d');
                if (ctx) {
                    if (userGrowthChart) userGrowthChart.destroy();

                    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.2)');
                    gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');

                    userGrowthChart = new Chart(ctx, {
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
                                    beginAtZero: true,
                                    ticks: {
                                        callback: (value) => `${value.toLocaleString()} users`
                                    }
                                }
                            }
                        }
                    });
                }
            }

            // Initialize Deposits vs Withdrawals Chart
            if (depositsWithdrawalsCanvas && stats) {
                const ctx = depositsWithdrawalsCanvas.getContext('2d');
                if (ctx) {
                    if (depositsWithdrawalsChart) depositsWithdrawalsChart.destroy();
                    
                    depositsWithdrawalsChart = new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                            datasets: [
                                {
                                    label: 'Deposits',
                                    data: [
                                        stats.completedTransactions.deposits.totalAmount * 0.5,
                                        stats.completedTransactions.deposits.totalAmount * 0.7,
                                        stats.completedTransactions.deposits.totalAmount * 0.8,
                                        stats.completedTransactions.deposits.totalAmount * 0.9,
                                        stats.completedTransactions.deposits.totalAmount * 0.95,
                                        stats.completedTransactions.deposits.totalAmount
                                    ],
                                    borderColor: '#10B981',
                                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                    fill: true,
                                    tension: 0.4
                                },
                                {
                                    label: 'Withdrawals',
                                    data: [
                                        stats.completedTransactions.withdrawals.totalAmount * 0.4,
                                        stats.completedTransactions.withdrawals.totalAmount * 0.6,
                                        stats.completedTransactions.withdrawals.totalAmount * 0.7,
                                        stats.completedTransactions.withdrawals.totalAmount * 0.8,
                                        stats.completedTransactions.withdrawals.totalAmount * 0.9,
                                        stats.completedTransactions.withdrawals.totalAmount
                                    ],
                                    borderColor: '#EF4444',
                                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                    fill: true,
                                    tension: 0.4
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
            }

            // Initialize User Activity Chart
            if (userActivityCanvas && stats) {
                const ctx = userActivityCanvas.getContext('2d');
                if (ctx) {
                    if (userActivityChart) userActivityChart.destroy();

                    userActivityChart = new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                            datasets: [{
                                label: 'Active Users',
                                data: [
                                    Math.floor(stats.users.total * 0.7),
                                    Math.floor(stats.users.total * 0.8),
                                    Math.floor(stats.users.total * 0.9),
                                    Math.floor(stats.users.total * 0.85),
                                    Math.floor(stats.users.total * 0.95),
                                    Math.floor(stats.users.total * 0.75),
                                    Math.floor(stats.users.total * 0.65)
                                ],
                                backgroundColor: 'rgba(99, 102, 241, 0.8)',
                                borderRadius: 6
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
                                    beginAtZero: true,
                                    ticks: {
                                        callback: (value) => `${value.toLocaleString()} users`
                                    }
                                }
                            }
                        }
                    });
                }
            }

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

    // Add new function for user initials
    function getUserInitials(firstName: string, lastName: string): string {
        return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
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

        <!-- Stats Grid - Add this after the header and before the charts -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <!-- Total Users Card -->
            <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-200">
                <div class="flex items-center justify-between mb-4">
                    <div class="p-3 bg-blue-50 rounded-lg">
                        <svg class="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="text-xs font-medium text-green-500 bg-green-50 px-2.5 py-0.5 rounded-full">
                            +{stats?.users?.regularUsers || 0} new
                        </span>
                    </div>
                </div>
                <h3 class="text-sm font-medium text-gray-500">Total Users</h3>
                <div class="mt-2 flex items-baseline">
                    <p class="text-2xl font-semibold text-gray-900">{stats?.users?.total?.toLocaleString() || 0}</p>
                    <p class="ml-2 text-sm text-gray-500">accounts</p>
                </div>
                <div class="mt-4 flex items-center justify-between text-xs">
                    <span class="text-gray-500">Active Users</span>
                    <span class="font-medium text-gray-900">{stats?.users?.regularUsers || 0}</span>
                </div>
                <div class="mt-1 flex items-center justify-between text-xs">
                    <span class="text-gray-500">Admins</span>
                    <span class="font-medium text-gray-900">{stats?.users?.admins || 0}</span>
                </div>
            </div>

            <!-- Total Balance Card -->
            <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-200">
                <div class="flex items-center justify-between mb-4">
                    <div class="p-3 bg-green-50 rounded-lg">
                        <svg class="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="text-xs font-medium text-green-500 bg-green-50 px-2.5 py-0.5 rounded-full">
                            +2.5%
                        </span>
                    </div>
                </div>
                <h3 class="text-sm font-medium text-gray-500">Total Balance</h3>
                <div class="mt-2 flex items-baseline">
                    <p class="text-2xl font-semibold text-gray-900">{stats?.balance?.totalUSDT?.toLocaleString() || 0}</p>
                    <p class="ml-2 text-sm text-gray-500">USDT</p>
                </div>
                <div class="mt-4 flex items-center justify-between text-xs">
                    <span class="text-gray-500">24h Volume</span>
                    <span class="font-medium text-gray-900">
                        {((stats?.completedTransactions?.deposits?.totalAmount || 0) + 
                          (stats?.completedTransactions?.withdrawals?.totalAmount || 0)).toLocaleString()} USDT
                    </span>
                </div>
                <div class="mt-1 flex items-center justify-between text-xs">
                    <span class="text-gray-500">Active Orders</span>
                    <span class="font-medium text-gray-900">
                        {(stats?.pendingTransactions?.deposits?.count || 0) + 
                         (stats?.pendingTransactions?.withdrawals?.count || 0)}
                    </span>
                </div>
            </div>

            <!-- Pending Transactions Card -->
            <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-200">
                <div class="flex items-center justify-between mb-4">
                    <div class="p-3 bg-orange-50 rounded-lg">
                        <svg class="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="text-xs font-medium text-orange-500 bg-orange-50 px-2.5 py-0.5 rounded-full">
                            {stats?.pendingTransactions?.deposits?.count || 0} deposits
                        </span>
                    </div>
                </div>
                <h3 class="text-sm font-medium text-gray-500">Pending Transactions</h3>
                <div class="mt-2 flex items-baseline">
                    <p class="text-2xl font-semibold text-gray-900">
                        {((stats?.pendingTransactions?.deposits?.count || 0) + 
                          (stats?.pendingTransactions?.withdrawals?.count || 0)).toLocaleString()}
                    </p>
                    <p class="ml-2 text-sm text-gray-500">total</p>
                </div>
                <div class="mt-4 flex items-center justify-between text-xs">
                    <span class="text-gray-500">Deposits Amount</span>
                    <span class="font-medium text-gray-900">
                        {stats?.pendingTransactions?.deposits?.totalAmount?.toLocaleString() || 0} USDT
                    </span>
                </div>
                <div class="mt-1 flex items-center justify-between text-xs">
                    <span class="text-gray-500">Withdrawals Amount</span>
                    <span class="font-medium text-gray-900">
                        {stats?.pendingTransactions?.withdrawals?.totalAmount?.toLocaleString() || 0} USDT
                    </span>
                </div>
            </div>

            <!-- Completed Transactions Card -->
            <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-200">
                <div class="flex items-center justify-between mb-4">
                    <div class="p-3 bg-purple-50 rounded-lg">
                        <svg class="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="text-xs font-medium text-purple-500 bg-purple-50 px-2.5 py-0.5 rounded-full">
                            {stats?.completedTransactions?.deposits?.count || 0} completed
                        </span>
                    </div>
                </div>
                <h3 class="text-sm font-medium text-gray-500">Completed Transactions</h3>
                <div class="mt-2 flex items-baseline">
                    <p class="text-2xl font-semibold text-gray-900">
                        {((stats?.completedTransactions?.deposits?.count || 0) + 
                          (stats?.completedTransactions?.withdrawals?.count || 0)).toLocaleString()}
                    </p>
                    <p class="ml-2 text-sm text-gray-500">total</p>
                </div>
                <div class="mt-4 flex items-center justify-between text-xs">
                    <span class="text-gray-500">Deposits Amount</span>
                    <span class="font-medium text-gray-900">
                        {stats?.completedTransactions?.deposits?.totalAmount?.toLocaleString() || 0} USDT
                    </span>
                </div>
                <div class="mt-1 flex items-center justify-between text-xs">
                    <span class="text-gray-500">Withdrawals Amount</span>
                    <span class="font-medium text-gray-900">
                        {stats?.completedTransactions?.withdrawals?.totalAmount?.toLocaleString() || 0} USDT
                    </span>
                </div>
            </div>
        </div>

        {#if isLoading}
            <div class="flex justify-center items-center h-64">
                <div class="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
            </div>
        {:else if error}
            <div class="bg-red-50 text-red-600 p-4 rounded-lg text-center">{error}</div>
        {:else if stats}
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
                        <canvas bind:this={transactionOverviewCanvas}></canvas>
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
                        <canvas bind:this={userGrowthCanvas}></canvas>
                    </div>
                </div>
            </div>

            <!-- Transaction History Chart -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <!-- Deposits vs Withdrawals Comparison -->
                <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                    <h3 class="text-lg font-semibold text-gray-900 mb-6">Deposits vs Withdrawals</h3>
                    <div class="h-[400px] w-full relative" style="min-height: 400px;">
                        {#if chartsLoading}
                            <div class="absolute inset-0 flex items-center justify-center">
                                <div class="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent"></div>
                            </div>
                        {/if}
                        <canvas bind:this={depositsWithdrawalsCanvas}></canvas>
                    </div>
                </div>

                <!-- User Activity Chart -->
                <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                    <h3 class="text-lg font-semibold text-gray-900 mb-6">User Activity</h3>
                    <div class="h-[400px] w-full relative" style="min-height: 400px;">
                        {#if chartsLoading}
                            <div class="absolute inset-0 flex items-center justify-center">
                                <div class="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent"></div>
                            </div>
                        {/if}
                        <canvas bind:this={userActivityCanvas}></canvas>
                    </div>
                </div>
            </div>

            
        {/if}
    </div>
</div>