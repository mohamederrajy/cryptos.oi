<script lang="ts">
    import { fade } from 'svelte/transition';
</script>

<div class="max-w-4xl mx-auto px-4 py-12" in:fade>
    <h1 class="text-4xl font-bold text-gray-900 mb-8">Compliance & Regulations</h1>
    
    <div class="prose prose-lg max-w-none space-y-12">
        <!-- KYC Section -->
        <section class="bg-white p-8 rounded-xl border border-gray-200">
            <h2 class="text-2xl font-semibold mb-6">Know Your Customer (KYC)</h2>
            <p class="text-gray-600 mb-6">
                At Coinsna, we implement strict KYC procedures to prevent fraud and ensure compliance 
                with international regulations. Our verification process is designed to be secure and efficient.
            </p>
            <div class="grid md:grid-cols-3 gap-6">
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h3 class="font-medium mb-2">Level 1 Verification</h3>
                    <ul class="text-sm text-gray-600 space-y-2">
                        <li>Email verification</li>
                        <li>Phone verification</li>
                        <li>Basic personal info</li>
                        <li>Daily limit: $2,000</li>
                    </ul>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h3 class="font-medium mb-2">Level 2 Verification</h3>
                    <ul class="text-sm text-gray-600 space-y-2">
                        <li>Government ID</li>
                        <li>Proof of address</li>
                        <li>Face verification</li>
                        <li>Daily limit: $100,000</li>
                    </ul>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h3 class="font-medium mb-2">Level 3 Verification</h3>
                    <ul class="text-sm text-gray-600 space-y-2">
                        <li>Enhanced due diligence</li>
                        <li>Source of funds</li>
                        <li>Video verification</li>
                        <li>Custom limits</li>
                    </ul>
                </div>
            </div>
        </section>

        <!-- AML Section -->
        <section class="bg-white p-8 rounded-xl border border-gray-200">
            <h2 class="text-2xl font-semibold mb-6">Anti-Money Laundering (AML)</h2>
            <p class="text-gray-600 mb-6">
                Our comprehensive AML policy is designed to prevent and detect suspicious activities. 
                We employ advanced monitoring systems and follow strict reporting procedures.
            </p>
            <div class="space-y-4">
                <div class="flex items-start gap-3">
                    <div class="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <svg class="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                        </svg>
                    </div>
                    <div>
                        <h3 class="font-medium mb-1">Transaction Monitoring</h3>
                        <p class="text-sm text-gray-600">Real-time monitoring of all transactions for suspicious patterns</p>
                    </div>
                </div>
                <div class="flex items-start gap-3">
                    <div class="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <svg class="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                        </svg>
                    </div>
                    <div>
                        <h3 class="font-medium mb-1">Risk Assessment</h3>
                        <p class="text-sm text-gray-600">Regular assessment of money laundering and terrorist financing risks</p>
                    </div>
                </div>
                <div class="flex items-start gap-3">
                    <div class="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <svg class="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                        </svg>
                    </div>
                    <div>
                        <h3 class="font-medium mb-1">Staff Training</h3>
                        <p class="text-sm text-gray-600">Regular training for all staff on AML procedures and regulations</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Regulatory Compliance -->
        <section class="bg-white p-8 rounded-xl border border-gray-200">
            <h2 class="text-2xl font-semibold mb-6">Regulatory Framework</h2>
            <p class="text-gray-600 mb-6">
                Coinsna maintains strict compliance with relevant regulations in all operating jurisdictions. 
                We work closely with regulatory bodies to ensure the highest standards of compliance.
            </p>
            <div class="bg-blue-50 p-6 rounded-xl">
                <h3 class="font-medium mb-4">Our Compliance Commitments:</h3>
                <ul class="space-y-3 text-gray-600">
                    <li class="flex items-center gap-2">
                        <svg class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                        </svg>
                        <span>Regular compliance audits and assessments</span>
                    </li>
                    <li class="flex items-center gap-2">
                        <svg class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                        </svg>
                        <span>Cooperation with law enforcement agencies</span>
                    </li>
                    <li class="flex items-center gap-2">
                        <svg class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                        </svg>
                        <span>Transparent reporting procedures</span>
                    </li>
                </ul>
            </div>
        </section>
    </div>
</div> 