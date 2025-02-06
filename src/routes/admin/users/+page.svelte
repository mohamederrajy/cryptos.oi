<script lang="ts">
    import { onMount } from 'svelte';
    import { session } from '$lib/stores/session';
    import { notifications } from '$lib/stores/notifications';
    import { PUBLIC_API_URL } from '$env/static/public';
    import { mockUsers } from '$lib/data/mockUsers';

    interface Wallet {
        totalBalance: { btc: number; usd: number; };
        assetBalance: { btc: number; usd: number; };
        exchangeBalance: { btc: number; usd: number; };
    }

    interface User {
        _id: string;
        firstName?: string;
        lastName?: string;
        email: string;
        role: string;
        wallet: Wallet;
        profileImage: string | null;
        createdAt: string;
        status: string;
    }

    let users: User[] = [];
    let isLoading = true;
    let searchQuery = '';
    let selectedRole = 'all';
    let selectedUser: User | null = null;
    let showUserModal = false;
    let showEditModal = false;
    let showDeleteModal = false;
    let editingUser: User | null = null;
    let userToDelete: User | null = null;
    let editForm = {
        email: '',
        role: '',
        firstName: '',
        lastName: '',
        wallet: {
            totalBalance: {
                btc: 0,
                usd: 0
            }
        }
    };

    async function fetchUsers() {
        try {
            isLoading = true;
            
            const token = localStorage.getItem('token');
            
            if (!token) {
                notifications.error('Authentication required');
                return;
            }

            const response = await fetch(`${PUBLIC_API_URL}/api/admin/users`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Raw API response:', data);
                
                if (Array.isArray(data)) {
                    users = data;
                } else if (Array.isArray(data.users)) {
                    users = data.users;
                } else {
                    users = [];
                }
                
                console.log('Processed users:', users);
                if (users.length === 0) {
                    notifications.info('No users found');
                }
            } else {
                const error = await response.json();
                console.error('API error response:', error);
                notifications.error(error.message || 'Failed to fetch users');
            }
        } catch (error) {
            console.error('Users error:', error);
            notifications.error('Failed to load users');
        } finally {
            isLoading = false;
        }
    }

    function viewUserDetails(user: User) {
        selectedUser = user;
        showUserModal = true;
    }

    // Filter users based on search and role
    $: filteredUsers = users.filter(user => {
        const searchString = searchQuery.toLowerCase();
        const matchesSearch = searchString === '' || 
            (user.firstName?.toLowerCase()?.includes(searchString) ?? false) ||
            (user.lastName?.toLowerCase()?.includes(searchString) ?? false) ||
            user.email.toLowerCase().includes(searchString);
        
        const matchesRole = selectedRole === 'all' || user.role === selectedRole;
        
        return matchesSearch && matchesRole;
    });

    // Helper function to get user initials
    function getUserInitials(user: User): string {
        const firstInitial = user.firstName?.[0] || user.email[0];
        const lastInitial = user.lastName?.[0] || '';
        return (firstInitial + lastInitial).toUpperCase();
    }

    // Helper function to get user display name
    function getUserDisplayName(user: User): string {
        if (user.firstName && user.lastName) {
            return `${user.firstName} ${user.lastName}`;
        }
        return user.email;
    }

    async function deleteUser(userId: string) {
        try {
            const response = await fetch(`${PUBLIC_API_URL}/api/admin/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                notifications.success('User deleted successfully');
                users = users.filter(user => user._id !== userId);
                showDeleteModal = false;
                userToDelete = null;
            } else {
                const error = await response.json();
                notifications.error(error.message || 'Failed to delete user');
            }
        } catch (error) {
            console.error('Delete user error:', error);
            notifications.error('Failed to delete user');
        }
    }

    function openEditModal(user: User) {
        editingUser = user;
        editForm = {
            email: user.email,
            role: user.role,
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            wallet: {
                totalBalance: {
                    btc: user.wallet.totalBalance.btc,
                    usd: user.wallet.totalBalance.usd
                }
            }
        };
        showEditModal = true;
    }

    function openDeleteModal(user: User) {
        userToDelete = user;
        showDeleteModal = true;
    }

    async function updateUser() {
        if (!editingUser) return;

        // Show loading state
        isLoading = true;

        try {
            // Prepare the request body
            const updateData = {
                email: editForm.email,
                role: editForm.role,
                firstName: editForm.firstName,
                lastName: editForm.lastName,
                wallet: {
                    totalBalance: {
                        btc: Number(editForm.wallet.totalBalance.btc),
                        usd: Number(editForm.wallet.totalBalance.usd)
                    }
                }
            };

            console.log('Sending update data:', updateData);

            const response = await fetch(`${PUBLIC_API_URL}/api/admin/users/${editingUser._id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData)
            });

            console.log('Update response status:', response.status);
            
            if (response.ok) {
                const responseData = await response.json();
                console.log('Update response data:', responseData);
                
                const { message, user: updatedUser } = responseData;
                users = users.map(u => 
                    u._id === editingUser._id ? { ...u, ...updatedUser } : u
                );
                notifications.success(message || 'User updated successfully');
                showEditModal = false;
                editingUser = null;
            } else {
                const error = await response.json();
                console.error('Update error response:', error);
                notifications.error(error.message || 'Failed to update user');
            }
        } catch (error) {
            console.error('Update user error:', error);
            notifications.error('Failed to update user');
        } finally {
            isLoading = false;
        }
    }

    onMount(async () => {
        if ($session.user?.role !== 'admin') {
            notifications.error('Admin access required');
            window.location.href = '/';
            return;
        }

        await fetchUsers();
    });
</script>

<!-- Add a loading state for the entire page -->
{#if !$session.isAuthenticated || $session.user?.role !== 'admin'}
    <div class="flex items-center justify-center min-h-screen">
        <div class="text-center">
            <p class="text-lg text-gray-600">Access Denied</p>
            <a href="/" class="text-blue-600 hover:underline">Return to Home</a>
        </div>
    </div>
{:else}
    <div class="p-8 space-y-6">
        <!-- Header -->
        <div class="flex justify-between items-center">
            <h1 class="text-2xl font-bold text-gray-900">Users Management</h1>
            <button 
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                on:click={fetchUsers}
            >
                Refresh
            </button>
        </div>

        <!-- Filters -->
        <div class="flex gap-4">
            <div class="flex-1">
                <input 
                    type="text"
                    bind:value={searchQuery}
                    placeholder="Search by name or email..."
                    class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <select 
                bind:value={selectedRole}
                class="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="all">All Roles</option>
                <option value="user">Users</option>
                <option value="admin">Admins</option>
            </select>
        </div>

        <!-- Users Table -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {#if isLoading}
                <div class="flex items-center justify-center py-12">
                    <div class="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            {:else}
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead>
                            <tr class="bg-gray-50">
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            {#each filteredUsers as user (user._id)}
                                <tr class="hover:bg-gray-50">
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex items-center">
                                            {#if user.profileImage}
                                                <img 
                                                    src={`${PUBLIC_API_URL}/${user.profileImage}`} 
                                                    alt={getUserDisplayName(user)}
                                                    class="w-8 h-8 rounded-full object-cover"
                                                />
                                            {:else}
                                                <div class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                                                    {getUserInitials(user)}
                                                </div>
                                            {/if}
                                            <div class="ml-3">
                                                <div class="text-sm font-medium text-gray-900">
                                                    {getUserDisplayName(user)}
                                                </div>
                                            </div>
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
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            {user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                                            {user.status}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div class="flex gap-3">
                                            <button 
                                                class="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                                on:click={() => viewUserDetails(user)}
                                            >
                                                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                                <span>View</span>
                                            </button>
                                            <button 
                                                class="text-purple-600 hover:text-purple-800 flex items-center gap-1"
                                                on:click={() => openEditModal(user)}
                                            >
                                                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                                <span>Edit</span>
                                            </button>
                                            <button 
                                                class="text-red-600 hover:text-red-800 flex items-center gap-1"
                                                on:click={() => openDeleteModal(user)}
                                            >
                                                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                <span>Delete</span>
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
    </div>

    <!-- User Details Modal -->
    {#if showUserModal && selectedUser}
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div class="p-6 border-b border-gray-200">
                    <div class="flex justify-between items-center">
                        <h2 class="text-xl font-bold text-gray-900">User Details</h2>
                        <button 
                            class="text-gray-500 hover:text-gray-700"
                            on:click={() => showUserModal = false}
                        >
                            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="p-6 space-y-6">
                    <!-- User Info -->
                    <div class="space-y-4">
                        <div class="flex items-center space-x-4">
                            <div class="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl font-medium">
                                {selectedUser.firstName?.[0] || ''}{selectedUser.lastName?.[0] || ''}
                            </div>
                            <div>
                                <h3 class="text-lg font-medium">{selectedUser.firstName} {selectedUser.lastName}</h3>
                                <p class="text-gray-500">{selectedUser.email}</p>
                            </div>
                        </div>
                        
                        <div class="grid grid-cols-2 gap-4">
                            <div class="p-4 bg-gray-50 rounded-lg">
                                <div class="text-sm font-medium text-gray-500">User ID</div>
                                <div class="mt-1 text-sm">{selectedUser._id}</div>
                            </div>
                            <div class="p-4 bg-gray-50 rounded-lg">
                                <div class="text-sm font-medium text-gray-500">Role</div>
                                <div class="mt-1">
                                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                               {selectedUser.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}">
                                        {selectedUser.role}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- Wallet Information -->
                        <div class="space-y-4">
                            <h4 class="text-lg font-medium">Wallet Information</h4>
                            
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <!-- Total Balance -->
                                <div class="p-4 bg-gray-50 rounded-lg">
                                    <div class="text-sm font-medium text-gray-500">Total Balance</div>
                                    <div class="mt-2 space-y-1">
                                        <div class="text-sm">{selectedUser.wallet.totalBalance.btc.toFixed(8)} BTC</div>
                                        <div class="text-sm">${selectedUser.wallet.totalBalance.usd.toFixed(2)} USD</div>
                                    </div>
                                </div>

                                <!-- Asset Balance -->
                                <div class="p-4 bg-gray-50 rounded-lg">
                                    <div class="text-sm font-medium text-gray-500">Asset Balance</div>
                                    <div class="mt-2 space-y-1">
                                        <div class="text-sm">{selectedUser.wallet.assetBalance.btc.toFixed(8)} BTC</div>
                                        <div class="text-sm">${selectedUser.wallet.assetBalance.usd.toFixed(2)} USD</div>
                                    </div>
                                </div>

                                <!-- Exchange Balance -->
                                <div class="p-4 bg-gray-50 rounded-lg">
                                    <div class="text-sm font-medium text-gray-500">Exchange Balance</div>
                                    <div class="mt-2 space-y-1">
                                        <div class="text-sm">{selectedUser.wallet.exchangeBalance.btc.toFixed(8)} BTC</div>
                                        <div class="text-sm">${selectedUser.wallet.exchangeBalance.usd.toFixed(2)} USD</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    {/if}

    <!-- Add Edit Modal -->
    {#if showEditModal && editingUser}
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-xl max-w-lg w-full mx-4">
                <div class="p-6 border-b border-gray-200">
                    <div class="flex justify-between items-center">
                        <h2 class="text-xl font-bold text-gray-900">Edit User</h2>
                        <button 
                            class="text-gray-500 hover:text-gray-700"
                            on:click={() => {
                                showEditModal = false;
                                editingUser = null;
                            }}
                            disabled={isLoading}
                        >
                            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="p-6 space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">First Name</label>
                        <input 
                            type="text" 
                            bind:value={editForm.firstName}
                            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter first name"
                        />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Last Name</label>
                        <input 
                            type="text" 
                            bind:value={editForm.lastName}
                            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter last name"
                        />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Email</label>
                        <input 
                            type="email" 
                            bind:value={editForm.email}
                            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Role</label>
                        <select 
                            bind:value={editForm.role}
                            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">BTC Balance</label>
                        <input 
                            type="number" 
                            bind:value={editForm.wallet.totalBalance.btc}
                            step="0.00000001"
                            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">USD Balance</label>
                        <input 
                            type="number" 
                            bind:value={editForm.wallet.totalBalance.usd}
                            step="0.01"
                            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div class="mt-6 flex justify-end space-x-3">
                        <button 
                            class="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                            on:click={() => {
                                showEditModal = false;
                                editingUser = null;
                            }}
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button 
                            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                            on:click={updateUser}
                            disabled={isLoading}
                        >
                            {#if isLoading}
                                <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            {/if}
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    {/if}

    <!-- Add Delete Confirmation Modal -->
    {#if showDeleteModal && userToDelete}
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-xl max-w-md w-full mx-4 p-6">
                <div class="text-center">
                    <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                        <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h3 class="text-lg font-medium text-gray-900 mb-2">Delete User</h3>
                    <p class="text-sm text-gray-500 mb-6">
                        Are you sure you want to delete {userToDelete.firstName} {userToDelete.lastName}? 
                        This action cannot be undone.
                    </p>
                    <div class="flex justify-center space-x-3">
                        <button 
                            class="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                            on:click={() => {
                                showDeleteModal = false;
                                userToDelete = null;
                            }}
                        >
                            Cancel
                        </button>
                        <button 
                            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            on:click={() => deleteUser(userToDelete._id)}
                        >
                            Delete User
                        </button>
                    </div>
                </div>
            </div>
        </div>
    {/if}
{/if} 