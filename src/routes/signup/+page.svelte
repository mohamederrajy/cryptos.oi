<script lang="ts">
    import { enhance } from '$app/forms';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { notifications } from '$lib/stores/notifications';
    import { session } from '$lib/stores/session';
    import { fade } from 'svelte/transition';
    import { PUBLIC_API_URL } from '$env/static/public';
    
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

    let recaptchaLoaded = false;

    let error: Error | null = null;

    onMount(() => {
        if (typeof window !== 'undefined') {
            // Load reCAPTCHA script dynamically
            const script = document.createElement('script');
            script.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
            script.async = true;
            script.defer = true;
            
            script.onload = () => {
                recaptchaLoaded = true;
                if (window.grecaptcha) {
                    window.grecaptcha.ready(() => {
                        try {
                            window.grecaptcha.render('recaptcha', {
                                'sitekey': '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
                                'callback': onRecaptchaVerify,
                                'theme': 'light',
                                'size': 'normal'
                            });
                        } catch (error) {
                            console.error('reCAPTCHA render error:', error);
                        }
                    });
                }
            };
            
            document.head.appendChild(script);
        }
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

            const response = await fetch(`${PUBLIC_API_URL}/api/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    password,
                    confirmPassword
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to create account');
            }

            // Show success notification
            notifications.success('Account created successfully! Redirecting to login...');

            // Redirect to login page
            goto('/login', { replaceState: true });

        } catch (err) {
            error = err instanceof Error ? err : new Error('An unknown error occurred');
            console.error('Submit error:', error);
            errorMessage = error.message || 'Failed to create account. Please try again.';
            notifications.error(errorMessage);
        } finally {
            isLoading = false;
        }
    }
</script>

<svelte:head>
    <script src="https://www.google.com/recaptcha/api.js" async defer></script>
</svelte:head>

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
                {/if}
                <p class="text-sm font-medium">{$notifications.message}</p>
            </div>
        </div>
    </div>
{/if}

<div class="flex flex-col lg:flex-row min-h-screen overflow-y-auto">
    <!-- Left Section - Update overflow handling -->
    <div class="w-full lg:w-1/2 bg-gradient-to-br from-[#3772FF] to-[#2952cc] p-3 sm:p-4 lg:p-8 flex flex-col relative">
        <!-- Logo Section - Adjust mobile size -->
        <div class="relative mb-3 sm:mb-4 lg:mb-12">
            <div class="flex items-center">
                <img 
                    src="/images/LOGwOOC.png" 
                    alt="Logo" 
                    class="h-7 sm:h-8 lg:h-14 object-contain" 
                />
            </div>
        </div>
        
        <!-- Content Section - Improve mobile spacing -->
        <div class="flex-grow flex flex-col justify-center relative z-10 py-3 sm:py-4 lg:py-0">
            <!-- Stats Section - Better mobile layout -->
            <div class="flex gap-2 sm:gap-3 lg:gap-6 mb-4 sm:mb-6 lg:mb-12">
                <div class="bg-white/10 backdrop-blur-lg rounded-xl p-2 sm:p-3 lg:p-4 flex-1">
                    <div class="text-white/60 text-xs lg:text-sm mb-0.5 sm:mb-1">Active Users</div>
                    <div class="text-white text-sm sm:text-base lg:text-2xl font-bold">250K+</div>
                </div>
                <div class="bg-white/10 backdrop-blur-lg rounded-xl p-2 sm:p-3 lg:p-4 flex-1">
                    <div class="text-white/60 text-xs lg:text-sm mb-0.5 sm:mb-1">Daily Volume</div>
                    <div class="text-white text-sm sm:text-base lg:text-2xl font-bold">$2.5M</div>
                </div>
            </div>

            <!-- Main Content - Adjust text sizes -->
            <div class="space-y-3 sm:space-y-4 lg:space-y-6 max-w-lg">
                <div class="space-y-2 lg:space-y-4">
                    <h1 class="text-xl sm:text-2xl lg:text-5xl text-white font-bold leading-tight">
                        Welcome to the Future of Trading
                    </h1>
                    <p class="text-sm sm:text-base lg:text-xl text-white/80 leading-relaxed">
                        Experience secure, professional, and lightning-fast crypto trading with advanced tools and real-time analytics.
                    </p>
                </div>

                <!-- Features List - Adjust spacing -->
                <div class="space-y-3 lg:space-y-4 mt-4 lg:mt-8">
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

                <!-- Special Offer Section - Adjust for mobile -->
                <div class="mt-8 lg:mt-12 bg-white/10 backdrop-blur-lg rounded-xl p-4 lg:p-6">
                    <h3 class="text-lg lg:text-xl text-white font-semibold mb-3 lg:mb-4">
                        Limited Time Offer! 🚀
                    </h3>
                    <p class="text-sm lg:text-base text-white/80 mb-4">
                        Sign up now and get 0% trading fees for 30 days!
                    </p>
                    <div class="flex gap-4">
                        {#each [
                            { value: days, label: 'Days' },
                            { value: hours, label: 'Hours' },
                            { value: minutes, label: 'Mins' },
                            { value: seconds, label: 'Secs' }
                        ] as { value, label }}
                            <div class="bg-white/10 rounded-lg p-2 text-center min-w-[60px]">
                                <div class="text-white text-xl font-bold">{value}</div>
                                <div class="text-white/60 text-xs">{label}</div>
                            </div>
                        {/each}
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Right Section - Update overflow handling -->
    <div class="w-full lg:w-1/2 p-3 sm:p-4 lg:p-8 bg-gray-50/50 backdrop-blur-sm">
        <div class="w-full max-w-md mx-auto space-y-4 sm:space-y-6">
            <!-- Form header adjustments -->
            <div class="text-center space-y-1 sm:space-y-2 lg:space-y-3">
                <h2 class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Create Your Account</h2>
                <p class="text-xs sm:text-sm lg:text-base text-gray-500">Join thousands of traders worldwide</p>
            </div>

            <!-- Update the style section with enhanced mobile responsiveness -->
            <style>
                /* Mobile-first approach */
                @media (max-width: 640px) {
                    .input-field {
                        @apply py-3 text-sm;
                        height: 48px;
                    }

                    .form-label {
                        @apply text-sm mb-1;
                    }

                    .input-icon {
                        @apply w-4 h-4;
                    }

                    .form-group {
                        @apply mb-4;
                    }

                    .grid-cols-2 {
                        @apply gap-2;
                    }

                    button[type="submit"] {
                        @apply py-3 text-sm;
                        height: 48px;
                    }

                    .verify-container {
                        height: 48px;
                    }

                    .verify-thumb {
                        @apply w-8 h-8;
                    }

                    input[type="checkbox"] {
                        @apply w-5 h-5;
                    }

                    .space-y-4 > * {
                        margin-top: 1rem;
                        margin-bottom: 1rem;
                    }
                }

                /* Tablet improvements */
                @media (min-width: 641px) and (max-width: 1024px) {
                    .input-field {
                        @apply py-3.5 text-base;
                        height: 52px;
                    }

                    .form-label {
                        @apply text-base mb-1.5;
                    }

                    .input-icon {
                        @apply w-5 h-5;
                    }

                    .form-group {
                        @apply mb-5;
                    }

                    .grid-cols-2 {
                        @apply gap-3;
                    }

                    button[type="submit"] {
                        @apply py-3.5 text-base;
                        height: 52px;
                    }

                    .verify-container {
                        height: 56px;
                    }

                    .verify-thumb {
                        @apply w-10 h-10;
                    }

                    input[type="checkbox"] {
                        @apply w-5 h-5;
                    }

                    .space-y-6 > * {
                        margin-top: 1.25rem;
                        margin-bottom: 1.25rem;
                    }
                }

                /* Touch-specific improvements */
                @media (hover: none) and (pointer: coarse) {
                    .input-field, button, a {
                        @apply min-h-[44px]; /* Minimum touch target size */
                    }

                    .input-action-btn {
                        @apply p-2; /* Larger touch area for buttons */
                    }

                    a {
                        @apply py-2 px-3 inline-block;
                    }
                }

                /* Better form spacing for small screens */
                @media (max-height: 700px) {
                    .space-y-4 > * {
                        margin-top: 0.75rem;
                        margin-bottom: 0.75rem;
                    }

                    .form-group {
                        @apply mb-3;
                    }
                }

                /* iOS-specific fixes */
                @supports (-webkit-touch-callout: none) {
                    .min-h-screen {
                        min-height: -webkit-fill-available;
                    }

                    .input-field {
                        @apply appearance-none;
                    }
                }

                /* Improved scrolling */
                .overflow-y-auto {
                    -webkit-overflow-scrolling: touch;
                    scroll-behavior: smooth;
                }

                /* Better form element spacing */
                .form-group {
                    @apply relative;
                }

                .input-container {
                    @apply relative flex items-center bg-white;
                }

                .input-field {
                    @apply w-full rounded-xl border border-gray-200
                           transition-all duration-200
                           focus:outline-none focus:ring-2 focus:ring-[#3772FF]/20
                           focus:border-[#3772FF];
                }

                /* Enhanced touch feedback */
                .input-field:active {
                    @apply bg-gray-50;
                }

                button:active {
                    @apply transform scale-95;
                }
            </style>

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

            <form class="space-y-6" on:submit={handleSubmit}>
                <!-- Name Fields with enhanced styling -->
                <div class="grid grid-cols-2 gap-4">
                    <div class="form-group">
                        <label class="form-label" for="firstName">
                            <span class="text-sm font-medium text-gray-700">First Name</span>
                            <span class="ml-1 text-xs text-[#3772FF]">*</span>
                        </label>
                        <div class="input-wrapper group">
                            <div class="input-container hover:border-[#3772FF]/50 focus-within:border-[#3772FF] focus-within:ring-2 ring-[#3772FF]/20">
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
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="lastName">
                            <span class="text-sm font-medium text-gray-700">Last Name</span>
                            <span class="ml-1 text-xs text-[#3772FF]">*</span>
                        </label>
                        <div class="input-wrapper group">
                            <div class="input-container hover:border-[#3772FF]/50 focus-within:border-[#3772FF] focus-within:ring-2 ring-[#3772FF]/20">
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
                </div>

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
                                type="email"
                                bind:value={email}
                                required
                                class="input-field"
                                placeholder="name@company.com"
                            />
                        </div>
                    </div>
                </div>

                <!-- Enhanced Password Fields -->
                <div class="space-y-4">
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
                                        type="text"
                                        bind:value={password}
                                        required
                                        class="input-field"
                                        placeholder="••••••••"
                                    />
                                {:else}
                                    <input 
                                        id="password"
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
                            </div>
                        </div>
                    </div>
                    <!-- Enhanced Password Strength Indicator -->
                    <div class="mt-2 space-y-2">
                        <div class="flex gap-2">
                            {#each Array(4) as _, i}
                                <div class="h-1 flex-1 rounded-full transition-all duration-300"
                                     class:bg-gray-200={i >= password.length/2}
                                     class:bg-red-400={password.length/2 > 0 && i < 1}
                                     class:bg-orange-400={password.length/2 >= 2 && i < 2}
                                     class:bg-yellow-400={password.length/2 >= 3 && i < 3}
                                     class:bg-green-400={password.length/2 >= 4 && i < 4}>
                                </div>
                            {/each}
                        </div>
                        <div class="flex gap-4 text-xs">
                            <div class="flex items-center gap-1 text-gray-500">
                                <svg class="w-4 h-4" class:text-green-500={password.length >= 8} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={password.length >= 8 ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"} />
                                </svg>
                                <span>8+ Characters</span>
                            </div>
                            <div class="flex items-center gap-1 text-gray-500">
                                <svg class="w-4 h-4" class:text-green-500={/[A-Z]/.test(password)} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={/[A-Z]/.test(password) ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"} />
                                </svg>
                                <span>Uppercase</span>
                            </div>
                            <div class="flex items-center gap-1 text-gray-500">
                                <svg class="w-4 h-4" class:text-green-500={/[0-9]/.test(password)} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={/[0-9]/.test(password) ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"} />
                                </svg>
                                <span>Number</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Confirm Password -->
                <div class="form-group">
                    <label class="form-label" for="confirmPassword">
                        <span class="text-sm font-medium text-gray-700">Confirm Password</span>
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
                                    id="confirmPassword"
                                    type="text"
                                    bind:value={confirmPassword}
                                    required
                                    class="input-field"
                                    placeholder="••••••••"
                                />
                            {:else}
                                <input 
                                    id="confirmPassword"
                                    type="password"
                                    bind:value={confirmPassword}
                                    required
                                    class="input-field"
                                    placeholder="••••••••"
                                />
                            {/if}
                        </div>
                    </div>
                </div>

                <!-- Enhanced Security Check -->
                <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
                    <div class="flex items-center justify-between">
                        <span class="text-sm font-medium text-gray-700">Security Verification</span>
                        {#if isVerified}
                            <span class="text-xs font-medium text-green-500 bg-green-50 px-2 py-1 rounded-full">
                                Verified ✓
                            </span>
                        {/if}
                    </div>
                    
                    <div class="verify-container bg-gray-50 rounded-xl overflow-hidden">
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

                <!-- Enhanced Terms Agreement -->
                <div class="flex items-start gap-3">
                    <div class="relative flex items-start pt-1">
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
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                        </svg>
                    </div>
                    <label for="terms" class="text-sm text-gray-600 leading-tight">
                        I agree to the <a href="/terms" class="text-[#3772FF] hover:underline font-medium">Terms of Service</a> and 
                        <a href="/privacy" class="text-[#3772FF] hover:underline font-medium">Privacy Policy</a>, including 
                        <a href="/cookie-policy" class="text-[#3772FF] hover:underline font-medium">Cookie Use</a>.
                    </label>
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
                    disabled={!isVerified || !isAgreed || isLoading}
                >
                    <span class="relative z-10 flex items-center justify-center gap-2">
                        {#if isLoading}
                            <svg class="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                            </svg>
                            <span>Creating your account...</span>
                        {:else}
                            <span>Create Account</span>
                            <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        {/if}
                    </span>
                </button>

                <!-- Enhanced Sign In Link -->
                <div class="text-center space-y-4">
                    <div class="relative">
                        <div class="absolute inset-0 flex items-center">
                            <div class="w-full border-t border-gray-200"></div>
                        </div>
                        <div class="relative flex justify-center text-sm">
                            <span class="px-2 bg-gray-50 text-gray-500">Already have an account?</span>
                        </div>
                    </div>
                    <a 
                        href="/login" 
                        class="inline-flex items-center justify-center px-4 py-2 border border-[#3772FF] text-sm font-medium rounded-xl text-[#3772FF] bg-transparent hover:bg-[#3772FF]/5 transition-colors duration-200"
                    >
                        Sign in to your account
                    </a>
                </div>
            </form>
        </div>
    </div>
</div>

{#if error}
    <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong class="font-bold">Error!</strong>
        <span class="block sm:inline">{error.message}</span>
    </div>
{/if}

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
        height: 100%;
        overflow-y: auto !important;
    }

    .overflow-y-auto {
        scrollbar-width: thin;
        scrollbar-color: #3772FF #f1f5f9;
        -webkit-overflow-scrolling: touch;
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

    /* Update responsive styles */
    @media (max-width: 1024px) {
        :global(body) {
            @apply overflow-y-auto;
        }

        .max-h-screen {
            max-height: none;
        }

        .min-h-screen {
            min-height: 100%;
        }
    }

    /* Add touch-friendly adjustments for mobile */
    @media (max-width: 768px) {
        .input-field {
            @apply py-3.5 text-base;  /* Larger input fields */
        }

        .form-label {
            @apply text-base;  /* Larger labels */
        }

        button[type="submit"] {
            @apply py-4 text-base;  /* Larger submit button */
        }

        .verify-container {
            height: 64px;  /* Larger verification slider */
        }

        .verify-thumb {
            @apply w-12 h-12;  /* Larger slider thumb */
        }

        /* Improve touch targets */
        input[type="checkbox"] {
            @apply w-6 h-6;
        }

        /* Better spacing for mobile */
        .space-y-6 > * {
            margin-top: 1.5rem;
            margin-bottom: 1.5rem;
        }

        /* Adjust form groups for better mobile spacing */
        .form-group {
            @apply mb-6;
        }

        /* Make links more touchable */
        a {
            @apply py-2 px-3 inline-block;
        }
    }

    /* Fix iOS height issues */
    @supports (-webkit-touch-callout: none) {
        .min-h-screen {
            min-height: 100%;
        }
    }

    /* Improve scrolling behavior */
    .overflow-y-auto {
        -webkit-overflow-scrolling: touch;
    }
</style> 