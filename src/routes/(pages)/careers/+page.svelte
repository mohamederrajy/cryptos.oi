<script lang="ts">
    import { fade } from 'svelte/transition';

    interface JobPosting {
        id: string;
        title: string;
        department: string;
        location: string;
        type: string;
        description: string;
        requirements: string[];
        benefits: string[];
    }

    const jobPostings: JobPosting[] = [
        {
            id: "eng-001",
            title: "Senior Backend Engineer",
            department: "Engineering",
            location: "Remote / New York",
            type: "Full-time",
            description: "Join our core engineering team to build and scale our distributed trading systems.",
            requirements: [
                "5+ years of experience with backend development",
                "Strong knowledge of Node.js and TypeScript",
                "Experience with distributed systems",
                "Understanding of blockchain technology",
                "Experience with high-performance trading systems"
            ],
            benefits: [
                "Competitive salary and equity",
                "Health, dental, and vision insurance",
                "Flexible working hours",
                "Remote work options",
                "Learning and development budget"
            ]
        },
        {
            id: "prod-001",
            title: "Product Manager",
            department: "Product",
            location: "San Francisco / Remote",
            type: "Full-time",
            description: "Lead the development of our next-generation crypto trading products.",
            requirements: [
                "3+ years of product management experience",
                "Experience with financial or crypto products",
                "Strong analytical and communication skills",
                "Track record of shipping successful products",
                "Understanding of crypto markets"
            ],
            benefits: [
                "Competitive compensation package",
                "Health and wellness benefits",
                "Unlimited PTO",
                "Home office stipend",
                "Professional development opportunities"
            ]
        }
    ];

    const values = [
        {
            title: "Innovation",
            icon: `<svg class="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M13 10V3L4 14h7v7l9-11h-7z"/>
                   </svg>`,
            description: "We push boundaries and embrace new technologies"
        },
        {
            title: "Collaboration",
            icon: `<svg class="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                   </svg>`,
            description: "We work together to achieve common goals"
        },
        {
            title: "Excellence",
            icon: `<svg class="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
                   </svg>`,
            description: "We strive for excellence in everything we do"
        }
    ];
</script>

<div class="max-w-7xl mx-auto px-4 py-12" in:fade>
    <!-- Hero Section -->
    <div class="text-center mb-16">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Join Our Team
        </h1>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Help us build the future of finance. We're looking for passionate individuals 
            who want to make a difference in the crypto space.
        </p>
    </div>

    <!-- Company Values -->
    <div class="mb-16">
        <h2 class="text-3xl font-bold text-center mb-12">Our Values</h2>
        <div class="grid md:grid-cols-3 gap-8">
            {#each values as value}
                <div class="bg-white p-8 rounded-xl border border-gray-200 text-center">
                    <div class="flex justify-center mb-4">
                        {@html value.icon}
                    </div>
                    <h3 class="text-xl font-semibold mb-2">{value.title}</h3>
                    <p class="text-gray-600">{value.description}</p>
                </div>
            {/each}
        </div>
    </div>

    <!-- Open Positions -->
    <div>
        <h2 class="text-3xl font-bold text-center mb-12">Open Positions</h2>
        <div class="space-y-6">
            {#each jobPostings as job}
                <div class="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-blue-500 transition-colors">
                    <div class="p-6">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-xl font-semibold text-gray-900">{job.title}</h3>
                            <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                {job.type}
                            </span>
                        </div>
                        <div class="grid md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                            <div class="flex items-center gap-2">
                                <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                                </svg>
                                {job.department}
                            </div>
                            <div class="flex items-center gap-2">
                                <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                </svg>
                                {job.location}
                            </div>
                        </div>
                        <p class="text-gray-600 mb-6">{job.description}</p>
                        <a 
                            href="/careers/{job.id}" 
                            class="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                        >
                            View Details
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                            </svg>
                        </a>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</div>

<style>
    /* Add smooth transitions */
    .hover\:border-blue-500:hover {
        transition: border-color 0.2s ease;
    }

    /* Add card hover effects */
    .rounded-xl {
        transition: transform 0.2s ease-in-out;
    }

    .rounded-xl:hover {
        transform: translateY(-2px);
    }
</style> 