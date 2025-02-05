<script lang="ts">
    import { enhance } from '$app/forms';
    import { onMount } from 'svelte';
    
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
            alert('Please verify that you are not a robot');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        if (!isAgreed) {
            alert('Please agree to the terms and conditions');
            return;
        }

        // Your form submission logic here
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
    <div class="w-1/2 p-8 flex items-center bg-gray-50 overflow-y-auto">
        <div class="w-full max-w-md mx-auto space-y-8">
            <!-- Form Header -->
            <div class="text-center space-y-2">
                <h2 class="text-2xl font-bold text-gray-900">Create an Account</h2>
                <p class="text-gray-500">Join the world's leading crypto exchange</p>
            </div>

            <form class="space-y-6" on:submit={handleSubmit}>
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

                <!-- Verification Slider -->
                <div class="verify-container">
                    <div class="verify-track">
                        <div class="verify-text">
                            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                      d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{isVerified ? 'Verified ✓' : 'Slide to verify →'}</span>
                        </div>
                        
                        <div class="verify-progress" 
                             style="transform: translateX({sliderValue}%)">
                        </div>
                        
                        <div class="verify-thumb" 
                             style="left: {sliderValue}%"
                             on:mousedown={startDragging}
                             on:touchstart={handleTouchStart}>
                            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                      d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                </div>

                <!-- Terms Agreement -->
                <div class="form-checkbox">
                    <input 
                        type="checkbox" 
                        bind:checked={isAgreed}
                        id="terms"
                        class="form-checkbox-input"
                    />
                    <label for="terms" class="form-checkbox-label">
                        I agree to the <a href="/terms" class="text-[#3772FF] hover:underline">Terms of Service</a> and 
                        <a href="/privacy" class="text-[#3772FF] hover:underline">Privacy Policy</a>
                    </label>
                </div>

                <!-- Submit Button -->
                <button 
                    type="submit" 
                    class="w-full py-3 px-4 bg-[#3772FF] text-white rounded-lg font-medium
                           transform transition-all duration-200 
                           hover:bg-[#2952cc] hover:shadow-lg hover:-translate-y-0.5
                           focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3772FF]
                           disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
                    disabled={!isVerified || !isAgreed}
                >
                    Create Account
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
                Already have an account? 
                <a href="/account/login" class="text-[#3772FF] font-medium hover:underline">Sign in</a>
            </div>
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
        height: 40px;
        background: #f8fafc;
        border-radius: 20px;
        overflow: hidden;
        touch-action: none;
    }

    .verify-track {
        position: relative;
        width: 100%;
        height: 100%;
        background: #fff;
        border: 2px solid #e2e8f0;
        border-radius: 20px;
        transition: border-color 0.3s ease;
    }

    .verify-track:hover {
        border-color: #3772FF;
    }

    .verify-text {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        color: #64748b;
        font-size: 14px;
        user-select: none;
        z-index: 1;
    }

    .verify-progress {
        position: absolute;
        left: -100%;
        top: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, #3772FF20 0%, #3772FF40 100%);
        transition: transform 0.3s ease;
    }

    .verify-thumb {
        position: absolute;
        top: 50%;
        width: 36px;
        height: 36px;
        background: #3772FF;
        border-radius: 18px;
        transform: translate(-50%, -50%);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        box-shadow: 0 4px 6px -1px rgb(55 114 255 / 0.2);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        z-index: 2;
    }

    .verify-thumb:hover {
        transform: translate(-50%, -50%) scale(1.05);
        box-shadow: 0 10px 15px -3px rgb(55 114 255 / 0.3);
    }

    .verify-thumb:active {
        transform: translate(-50%, -50%) scale(0.95);
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
</style> 