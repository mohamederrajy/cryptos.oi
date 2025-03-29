<script lang="ts">
    import { session } from '$lib/stores/session';
    import { fade } from 'svelte/transition';
    import type { PageData } from './$types';
    import { updateProfile, fetchUserProfile } from '$lib/services/userService';
    import { invalidateAll } from '$app/navigation';

    export let data: PageData;

    // Format date helper
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Format currency helper
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    $: profile = data.profile;

    // Form state
    let isEditing = false;
    let isSubmitting = false;
    let formError = '';
    
    // Form data
    let formData = {
        firstName: profile?.firstName || '',
        lastName: profile?.lastName || '',
        email: profile?.email || ''
    };

    // Handle form submission
    async function handleSubmit() {
        try {
            isSubmitting = true;
            formError = '';
            
            const updatedProfile = await updateProfile(formData);
            
            // Update session and local state
            session.updateProfile(updatedProfile);
            
            // Refresh data
            await invalidateAll();
            
            // Close edit mode
            isEditing = false;

            // Refetch profile data to ensure we have the latest
            const freshProfile = await fetchUserProfile();
            if (freshProfile) {
                session.updateProfile(freshProfile);
                profile = freshProfile;
            }
        } catch (error) {
            if (error instanceof Error) {
                formError = error.message;
            } else {
                formError = 'Failed to update profile';
            }
        } finally {
            isSubmitting = false;
        }
    }
</script>

{#if profile}
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" in:fade>
        <!-- Profile Header Card -->
        <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-xl p-8 mb-8">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-6">
                    <div class="w-24 h-24 bg-white rounded-full flex items-center justify-center text-blue-600 text-3xl font-bold shadow-inner">
                        {(profile.firstName[0] + profile.lastName[0]).toUpperCase()}
                    </div>
                    <div class="text-white">
                        <h1 class="text-3xl font-bold mb-2">{profile.firstName} {profile.lastName}</h1>
                        <p class="text-blue-100 flex items-center gap-2">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            {profile.email}
                        </p>
                    </div>
                </div>
                {#if !isEditing}
                    <button 
                        on:click={() => {
                            formData = {
                                firstName: profile.firstName,
                                lastName: profile.lastName,
                                email: profile.email
                            };
                            isEditing = true;
                        }}
                        class="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg flex items-center gap-2 transition-colors"
                    >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit Profile
                    </button>
                {/if}
            </div>
        </div>

        {#if isEditing}
            <!-- Edit Profile Form -->
            <div class="bg-white rounded-2xl shadow-lg p-8 mb-8" transition:fade>
                <h2 class="text-2xl font-bold text-gray-800 mb-6">Edit Profile</h2>
                
                {#if formError}
                    <div class="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
                        {formError}
                    </div>
                {/if}

                <form on:submit|preventDefault={handleSubmit} class="space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                            <input
                                type="text"
                                id="firstName"
                                bind:value={formData.firstName}
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                            <input
                                type="text"
                                id="lastName"
                                bind:value={formData.lastName}
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            id="email"
                            bind:value={formData.email}
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div class="flex justify-end gap-4">
                        <button
                            type="button"
                            on:click={() => isEditing = false}
                            class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                            disabled={isSubmitting}
                        >
                            {#if isSubmitting}
                                <div class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            {/if}
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        {/if}

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Account Info Card -->
            <div class="lg:col-span-2">
                <div class="bg-white rounded-2xl shadow-lg p-8">
                    <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                        <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Account Information
                    </h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div class="space-y-6">
                            <div>
                                <p class="text-sm text-gray-500 mb-1">Member Since</p>
                                <p class="text-lg font-medium text-gray-800">{formatDate(profile.createdAt)}</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500 mb-1">Account Status</p>
                                <div class="flex items-center">
                                    <span class="w-3 h-3 rounded-full {profile.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'} mr-2"></span>
                                    <p class="text-lg font-medium capitalize">{profile.status}</p>
                                </div>
                            </div>
                        </div>
                        <div class="space-y-6">
                            <div>
                                <p class="text-sm text-gray-500 mb-1">Role</p>
                                <p class="text-lg font-medium capitalize">{profile.role}</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500 mb-1">Account Type</p>
                                <p class="text-lg font-medium">{profile.isAdmin ? 'Administrator' : 'Standard User'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Wallet Balance Card -->
            <div class="bg-white rounded-2xl shadow-lg p-8">
                <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Wallet Balance
                </h2>
                <div class="space-y-6">
                    <div class="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6">
                        <p class="text-sm text-gray-600 mb-2">Total Balance</p>
                        <p class="text-3xl font-bold text-green-600">
                            {formatCurrency(profile.wallet?.totalBalance?.USDT || 0)} USDT
                        </p>
                    </div>
                    <div class="space-y-4">
                        <div class="bg-gray-50 rounded-lg p-4">
                            <p class="text-sm text-gray-600 mb-1">Asset Balance</p>
                            <p class="text-xl font-semibold text-gray-800">
                                {formatCurrency(profile.wallet?.assetBalance?.USDT || 0)} USDT
                            </p>
                        </div>
                        <div class="bg-gray-50 rounded-lg p-4">
                            <p class="text-sm text-gray-600 mb-1">Exchange Balance</p>
                            <p class="text-xl font-semibold text-gray-800">
                                {formatCurrency(profile.wallet?.exchangeBalance?.USDT || 0)} USDT
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
{:else}
    <div class="flex justify-center items-center min-h-[60vh]">
        <div class="text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
            <p class="text-gray-600">Loading profile data...</p>
        </div>
    </div>
{/if} 