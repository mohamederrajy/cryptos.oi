<script lang="ts">
    import { session } from '$lib/stores/session';
    import { notifications } from '$lib/stores/notifications';
    import { updateUserProfile } from '$lib/services/userService';
    import { getProfileImageUrl } from '$lib/utils/image';
    
    let activeTab = 'Account';
    const tabs = ['Account', 'Referrals', 'Password', '2FA', 'ID', 'Sessions history'];

    let avatarFile: FileList;
    let firstName = $session.user?.firstName || '';
    let lastName = $session.user?.lastName || '';
    let email = $session.user?.email || '';
    let isUpdating = false;
    
    async function handleAvatarUpload() {
        if (!avatarFile?.[0]) return;
        
        
        try {
            isUpdating = true;
            const updatedUser = await updateUserProfile({
                profileImage: avatarFile[0]
            });
            
            session.updateProfile(updatedUser);
            notifications.success('Profile image updated successfully');
        } catch (error) {
            notifications.error('Failed to update profile image');
        } finally {
            isUpdating = false;
        }
    }

    async function handleDeleteAvatar() {
        try {
            // TODO: Implement avatar deletion API call
            notifications.success('Avatar deleted successfully');
        } catch (error) {
            notifications.error('Failed to delete avatar');
        }
    }

    async function handleUpdateProfile() {
        try {
            isUpdating = true;
            
            const updatedUser = await updateUserProfile({
                firstName,
                lastName,
                email,
                ...(avatarFile?.[0] && { profileImage: avatarFile[0] })
            });
            
            session.updateProfile(updatedUser);
            notifications.success('Profile updated successfully');
        } catch (error: any) {
            notifications.error(error.message || 'Failed to update profile');
        } finally {
            isUpdating = false;
        }
    }
</script>

<div class="max-w-4xl mx-auto px-4 py-8">
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <!-- Header -->
        <div class="flex items-center justify-between mb-8">
            <h1 class="text-2xl font-bold text-gray-900">Account Setting</h1>
            <button class="text-gray-500 hover:text-gray-700">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        <!-- Tabs -->
        <div class="flex gap-4 mb-8 overflow-x-auto pb-2">
            {#each tabs as tab}
                <button 
                    class="px-6 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap
                           {activeTab === tab 
                               ? 'bg-blue-100 text-blue-600' 
                               : 'text-gray-600 hover:bg-gray-100'}"
                    on:click={() => activeTab = tab}
                >
                    {tab}
                </button>
            {/each}
        </div>

        <!-- Profile Section -->
        <div class="space-y-8">
            <!-- Avatar -->
            <div class="flex items-center gap-4">
                <div class="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center bg-blue-600">
                    {#if $session.user?.profileImage}
                        <img 
                            src={getProfileImageUrl($session.user.profileImage)}
                            alt="Profile"
                            class="w-full h-full object-cover"
                            on:error={(e) => {
                                // Fallback to initials if image fails to load
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling.style.display = 'flex';
                            }}
                        />
                        <div class="hidden w-full h-full text-white text-3xl font-medium items-center justify-center">
                            {$session.user?.firstName?.[0]}{$session.user?.lastName?.[0]}
                        </div>
                    {:else}
                        <div class="w-full h-full text-white text-3xl font-medium flex items-center justify-center">
                            {$session.user?.firstName?.[0]}{$session.user?.lastName?.[0]}
                        </div>
                    {/if}
                </div>
                <div class="space-y-2">
                    <label class="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                           class:opacity-50={isUpdating}
                           class:cursor-not-allowed={isUpdating}>
                        {#if isUpdating}
                            <div class="flex items-center gap-2">
                                <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                </svg>
                                Uploading...
                            </div>
                        {:else}
                            Upload New
                        {/if}
                        <input 
                            type="file" 
                            class="hidden" 
                            accept="image/*"
                            bind:files={avatarFile}
                            on:change={handleAvatarUpload}
                            disabled={isUpdating}
                        />
                    </label>
                    {#if $session.user?.profileImage}
                        <button 
                            class="block text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                            on:click={handleDeleteAvatar}
                            disabled={isUpdating}
                        >
                            Delete avatar
                        </button>
                    {/if}
                </div>
            </div>

            <!-- Form -->
            <div class="grid grid-cols-2 gap-6">
                <div class="space-y-2">
                    <label class="block text-sm text-gray-600">First name</label>
                    <input 
                        type="text" 
                        class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                        bind:value={firstName}
                        placeholder="Enter your first name"
                    />
                </div>

                <div class="space-y-2">
                    <label class="block text-sm text-gray-600">Last name</label>
                    <input 
                        type="text" 
                        class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                        bind:value={lastName}
                        placeholder="Enter your last name"
                    />
                </div>

                <div class="space-y-2">
                    <label class="block text-sm text-gray-600">Email</label>
                    <input 
                        type="email" 
                        class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                        bind:value={email}
                        placeholder="Enter your email"
                    />
                </div>

                <div class="space-y-2">
                    <label class="block text-sm text-gray-600">Account status</label>
                    <div class="px-4 py-2 text-red-500 font-medium">
                        Not activated
                    </div>
                </div>

                <div class="space-y-2">
                    <label class="block text-sm text-gray-600">2FA</label>
                    <select class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500">
                        <option>Disabled</option>
                        <option>Enabled</option>
                    </select>
                </div>

                <div class="space-y-2">
                    <label class="block text-sm text-gray-600">ID verification</label>
                    <div class="px-4 py-2 text-red-500 font-medium">
                        Not verified
                    </div>
                </div>
            </div>

            <!-- Update Button -->
            <div class="pt-4 col-span-2">
                <button 
                    class="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    on:click={handleUpdateProfile}
                    disabled={isUpdating}
                >
                    {#if isUpdating}
                        <div class="flex items-center gap-2">
                            <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                            </svg>
                            Updating...
                        </div>
                    {:else}
                        Update Profile
                    {/if}
                </button>
            </div>
        </div>
    </div>
</div> 