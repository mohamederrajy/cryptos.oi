<script lang="ts">
    import { onMount } from 'svelte';
    import { session } from '$lib/stores/session';
    import { notifications } from '$lib/stores/notifications';
    import { PUBLIC_API_URL } from '$env/static/public';
    import Chart from 'chart.js/auto';

    interface Statistics {
        totalUsers: number;
        totalAdmins: number;
        totalBalance: {
            btc: number;
            usd: number;
        };
        activeUsers: number;
        totalTransactions: number;
        dailyVolume: {
            btc: number;
            usd: number;
        };
        monthlyVolume?: { month: string; btc: number }[];
        userGrowth?: { month: string; users: number }[];
    }

    let stats: Statistics = {
        totalUsers: 0,
        totalAdmins: 0,
        totalBalance: {
            btc: 0,
            usd: 0
        },
        activeUsers: 0,
        totalTransactions: 0,
        dailyVolume: {
            btc: 0,
            usd: 0
        }
    };
    let isLoading = true;
    let selectedPeriod = '24h';
    let error = null;

    let transactionChartCanvas: HTMLCanvasElement;
    let userGrowthChartCanvas: HTMLCanvasElement;
    let transactionChart: Chart | null = null;
    let userGrowthChart: Chart | null = null;

    async function fetchStatistics() {
        try {
            isLoading = true;
            console.log('Fetching statistics...');
            
            const token = localStorage.getItem('token');
            console.log('Token:', token);
            if (!token) {
                console.error('No token found');
                notifications.error('Authentication required');
                return;
            }

            const response = await fetch(`${PUBLIC_API_URL}/api/admin/statistics`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('Response:', response);

            if (response.ok) {
                const data = await response.json();
                console.log('Data:', data);
                stats = {
                    ...stats,
                    ...data,
                    // Provide fallback values for new fields
                    activeUsers: data.activeUsers || 0,
                    totalTransactions: data.totalTransactions || 0,
                    dailyVolume: data.dailyVolume || { btc: 0, usd: 0 },
                    monthlyVolume: data.monthlyVolume || [
                        { month: 'Jan', btc: data.dailyVolume?.btc || 0 },
                        { month: 'Feb', btc: data.dailyVolume?.btc * 1.2 || 0 },
                        { month: 'Mar', btc: data.dailyVolume?.btc * 1.5 || 0 },
                        { month: 'Apr', btc: data.dailyVolume?.btc * 1.3 || 0 },
                        { month: 'May', btc: data.dailyVolume?.btc * 1.8 || 0 },
                        { month: 'Jun', btc: data.dailyVolume?.btc * 1.6 || 0 }
                    ],
                    userGrowth: data.userGrowth || [
                        { month: 'Jan', users: data.totalUsers * 0.5 || 0 },
                        { month: 'Feb', users: data.totalUsers * 0.6 || 0 },
                        { month: 'Mar', users: data.totalUsers * 0.7 || 0 },
                        { month: 'Apr', users: data.totalUsers * 0.8 || 0 },
                        { month: 'May', users: data.totalUsers * 0.9 || 0 },
                        { month: 'Jun', users: data.totalUsers || 0 }
                    ]
                };
            } else {
                error = 'Failed to fetch statistics';
            }
        } catch (err) {
            console.error('Error:', err);
            error = err.message;
        } finally {
            isLoading = false;
        }
    }

    function createTransactionChart() {
        if (!transactionChartCanvas) return;
        if (transactionChart) transactionChart.destroy();
        
        const ctx = transactionChartCanvas.getContext('2d');
        if (!ctx) return;

        const monthlyVolume = stats.monthlyVolume || [
            { month: 'Jan', btc: stats.dailyVolume?.btc || 0 },
            { month: 'Feb', btc: stats.dailyVolume?.btc * 1.2 || 0 },
            { month: 'Mar', btc: stats.dailyVolume?.btc * 1.5 || 0 },
            { month: 'Apr', btc: stats.dailyVolume?.btc * 1.3 || 0 },
            { month: 'May', btc: stats.dailyVolume?.btc * 1.8 || 0 },
            { month: 'Jun', btc: stats.dailyVolume?.btc * 1.6 || 0 }
        ];

        transactionChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: monthlyVolume.map(item => item.month),
                datasets: [{
                    label: 'Transaction Volume (BTC)',
                    data: monthlyVolume.map(item => item.btc),
                    borderColor: '#8B5CF6',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${context.parsed.y.toFixed(8)} BTC`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value.toFixed(8) + ' BTC';
                            }
                        }
                    }
                }
            }
        });
    }

    function createUserGrowthChart() {
        if (!userGrowthChartCanvas) return;
        if (userGrowthChart) userGrowthChart.destroy();
        
        const ctx = userGrowthChartCanvas.getContext('2d');
        if (!ctx) return;

        const userGrowthData = stats.userGrowth || [
            { month: 'Jan', users: stats.totalUsers * 0.5 || 0 },
            { month: 'Feb', users: stats.totalUsers * 0.6 || 0 },
            { month: 'Mar', users: stats.totalUsers * 0.7 || 0 },
            { month: 'Apr', users: stats.totalUsers * 0.8 || 0 },
            { month: 'May', users: stats.totalUsers * 0.9 || 0 },
            { month: 'Jun', users: stats.totalUsers || 0 }
        ];

        userGrowthChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: userGrowthData.map(item => item.month),
                datasets: [{
                    label: 'New Users',
                    data: userGrowthData.map(item => item.users),
                    backgroundColor: 'rgba(59, 130, 246, 0.8)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${context.parsed.y.toLocaleString()}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }

    onMount(async () => {
        if (!$session.isAuthenticated || $session.user?.role !== 'admin') {
            notifications.error('Admin access required');
            window.location.href = '/';
            return;
        }
        await fetchStatistics();
    });

    // Only create charts when canvas elements are ready and stats are loaded
    $: if (!isLoading && stats && transactionChartCanvas && userGrowthChartCanvas) {
        setTimeout(() => {
            createTransactionChart();
            createUserGrowthChart();
        }, 0);
    }
</script>

{#if !$session.isAuthenticated || $session.user?.role !== 'admin'}
    <div class="flex items-center justify-center min-h-screen">
        <div class="text-center">
            <p class="text-lg text-gray-600">Access Denied</p>
            <a href="/" class="text-blue-600 hover:underline">Return to Home</a>
        </div>
    </div>
{:else}
    <div class="min-h-screen bg-white p-8">
        <!-- Header Section -->
        <div class="mb-8 flex justify-between items-center">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                <p class="mt-1 text-sm text-gray-500">Monitor your platform's performance and metrics</p>
            </div>
            <div class="flex items-center gap-4">
                <select 
                    bind:value={selectedPeriod}
                    class="px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="24h">Last 24 Hours</option>
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="1y">Last Year</option>
                </select>
                <button 
                    class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
                    on:click={fetchStatistics}
                >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                </button>
            </div>
        </div>

        {#if isLoading}
            <div class="flex items-center justify-center h-[calc(100vh-200px)]">
                <div class="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        {:else if error}
            <div class="text-red-600">{error}</div>
        {:else}
            <div class="space-y-6">
                <!-- Main Stats Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <!-- Users Card -->
                    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <div class="flex items-center justify-between mb-4">
                            <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                <svg class="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <div class="flex flex-col items-end">
                                <span class="text-xs font-medium text-green-600">↑ 12%</span>
                                <span class="text-xs text-gray-500">vs last period</span>
                            </div>
                        </div>
                        <h3 class="text-lg font-semibold text-gray-900">{stats.totalUsers.toLocaleString()}</h3>
                        <p class="text-sm text-gray-500">Total Users</p>
                        <div class="mt-4 flex items-center text-xs text-gray-500">
                            <span class="font-medium text-green-600">{stats.activeUsers} active now</span>
                            <span class="mx-2">•</span>
                            <span>{stats.totalAdmins} admins</span>
                        </div>
                    </div>

                    <!-- BTC Balance Card -->
                    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <div class="flex items-center justify-between mb-4">
                            <div class="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                                <svg class="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div class="flex flex-col items-end">
                                <span class="text-xs font-medium text-green-600">↑ 8.3%</span>
                                <span class="text-xs text-gray-500">vs last period</span>
                            </div>
                        </div>
                        <h3 class="text-lg font-semibold text-gray-900">{stats.totalBalance.btc.toFixed(8)} BTC</h3>
                        <p class="text-sm text-gray-500">Total BTC Balance</p>
                        <div class="mt-4 flex items-center text-xs text-gray-500">
                            <span class="font-medium text-orange-600">{stats.dailyVolume.btc.toFixed(8)} BTC</span>
                            <span class="mx-2">•</span>
                            <span>24h volume</span>
                        </div>
                    </div>

                    <!-- USD Balance Card -->
                    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <div class="flex items-center justify-between mb-4">
                            <div class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                                <svg class="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div class="flex flex-col items-end">
                                <span class="text-xs font-medium text-green-600">↑ 5.2%</span>
                                <span class="text-xs text-gray-500">vs last period</span>
                            </div>
                        </div>
                        <h3 class="text-lg font-semibold text-gray-900">${stats.totalBalance.usd.toLocaleString()}</h3>
                        <p class="text-sm text-gray-500">Total USD Balance</p>
                        <div class="mt-4 flex items-center text-xs text-gray-500">
                            <span class="font-medium text-green-600">${stats.dailyVolume.usd.toLocaleString()}</span>
                            <span class="mx-2">•</span>
                            <span>24h volume</span>
                        </div>
                    </div>

                    <!-- Transactions Card -->
                    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <div class="flex items-center justify-between mb-4">
                            <div class="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                                <svg class="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                            <div class="flex flex-col items-end">
                                <span class="text-xs font-medium text-green-600">↑ 15.4%</span>
                                <span class="text-xs text-gray-500">vs last period</span>
                            </div>
                        </div>
                        <h3 class="text-lg font-semibold text-gray-900">{stats.totalTransactions.toLocaleString()}</h3>
                        <p class="text-sm text-gray-500">Total Transactions</p>
                        <div class="mt-4 flex items-center text-xs text-gray-500">
                            <span class="font-medium text-purple-600">98.5%</span>
                            <span class="mx-2">•</span>
                            <span>Success rate</span>
                        </div>
                    </div>
                </div>

                <!-- Additional Stats or Charts can be added here -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">Transaction History</h3>
                        <div class="h-[400px]">
                            <canvas bind:this={transactionChartCanvas}></canvas>
                        </div>
                    </div>
                    
                    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
                        <div class="h-[400px]">
                            <canvas bind:this={userGrowthChartCanvas}></canvas>
                        </div>
                    </div>
                </div>

                <!-- Add a third chart for detailed analytics -->
                <div class="mt-6">
                    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div class="flex justify-between items-center mb-6">
                            <h3 class="text-lg font-semibold text-gray-900">Detailed Analytics</h3>
                            <div class="flex gap-2">
                                <button class="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                                    Daily
                                </button>
                                <button class="px-3 py-1 text-sm bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100">
                                    Weekly
                                </button>
                                <button class="px-3 py-1 text-sm bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100">
                                    Monthly
                                </button>
                            </div>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div class="p-4 bg-gray-50 rounded-lg">
                                <div class="text-sm text-gray-500">Average Transaction</div>
                                <div class="text-xl font-semibold mt-1">0.0234 BTC</div>
                                <div class="text-xs text-green-600 mt-1">↑ 2.5%</div>
                            </div>
                            <div class="p-4 bg-gray-50 rounded-lg">
                                <div class="text-sm text-gray-500">Success Rate</div>
                                <div class="text-xl font-semibold mt-1">98.5%</div>
                                <div class="text-xs text-green-600 mt-1">↑ 0.8%</div>
                            </div>
                            <div class="p-4 bg-gray-50 rounded-lg">
                                <div class="text-sm text-gray-500">Active Users</div>
                                <div class="text-xl font-semibold mt-1">{stats.activeUsers}</div>
                                <div class="text-xs text-green-600 mt-1">↑ 12.3%</div>
                            </div>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="min-w-full">
                                <thead>
                                    <tr class="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <th class="px-6 py-3">Date</th>
                                        <th class="px-6 py-3">Transactions</th>
                                        <th class="px-6 py-3">Volume (BTC)</th>
                                        <th class="px-6 py-3">Volume (USD)</th>
                                        <th class="px-6 py-3">Success Rate</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-gray-200">
                                    {#each Array(5) as _, i}
                                        <tr class="text-sm text-gray-900">
                                            <td class="px-6 py-4">2024-0{i + 1}-01</td>
                                            <td class="px-6 py-4">{(1000 + i * 100).toLocaleString()}</td>
                                            <td class="px-6 py-4">{(2.5 + i * 0.5).toFixed(2)}</td>
                                            <td class="px-6 py-4">${(50000 + i * 10000).toLocaleString()}</td>
                                            <td class="px-6 py-4">
                                                <span class="text-green-600">98.{5 + i}%</span>
                                            </td>
                                        </tr>
                                    {/each}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        {/if}
    </div>
{/if} 