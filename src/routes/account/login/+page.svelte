<script lang="ts">
    import { enhance } from '$app/forms';
    import type { ActionData } from './$types';
    
    export let form: ActionData;
    
    let email = '';
    let password = '';
    let showPassword = false;
    let rememberMe = false;

    function handleSubmit() {
        return async ({ result }) => {
            if (result.type === 'success') {
                // Handle successful login
                window.location.href = '/';
            }
        };
    }
</script>

<div class="flex min-h-screen max-h-screen overflow-hidden">
    <!-- Left Section -->
    <div class="w-1/2 bg-[#3772FF] p-8 flex flex-col relative overflow-hidden">
        <!-- Logo Section -->
        <div class="relative mb-6">
            <img src="/images/crypto images/LOGOOC.png" alt="XonBiT" class="h-8 object-contain" />
        </div>
        
        <!-- Content Section -->
        <div class="flex-grow flex flex-col justify-between relative z-10">
            <div class="space-y-4">
                <div class="space-y-2">
                    <h1 class="text-white text-4xl font-bold leading-tight">
                        Welcome back to<br />
                        <span class="text-white/90">the world's leading</span><br />
                        crypto exchange
                    </h1>
                    <p class="text-white/80 text-lg">Trade with confidence</p>
                </div>

                <!-- Crypto Image -->
                <div class="relative">
                    <div class="absolute -top-4 -left-4 w-24 h-24 bg-white/5 rounded-full animate-pulse"></div>
                    <img 
                        src="/images/crypto images/icoco.png" 
                        alt="Crypto" 
                        class="w-56 relative z-10 drop-shadow-2xl transform hover:scale-105 transition-transform duration-300"
                    />
                </div>
            </div>
        </div>
    </div>

    <!-- Right Section -->
    <div class="w-1/2 p-8 flex items-center bg-gray-50 overflow-y-auto">
        <div class="w-full max-w-md mx-auto space-y-8">
            <!-- Form Header -->
            <div class="text-center space-y-2">
                <h2 class="text-2xl font-bold text-gray-900">Welcome Back</h2>
                <p class="text-gray-500">Sign in to continue to XonBIT</p>
            </div>

            <form 
                class="space-y-6" 
                method="POST" 
                use:enhance={handleSubmit}
            >
                {#if form?.error}
                    <div class="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                        {form.error}
                    </div>
                {/if}

                <!-- Email Field -->
                <div class="form-group">
                    <label class="form-label" for="email">
                        <span class="text-sm font-medium text-gray-700">Email</span>
                        <span class="ml-1 text-xs text-[#3772FF]">*</span>
                    </label>
                    <div class="input-wrapper">
                        <div class="input-container">
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
                        <div class="input-border"></div>
                    </div>
                </div>

                <!-- Password Field -->
                <div class="form-group">
                    <label class="form-label" for="password">
                        <span class="text-sm font-medium text-gray-700">Password</span>
                        <span class="ml-1 text-xs text-[#3772FF]">*</span>
                    </label>
                    <div class="input-wrapper">
                        <div class="input-container">
                            <div class="input-icon">
                                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <input 
                                id="password"
                                name="password"
                                type="password"
                                bind:value={password}
                                required
                                class="input-field"
                                placeholder="Enter your password"
                            />
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
                        <div class="input-border"></div>
                    </div>
                </div>

                <!-- Remember Me & Forgot Password -->
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <input 
                            type="checkbox" 
                            id="remember-me"
                            name="rememberMe"
                            bind:checked={rememberMe}
                            class="form-checkbox-input"
                        />
                        <label for="remember-me" class="form-checkbox-label">
                            Remember me
                        </label>
                    </div>
                    <a href="/account/forgot-password" class="text-sm text-[#3772FF] hover:underline">
                        Forgot password?
                    </a>
                </div>

                <!-- Submit Button -->
                <button 
                    type="submit" 
                    class="w-full py-3 px-4 bg-[#3772FF] text-white rounded-lg font-medium
                           transform transition-all duration-200 
                           hover:bg-[#2952cc] hover:shadow-lg hover:-translate-y-0.5
                           focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3772FF]"
                >
                    Sign in
                </button>
            </form>

            <!-- Social Login -->
            <div class="relative">
                <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-gray-200"></div>
                </div>
                <div class="relative flex justify-center text-sm">
                    <span class="px-2 bg-gray-50 text-gray-500">Or continue with</span>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
                <button class="social-button">
                    <img src="/images/google-icon.png" alt="Google" class="w-5 h-5" />
                    <span>Google</span>
                </button>
                <button class="social-button">
                    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z"/>
                    </svg>
                    <span>LinkedIn</span>
                </button>
            </div>

            <div class="text-center text-sm text-gray-500">
                Don't have an account? 
                <a href="/account/signup" class="text-[#3772FF] font-medium hover:underline">Sign up</a>
            </div>
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
</style> 