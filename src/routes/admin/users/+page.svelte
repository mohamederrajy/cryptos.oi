<script lang="ts">
    import { onMount } from 'svelte';
    import { session } from '$lib/stores/session';
    import { notifications } from '$lib/stores/notifications';
    import { PUBLIC_API_URL } from '$env/static/public';
    import { mockUsers } from '$lib/data/mockUsers';

    interface Wallet {
        totalBalance: { USDT: number; };
        assetBalance: { USDT: number; };
        exchangeBalance: { USDT: number; };
    }

    interface User {
        id: string;
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
                USDT: 0
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
                users = users.filter(user => user.id !== userId);
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
                    USDT: user.wallet.totalBalance.USDT
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

        try {
            const updateData = {
                email: editForm.email,
                role: editForm.role,
                firstName: editForm.firstName,
                lastName: editForm.lastName,
                wallet: {
                    totalBalance: {
                        USDT: Number(editForm.wallet.totalBalance.USDT)
                    }
                }
            };

            const response = await fetch(`${PUBLIC_API_URL}/api/admin/users/${editingUser.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData)
            });

            if (response.ok) {
                const responseData = await response.json();
                const { message, user: updatedUser } = responseData;
                users = users.map(u => 
                    u.id === editingUser?.id ? { ...u, ...updatedUser } : u
                );
                notifications.success(message || 'User updated successfully');
                showEditModal = false;
                editingUser = null;
            } else {
                const error = await response.json();
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
        <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-lg font-semibold text-gray-900">Users Management</h3>
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

            {#if isLoading}
                <div class="flex items-center justify-center py-12">
                    <div class="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            {:else}
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
                                    <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">Email</span>
                                </th>
                                <th class="px-6 py-3 text-left">
                                    <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">Role</span>
                                </th>
                                <th class="px-6 py-3 text-left">
                                    <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</span>
                                </th>
                                <th class="px-6 py-3 text-left">
                                    <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</span>
                                </th>
                                <th class="px-6 py-3 text-right">
                                    <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-50">
                            {#each filteredUsers as user, index (user.id || index)}
                                <tr class="hover:bg-gray-50/50 transition-colors">
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex items-center gap-3">
                                            {#if user.profileImage}
                                                <img 
                                                    src={`${PUBLIC_API_URL}/${user.profileImage}`} 
                                                    alt={getUserDisplayName(user)}
                                                    class="w-10 h-10 rounded-full object-cover"
                                                />
                                            {:else}
                                                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 
                                                            flex items-center justify-center text-white font-medium">
                                                    {getUserInitials(user)}
                                                </div>
                                            {/if}
                                            <div>
                                                <div class="text-sm font-medium text-gray-900">
                                                    {getUserDisplayName(user)}
                                                </div>
                                                <div class="text-sm text-gray-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm text-gray-500">{user.email}</div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="px-2 py-1 text-xs font-medium rounded-full 
                                            {user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}">
                                            {user.role}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex items-center gap-2">
                                            <div class="w-2 h-2 rounded-full 
                                                {user.status === 'active' ? 'bg-green-500' : 'bg-gray-300'}">
                                            </div>
                                            <span class="text-sm text-gray-900 capitalize">{user.status}</span>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm font-medium text-gray-900">
                                            {user.wallet.totalBalance.USDT.toLocaleString()} USDT
                                        </div>
                                        <div class="flex items-center gap-1 text-xs text-gray-500">
                                            <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                                                <path d="M11 7h2v7h-2zm0 8h2v2h-2z"/>
                                            </svg>
                                            <span>Total Balance</span>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-right">
                                        <div class="flex items-center justify-end gap-2">
                                            <button 
                                                class="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                                on:click={() => viewUserDetails(user)}
                                            >
                                                <svg class="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            </button>
                                            <button 
                                                class="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                                on:click={() => openEditModal(user)}
                                            >
                                                <svg class="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button 
                                                class="p-1 hover:bg-red-50 rounded-full transition-colors"
                                                on:click={() => openDeleteModal(user)}
                                            >
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
                        Showing {filteredUsers.length} of {users.length} users
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
                                <div class="mt-1 text-sm">{selectedUser.id}</div>
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
                                    <div class="mt-2">
                                        <div class="text-lg font-semibold text-gray-900">
                                            {selectedUser.wallet.totalBalance.USDT.toLocaleString()} USDT
                                        </div>
                                    </div>
                                </div>

                                <!-- Asset Balance -->
                                <div class="p-4 bg-gray-50 rounded-lg">
                                    <div class="text-sm font-medium text-gray-500">Asset Balance</div>
                                    <div class="mt-2">
                                        <div class="text-lg font-semibold text-gray-900">
                                            {selectedUser.wallet.assetBalance.USDT.toLocaleString()} USDT
                                        </div>
                                    </div>
                                </div>

                                <!-- Exchange Balance -->
                                <div class="p-4 bg-gray-50 rounded-lg">
                                    <div class="text-sm font-medium text-gray-500">Exchange Balance</div>
                                    <div class="mt-2">
                                        <div class="text-lg font-semibold text-gray-900">
                                            {selectedUser.wallet.exchangeBalance.USDT.toLocaleString()} USDT
                                        </div>
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
                        <label class="block text-sm font-medium text-gray-700">USDT Balance</label>
                        <div class="mt-1 relative rounded-md shadow-sm">
                            <input 
                                type="number" 
                                bind:value={editForm.wallet.totalBalance.USDT}
                                step="0.01"
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
                                       focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                            <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <span class="text-gray-500 sm:text-sm">USDT</span>
                            </div>
                        </div>
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
                            on:click={() => deleteUser(userToDelete.id)}
                        >
                            Delete User
                        </button>
                    </div>
                </div>
            </div>
        </div>
    {/if}
{/if} 