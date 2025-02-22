<script lang="ts">
    import { onMount } from 'svelte';
    import { slide, fade, fly } from 'svelte/transition';
    import { session } from '$lib/stores/session';
    import { PUBLIC_API_URL } from '$env/static/public';
    import { notifications } from '$lib/stores/notifications';
    
    console.log('Wallets page mounted');

    // Initialize balances from session user data
    $: totalBalance = {
        usdt: $session.user?.wallet?.totalBalance?.USDT || 0,
        usd: $session.user?.wallet?.totalBalance?.USDT || 0.00, // USDT is 1:1 with USD
        change: '+0.00%'
    };

    $: assetBalance = {
        usdt: $session.user?.wallet?.assetBalance?.USDT || 0,
        usd: $session.user?.wallet?.assetBalance?.USDT || 0.00,
        change: '+0.00%'
    };

    $: exchangeBalance = {
        usdt: $session.user?.wallet?.exchangeBalance?.USDT || 0,
        usd: $session.user?.wallet?.exchangeBalance?.USDT || 0.00,
        change: '+0.00%'
    };

    let showZeroBalances = true;
    let isLoading = true;

    // Add these new variables
    let showWithdrawModal = false;
    let selectedCrypto = {
        symbol: 'USDT',
        name: 'Tether',
        icon: 'https://dynamic-assets.coinbase.com/41f6a93a3a222078c939115fc304a67c384886b7a9e6c15dcbfa6519dc45f6bb4a586e9c48535d099efa596dbf8a9dd72b05815bcd32ac650c50abb5391a5bd0/asset_icons/1f8489bb280fb0a0fd643c1161312ba49655040e9aaaced5f9ad3eeaf868eadc.png'
    };
    let withdrawAddress = '';
    let withdrawAmount = '';

    let showDepositModal = false;
    let selectedNetwork = 'BTC';

    // Add this new interface and data
    interface Cryptocurrency {
        symbol: string;
        name: string;
        icon: string;
    }

    const cryptocurrencies: Cryptocurrency[] = [
        {
            symbol: 'USDT',
            name: 'Tether',
            icon: 'https://dynamic-assets.coinbase.com/41f6a93a3a222078c939115fc304a67c384886b7a9e6c15dcbfa6519dc45f6bb4a586e9c48535d099efa596dbf8a9dd72b05815bcd32ac650c50abb5391a5bd0/asset_icons/1f8489bb280fb0a0fd643c1161312ba49655040e9aaaced5f9ad3eeaf868eadc.png'
        }
    ];

    const popularCryptos = [
        {
            symbol: 'BTC',
            name: 'Bitcoin',
            icon: '...'
        },
        {
            symbol: 'ETH',
            name: 'Ethereum',
            icon: '...'
        },
        {
            symbol: 'USDT',
            name: 'Tether',
            icon: '...'
        },
        {
            symbol: 'BNB',
            name: 'Binance Coin',
            icon: '...'
        },
        {
            symbol: 'LTC',
            name: 'Litecoin',
            icon: '...'
        }
    ];

    let showCryptoDropdown = false;

    // Add click outside handler
    let dropdownRef: HTMLDivElement;
    
    function handleClickOutside(event: MouseEvent) {
        if (dropdownRef && !dropdownRef.contains(event.target as Node)) {
            showCryptoDropdown = false;
        }
    }

    function selectCrypto(crypto: Cryptocurrency) {
        selectedCrypto = crypto;
        showCryptoDropdown = false;
    }

    function openWithdrawModal() {
        showWithdrawModal = true;
    }

    function closeWithdrawModal() {
        showWithdrawModal = false;
        withdrawAddress = '';
        withdrawAmount = '';
    }

    async function handleWithdraw() {
        if (!withdrawAmount || !withdrawAddress) {
            notifications.error('Please fill in all fields');
            return;
        }

        try {
            const response = await fetch(`${PUBLIC_API_URL}/api/withdrawal/request`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${$session.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    amount: Number(withdrawAmount),
                    currency: 'USDT',
                    withdrawalAddress: withdrawAddress
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to process withdrawal');
            }

            notifications.success('Withdrawal request submitted successfully');
            closeWithdrawModal();
            await refreshWalletData();
            await fetchWithdrawals();
        } catch (error) {
            console.error('Withdrawal error:', error);
            notifications.error(error.message || 'Failed to process withdrawal');
        }
    }

    function openDepositModal() {
        showDepositModal = true;
    }

    function closeDepositModal() {
        showDepositModal = false;
        depositMethod = 'manual';
        depositAmount = null;
        selectedPaymentMethod = 'BTC';
    }

    // Add these variables
    let depositAddress = 'bc1qndtrpfh7da2qfwg6zgef0zcqt...';
    let copySuccess = false;
    let qrCode = ''; // You'll need to generate this based on the address

    // Add this function for copy functionality
    async function copyToClipboard(text: string) {
        try {
            await navigator.clipboard.writeText(text);
            copySuccess = true;
            setTimeout(() => copySuccess = false, 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    }

    // Add network detection
    $: networkOptions = {
        USDT: ['TRC20', 'ERC20', 'BEP20']
    };

    $: availableNetworks = networkOptions[selectedCrypto.symbol] || ['BTC'];
    $: selectedNetwork = availableNetworks[0];

    // Update selected network when crypto changes
    $: {
        if (selectedCrypto) {
            selectedNetwork = availableNetworks[0];
        }
    }

    // Add this function to refresh wallet data
    async function refreshWalletData() {
        try {
            const response = await fetch(`${PUBLIC_API_URL}/api/user/wallet`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                session.updateWallet(data.wallet);
            }
        } catch (error) {
            console.error('Failed to refresh wallet data:', error);
        }
    }

    // Add these near the top of your script section with other variables
    let depositMethod: 'manual' | 'auto' = 'manual';
    let depositAmount: number | null = null;
    let selectedPaymentMethod = 'BTC';

    // Add this function with your other handler functions
    async function handleAutoDeposit() {
        if (!depositAmount || !selectedPaymentMethod) return;
        
        try {
            const response = await fetch(`${PUBLIC_API_URL}/api/payments/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    amount: depositAmount,
                    currency: 'USD',
                    paymentMethod: selectedPaymentMethod
                })
            });

            if (response.ok) {
                const { paymentUrl } = await response.json();
                // Redirect to payment page
                window.location.href = paymentUrl;
            } else {
                notifications.error('Failed to create payment session');
            }
        } catch (error) {
            console.error('Payment error:', error);
            notifications.error('Failed to process payment');
        }
    }

    // Add these interfaces at the top of your file
    interface Deposit {
        id: string;
        amount: number;
        currency: string;
        status: string;
        createdAt: string;
        txHash?: string;
    }

    interface Withdrawal {
        id: string;
        amount: number;
        currency: string;
        status: string;
        withdrawalAddress: string;
        createdAt: string;
        txHash?: string;
    }

    // Add these state variables
    let deposits: Deposit[] = [];
    let withdrawals: Withdrawal[] = [];
    let isLoadingDeposits = false;
    let isLoadingWithdrawals = false;

    // Add these fetch functions
    async function fetchDeposits() {
        try {
            isLoadingDeposits = true;
            const response = await fetch(`${PUBLIC_API_URL}/api/deposit/my-deposits`, {
                headers: {
                    'Authorization': `Bearer ${$session.token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch deposits');
            }

            const data = await response.json();
            deposits = data;
        } catch (error: any) {
            console.error('Error fetching deposits:', error);
            notifications.error(error.message || 'Failed to load deposits');
        } finally {
            isLoadingDeposits = false;
        }
    }

    async function handleManualDeposit() {
        if (!depositAmount || depositAmount < 50) {
            notifications.error('Minimum deposit amount is 50 USDT');
            return;
        }
        
        try {
            const response = await fetch(`${PUBLIC_API_URL}/api/deposit/manual`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${$session.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    amount: Number(depositAmount),
                    currency: 'USDT'
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to submit deposit');
            }

            notifications.success('Deposit request submitted successfully');
            closeDepositModal();
            await refreshWalletData();
            await fetchDeposits();
        } catch (error) {
            console.error('Deposit error:', error);
            notifications.error(error.message || 'Failed to process deposit');
        }
    }

    // Add this function to fetch withdrawals
    async function fetchWithdrawals() {
        try {
            isLoadingWithdrawals = true;
            const response = await fetch(`${PUBLIC_API_URL}/api/withdrawal/my-withdrawals`, {
                headers: {
                    'Authorization': `Bearer ${$session.token}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch withdrawals');
            withdrawals = await response.json();
        } catch (error) {
            console.error('Error fetching withdrawals:', error);
        } finally {
            isLoadingWithdrawals = false;
        }
    }

    onMount(async () => {
        try {
            // Fetch both deposits and withdrawals when component mounts
            await Promise.all([
                fetchDeposits(),
                fetchWithdrawals()
            ]);
        } catch (error: any) {
            console.error('Error loading transaction history:', error);
        }
    });

    // Add this constant at the top with your other constants
    const USDT_ADDRESS = 'TDfbHnvSuRe9YZdDB2FWZqsLTWD19XfZ8q';

    // First, add the constant for the deposit address at the top with your other constants
    const USDT_DEPOSIT_ADDRESS = 'TDfbHnvSuRe9YZdDB2FWZqsLTWD19XfZ8q';
</script>

{#if showWithdrawModal}
    <div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-xl w-full max-w-[420px] shadow-xl" 
             in:fade={{ duration: 150 }}
             out:fade={{ duration: 100 }}>
            <!-- Header -->
            <div class="flex items-center justify-between p-4 border-b border-gray-100">
                <div class="flex items-center gap-3">
                    <img src={selectedCrypto.icon} alt={selectedCrypto.symbol} class="w-8 h-8">
                    <h2 class="text-xl font-semibold text-gray-900">Withdraw {selectedCrypto.symbol}</h2>
                </div>
                <button 
                    class="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
                    on:click={closeWithdrawModal}
                >
                    <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <!-- Content -->
            <div class="p-4 space-y-4">
                <!-- Crypto Selector -->
                <div class="relative" bind:this={dropdownRef}>
                    <button 
                        type="button"
                        class="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                        on:click|stopPropagation={() => showCryptoDropdown = !showCryptoDropdown}
                    >
                        <img src={selectedCrypto.icon} alt={selectedCrypto.symbol} class="w-10 h-10">
                        <div class="flex-1 text-left">
                            <div class="text-lg font-medium">{selectedCrypto.symbol}</div>
                            <div class="text-sm text-gray-500">{selectedCrypto.name}</div>
                        </div>
                        <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {#if showCryptoDropdown}
                        <div 
                            class="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg"
                            transition:slide={{ duration: 150 }}
                        >
                            <div class="p-2">
                                <div class="text-xs font-medium text-gray-500 px-3 py-2">Popular Coins</div>
                                <div class="grid grid-cols-1 gap-1">
                                    {#each ['BTC', 'ETH', 'USDT', 'BNB', 'LTC'] as symbol}
                                        {@const crypto = cryptocurrencies.find(c => c.symbol === symbol)}
                                        {#if crypto}
                                            <button
                                                type="button"
                                                class="w-full flex items-center px-3 py-2.5 hover:bg-gray-50 rounded-lg transition-colors"
                                                class:bg-blue-50={selectedCrypto.symbol === crypto.symbol}
                                                on:click={() => selectCrypto(crypto)}
                                            >
                                                <img src={crypto.icon} alt={crypto.symbol} class="w-8 h-8 mr-3">
                                                <div>
                                                    <div class="font-medium">{crypto.symbol}</div>
                                                    <div class="text-sm text-gray-500">{crypto.name}</div>
                                                </div>
                                                {#if selectedCrypto.symbol === crypto.symbol}
                                                    <svg class="w-5 h-5 ml-auto text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                {/if}
                                            </button>
                                        {/if}
                                    {/each}
                                </div>
                            </div>
                        </div>
                    {/if}
                </div>

                <!-- Network Selection -->
                <div class="space-y-2">
                    <div class="text-sm font-medium text-gray-700">Choose network</div>
                    <div class="flex flex-wrap gap-2">
                        {#each availableNetworks as network}
                            <button 
                                class="px-3 py-2 rounded-lg text-sm font-medium transition-colors
                                       {selectedNetwork === network ? 
                                       'bg-blue-50 text-blue-600 ring-1 ring-blue-600/20' : 
                                       'bg-gray-50 text-gray-600 hover:bg-gray-100'}"
                                on:click={() => selectedNetwork = network}
                            >
                                <div class="flex items-center gap-2">
                                    {#if network === 'TRC20'}
                                        <span class="text-[#FF060A]">●</span>
                                    {:else if network === 'ERC20'}
                                        <span class="text-[#627EEA]">●</span>
                                    {:else if network === 'BEP20'}
                                        <span class="text-[#F3BA2F]">●</span>
                                    {:else}
                                        <span class="text-gray-400">●</span>
                                    {/if}
                                    {network}
                                </div>
                            </button>
                        {/each}
                    </div>
                </div>

                <!-- Balance -->
                <div class="bg-gray-50 rounded-lg p-3 space-y-0.5">
                    <div class="text-xs font-medium text-gray-500">Available Balance</div>
                    <div class="text-lg font-semibold">0 {selectedCrypto.symbol}</div>
                    <div class="text-xs text-gray-500">≈ $0.00</div>
                </div>

                <!-- Address Input -->
                <div class="space-y-2">
                    <div class="flex items-center justify-between">
                        <div class="text-sm font-medium text-gray-700">Withdrawal Address</div>
                        <div class="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-500">
                            Network: {selectedNetwork}
                        </div>
                    </div>
                    <input 
                        type="text"
                        bind:value={withdrawAddress}
                        placeholder="Enter withdrawal address"
                        class="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono
                               focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                    >
                </div>

                <!-- Amount Input -->
                <div class="space-y-2">
                    <label class="text-sm font-medium text-gray-700">Amount</label>
                    <div class="relative">
                        <input 
                            type="text"
                            bind:value={withdrawAmount}
                            placeholder="0.00"
                            class="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm
                                   focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                        >
                        <button 
                            class="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-sm text-blue-600 
                                   hover:bg-blue-50 rounded-lg transition-colors"
                        >
                            Max
                        </button>
                    </div>
                </div>

                <!-- Fee Info -->
                <div class="flex items-center justify-between text-sm p-3 bg-gray-50 rounded-lg">
                    <span class="text-gray-500">Network Fee</span>
                    <span class="font-medium">0.00011 {selectedCrypto.symbol}</span>
                </div>

                <!-- Submit Button -->
                <button 
                    class="w-full py-3 bg-blue-600 text-white rounded-lg font-medium
                           hover:bg-blue-700 transition-colors"
                    on:click={handleWithdraw}
                >
                    Withdraw {selectedCrypto.symbol}
                </button>

                <!-- Withdrawal Info -->
                <div class="text-xs text-gray-500 text-center">
                    Daily withdrawal limit: $20,000.00
                </div>
            </div>
        </div>
    </div>
{/if}

{#if showDepositModal}
    <div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-xl w-full max-w-[380px] shadow-xl" 
             in:fade={{ duration: 150 }}
             out:fade={{ duration: 100 }}>
            <!-- Header -->
            <div class="flex items-center justify-between p-4 border-b border-gray-100">
                <h2 class="text-xl font-semibold text-gray-900">Deposit Crypto</h2>
                <button 
                    class="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
                    on:click={closeDepositModal}
                >
                    <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <!-- Content -->
            <div class="p-4 space-y-4">
                <!-- Crypto Selector -->
                <div class="relative" bind:this={dropdownRef}>
                    <button 
                        type="button"
                        class="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                        on:click|stopPropagation={() => showCryptoDropdown = !showCryptoDropdown}
                    >
                        <img src={selectedCrypto.icon} alt={selectedCrypto.symbol} class="w-10 h-10">
                        <div class="flex-1 text-left">
                            <div class="text-lg font-medium">{selectedCrypto.symbol}</div>
                            <div class="text-sm text-gray-500">{selectedCrypto.name}</div>
                        </div>
                        <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {#if showCryptoDropdown}
                        <div 
                            class="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg"
                            transition:slide={{ duration: 150 }}
                        >
                            <div class="p-2">
                                <div class="text-xs font-medium text-gray-500 px-3 py-2">Popular Coins</div>
                                <div class="grid grid-cols-1 gap-1">
                                    {#each ['BTC', 'ETH', 'USDT', 'BNB', 'LTC'] as symbol}
                                        {@const crypto = cryptocurrencies.find(c => c.symbol === symbol)}
                                        {#if crypto}
                                            <button
                                                type="button"
                                                class="w-full flex items-center px-3 py-2.5 hover:bg-gray-50 rounded-lg transition-colors"
                                                class:bg-blue-50={selectedCrypto.symbol === crypto.symbol}
                                                on:click={() => selectCrypto(crypto)}
                                            >
                                                <img src={crypto.icon} alt={crypto.symbol} class="w-8 h-8 mr-3">
                                                <div>
                                                    <div class="font-medium">{crypto.symbol}</div>
                                                    <div class="text-sm text-gray-500">{crypto.name}</div>
                                                </div>
                                                {#if selectedCrypto.symbol === crypto.symbol}
                                                    <svg class="w-5 h-5 ml-auto text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                {/if}
                                            </button>
                                        {/if}
                                    {/each}
                                </div>
                            </div>
                        </div>
                    {/if}
                </div>

                <!-- Deposit Method Selector -->
                <div class="flex gap-2">
                    <button 
                        class="flex-1 p-4 rounded-lg border-2 transition-all duration-200 text-left
                               {depositMethod === 'manual' ? 
                               'border-blue-600 bg-blue-50' : 
                               'border-gray-200 hover:border-blue-200'}"
                        on:click={() => depositMethod = 'manual'}
                    >
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                <svg class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l4-4m0 0l4 4m-4-4v12" />
                                </svg>
                            </div>
                            <div>
                                <div class="font-medium">Manual Deposit</div>
                                <div class="text-sm text-gray-500">Get deposit address</div>
                            </div>
                        </div>
                    </button>

                    <button 
                        class="flex-1 p-4 rounded-lg border-2 transition-all duration-200 text-left
                               {depositMethod === 'auto' ? 
                               'border-blue-600 bg-blue-50' : 
                               'border-gray-200 hover:border-blue-200'}"
                        on:click={() => depositMethod = 'auto'}
                    >
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                <svg class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                          d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <div>
                                <div class="font-medium">Auto Deposit</div>
                                <div class="text-sm text-gray-500">Pay with crypto</div>
                            </div>
                        </div>
                    </button>
                </div>

                {#if depositMethod === 'auto'}
                    <!-- Auto Deposit Form -->
                    <div class="space-y-4">
                        <div class="space-y-2">
                            <label class="text-sm font-medium text-gray-700">Amount to deposit (USD)</label>
                            <div class="relative">
                                <input 
                                    type="number"
                                    bind:value={depositAmount}
                                    placeholder="Enter amount"
                                    class="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm
                                           focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                                />
                                <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                    <button 
                                        class="px-2 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                                        on:click={() => depositAmount = 100}
                                    >
                                        $100
                                    </button>
                                    <button 
                                        class="px-2 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                                        on:click={() => depositAmount = 500}
                                    >
                                        $500
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Payment Method Selection -->
                        <div class="space-y-2">
                            <label class="text-sm font-medium text-gray-700">Select payment method</label>
                            <div class="grid grid-cols-2 gap-2">
                                {#each ['BTC', 'ETH', 'USDT', 'USDC'] as method}
                                    {@const crypto = cryptocurrencies.find(c => c.symbol === method)}
                                    {#if crypto}
                                        <button
                                            class="p-3 rounded-lg border-2 transition-all duration-200
                                                   {selectedPaymentMethod === crypto.symbol ? 
                                                   'border-blue-600 bg-blue-50' : 
                                                   'border-gray-200 hover:border-blue-200'}"
                                            on:click={() => selectedPaymentMethod = crypto.symbol}
                                        >
                                            <div class="flex items-center gap-2">
                                                <img src={crypto.icon} alt={crypto.symbol} class="w-6 h-6">
                                                <span class="font-medium">{crypto.symbol}</span>
                                            </div>
                                        </button>
                                    {/if}
                                {/each}
                            </div>
                        </div>

                        <!-- Proceed Button -->
                        <button 
                            class="w-full py-3 bg-blue-600 text-white rounded-lg font-medium
                                   hover:bg-blue-700 transition-colors disabled:opacity-50"
                            disabled={!depositAmount || !selectedPaymentMethod}
                            on:click={handleAutoDeposit}
                        >
                            Continue to Payment
                        </button>

                        <div class="text-xs text-gray-500 text-center">
                            Minimum deposit: $50.00
                        </div>
                    </div>
                {:else}
                    <!-- Manual Deposit UI -->
                    <div class="space-y-3">
                        <!-- Amount Input -->
                        <div class="space-y-2">
                            <label class="text-sm font-medium text-gray-700">Amount to deposit</label>
                            <div class="relative">
                                <input 
                                    type="number"
                                    bind:value={depositAmount}
                                    placeholder="0.00"
                                    class="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm
                                           focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                                />
                                <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                    <button 
                                        class="px-2 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                                        on:click={() => depositAmount = 100}
                                    >
                                        $100
                                    </button>
                                    <button 
                                        class="px-2 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                                        on:click={() => depositAmount = 500}
                                    >
                                        $500
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Network Selection -->
                        <div class="flex items-center justify-between">
                            <div class="text-sm font-medium text-gray-700">Deposit Address</div>
                            <div class="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-500">
                                Network: {selectedNetwork}
                            </div>
                        </div>

                        <!-- Warning Message -->
                        <div class="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                            <svg class="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p class="text-xs text-blue-700 leading-relaxed">
                                Only send <span class="font-medium">{selectedCrypto.symbol}</span> on <span class="font-medium">{selectedNetwork}</span> network to this address. Sending any other asset may result in permanent loss.
                            </p>
                        </div>

                        <!-- Address Box -->
                        <div class="bg-white rounded-lg border border-gray-200 p-3">
                            <div class="flex items-center gap-3">
                                <div class="flex-1 font-mono text-sm bg-gray-50 p-3 rounded-lg break-all">
                                    {USDT_ADDRESS}
                                </div>
                                <button 
                                    class="p-2 hover:bg-gray-100 rounded-lg transition-colors relative group"
                                    on:click={() => copyToClipboard(USDT_ADDRESS)}
                                >
                                    {#if copySuccess}
                                        <div 
                                            class="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg"
                                            transition:fade={{ duration: 100 }}
                                        >
                                            <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                                            Copied!
                                        </div>
                                    {/if}
                                    <svg 
                                        class="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-colors" 
                                        fill="none" 
                                        viewBox="0 0 24 24" 
                                        stroke="currentColor"
                                    >
                                        <path 
                                            stroke-linecap="round" 
                                            stroke-linejoin="round" 
                                            stroke-width="2" 
                                            d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-2M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" 
                                        />
                                    </svg>
                                </button>
                            </div>
                            <div class="mt-2 flex items-center justify-between text-xs text-gray-500">
                                <span>Minimum deposit: 0.0001 {selectedCrypto.symbol}</span>
                                <span>Processing time: ~10 minutes</span>
                            </div>
                        </div>

                        <!-- QR Code -->
                        <div class="flex flex-col items-center gap-2 py-2">
                            <div class="w-32 h-32 bg-white border border-gray-200 rounded-lg p-3">
                                <img 
                                    src="/images/QRcode/usdt.jpg" 
                                    alt="USDT Deposit QR Code"
                                    class="w-full h-full object-contain"
                                />
                            </div>
                            <div class="text-xs text-gray-500">
                                Scan QR code to copy address
                            </div>
                        </div>

                        <!-- Submit Button -->
                        <button 
                            class="w-full py-3 bg-blue-600 text-white rounded-lg font-medium
                                   hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!depositAmount || depositAmount < 50}
                            on:click={handleManualDeposit}
                        >
                            Submit Deposit
                        </button>

                        <div class="text-xs text-gray-500 text-center">
                            Minimum deposit: $50.00
                        </div>
                    </div>
                {/if}
            </div>
        </div>
    </div>
{/if}

<div class="max-w-7xl mx-auto p-8 space-y-8">
    <!-- Header Section -->
    <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-gray-900">Wallet Overview</h1>
        <div class="flex items-center gap-2">
            <button class="btn-secondary">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
            </button>
            <div class="relative">
                <button class="btn-secondary" on:click={openDepositModal}>
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l4-4m0 0l4 4m-4-4v12" />
                    </svg>
                </button>
            </div>
        </div>
    </div>

    <!-- Total Balance Card -->
    <div class="balance-card">
        <div class="flex items-start justify-between">
            <div>
                <h2 class="text-xl font-semibold text-gray-800 mb-4">Total Balance</h2>
                <div class="flex items-baseline gap-2">
                    <span class="text-4xl font-bold tracking-tight">{totalBalance.usdt}</span>
                    <div class="flex items-center gap-2">
                        <span class="px-3 py-1 bg-[#26A17B] text-white rounded-full text-sm font-medium">USDT</span>
                        <span class="text-green-500 text-sm font-medium">{totalBalance.change}</span>
                    </div>
                </div>
                <div class="text-lg text-gray-500 mt-1">{totalBalance.usd.toFixed(2)} USD</div>
            </div>
            <div class="flex gap-3">
                <button class="btn-primary" on:click={openWithdrawModal}>
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Withdraw
                </button>
                <button class="btn-secondary" on:click={openDepositModal}>
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l4-4m0 0l4 4m-4-4v12" />
                    </svg>
                    Deposit
                </button>
            </div>
        </div>
    </div>

    <!-- Balance Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Asset Balance Card -->
        <div class="balance-card hover:scale-[1.02] transition-transform">
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-[#3772FF]/10 flex items-center justify-center">
                    <svg class="w-6 h-6 text-[#3772FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div class="flex-1">
                    <div class="flex items-center justify-between">
                        <h3 class="text-lg font-medium text-gray-800">Asset Balance</h3>
                        <span class="text-green-500 text-sm font-medium">{assetBalance.change}</span>
                    </div>
                    <div class="flex items-center gap-2 mt-1">
                        <span class="font-semibold">{assetBalance.usdt} USDT</span>
                        <span class="text-gray-500">{assetBalance.usd.toFixed(2)} USD</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Exchange Balance Card -->
        <div class="balance-card hover:scale-[1.02] transition-transform">
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-[#3772FF]/10 flex items-center justify-center">
                    <svg class="w-6 h-6 text-[#3772FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                              d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div class="flex-1">
                    <div class="flex items-center justify-between">
                        <h3 class="text-lg font-medium text-gray-800">Exchange Balance</h3>
                        <span class="text-green-500 text-sm font-medium">{exchangeBalance.change}</span>
                    </div>
                    <div class="flex items-center gap-2 mt-1">
                        <span class="font-semibold">{exchangeBalance.usdt} USDT</span>
                        <span class="text-gray-500">{exchangeBalance.usd.toFixed(2)} USD</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Add the deposits table after the Asset Balances table -->
    <!-- Recent Deposits -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div class="p-6 border-b border-gray-100">
            <div class="flex items-center justify-between">
                <h2 class="text-xl font-semibold text-gray-800">Recent Deposits</h2>
                <button class="btn-secondary" on:click={fetchDeposits}>
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                </button>
            </div>
        </div>

        <table class="w-full">
            <thead>
                <tr class="border-b border-gray-100">
                    <th class="text-left py-4 px-6 text-sm font-medium text-gray-500">DATE</th>
                    <th class="text-left py-4 px-6 text-sm font-medium text-gray-500">AMOUNT</th>
                    <th class="text-left py-4 px-6 text-sm font-medium text-gray-500">CURRENCY</th>
                    <th class="text-left py-4 px-6 text-sm font-medium text-gray-500">STATUS</th>
                    <th class="text-left py-4 px-6 text-sm font-medium text-gray-500">ADDRESS</th>
                </tr>
            </thead>
            <tbody>
                {#if isLoadingDeposits}
                    <tr>
                        <td colspan="5" class="py-8 text-center text-gray-500">
                            Loading deposits...
                        </td>
                    </tr>
                {:else if deposits.length === 0}
                    <tr>
                        <td colspan="5" class="py-16">
                            <div class="flex flex-col items-center justify-center text-gray-400">
                                <svg class="w-16 h-16 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                                <span class="text-lg">No deposits yet</span>
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
                                <span class="px-2 py-1 text-sm rounded-full
                                    {deposit.status === 'approved' ? 'bg-green-100 text-green-700' : 
                                     deposit.status === 'rejected' ? 'bg-red-100 text-red-700' : 
                                     'bg-yellow-100 text-yellow-700'}">
                                    {deposit.status}
                                </span>
                            </td>
                            <td class="py-4 px-6">
                                <div class="flex items-center gap-2">
                                    <span class="font-mono text-sm truncate max-w-[120px]">
                                        {USDT_DEPOSIT_ADDRESS}
                                    </span>
                                    <button 
                                        class="p-1 hover:bg-gray-100 rounded"
                                        on:click={() => copyToClipboard(USDT_DEPOSIT_ADDRESS)}
                                    >
                                        <svg class="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                                  d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-2M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    {/each}
                {/if}
            </tbody>
        </table>
    </div>

    <!-- Add the withdrawals table after the deposits table -->
    <!-- Recent Withdrawals -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 mt-6">
        <div class="p-6 border-b border-gray-100">
            <div class="flex items-center justify-between">
                <h2 class="text-xl font-semibold text-gray-800">Recent Withdrawals</h2>
                <button class="btn-secondary" on:click={fetchWithdrawals}>
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                </button>
            </div>
        </div>

        <table class="w-full">
            <thead>
                <tr class="border-b border-gray-100">
                    <th class="text-left py-4 px-6 text-sm font-medium text-gray-500">DATE</th>
                    <th class="text-left py-4 px-6 text-sm font-medium text-gray-500">AMOUNT</th>
                    <th class="text-left py-4 px-6 text-sm font-medium text-gray-500">CURRENCY</th>
                    <th class="text-left py-4 px-6 text-sm font-medium text-gray-500">STATUS</th>
                    <th class="text-left py-4 px-6 text-sm font-medium text-gray-500">ADDRESS</th>
                </tr>
            </thead>
            <tbody>
                {#if isLoadingWithdrawals}
                    <tr>
                        <td colspan="5" class="py-8 text-center text-gray-500">
                            Loading withdrawals...
                        </td>
                    </tr>
                {:else if withdrawals.length === 0}
                    <tr>
                        <td colspan="5" class="py-16">
                            <div class="flex flex-col items-center justify-center text-gray-400">
                                <svg class="w-16 h-16 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                                <span class="text-lg">No withdrawals yet</span>
                            </div>
                        </td>
                    </tr>
                {:else}
                    {#each withdrawals as withdrawal}
                        <tr class="hover:bg-gray-50 transition-colors">
                            <td class="py-4 px-6">
                                {new Date(withdrawal.createdAt).toLocaleString()}
                            </td>
                            <td class="py-4 px-6 font-medium">
                                {withdrawal.amount}
                            </td>
                            <td class="py-4 px-6">
                                {withdrawal.currency.toUpperCase()}
                            </td>
                            <td class="py-4 px-6">
                                <span class="px-2 py-1 text-sm rounded-full
                                    {withdrawal.status === 'approved' ? 'bg-green-100 text-green-700' : 
                                     withdrawal.status === 'rejected' ? 'bg-red-100 text-red-700' : 
                                     'bg-yellow-100 text-yellow-700'}">
                                    {withdrawal.status}
                                </span>
                            </td>
                            <td class="py-4 px-6">
                                <div class="flex items-center gap-2">
                                    <span class="font-mono text-sm truncate max-w-[120px]">
                                        {withdrawal.withdrawalAddress}
                                    </span>
                                    <button 
                                        class="p-1 hover:bg-gray-100 rounded"
                                        on:click={() => copyToClipboard(withdrawal.withdrawalAddress)}
                                    >
                                        <svg class="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                                  d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-2M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
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
    .balance-card {
        @apply bg-white rounded-xl p-6 shadow-sm border border-gray-100;
    }

    .btn-primary {
        @apply flex items-center gap-2 px-6 py-2.5 bg-[#3772FF] text-white rounded-lg 
               hover:bg-[#2952cc] transition-all duration-200
               focus:outline-none focus:ring-2 focus:ring-[#3772FF]/20 focus:ring-offset-2;
    }

    .btn-secondary {
        @apply flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg 
               hover:bg-gray-100 transition-all duration-200
               focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2;
    }

    .checkbox {
        @apply h-4 w-4 rounded border-gray-300 text-[#3772FF] 
               focus:ring-[#3772FF] transition-colors duration-200;
    }

    /* Loading skeleton animation */
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: .5; }
    }

    .animate-pulse {
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    /* Hover effects */
    .balance-card {
        @apply transition-all duration-200 hover:shadow-md;
    }

    /* Table styles */
    table {
        @apply w-full border-collapse;
    }

    th {
        @apply text-left py-4 px-6 text-sm font-medium text-gray-500 
               border-b border-gray-100 bg-gray-50;
    }

    td {
        @apply py-4 px-6 text-sm text-gray-700 border-b border-gray-100;
    }

    tr:hover td {
        @apply bg-gray-50;
    }
</style>