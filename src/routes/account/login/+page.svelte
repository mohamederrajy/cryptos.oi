<script lang="ts">
    import { enhance } from '$app/forms';
    import { goto } from '$app/navigation';
    import { login } from '$lib/auth';
    import { notifications } from '$lib/stores/notifications';
    import { fade } from 'svelte/transition';
    import type { ActionData } from './$types';
    
    export let form: ActionData;
    
    let email = '';
    let password = '';
    let showPassword = false;
    let rememberMe = false;
    let isLoading = false;
    let errorMessage = '';

    async function handleSubmit() {
        return async ({ result, update }) => {
            try {
                isLoading = true;
                errorMessage = '';

                if (!email || !password) {
                    errorMessage = 'Please fill in all fields';
                    return;
                }

                const loginData = {
                    email: email.trim(),
                    password: password
                };

                const loginResult = await login(loginData);

                if (loginResult?.token) {
                    notifications.success('Login successful! Redirecting...');
                    setTimeout(() => {
                        goto('/', { replaceState: true });
                    }, 1500);
                } else {
                    errorMessage = 'Invalid credentials';
                }

            } catch (error: any) {
                console.error('Login error:', error);
                errorMessage = error.message || 'Invalid email or password';
            } finally {
                isLoading = false;
            }
        };
    }
</script>

{#if $notifications && $notifications.message}
    <div 
        class="fixed top-4 right-4 z-50 max-w-sm"
        transition:fade={{ duration: 200 }}
    >
        <div class="p-4 rounded-lg shadow-lg {
            $notifications.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' :
            $notifications.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' :
            'bg-blue-50 text-blue-700 border border-blue-200'
        }">
            <div class="flex items-center gap-2">
                {#if $notifications.type === 'success'}
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                {:else if $notifications.type === 'error'}
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                {:else}
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                {/if}
                <p class="text-sm font-medium">{$notifications.message}</p>
            </div>
        </div>
    </div>
{/if}

<div class="flex min-h-screen max-h-screen overflow-hidden">
    <!-- Left Section -->
    <div class="w-1/2 bg-gradient-to-br from-[#3772FF] to-[#2952cc] p-8 flex flex-col relative overflow-hidden">
        <!-- Animated Background Elements -->
        <div class="absolute inset-0 overflow-hidden">
            <div class="absolute w-[500px] h-[500px] rounded-full bg-white/5 -top-48 -right-24 blur-3xl"></div>
            <div class="absolute w-[400px] h-[400px] rounded-full bg-blue-400/10 bottom-[-100px] -left-24 blur-2xl"></div>
            <!-- Animated Grid -->
            <div class="absolute inset-0" style="background-image: radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px); background-size: 20px 20px;"></div>
        </div>

        <!-- Logo Section -->
        <div class="relative mb-12">
            <div class="flex items-center">
                <img 
                    src="/images/LOGwOOC.png" 
                    alt="Logo" 
                    class="h-14 object-contain" 
                />
            </div>
        </div>
        
        <!-- Content Section -->
        <div class="flex-grow flex flex-col justify-center relative z-10">
            <!-- Stats Section -->
            <div class="flex gap-6 mb-12">
                <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-4 flex-1">
                    <div class="text-white/60 text-sm mb-1">Active Users</div>
                    <div class="text-white text-2xl font-bold">250K+</div>
                </div>
                <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-4 flex-1">
                    <div class="text-white/60 text-sm mb-1">Daily Volume</div>
                    <div class="text-white text-2xl font-bold">$2.5M</div>
                </div>
            </div>

            <!-- Main Content -->
            <div class="space-y-6 max-w-lg">
                <div class="space-y-4">
                    <h1 class="text-white text-5xl font-bold leading-tight">
                        Welcome to the Future of Trading
                    </h1>
                    <p class="text-white/80 text-xl leading-relaxed">
                        Experience secure, professional, and lightning-fast crypto trading with advanced tools and real-time analytics.
                    </p>
                </div>

                <!-- Features List -->
                <div class="space-y-4 mt-8">
                    <div class="flex items-center space-x-3 text-white/90">
                        <div class="bg-white/20 rounded-full p-2">
                            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <span>Bank-grade security protocols</span>
                    </div>
                    <div class="flex items-center space-x-3 text-white/90">
                        <div class="bg-white/20 rounded-full p-2">
                            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                      d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <span>Lightning-fast transactions</span>
                    </div>
                    <div class="flex items-center space-x-3 text-white/90">
                        <div class="bg-white/20 rounded-full p-2">
                            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <span>Advanced trading tools</span>
                    </div>
                </div>
            </div>

            <!-- Floating Crypto Icons -->
            <div class="absolute bottom-12 right-8 flex items-center space-x-4">
                <div class="bg-white/10 backdrop-blur-lg rounded-full p-3 animate-float-slow">
                    <img src="/images/crypto images/icoco.png" alt="Crypto" class="w-10 h-10" />
                </div>
                <div class="bg-white/10 backdrop-blur-lg rounded-full p-3 animate-float-medium">
                    <img src="/images/crypto images/icoco.png" alt="Crypto" class="w-10 h-10" />
                </div>
                <div class="bg-white/10 backdrop-blur-lg rounded-full p-3 animate-float-fast">
                    <img src="/images/crypto images/icoco.png" alt="Crypto" class="w-10 h-10" />
                </div>
            </div>
        </div>
    </div>

    <!-- Right Section -->
    <div class="w-1/2 p-8 flex items-center bg-gray-50/50 backdrop-blur-sm">
        <div class="w-full max-w-md mx-auto space-y-8">
            <!-- Enhanced Form Header -->
            <div class="text-center space-y-3">
                <h2 class="text-2xl font-bold text-gray-900">Welcome Back</h2>
                <p class="text-gray-500">Sign in to continue trading</p>
                <div class="flex items-center justify-center gap-2 mt-2">
                    <span class="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-medium">
                        <div class="flex items-center gap-1">
                            <div class="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                            Secure Login
                        </div>
                    </span>
                    <span class="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                        <div class="flex items-center gap-1">
                            <div class="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                            24/7 Support
                        </div>
                    </span>
                </div>
            </div>

            <!-- Error Message -->
            {#if errorMessage}
                <div class="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-center gap-2">
                    <svg class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{errorMessage}</span>
                </div>
            {/if}

            <form class="space-y-6" method="POST" use:enhance={handleSubmit}>
                <!-- Enhanced Email Field -->
                <div class="form-group">
                    <label class="form-label" for="email">
                        <span class="text-sm font-medium text-gray-700">Email Address</span>
                        <span class="ml-1 text-xs text-[#3772FF]">*</span>
                    </label>
                    <div class="input-wrapper group">
                        <div class="input-container hover:border-[#3772FF]/50 focus-within:border-[#3772FF] focus-within:ring-2 ring-[#3772FF]/20">
                            <div class="input-icon">
                                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                                          d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                </svg>
                            </div>
                            <input 
                                id="email"
                                name="email"
                                type="email"
                                bind:value={email}
                                required
                                class="input-field"
                                placeholder="name@company.com"
                            />
                            {#if email}
                                <button 
                                    type="button" 
                                    class="input-action-btn"
                                    on:click={() => email = ''}
                                >
                                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            {/if}
                        </div>
                    </div>
                </div>

                <!-- Enhanced Password Field -->
                <div class="form-group">
                    <label class="form-label" for="password">
                        <span class="text-sm font-medium text-gray-700">Password</span>
                        <span class="ml-1 text-xs text-[#3772FF]">*</span>
                    </label>
                    <div class="input-wrapper group">
                        <div class="input-container hover:border-[#3772FF]/50 focus-within:border-[#3772FF] focus-within:ring-2 ring-[#3772FF]/20">
                            <div class="input-icon">
                                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            {#if showPassword}
                                <input 
                                    id="password"
                                    name="password"
                                    type="text"
                                    bind:value={password}
                                    required
                                    class="input-field"
                                    placeholder="••••••••"
                                />
                            {:else}
                                <input 
                                    id="password"
                                    name="password"
                                    type="password"
                                    bind:value={password}
                                    required
                                    class="input-field"
                                    placeholder="••••••••"
                                />
                            {/if}
                            <button 
                                type="button" 
                                class="input-action-btn"
                                on:click={() => showPassword = !showPassword}
                            >
                                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                                          d={showPassword 
                                              ? "M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" 
                                          : "M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z"} 
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Enhanced Remember Me & Forgot Password -->
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <div class="relative">
                            <input 
                                type="checkbox" 
                                id="remember-me"
                                name="rememberMe"
                                bind:checked={rememberMe}
                                class="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-300
                                       checked:bg-[#3772FF] checked:border-[#3772FF] 
                                       transition-all duration-200
                                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3772FF]/20"
                            />
                            <svg 
                                class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white
                                       pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                            </svg>
                        </div>
                        <label for="remember-me" class="text-sm text-gray-600 select-none">
                            Remember me
                        </label>
                    </div>
                    <a href="/account/forgot-password" class="text-sm text-[#3772FF] hover:underline">
                        Forgot password?
                    </a>
                </div>

                <!-- Enhanced Submit Button -->
                <button 
                    type="submit" 
                    class="w-full py-3 px-4 bg-[#3772FF] text-white rounded-xl font-medium
                           transform transition-all duration-200 
                           hover:bg-[#2952cc] hover:shadow-lg hover:-translate-y-0.5
                           focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3772FF]
                           disabled:opacity-50 disabled:cursor-not-allowed
                           relative overflow-hidden group"
                    disabled={isLoading}
                >
                    <span class="relative z-10 flex items-center justify-center gap-2">
                        {#if isLoading}
                            <svg class="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                            </svg>
                            <span>Signing in...</span>
                        {:else}
                            <span>Sign in</span>
                            <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        {/if}
                    </span>
                </button>

                <!-- Enhanced Sign Up Link -->
                <div class="text-center space-y-4">
                    <div class="relative">
                        <div class="absolute inset-0 flex items-center">
                            <div class="w-full border-t border-gray-200"></div>
                        </div>
                        <div class="relative flex justify-center text-sm">
                            <span class="px-2 bg-gray-50 text-gray-500">New to platform?</span>
                        </div>
                    </div>
                    <a 
                        href="/account/signup" 
                        class="inline-flex items-center justify-center px-4 py-2 border border-[#3772FF] text-sm font-medium rounded-xl text-[#3772FF] bg-transparent hover:bg-[#3772FF]/5 transition-colors duration-200"
                    >
                        Create an account
                    </a>
                </div>
            </form>
        </div>
    </div>
</div>

<style lang="postcss">
    /* Copy all the styles from your signup page */
    /* ... existing styles ... */

    .form-group {
        @apply space-y-2;
    }

    .input-wrapper {
        @apply relative;
    }

    .input-container {
        @apply relative flex items-center bg-white rounded-xl 
               shadow-sm transition-all duration-200
               hover:shadow-md focus-within:shadow-md;
    }

    .input-icon {
        @apply absolute left-4 text-gray-400 transition-colors duration-200;
    }

    .input-field {
        @apply w-full pl-12 pr-4 py-3 bg-transparent text-gray-900 text-sm
               border-none rounded-xl
               placeholder:text-gray-400
               transition-all duration-200
               focus:outline-none focus:ring-0;
    }

    .input-border {
        @apply absolute bottom-0 left-0 right-0 h-[2px] 
               bg-gradient-to-r from-[#3772FF] to-[#3772FF]/60
               transform scale-x-0 origin-left
               transition-transform duration-200
               group-focus-within:scale-x-100;
    }

    .input-action-btn {
        @apply absolute right-4 text-gray-400 
               hover:text-gray-600 
               focus:outline-none focus:text-[#3772FF]
               transition-colors duration-200;
    }

    .input-container:focus-within {
        @apply ring-2 ring-[#3772FF]/20;
    }

    .input-container:focus-within .input-icon {
        @apply text-[#3772FF];
    }

    .input-container:hover .input-icon {
        @apply text-gray-500;
    }

    /* Password visibility toggle animation */
    .input-action-btn svg {
        @apply transform transition-transform duration-200;
    }

    .input-action-btn:hover svg {
        @apply scale-110;
    }

    .input-action-btn:active svg {
        @apply scale-95;
    }

    /* Remove autofill background */
    input:-webkit-autofill,
    input:-webkit-autofill:hover,
    input:-webkit-autofill:focus {
        -webkit-box-shadow: 0 0 0px 1000px white inset;
        transition: background-color 5000s ease-in-out 0s;
    }

    /* Remove password reveal button in Edge */
    input::-ms-reveal,
    input::-ms-clear {
        display: none;
    }

    .password-visible {
        -webkit-text-security: none !important;
        text-security: none !important;
    }

    @supports (-webkit-text-security: disc) {
        input[type="password"] {
            -webkit-text-security: disc;
            text-security: disc;
        }
    }

    /* Add these new animations */
    @keyframes float-slow {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
    }

    @keyframes float-medium {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-15px); }
    }

    @keyframes float-fast {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-20px); }
    }

    .animate-float-slow {
        animation: float-slow 4s ease-in-out infinite;
    }

    .animate-float-medium {
        animation: float-medium 3.5s ease-in-out infinite;
        animation-delay: 0.5s;
    }

    .animate-float-fast {
        animation: float-fast 3s ease-in-out infinite;
        animation-delay: 1s;
    }
</style> 