<script lang="ts">
    import { onMount } from 'svelte';
    import { slide, fade, fly } from 'svelte/transition';
    import { session } from '$lib/stores/session';
    import { PUBLIC_API_URL } from '$env/static/public';
    import { notifications } from '$lib/stores/notifications';
    import { goto } from '$app/navigation';
    
    console.log('Wallets page mounted');

    // Add these type definitions at the top of the script
    interface WalletBalances {
        [key: string]: number;  // Allow any string key
    }

    interface Cryptocurrency {
        symbol: string;
        name: string;
        icon: string;
    }

    interface Withdrawal {
        _id: string;
        amount: number;
        currency: string;
        withdrawalAddress: string;
        status: string;
        createdAt: string;
        txHash?: string;
    }

    // Initialize balances from session user data
    $: totalBalance = {
        usdt: $session.user?.wallet?.totalBalance?.USDT || 0,
        usd: $session.user?.wallet?.totalBalance?.USDT || 0.00,
        change: '+0.00%'
    } as WalletBalances;

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
    const cryptocurrencies: Cryptocurrency[] = [
        {
            symbol: 'BTC',
            name: 'Bitcoin',
            icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png'
        },
        {
            symbol: 'ETH',
            name: 'Ethereum',
            icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
        },
        {
            symbol: 'BNB',
            name: 'Binance Coin',
            icon: 'https://cryptologos.cc/logos/bnb-bnb-logo.png'
        },
        {
            symbol: 'USDT',
            name: 'Tether',
            icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png'
        },
        {
            symbol: 'TRX',
            name: 'TRON',
            icon: 'https://cryptologos.cc/logos/tron-trx-logo.png'
        },
        {
            symbol: 'USDC',
            name: 'USD Coin',
            icon: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png'
        },
        {
            symbol: 'DOGE',
            name: 'Dogecoin',
            icon: 'https://cryptologos.cc/logos/dogecoin-doge-logo.png'
        }
    ];

    const popularCryptos = ['BTC', 'ETH', 'BNB', 'USDT', 'TRX', 'USDC', 'DOGE'];

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

    // Update the balance computation
    $: availableBalance = {
        USDT: $session.user?.wallet?.totalBalance?.USDT || 0
    } as WalletBalances;

    // Add proper interface for withdrawal request
    interface WithdrawalRequest {
        amount: number;
        currency: "USDT";
        withdrawalAddress: string;
    }

    // Update the handleWithdraw function with corrected balance checking
    async function handleWithdraw() {
        try {
            console.log('💡 Starting withdrawal process:', { withdrawAmount, withdrawAddress });

            const amountNum = Number(withdrawAmount);
            
            // Get current balance
            const totalBalance = $session.user?.wallet?.totalBalance?.USDT || 0;
            
            // Set available balance equal to total balance
            const availableBalance = totalBalance; // This is the key change

            console.log('💰 Balance details:', {
                totalBalance,
                availableBalance,
                requestedAmount: amountNum,
                user: $session.user?.email,
                wallet: $session.user?.wallet
            });

            // Check if user has sufficient balance
            if (amountNum > availableBalance) {
                const errorMsg = `Insufficient available balance. Required: ${amountNum} USDT, Available: ${availableBalance} USDT`;
                console.log('❌ Balance check failed:', {
                    availableBalance,
                    required: amountNum,
                    totalBalance
                });
                notifications.error(errorMsg);
                return;
            }

            // Proceed with withdrawal if balance is sufficient
            const response = await fetch(`${PUBLIC_API_URL}/api/withdrawal/request`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${$session.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    amount: amountNum,
                    currency: 'USDT',
                    withdrawalAddress: withdrawAddress
                })
            });

            const responseData = await response.json();
            console.log('📥 API response:', {
                status: response.status,
                statusText: response.statusText,
                data: responseData,
                balanceAtRequest: availableBalance
            });

            if (!response.ok) {
                if (responseData.error === 'Insufficient balance') {
                    const errorMsg = `Server reports insufficient balance. Required: ${responseData.required} USDT, Server Available: ${responseData.available} USDT, Client Available: ${availableBalance} USDT`;
                    console.log('❌ Balance mismatch detected:', {
                        serverAvailable: responseData.available,
                        clientAvailable: availableBalance,
                        required: responseData.required
                    });
                    console.log('🔔 Showing notification:', errorMsg);
                    notifications.error(errorMsg);
                    
                    // Refresh balance after mismatch
                    await refreshBalance();
                    return;
                }

                const errorMsg = responseData.message || responseData.error || 'Withdrawal request failed';
                console.error('❌ API error:', responseData);
                console.log('🔔 Showing notification:', errorMsg);
                notifications.error(errorMsg);
                return;
            }

            const successMsg = 'Withdrawal request submitted successfully';
            console.log('✅ Withdrawal success:', responseData);
            console.log('🔔 Showing notification:', successMsg);
            notifications.success(successMsg);

            console.log('🧹 Clearing form');
            withdrawAmount = '';
            withdrawAddress = '';
            showWithdrawModal = false;

            console.log('🔄 Refreshing data');
            await Promise.all([
                fetchWithdrawals(),
                refreshBalance()
            ]);

        } catch (error: any) {
            const errorMsg = error.message || 'An unexpected error occurred';
            console.error('❌ Withdrawal error:', {
                message: error.message,
                error: error
            });
            console.log('🔔 Showing notification:', errorMsg);
            notifications.error(errorMsg);
        }
    }

    // Add this helper function to refresh balance
    async function refreshBalance() {
        try {
            // Check session before fetching
            if (!await checkAndClearSession()) return;

            const response = await fetch(`${PUBLIC_API_URL}/api/user/profile`, {
                headers: {
                    'Authorization': `Bearer ${$session.token}`
                }
            });
            
            if (!response.ok) {
                if (response.status === 401) {
                    await checkAndClearSession();
                    return;
                }
            }

            if (response.ok) {
                const userData = await response.json();
                session.updateProfile(userData);
            }
        } catch (error) {
            console.error('Failed to refresh balance:', error);
            await checkAndClearSession();
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

    // Update the copyToClipboard function
    async function copyToClipboard(text: string | undefined) {
        if (!text) {
            notifications.error('Nothing to copy');
            return;
        }
        
        try {
            await navigator.clipboard.writeText(text);
            notifications.success('Copied to clipboard');
        } catch (err) {
            console.error('Failed to copy:', err);
            notifications.error('Failed to copy to clipboard');
        }
    }

    // Add network detection
    $: networkOptions = {
        USDT: ['TRC20', 'ERC20', 'BEP20'],
        BTC: ['BTC'],
        ETH: ['ERC20'],
        BNB: ['BEP20'],
        TRX: ['TRC20'],
        USDC: ['ERC20', 'BEP20'],
        DOGE: ['DOGE']
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
            // Check session before fetching
            if (!await checkAndClearSession()) return;

            const response = await fetch(`${PUBLIC_API_URL}/api/user/wallet`, {
                headers: {
                    'Authorization': `Bearer ${$session.token}`
                }
            });
            
            if (!response.ok) {
                if (response.status === 401) {
                    await checkAndClearSession();
                    return;
                }
            }

            if (response.ok) {
                const data = await response.json();
                session.updateWallet(data.wallet);
            }
        } catch (error) {
            console.error('Failed to refresh wallet data:', error);
            await checkAndClearSession();
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

    // Add these state variables
    let deposits: Deposit[] = [];
    let withdrawals: Withdrawal[] = [];
    let isLoadingDeposits = false;
    let isLoadingWithdrawals = false;

    // Add these fetch functions
    async function fetchDeposits() {
        try {
            // Check session before fetching
            if (!await checkAndClearSession()) return;

            isLoadingDeposits = true;
            const response = await fetch(`${PUBLIC_API_URL}/api/deposit/my-deposits`, {
                headers: {
                    'Authorization': `Bearer ${$session.token}`
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    await checkAndClearSession();
                    return;
                }
                throw new Error('Failed to fetch deposits');
            }

            const data = await response.json();
            deposits = data;
        } catch (error: any) {
            console.error('Error fetching deposits:', error);
            notifications.error(error.message || 'Failed to load deposits');
            await checkAndClearSession();
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
            // Check session before fetching
            if (!await checkAndClearSession()) return;

            isLoadingWithdrawals = true;
            const response = await fetch(`${PUBLIC_API_URL}/api/withdrawal/my-withdrawals`, {
                headers: {
                    'Authorization': `Bearer ${$session.token}`
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    await checkAndClearSession();
                    return;
                }
                throw new Error('Failed to fetch withdrawals');
            }

            withdrawals = await response.json();
        } catch (error) {
            console.error('Error fetching withdrawals:', error);
            await checkAndClearSession();
        } finally {
            isLoadingWithdrawals = false;
        }
    }

    // Add session check to your data fetching functions
    async function checkAndClearSession() {
        // Check if user is logged in
        if (!$session.token || !$session.user) {
            // Clear all session data
            session.clear();
            // Clear localStorage
            localStorage.removeItem('token');
            // Redirect to home page
            goto('/');
            return false;
        }
        return true;
    }

    // Update your onMount function
    onMount(async () => {
        try {
            // First check session
            const isAuthenticated = await checkAndClearSession();
            if (!isAuthenticated) return;

            // Only fetch data if user is authenticated
            await Promise.all([
                fetchDeposits(),
                fetchWithdrawals()
            ]);
        } catch (error: any) {
            console.error('Error loading transaction history:', error);
            // If there's an error, also check session
            await checkAndClearSession();
        }
    });

    // Add this constant at the top with your other constants
    const USDT_ADDRESS = 'TDfbHnvSuRe9YZdDB2FWZqsLTWD19XfZ8q';

    // First, update the constant at the top of the script section where other constants are defined
    const USDT_DEPOSIT_ADDRESS = 'TVAa2JDSo5MboXUkDecxa57pPNYy33876M';

    // Add this new variable for the withdrawal approval modal
    let showApprovalModal = false;
    let networkFee = 0.00011; // Assuming a default network fee
    let isProcessing = false;

    // Add this function to handle the withdrawal approval
    function handleWithdrawalApproval() {
        showApprovalModal = true;
        isProcessing = true;
        handleWithdraw();
    }
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

                <!-- Available Balance -->
                <div class="bg-gray-50 rounded-lg p-4">
                    <div class="flex items-center justify-between">
                        <span class="text-gray-600">Available Balance</span>
                        <div class="flex items-center gap-2">
                            <span class="text-lg font-semibold text-gray-900">
                                {totalBalance[selectedCrypto.symbol.toLowerCase()] ?? 0} {selectedCrypto.symbol}
                            </span>
                            <span class="text-sm text-gray-500">
                                ≈ ${((totalBalance[selectedCrypto.symbol.toLowerCase()] ?? 0) * 1).toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Amount Input -->
                <div class="space-y-4">
                    <div>
                        <label for="withdrawAmount" class="block text-sm font-medium text-gray-700 mb-1">
                            USDT Amount
                        </label>
                        <div class="relative">
                            <input
                                type="number"
                                id="withdrawAmount"
                                bind:value={withdrawAmount}
                                class="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                placeholder="Enter USDT amount"
                                min="1"
                                step="any"
                            />
                            <button 
                                type="button"
                                class="absolute right-3 top-2 text-sm text-blue-600 hover:text-blue-700"
                                on:click={() => {
                                    const maxAmount = $session.user?.wallet?.totalBalance?.USDT || 0;
                                    withdrawAmount = maxAmount.toString();
                                }}
                            >
                                MAX
                            </button>
                        </div>
                        <p class="text-xs text-gray-500 mt-1">
                            Available: {$session.user?.wallet?.totalBalance?.USDT || 0} USDT
                        </p>
                    </div>

                    <!-- TRC20 Address Input -->
                    <div>
                        <label for="withdrawAddress" class="block text-sm font-medium text-gray-700 mb-1">
                            TRC20 Address
                        </label>
                        <input
                            type="text"
                            id="withdrawAddress"
                            bind:value={withdrawAddress}
                            class="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            placeholder="Enter TRC20 address (starts with T)"
                        />
                    </div>

                    <!-- Submit Button -->
                    <button
                        type="button"
                        class="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                        on:click={handleWithdraw}
                        disabled={!withdrawAmount || !withdrawAddress}
                    >
                        Withdrawal
                    </button>
                </div>

                <!-- Withdrawal Info -->
                <div class="text-xs text-gray-500 text-center">
                    Daily withdrawal limit: $20,000.00
                </div>
            </div>
        </div>
    </div>
{/if}

{#if showDepositModal}
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
         transition:fade
         on:click|self={closeDepositModal}>
        <!-- Only adding h-[350px] and overflow-y-auto -->
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-lg h-[700px] overflow-y-auto transform transition-all"
             in:fly="{{ y: 20, duration: 200 }}"
             out:fade>
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
                                    {#each popularCryptos as symbol}
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
                                    {USDT_DEPOSIT_ADDRESS}
                                </div>
                                <button 
                                    class="p-2 hover:bg-gray-100 rounded-lg transition-colors relative group"
                                    on:click={() => copyToClipboard(USDT_DEPOSIT_ADDRESS)}
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
                                    src="/images/QRcode/qrusdt.jpeg" 
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
                            Deposit
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

<!-- Withdrawal Approval Modal -->
{#if showApprovalModal}
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-xl w-full max-w-md shadow-xl" transition:fade>
            <!-- Modal Header -->
            <div class="flex items-center justify-between p-5 border-b border-gray-100">
                <h3 class="text-lg font-semibold text-gray-900">
                    Confirm Withdrawal
                </h3>
                <button 
                    class="text-gray-400 hover:text-gray-500 transition-colors"
                    on:click={() => showApprovalModal = false}
                >
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <!-- Modal Content -->
            <div class="p-5 space-y-5">
                <!-- Withdrawal Details -->
                <div class="space-y-4">
                    <div class="bg-blue-50 rounded-lg p-4">
                        <div class="flex items-center gap-3 text-blue-700">
                            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span class="font-medium">Withdrawal Details</span>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-1">
                            <span class="text-sm text-gray-500">Amount</span>
                            <div class="font-medium text-gray-900">
                                {withdrawAmount} {selectedCrypto.symbol}
                            </div>
                        </div>
                        <div class="space-y-1">
                            <span class="text-sm text-gray-500">Network</span>
                            <div class="font-medium text-gray-900">
                                {selectedNetwork}
                            </div>
                        </div>
                    </div>

                    <div class="space-y-1">
                        <span class="text-sm text-gray-500">Withdrawal Address</span>
                        <div class="font-mono text-sm bg-gray-50 p-3 rounded-lg break-all">
                            {withdrawAddress}
                        </div>
                    </div>

                    <!-- Fee Information -->
                    <div class="border-t border-gray-100 pt-4">
                        <div class="flex justify-between items-center text-sm">
                            <span class="text-gray-500">Network Fee</span>
                            <span class="font-medium text-gray-900">
                                {networkFee} {selectedCrypto.symbol}
                            </span>
                        </div>
                        <div class="flex justify-between items-center text-sm mt-2">
                            <span class="text-gray-500">You will receive</span>
                            <span class="font-medium text-gray-900">
                                {(Number(withdrawAmount) - networkFee).toFixed(8)} {selectedCrypto.symbol}
                            </span>
                        </div>
                    </div>

                    <!-- Warning -->
                    <div class="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
                        <div class="flex gap-3">
                            <svg class="w-5 h-5 text-yellow-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                            </svg>
                            <div class="text-sm text-yellow-700">
                                <p class="font-medium mb-1">Please verify:</p>
                                <ul class="list-disc list-inside space-y-1">
                                    <li>The withdrawal address is correct</li>
                                    <li>You've selected the right network</li>
                                    <li>The amount is correct</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal Footer -->
            <div class="p-5 border-t border-gray-100">
                <div class="flex items-center justify-end gap-3">
                    <button 
                        class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        on:click={() => showApprovalModal = false}
                    >
                        Cancel
                    </button>
                    <button 
                        class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                               transition-colors flex items-center gap-2"
                        on:click={handleWithdraw}
                    >
                        {#if isProcessing}
                            <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Processing...
                        {:else}
                            Confirm Withdrawal
                        {/if}
                    </button>
                </div>
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
        <div class="flex flex-col">
            <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-1">
                    <span class="bg-green-100 text-green-600 text-[9px] sm:text-xs px-1.5 py-0.5 rounded">USDT</span>
                    <span class="text-sm text-gray-500">Total Balance</span>
                </div>
                <span class="text-xs text-green-500">{totalBalance.change}</span>
            </div>
            <div class="text-xl sm:text-2xl font-semibold mb-1">${totalBalance.usd.toFixed(2)}</div>
            <div class="text-sm text-gray-500">{totalBalance.usdt.toFixed(2)} USDT</div>
            
            <!-- Updated mobile-responsive buttons -->
            <div class="grid grid-cols-2 sm:flex gap-2 sm:gap-4 mt-4">
                <button 
                    class="btn-primary h-[44px] sm:h-auto w-full sm:w-auto text-sm sm:text-base flex items-center justify-center px-3 sm:px-6" 
                    on:click={() => showDepositModal = true}
                >
                    <svg class="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Deposit</span>
                </button>
                <button 
                    class="btn-primary h-[44px] sm:h-auto w-full sm:w-auto text-sm sm:text-base flex items-center justify-center px-3 sm:px-6" 
                    on:click={openWithdrawModal}
                >
                    <svg class="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Withdraw</span>
                </button>
            </div>
        </div>
    </div>

    <!-- Balance Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Asset Balance Card -->
        <div class="balance-card hover:scale-[1.02] transition-transform">
            <div class="flex items-center gap-2 sm:gap-4">
                <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#3772FF]/10 flex items-center justify-center">
                    <svg class="w-5 h-5 sm:w-6 sm:h-6 text-[#3772FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div class="flex-1">
                    <div class="flex items-center justify-between">
                        <h3 class="text-sm sm:text-lg font-medium text-gray-800">Asset Balance</h3>
                        <div class="flex items-center gap-1">
                            <span class="bg-green-100 text-green-600 text-[9px] sm:text-xs px-1.5 py-0.5 rounded">USDT</span>
                            <span class="text-xs sm:text-sm font-medium text-green-500">{assetBalance.change}</span>
                        </div>
                    </div>
                    <div class="flex items-center gap-2 mt-1">
                        <span class="text-sm sm:text-base font-semibold">{assetBalance.usdt} USDT</span>
                        <span class="text-xs sm:text-sm text-gray-500">{assetBalance.usd.toFixed(2)} USD</span>
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
                        <div class="flex items-center gap-1">
                            <span class="bg-green-100 text-green-600 text-[9px] sm:text-xs px-1.5 py-0.5 rounded">USDT</span>
                            <span class="text-xs sm:text-sm font-medium text-green-500">{exchangeBalance.change}</span>
                        </div>
                    </div>
                    <div class="flex items-center gap-2 mt-1">
                        <span class="font-semibold">{exchangeBalance.usdt} USDT</span>
                        <span class="text-gray-500">{exchangeBalance.usd.toFixed(2)} USD</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Recent Deposits -->
    <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
        <div class="flex justify-between items-center mb-6">
            <div>
                <h3 class="text-lg font-semibold text-gray-900">Recent Deposits</h3>
                <p class="text-sm text-gray-500 mt-1">Your deposit history</p>
            </div>
            <div class="flex items-center gap-3">
                <button 
                    class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 
                           flex items-center gap-2 shadow-lg shadow-indigo-500/20"
                    on:click={fetchDeposits}
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
                                <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">Date</span>
                                <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                                </svg>
                            </div>
                        </th>
                        <th class="px-6 py-3 text-left">
                            <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</span>
                        </th>
                        <th class="px-6 py-3 text-left">
                            <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">Currency</span>
                        </th>
                        <th class="px-6 py-3 text-left">
                            <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</span>
                        </th>
                        <th class="px-6 py-3 text-left">
                            <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">USDT Address</span>
                        </th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                    {#if isLoadingDeposits}
                        <tr>
                            <td colspan="5" class="py-8">
                                <div class="flex justify-center">
                                    <div class="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent"></div>
                                </div>
                            </td>
                        </tr>
                    {:else if deposits.length === 0}
                        <tr>
                            <td colspan="5" class="py-16">
                                <div class="flex flex-col items-center justify-center text-gray-400">
                                    <svg class="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                    </svg>
                                    <span class="text-lg">No deposits yet</span>
                                </div>
                            </td>
                        </tr>
                    {:else}
                        {#each deposits as deposit}
                            <tr class="hover:bg-gray-50/50 transition-colors">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm text-gray-900">
                                        {new Date(deposit.createdAt).toLocaleDateString()}
                                    </div>
                                    <div class="text-xs text-gray-500">
                                        {new Date(deposit.createdAt).toLocaleTimeString()}
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm font-medium text-gray-900">
                                        {deposit.amount} {deposit.currency.toUpperCase()}
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                        {deposit.currency.toUpperCase()}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 py-1 text-sm rounded-full
                                        {deposit.status === 'approved' ? 'bg-green-100 text-green-700' : 
                                         deposit.status === 'rejected' ? 'bg-red-100 text-red-700' : 
                                         'bg-yellow-100 text-yellow-700'}">
                                        {deposit.status}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center gap-2">
                                        <span class="font-mono text-sm text-gray-900 truncate max-w-[120px]">
                                            {deposit.txHash || '-'}
                                        </span>
                                        {#if deposit.txHash}
                                            <button 
                                                class="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                                on:click={() => copyToClipboard(deposit.txHash)}
                                            >
                                                <svg class="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                                          d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-2M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                </svg>
                                            </button>
                                        {/if}
                                    </div>
                                </td>
                            </tr>
                        {/each}
                    {/if}
                </tbody>
            </table>
        </div>
    </div>

    <!-- Recent Withdrawals -->
    <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow mt-8">
        <div class="flex justify-between items-center mb-6">
            <div>
                <h3 class="text-lg font-semibold text-gray-900">Recent Withdrawals</h3>
                <p class="text-sm text-gray-500 mt-1">Your withdrawal history</p>
            </div>
            <div class="flex items-center gap-3">
                <button 
                    class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 
                           flex items-center gap-2 shadow-lg shadow-indigo-500/20"
                    on:click={fetchWithdrawals}
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
                                <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">Date</span>
                                <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                                </svg>
                            </div>
                        </th>
                        <th class="px-6 py-3 text-left">
                            <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</span>
                        </th>
                        <th class="px-6 py-3 text-left">
                            <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">Currency</span>
                        </th>
                        <th class="px-6 py-3 text-left">
                            <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</span>
                        </th>
                        <th class="px-6 py-3 text-left">
                            <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">USDT Address</span>
                        </th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                    {#if isLoadingWithdrawals}
                        <tr>
                            <td colspan="5" class="py-8">
                                <div class="flex justify-center">
                                    <div class="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent"></div>
                                </div>
                            </td>
                        </tr>
                    {:else if withdrawals.length === 0}
                        <tr>
                            <td colspan="5" class="py-16">
                                <div class="flex flex-col items-center justify-center text-gray-400">
                                    <svg class="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                    </svg>
                                    <span class="text-lg">No withdrawals yet</span>
                                </div>
                            </td>
                        </tr>
                    {:else}
                        {#each withdrawals as withdrawal}
                            <tr class="hover:bg-gray-50/50 transition-colors">
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
                                    <span class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                        {withdrawal.currency.toUpperCase()}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 py-1 text-sm rounded-full
                                        {withdrawal.status === 'approved' ? 'bg-green-100 text-green-700' : 
                                         withdrawal.status === 'rejected' ? 'bg-red-100 text-red-700' : 
                                         'bg-yellow-100 text-yellow-700'}">
                                        {withdrawal.status}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center gap-2">
                                        <span class="font-mono text-sm text-gray-900 truncate max-w-[120px]">
                                            {withdrawal.withdrawalAddress || '-'}
                                        </span>
                                        {#if withdrawal.withdrawalAddress}
                                            <button 
                                                class="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                                on:click={() => copyToClipboard(withdrawal.withdrawalAddress)}
                                            >
                                                <svg class="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                                          d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-2M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                </svg>
                                            </button>
                                        {/if}
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

    /* Comprehensive mobile styles */
    @media screen and (max-width: 640px) {
        /* Main container */
        :global(.max-w-7xl) {
            padding: 12px !important;
        }

        /* Balance cards */
        :global(.grid-cols-3) {
            grid-template-columns: 1fr !important;
        }

        :global(.balance-card) {
            background: white !important;
            border-radius: 16px !important;
            padding: 20px !important;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05) !important;
        }

        /* Card content */
        :global(.balance-card > div) {
            gap: 12px !important;
        }

        :global(.balance-card .text-2xl) {
            font-size: 24px !important;
            line-height: 1.2 !important;
            margin-bottom: 4px !important;
        }

        :global(.balance-card .text-sm) {
            font-size: 14px !important;
            color: #666 !important;
        }

        /* Card buttons */
        :global(.balance-card > div > div:last-child) {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 10px !important;
            margin-top: 16px !important;
            width: 100% !important;
        }

        :global(.balance-card .btn-primary) {
            height: 44px !important;
            padding: 8px 12px !important;
            font-size: 14px !important;
            border-radius: 12px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-weight: 500 !important;
            width: 100% !important;
        }

        :global(.balance-card .btn-primary svg) {
            width: 16px !important;
            height: 16px !important;
            margin-right: 6px !important;
        }

        /* Recent transactions section */
        :global(.recent-withdrawals) {
            margin-top: 24px !important;
            background: white !important;
            border-radius: 16px !important;
            padding: 20px !important;
        }

        :global(.recent-withdrawals h3) {
            font-size: 20px !important;
            margin-bottom: 16px !important;
        }

        /* Table adjustments */
        :global(.table-container) {
            margin: 0 -20px !important;
            padding: 0 !important;
            overflow-x: auto !important;
            -webkit-overflow-scrolling: touch !important;
        }

        :global(table) {
            width: 100% !important;
            min-width: 600px !important;
        }

        :global(th) {
            background: #f8f9fa !important;
            padding: 12px 16px !important;
            font-size: 13px !important;
            font-weight: 500 !important;
            color: #666 !important;
            text-align: left !important;
        }

        :global(td) {
            padding: 16px !important;
            font-size: 14px !important;
            vertical-align: middle !important;
        }

        /* Status badges */
        :global(.status-badge) {
            padding: 6px 12px !important;
            border-radius: 20px !important;
            font-size: 13px !important;
            font-weight: 500 !important;
        }

        /* Modal improvements */
        :global(.modal-overlay) {
            padding: 16px !important;
            background: rgba(0, 0, 0, 0.5) !important;
        }

        :global(.modal-content) {
            width: 100% !important;
            max-width: none !important;
            border-radius: 16px !important;
            padding: 24px !important;
        }

        :global(.modal-header) {
            margin-bottom: 20px !important;
        }

        :global(.modal-header h3) {
            font-size: 20px !important;
        }

        :global(.modal input, .modal select) {
            height: 48px !important;
            border-radius: 12px !important;
            padding: 0 16px !important;
            font-size: 15px !important;
            border: 1px solid #e2e8f0 !important;
        }

        :global(.modal button) {
            height: 48px !important;
            border-radius: 12px !important;
            font-size: 15px !important;
            font-weight: 500 !important;
        }
    }

    /* Touch optimizations */
    @media (hover: none) {
        :global(button) {
            -webkit-tap-highlight-color: transparent !important;
        }

        :global(button:active) {
            transform: scale(0.98) !important;
            opacity: 0.9 !important;
        }

        :global(input, select) {
            font-size: 16px !important; /* Prevents zoom on iOS */
        }

        :global(.balance-card .btn-primary:active) {
            transform: scale(0.98) !important;
            opacity: 0.9 !important;
        }
    }

    /* Add mobile-specific styles for Asset and Exchange Balance cards */
    @media screen and (max-width: 640px) {
        /* Make cards stack in single column */
        :global(.grid-cols-3) {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
        }

        /* Asset and Exchange Balance cards */
        :global(.balance-card:nth-child(2), .balance-card:nth-child(3)) {
            padding: 20px !important;
            border-radius: 16px !important;
            background: white !important;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05) !important;
            margin-bottom: 0 !important;
        }

        /* Card content */
        :global(.balance-card:nth-child(2) .text-2xl, .balance-card:nth-child(3) .text-2xl) {
            font-size: 22px !important;
            line-height: 1.2 !important;
            margin-bottom: 4px !important;
        }

        :global(.balance-card:nth-child(2) .text-sm, .balance-card:nth-child(3) .text-sm) {
            font-size: 13px !important;
            color: #666 !important;
        }

        /* Card buttons */
        :global(.balance-card:nth-child(2) > div > div:last-child, 
                .balance-card:nth-child(3) > div > div:last-child) {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 10px !important;
            margin-top: 16px !important;
            width: 100% !important;
        }

        :global(.balance-card:nth-child(2) .btn-primary, 
                .balance-card:nth-child(3) .btn-primary) {
            height: 44px !important;
            padding: 8px 12px !important;
            font-size: 14px !important;
            border-radius: 12px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-weight: 500 !important;
            width: 100% !important;
        }

        :global(.balance-card:nth-child(2) .btn-primary svg, 
                .balance-card:nth-child(3) .btn-primary svg) {
            width: 16px !important;
            height: 16px !important;
            margin-right: 6px !important;
        }
    }

    /* Touch optimizations for Asset and Exchange cards */
    @media (hover: none) {
        :global(.balance-card:nth-child(2) .btn-primary:active,
                .balance-card:nth-child(3) .btn-primary:active) {
            transform: scale(0.98) !important;
            opacity: 0.9 !important;
        }
    }

    /* Only adjust text sizes for Asset and Exchange Balance cards on mobile */
    @media screen and (max-width: 640px) {
        /* Target specifically the Asset and Exchange Balance card text */
        :global(.balance-card:nth-child(2) .text-2xl, 
                .balance-card:nth-child(3) .text-2xl) {
            font-size: 18px !important;
            line-height: 1.2 !important;
        }

        :global(.balance-card:nth-child(2) .text-sm, 
                .balance-card:nth-child(3) .text-sm) {
            font-size: 12px !important;
            color: #666 !important;
        }

        :global(.balance-card:nth-child(2) .text-gray-500, 
                .balance-card:nth-child(3) .text-gray-500) {
            font-size: 11px !important;
        }
    }

    /* Make font sizes smaller for Asset and Exchange Balance cards on mobile */
    @media screen and (max-width: 640px) {
        /* Make balance amounts much smaller */
        :global(.balance-card:nth-child(2) .text-2xl, 
                .balance-card:nth-child(3) .text-2xl) {
            font-size: 16px !important;
            line-height: 1.2 !important;
        }

        /* Make USDT amount smaller */
        :global(.balance-card:nth-child(2) .text-sm, 
                .balance-card:nth-child(3) .text-sm) {
            font-size: 10px !important;
            color: #666 !important;
        }

        /* Make "Asset Balance" and "Exchange Balance" labels smaller */
        :global(.balance-card:nth-child(2) .text-gray-500, 
                .balance-card:nth-child(3) .text-gray-500) {
            font-size: 9px !important;
        }
    }

    /* Add mobile-specific styles */
    @media screen and (max-width: 640px) {
        :global(.balance-card:nth-child(2)) {
            padding: 12px !important;
        }

        :global(.balance-card:nth-child(2) h3) {
            font-size: 13px !important;
        }

        :global(.balance-card:nth-child(2) .font-semibold) {
            font-size: 14px !important;
        }

        :global(.balance-card:nth-child(2) .text-gray-500) {
            font-size: 11px !important;
        }

        :global(.balance-card:nth-child(2) .text-green-500) {
            font-size: 10px !important;
        }
    }
</style>