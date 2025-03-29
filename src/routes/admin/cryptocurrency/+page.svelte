<script lang="ts">
    import { onMount } from 'svelte';
    import { session } from '$lib/stores/session';
    import { notifications } from '$lib/stores/notifications';
    import { PUBLIC_API_URL } from '$env/static/public';

    interface Cryptocurrency {
        _id: string;
        name: string;
        symbol: string;
        logo: string;
        price: number;
        change24h: number;
        marketCap: number;
        volume24h: number;
        volumeChange24h: number;
        isActive: boolean;
        createdAt: string;
        updatedAt: string;
    }

    let cryptocurrencies: Cryptocurrency[] = [];
    let isLoading = true;
    let showAddModal = false;
    let showEditModal = false;
    let selectedCrypto: Cryptocurrency | null = null;

    // Form data
    let formData = {
        name: '',
        symbol: '',
        logo: null as File | null,
        price: '',
        change24h: '',
        marketCap: '',
        volume24h: '',
        volumeChange24h: ''
    };

    // Reset form
    function resetForm() {
        formData = {
            name: '',
            symbol: '',
            logo: null,
            price: '',
            change24h: '',
            marketCap: '',
            volume24h: '',
            volumeChange24h: ''
        };
    }

    // Fetch all cryptocurrencies
    async function fetchCryptocurrencies() {
        try {
            isLoading = true;
            const response = await fetch(`${PUBLIC_API_URL}/api/cryptocurrencies`);
            if (!response.ok) throw new Error('Failed to fetch cryptocurrencies');
            cryptocurrencies = await response.json();
        } catch (error) {
            notifications.error('Failed to load cryptocurrencies');
            console.error('Error:', error);
        } finally {
            isLoading = false;
        }
    }

    // Handle file input
    function handleFileInput(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            formData.logo = input.files[0];
        }
    }

    // Add cryptocurrency
    async function handleAdd() {
        try {
            const form = new FormData();
            form.append('name', formData.name);
            form.append('symbol', formData.symbol);
            if (formData.logo) form.append('logo', formData.logo);
            form.append('price', formData.price);
            form.append('change24h', formData.change24h);
            form.append('marketCap', formData.marketCap);
            form.append('volume24h', formData.volume24h);
            form.append('volumeChange24h', formData.volumeChange24h);

            const response = await fetch(`${PUBLIC_API_URL}/api/cryptocurrencies/add`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${$session.token}`
                },
                body: form
            });

            if (!response.ok) throw new Error('Failed to add cryptocurrency');
            
            const result = await response.json();
            notifications.success(result.message);
            showAddModal = false;
            resetForm();
            await fetchCryptocurrencies();
        } catch (error) {
            notifications.error('Failed to add cryptocurrency');
            console.error('Error:', error);
        }
    }

    // Update cryptocurrency
    async function handleUpdate() {
        if (!selectedCrypto?._id) return;

        try {
            const form = new FormData();
            form.append('price', formData.price);
            form.append('change24h', formData.change24h);

            const response = await fetch(`${PUBLIC_API_URL}/api/cryptocurrencies/${selectedCrypto._id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${$session.token}`
                },
                body: form
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to update cryptocurrency');
            }
            
            const result = await response.json();
            notifications.success(result.message);
            showEditModal = false;
            selectedCrypto = null;
            resetForm();
            await fetchCryptocurrencies();
        } catch (error: any) {
            notifications.error(error.message || 'Failed to update cryptocurrency');
            console.error('Update error:', error);
        }
    }

    // Delete cryptocurrency
    async function handleDelete(id: string) {
        if (!id) {
            notifications.error('Invalid cryptocurrency ID');
            return;
        }

        if (!confirm('Are you sure you want to delete this cryptocurrency?')) return;

        try {
            const response = await fetch(`${PUBLIC_API_URL}/api/cryptocurrencies/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${$session.token}`
                }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to delete cryptocurrency');
            }
            
            notifications.success('Cryptocurrency deleted successfully');
            await fetchCryptocurrencies();
        } catch (error: any) {
            notifications.error(error.message || 'Failed to delete cryptocurrency');
            console.error('Delete error:', error);
        }
    }

    // Edit cryptocurrency
    function editCrypto(crypto: Cryptocurrency) {
        selectedCrypto = crypto;
        formData = {
            name: crypto.name,
            symbol: crypto.symbol,
            logo: null,
            price: crypto.price.toString(),
            change24h: crypto.change24h.toString(),
            marketCap: crypto.marketCap.toString(),
            volume24h: crypto.volume24h.toString(),
            volumeChange24h: crypto.volumeChange24h.toString()
        };
        showEditModal = true;
    }

    onMount(fetchCryptocurrencies);
</script>

<div class="max-w-7xl mx-auto p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Cryptocurrency Management</h1>
        <button
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            on:click={() => showAddModal = true}
        >
            Add New Cryptocurrency
        </button>
    </div>

    <!-- Cryptocurrency List -->
    {#if isLoading}
        <div class="flex justify-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
        </div>
    {:else}
        <div class="bg-white rounded-xl shadow-lg overflow-hidden">
            <table class="w-full">
                <thead>
                    <tr class="bg-gray-50 border-b border-gray-100">
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Logo</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Symbol</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">24h Change</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                    {#each cryptocurrencies as crypto}
                        <tr class="hover:bg-gray-50">
                            <td class="px-6 py-4">
                                <img 
                                    src={`${PUBLIC_API_URL}${crypto.logo}`} 
                                    alt={crypto.name} 
                                    class="w-8 h-8 rounded-full object-cover"
                                    onerror="this.src='/images/default-crypto.png'"
                                />
                            </td>
                            <td class="px-6 py-4">{crypto.name}</td>
                            <td class="px-6 py-4">{crypto.symbol}</td>
                            <td class="px-6 py-4">${crypto.price.toLocaleString()}</td>
                            <td class="px-6 py-4">
                                <span class={crypto.change24h >= 0 ? 'text-green-600' : 'text-red-600'}>
                                    {crypto.change24h}%
                                </span>
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex gap-2">
                                    <button
                                        class="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                                        on:click={() => editCrypto(crypto)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        class="px-3 py-1 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200"
                                        on:click={() => handleDelete(crypto._id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    {/if}
</div>

<!-- Add Modal -->
{#if showAddModal}
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <!-- Header -->
            <div class="flex items-center justify-between mb-6">
                <div>
                    <h2 class="text-xl font-semibold text-gray-900">Add New Cryptocurrency</h2>
                    <p class="text-sm text-gray-500 mt-1">Fill in the cryptocurrency details below</p>
                </div>
                <button
                    class="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    on:click={() => {
                        showAddModal = false;
                        resetForm();
                    }}
                >
                    <svg class="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            
            <form class="space-y-6" on:submit|preventDefault={handleAdd}>
                <!-- Basic Information Section -->
                <div class="bg-gray-50 rounded-lg p-6 space-y-5">
                    <h3 class="text-base font-medium text-gray-900">Basic Information</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="input-group">
                            <label class="input-label">Name</label>
                            <input
                                type="text"
                                bind:value={formData.name}
                                class="form-input"
                                placeholder="e.g. Bitcoin"
                                required
                            />
                        </div>
                        <div class="input-group">
                            <label class="input-label">Symbol</label>
                            <input
                                type="text"
                                bind:value={formData.symbol}
                                class="form-input uppercase"
                                placeholder="e.g. BTC"
                                required
                            />
                        </div>
                    </div>

                    <!-- Logo Upload -->
                    <div class="input-group mt-6">
                        <label class="input-label mb-3">Logo</label>
                        <div class="flex items-center space-x-6">
                            <div class="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-200">
                                {#if formData.logo}
                                    <img 
                                        src={URL.createObjectURL(formData.logo)} 
                                        alt="Preview" 
                                        class="w-full h-full object-cover"
                                    />
                                {:else}
                                    <svg class="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                {/if}
                            </div>
                            <div class="flex-1">
                                <label class="block w-full">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        on:change={handleFileInput}
                                        class="block w-full text-base text-gray-500
                                               file:mr-4 file:py-3 file:px-6
                                               file:rounded-lg file:border-0
                                               file:text-base file:font-medium
                                               file:bg-blue-50 file:text-blue-700
                                               hover:file:bg-blue-100
                                               cursor-pointer"
                                        required
                                    />
                                </label>
                                <p class="text-sm text-gray-500 mt-2">PNG, JPG up to 5MB</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Market Data Section -->
                <div class="bg-gray-50 rounded-lg p-6 space-y-5 mt-6">
                    <h3 class="text-base font-medium text-gray-900">Market Data</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="input-group">
                            <label class="input-label">Price (USD)</label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span class="text-gray-500 text-base">$</span>
                                </div>
                                <input
                                    type="number"
                                    bind:value={formData.price}
                                    step="0.000001"
                                    class="form-input form-input-currency"
                                    placeholder="0.00"
                                    required
                                />
                            </div>
                        </div>
                        <div class="input-group">
                            <label class="input-label">24h Change (%)</label>
                            <div class="relative">
                                <input
                                    type="number"
                                    bind:value={formData.change24h}
                                    step="0.01"
                                    class="form-input form-input-percent"
                                    placeholder="-2.5"
                                    required
                                />
                                <div class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                    <span class="text-gray-500 text-base">%</span>
                                </div>
                            </div>
                        </div>
                        <div class="input-group">
                            <label class="input-label">Market Cap (USD)</label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span class="text-gray-500 text-base">$</span>
                                </div>
                                <input
                                    type="number"
                                    bind:value={formData.marketCap}
                                    class="form-input form-input-currency"
                                    placeholder="1,000,000"
                                    required
                                />
                            </div>
                        </div>
                        <div class="input-group">
                            <label class="input-label">24h Volume (USD)</label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span class="text-gray-500 text-base">$</span>
                                </div>
                                <input
                                    type="number"
                                    bind:value={formData.volume24h}
                                    class="form-input form-input-currency"
                                    placeholder="500,000"
                                    required
                                />
                            </div>
                        </div>
                        <div class="md:col-span-2">
                            <label class="input-label">Volume Change 24h (%)</label>
                            <div class="relative">
                                <input
                                    type="number"
                                    bind:value={formData.volumeChange24h}
                                    step="0.01"
                                    class="form-input form-input-percent"
                                    placeholder="1.5"
                                    required
                                />
                                <div class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                    <span class="text-gray-500 text-base">%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex justify-end gap-4 pt-6 border-t border-gray-100 mt-6">
                    <button
                        type="button"
                        class="px-6 py-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        on:click={() => {
                            showAddModal = false;
                            resetForm();
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        class="px-6 py-3 text-base font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Add Cryptocurrency
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}

<!-- Edit Modal -->
{#if showEditModal}
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
        <div class="bg-white rounded-xl w-full max-w-md p-6">
            <h2 class="text-xl font-semibold mb-4">Edit Cryptocurrency</h2>
            
            <form class="space-y-4" on:submit|preventDefault={handleUpdate}>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Price (USD)</label>
                    <input
                        type="number"
                        bind:value={formData.price}
                        step="0.000001"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700">24h Change (%)</label>
                    <input
                        type="number"
                        bind:value={formData.change24h}
                        step="0.01"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                    />
                </div>

                <div class="flex justify-end gap-3 mt-6">
                    <button
                        type="button"
                        class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                        on:click={() => {
                            showEditModal = false;
                            selectedCrypto = null;
                            resetForm();
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Update Cryptocurrency
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}

<style lang="postcss">
    /* Add these custom input styles */
    :global(.form-input) {
        @apply block w-full px-4 py-3 rounded-lg border border-gray-300 
               text-base shadow-sm transition-colors duration-200
               focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none;
    }

    :global(.form-input-currency) {
        @apply pl-10;
    }

    :global(.form-input-percent) {
        @apply pr-8;
    }

    :global(.input-group) {
        @apply space-y-2;
    }

    :global(.input-label) {
        @apply block text-sm font-medium text-gray-700;
    }
</style>
