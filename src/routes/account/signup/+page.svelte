<script lang="ts">
    import { enhance } from '$app/forms';
    import { onMount } from 'svelte';
    import { signup } from '$lib/auth';
    import { goto } from '$app/navigation';
    
    // TypeScript declarations
    declare global {
        interface Window {
            grecaptcha: any;
            onRecaptchaVerify: (token: string) => void;
        }
    }
    
    let email = '';
    let password = '';
    let confirmPassword = '';
    let referralCode = '';
    let isAgreed = false;
    let isVerified = false;
    
    // Timer state
    let days = 0;
    let hours = 0;
    let minutes = 0;
    let seconds = 0;

    let sliderValue = 0;
    
    let isDragging = false;
    let startX = 0;
    let startLeft = 0;

    let showPassword = false;

    // Add these variables
    let firstName = '';
    let lastName = '';

    let errorMessage = '';
    let isLoading = false;

    onMount(() => {
        // Load reCAPTCHA script dynamically
        const script = document.createElement('script');
        script.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
        script.async = true;
        script.defer = true;
        
        script.onload = () => {
            window.grecaptcha.ready(() => {
                window.grecaptcha.render('recaptcha', {
                    'sitekey': '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI', // Replace with your site key
                    'callback': onRecaptchaVerify,
                    'theme': 'light',
                    'size': 'normal'
                });
            });
        };
        
        document.head.appendChild(script);
        
        return () => {
            document.head.removeChild(script);
        };
    });

    function updateTimer() {
        const now = new Date();
        const target = new Date('2024-12-31');
        const diff = target.getTime() - now.getTime();

        days = Math.floor(diff / (1000 * 60 * 60 * 24));
        hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        seconds = Math.floor((diff % (1000 * 60)) / 1000);
    }

    function onRecaptchaVerify(token: string) {
        isVerified = true;
    }

    function startDragging(event: MouseEvent) {
        isDragging = true;
        startX = event.clientX;
        startLeft = sliderValue;
        
        window.addEventListener('mousemove', handleDragging);
        window.addEventListener('mouseup', stopDragging);
    }

    function handleDragging(event: MouseEvent) {
        if (!isDragging) return;
        
        const delta = event.clientX - startX;
        const containerWidth = document.querySelector('.verify-container')?.clientWidth || 0;
        const newValue = Math.min(Math.max(startLeft + (delta / containerWidth) * 100, 0), 100);
        
        sliderValue = newValue;
        
        if (newValue > 90) {
            completeVerification();
        }
    }

    function stopDragging() {
        isDragging = false;
        if (!isVerified) {
            sliderValue = 0;
        }
        
        window.removeEventListener('mousemove', handleDragging);
        window.removeEventListener('mouseup', stopDragging);
    }

    function handleTouchStart(event: TouchEvent) {
        startX = event.touches[0].clientX;
        startLeft = sliderValue;
        
        window.addEventListener('touchmove', handleTouchMove);
        window.addEventListener('touchend', handleTouchEnd);
    }

    function handleTouchMove(event: TouchEvent) {
        const delta = event.touches[0].clientX - startX;
        const containerWidth = document.querySelector('.verify-container')?.clientWidth || 0;
        const newValue = Math.min(Math.max(startLeft + (delta / containerWidth) * 100, 0), 100);
        
        sliderValue = newValue;
        
        if (newValue > 90) {
            completeVerification();
        }
    }

    function handleTouchEnd() {
        if (!isVerified) {
            sliderValue = 0;
        }
        
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleTouchEnd);
    }

    function completeVerification() {
        sliderValue = 100;
        isVerified = true;
    }

    async function handleSubmit(event: Event) {
        event.preventDefault();
        
        if (!isVerified) {
            errorMessage = 'Please verify that you are not a robot';
            return;
        }

        if (password !== confirmPassword) {
            errorMessage = 'Passwords do not match';
            return;
        }

        if (!isAgreed) {
            errorMessage = 'Please agree to the terms and conditions';
            return;
        }

        try {
            isLoading = true;
            errorMessage = '';

            const signupData = {
                firstName,
                lastName,
                email,
                password,
                confirmPassword
            };

            const result = await signup(signupData);

            // If signup successful, redirect to login
            goto('/account/login?registered=true');

        } catch (error) {
            console.error('Signup error:', error);
            errorMessage = error.message || 'Failed to create account. Please try again.';
        } finally {
            isLoading = false;
        }
    }
</script>

<svelte:head>
    <script src="https://www.google.com/recaptcha/api.js" async defer></script>
</svelte:head>

<div class="flex min-h-screen max-h-screen overflow-hidden">
    <!-- Left Section - adjust padding and scaling -->
    <div class="w-1/2 bg-[#3772FF] p-8 flex flex-col relative overflow-hidden">
        <!-- Logo Section - reduce margin -->
        <div class="relative mb-6">
            <img src="/images/crypto images/LOGOOC.png" alt="XonBiT" class="h-8 object-contain" />
        </div>
        
        <!-- Content Section - adjust spacing -->
        <div class="flex-grow flex flex-col justify-between relative z-10">
            <div class="space-y-4">
                <div class="space-y-2">
                    <h1 class="text-white text-4xl font-bold leading-tight">
                        We make it easy to<br />
                        <span class="text-white/90">buy and sell</span><br />
                        cryptocurrency
                    </h1>
                    <p class="text-white/80 text-lg">Crypto Asset Exchange</p>
                </div>

                <!-- Crypto Image - adjust size -->
                <div class="relative">
                    <div class="absolute -top-4 -left-4 w-24 h-24 bg-white/5 rounded-full animate-pulse"></div>
                    <img 
                        src="/images/crypto images/icoco.png" 
                        alt="Crypto" 
                        class="w-56 relative z-10 drop-shadow-2xl transform hover:scale-105 transition-transform duration-300"
                    />
                </div>

                <!-- Timer Section - compact layout -->
                <div class="space-y-2">
                    <h3 class="text-white text-xl font-semibold">
                        Sign Up now and get down your
                        trading Fees to Zero!
                    </h3>
                    
                    <div class="space-y-1">
                        <p class="text-white/80 text-sm font-medium">Event ends in:</p>
                        <div class="flex gap-2">
                            {#each [
                                { value: days, label: 'D' },
                                { value: hours, label: 'H' },
                                { value: minutes, label: 'M' },
                                { value: seconds, label: 'S' }
                            ] as { value, label }}
                                <div class="group relative">
                                    <div class="relative bg-white/10 backdrop-blur-sm rounded-xl p-3 w-16
                                                border border-white/10 transform hover:scale-105 transition-all duration-300">
                                        <div class="text-2xl font-bold text-white">{value}</div>
                                        <div class="text-xs text-white/70">{label}</div>
                                    </div>
                                </div>
                            {/each}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Right Section - adjust padding and form spacing -->
    <div class="w-1/2 p-6 flex items-center bg-gray-50">
        <div class="w-full max-w-md mx-auto space-y-6">
            <!-- Form Header -->
            <div class="text-center space-y-1">
                <h2 class="text-xl font-bold text-gray-900">Create an Account</h2>
                <p class="text-sm text-gray-500">Join the world's leading crypto exchange</p>
            </div>

            <!-- Add error message display -->
            {#if errorMessage}
                <div class="p-3 mb-4 text-sm text-red-500 bg-red-50 rounded-lg">
                    {errorMessage}
                </div>
            {/if}

            <form class="space-y-4" on:submit={handleSubmit}>
                <!-- Name Fields in same line -->
                <div class="grid grid-cols-2 gap-3">
                    <!-- First Name Field -->
                    <div class="form-group">
                        <label class="form-label" for="firstName">
                            <span class="text-sm font-medium text-gray-700">First Name</span>
                            <span class="ml-1 text-xs text-[#3772FF]">*</span>
                        </label>
                        <div class="input-container">
                            <div class="input-icon">
                                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <input 
                                id="firstName"
                                type="text"
                                bind:value={firstName}
                                required
                                class="input-field"
                                placeholder="John"
                            />
                        </div>
                    </div>

                    <!-- Last Name Field -->
                    <div class="form-group">
                        <label class="form-label" for="lastName">
                            <span class="text-sm font-medium text-gray-700">Last Name</span>
                            <span class="ml-1 text-xs text-[#3772FF]">*</span>
                        </label>
                        <div class="input-container">
                            <div class="input-icon">
                                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <input 
                                id="lastName"
                                type="text"
                                bind:value={lastName}
                                required
                                class="input-field"
                                placeholder="Doe"
                            />
                        </div>
                    </div>
                </div>

                <!-- Email Field -->
                <div class="form-group">
                    <label class="form-label" for="email">
                        <span class="text-sm font-medium text-gray-700">Email</span>
                        <span class="ml-1 text-xs text-[#3772FF]">*</span>
                    </label>
                    <div class="input-container">
                        <div class="input-icon">
                            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                            </svg>
                        </div>
                        <input 
                            id="email"
                            type="email"
                            bind:value={email}
                            required
                            class="input-field"
                            placeholder="name@company.com"
                        />
                    </div>
                </div>

                <!-- Password Field -->
                <div class="form-group">
                    <label class="form-label" for="password">
                        <span class="text-sm font-medium text-gray-700">Password</span>
                        <span class="ml-1 text-xs text-[#3772FF]">*</span>
                    </label>
                    <div class="input-container">
                        <div class="input-icon">
                            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <input 
                            id="password"
                            type="password"
                            bind:value={password}
                            required
                            class="input-field"
                            placeholder="••••••••"
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
                    <div class="password-strength">
                        <div class="strength-bars">
                            <div class="bar" class:active={password.length > 0}></div>
                            <div class="bar" class:active={password.length > 8}></div>
                            <div class="bar" class:active={/[A-Z]/.test(password)}></div>
                            <div class="bar" class:active={/[0-9]/.test(password)}></div>
                        </div>
                        <span class="text-xs text-gray-500">Use 8+ characters with a mix of letters & numbers</span>
                    </div>
                </div>

                <!-- Confirm Password Field -->
                <div class="form-group">
                    <label class="form-label" for="confirmPassword">
                        <span class="text-sm font-medium text-gray-700">Confirm Password</span>
                        <span class="ml-1 text-xs text-[#3772FF]">*</span>
                    </label>
                    <div class="input-container">
                        <div class="input-icon">
                            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <input 
                            id="confirmPassword"
                            type="password"
                            bind:value={confirmPassword}
                            required
                            class="input-field"
                            placeholder="••••••••"
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
                </div>

                <!-- Referral Code Field -->
                <div class="form-group">
                    <label class="form-label" for="referralCode">
                        <span class="text-sm font-medium text-gray-700">Referral Code</span>
                        <span class="ml-1 text-xs text-gray-400">(Optional)</span>
                    </label>
                    <div class="input-container">
                        <div class="input-icon">
                            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                                      d="M15 9a3 3 0 11-6 0 3 3 0 016 0zm6 3a3 3 0 11-6 0 3 3 0 016 0zM6 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <input 
                            id="referralCode"
                            type="text"
                            bind:value={referralCode}
                            class="input-field"
                            placeholder="Enter referral code"
                        />
                    </div>
                </div>

                <!-- Enhanced Captcha Section -->
                <div class="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-sm font-medium text-gray-700">Security Check</span>
                        <button 
                            type="button"
                            class="text-[#3772FF] hover:text-[#2952cc] text-sm p-1"
                            on:click={() => {
                                sliderValue = 0;
                                isVerified = false;
                            }}
                        >
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </button>
                    </div>
                    
                    <div class="verify-container bg-gray-50 rounded-lg overflow-hidden h-12">
                        <div class="verify-track relative h-full">
                            <div class="verify-text flex items-center justify-center gap-2 h-full">
                                {#if !isVerified}
                                    <div class="flex items-center gap-2">
                                        <svg class="w-4 h-4 text-gray-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                                  d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span class="text-sm text-gray-500">Slide right to verify</span>
                                    </div>
                                {:else}
                                    <div class="flex items-center gap-2 text-green-500">
                                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                                  d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span class="text-sm font-medium">Verified</span>
                                    </div>
                                {/if}
                            </div>
                            
                            <div class="verify-progress absolute inset-0"
                                 style="transform: translateX({sliderValue - 100}%)">
                                <div class="h-full w-full bg-gradient-to-r from-[#3772FF]/5 to-[#3772FF]/20"></div>
                            </div>
                            
                            <div class="verify-thumb absolute top-1/2 -translate-y-1/2"
                                 style="left: {sliderValue}%"
                                 on:mousedown={startDragging}
                                 on:touchstart={handleTouchStart}>
                                <div class="w-8 h-8 bg-[#3772FF] rounded-full flex items-center justify-center
                                          shadow-lg cursor-pointer transform transition-all duration-200
                                          hover:scale-105 hover:shadow-xl active:scale-95">
                                    <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                              d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Submit Button -->
                <button 
                    type="submit" 
                    class="w-full py-2.5 bg-[#3772FF] text-white rounded-lg font-medium
                           transform transition-all duration-200 
                           hover:bg-[#2952cc] hover:shadow-lg
                           focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3772FF]
                           disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!isVerified || !isAgreed || isLoading}
                >
                    {#if isLoading}
                        <div class="flex items-center justify-center gap-2">
                            <svg class="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                            </svg>
                            Creating account...
                        </div>
                    {:else}
                        Create Account
                    {/if}
                </button>

                <!-- Terms Agreement moved below button -->
                <div class="flex items-center justify-center gap-2 mt-4">
                    <div class="relative">
                        <input 
                            type="checkbox" 
                            bind:checked={isAgreed}
                            id="terms"
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
                            <path 
                                stroke-linecap="round" 
                                stroke-linejoin="round" 
                                stroke-width="3" 
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                    <label for="terms" class="text-sm text-gray-600 select-none">
                        I agree to the <a href="/terms" class="text-[#3772FF] hover:underline font-medium">Terms</a> and 
                        <a href="/privacy" class="text-[#3772FF] hover:underline font-medium">Privacy Policy</a>
                    </label>
                </div>

                <!-- Simple Sign In Link -->
                <div class="text-center text-sm text-gray-500">
                    Already have an account? 
                    <a href="/account/login" class="text-[#3772FF] font-medium hover:underline">Sign in</a>
                </div>
            </form>
        </div>
    </div>
</div>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
        overflow-x: hidden;
    }

    input:focus {
        outline: none;
    }

    /* Smooth transitions */
    .transition-all {
        transition-property: all;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 150ms;
    }

    input[type="checkbox"]:focus {
        outline: 2px solid #3772FF;
        outline-offset: 2px;
    }
    
    input[type="checkbox"]:hover {
        border-color: #3772FF;
    }

    input[type="range"] {
        -webkit-appearance: none;
        appearance: none;
        background: transparent;
    }
    
    input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 40px;
        height: 40px;
        background: transparent;
        cursor: pointer;
    }
    
    input[type="range"]::-moz-range-thumb {
        width: 40px;
        height: 40px;
        background: transparent;
        cursor: pointer;
        border: none;
    }
    
    .slider-track {
        transition: transform 0.3s ease;
    }

    .verify-container {
        position: relative;
        width: 100%;
        background: #f8fafc;
        border-radius: 0.75rem;
        overflow: hidden;
        touch-action: none;
    }

    .verify-track {
        background: #fff;
        border: 2px solid #e2e8f0;
        border-radius: 0.75rem;
        transition: all 0.3s ease;
    }

    .verify-track:hover {
        border-color: #3772FF;
        box-shadow: 0 0 0 4px rgba(55, 114, 255, 0.1);
    }

    .verify-text {
        transition: all 0.3s ease;
    }

    .verify-progress {
        transition: transform 0.3s ease;
    }

    /* Add these styles */
    :global(html), :global(body) {
        height: 100vh;
        overflow: hidden;
    }

    .overflow-y-auto {
        scrollbar-width: thin;
        scrollbar-color: #3772FF #f1f5f9;
    }

    .overflow-y-auto::-webkit-scrollbar {
        width: 6px;
    }

    .overflow-y-auto::-webkit-scrollbar-track {
        background: #f1f5f9;
    }

    .overflow-y-auto::-webkit-scrollbar-thumb {
        background-color: #3772FF;
        border-radius: 3px;
    }

    /* Add these new styles */
    .form-group {
        @apply space-y-1.5 mb-4;
    }

    .form-label {
        @apply flex items-center mb-1.5;
    }

    .input-container {
        @apply relative flex items-center;
    }

    .input-icon {
        @apply absolute left-3 text-gray-400 pointer-events-none;
    }

    .input-field {
        @apply w-full pl-10 pr-4 py-2.5 bg-white text-gray-900 text-sm
               border border-gray-200 rounded-xl
               placeholder:text-gray-400
               transition duration-200
               focus:outline-none focus:ring-2 focus:ring-[#3772FF]/20 focus:border-[#3772FF]
               hover:border-[#3772FF]/50;
    }

    .input-action-btn {
        @apply absolute right-3 text-gray-400 
               hover:text-gray-600 transition-colors duration-200;
    }

    .password-strength {
        @apply mt-2 space-y-1;
    }

    .strength-bars {
        @apply flex gap-1;
    }

    .bar {
        @apply h-1 flex-1 rounded-full bg-gray-200 transition-colors duration-300;
    }

    .bar.active {
        @apply bg-[#3772FF];
    }

    /* Custom focus styles */
    .input-field:focus {
        @apply shadow-[0_0_0_4px_rgba(55,114,255,0.1)];
    }

    /* Custom hover styles */
    .input-container:hover .input-icon {
        @apply text-gray-500;
    }

    /* Error state */
    .input-field.error {
        @apply border-red-500 focus:ring-red-500/20 focus:border-red-500;
    }

    /* Success state */
    .input-field.success {
        @apply border-green-500 focus:ring-green-500/20 focus:border-green-500;
    }

    .form-checkbox-input {
        @apply h-4 w-4 text-[#3772FF] focus:ring-[#3772FF] border-gray-300 rounded
               transition-colors duration-200;
    }

    .form-checkbox-label {
        @apply ml-2 block text-sm text-gray-600;
    }

    .social-button {
        @apply w-full inline-flex justify-center items-center gap-2 px-4 py-2.5
               bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700
               hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3772FF]
               transition-all duration-200;
    }

    /* Enhanced checkbox styles */
    input[type="checkbox"] {
        background-image: none;
    }

    input[type="checkbox"]:hover {
        @apply border-[#3772FF]/50;
    }

    input[type="checkbox"]:checked:hover {
        @apply bg-[#2952cc] border-[#2952cc];
    }

    input[type="checkbox"]:focus {
        @apply outline-none ring-2 ring-offset-2 ring-[#3772FF]/20;
    }
</style> 