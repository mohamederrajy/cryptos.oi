<script lang="ts">
    import { fade } from 'svelte/transition';

    const systems = [
        {
            name: 'Trading Engine',
            status: 'operational',
            latency: '45ms'
        },
        {
            name: 'Wallet System',
            status: 'operational',
            latency: '120ms'
        },
        {
            name: 'Deposit & Withdrawal',
            status: 'operational',
            latency: '180ms'
        },
        {
            name: 'API Services',
            status: 'operational',
            latency: '65ms'
        }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'operational': return 'bg-green-500';
            case 'degraded': return 'bg-yellow-500';
            case 'down': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };
</script>

<div class="max-w-4xl mx-auto px-4 py-12" in:fade>
    <div class="flex items-center justify-between mb-8">
        <h1 class="text-4xl font-bold text-gray-900">System Status</h1>
        <div class="flex items-center gap-2">
            <div class="w-3 h-3 bg-green-500 rounded-full"></div>
            <span class="text-green-700 font-medium">All Systems Operational</span>
        </div>
    </div>

    <div class="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
        <div class="divide-y divide-gray-200">
            {#each systems as system}
                <div class="p-6">
                    <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center gap-3">
                            <div class="w-2.5 h-2.5 rounded-full {getStatusColor(system.status)}"></div>
                            <h3 class="font-medium text-gray-900">{system.name}</h3>
                        </div>
                        <div class="text-sm text-gray-500">
                            Latency: {system.latency}
                        </div>
                    </div>
                    <div class="text-sm text-gray-600">
                        {system.status.charAt(0).toUpperCase() + system.status.slice(1)}
                    </div>
                </div>
            {/each}
        </div>
    </div>

    <div class="bg-blue-50 rounded-xl p-6">
        <h2 class="text-lg font-semibold mb-2">Need Help?</h2>
        <p class="text-gray-600 mb-4">
            If you're experiencing any issues, please contact our support team.
        </p>
        <a 
            href="/contact" 
            class="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
        >
            Contact Support
            <svg class="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
        </a>
    </div>
</div> 