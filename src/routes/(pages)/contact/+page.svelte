<script lang="ts">
import { fade } from 'svelte/transition';
import { notifications } from '$lib/stores/notifications';

let formData = {
    name: '',
    email: '',
    subject: '',
    message: ''
};

async function handleSubmit() {
    try {
        // Here you would typically send the form data to your backend
        notifications.success('Message sent successfully!');
        formData = { name: '', email: '', subject: '', message: '' };
    } catch (error) {
        notifications.error('Failed to send message. Please try again.');
    }
}
</script>

<div class="max-w-4xl mx-auto px-4 py-12" in:fade>
    <h1 class="text-4xl font-bold text-gray-900 mb-8">Contact Us</h1>

    <div class="grid md:grid-cols-2 gap-12">
        <!-- Contact Information -->
        <div>
            <h2 class="text-2xl font-semibold mb-6">Get in Touch</h2>
            <div class="space-y-8">
                <div>
                    <h3 class="text-lg font-medium mb-2">24/7 Support</h3>
                    <p class="text-gray-600 mb-2">We're here to help you</p>
                    <a href="mailto:support@coinsna.com" class="text-blue-600 hover:text-blue-700">
                        support@coinsna.com
                    </a>
                </div>

                <div>
                    <h3 class="text-lg font-medium mb-2">Business Inquiries</h3>
                    <p class="text-gray-600 mb-2">For partnerships and business opportunities</p>
                    <a href="mailto:business@coinsna.com" class="text-blue-600 hover:text-blue-700">
                        business@coinsna.com
                    </a>
                </div>

                <div>
                    <h3 class="text-lg font-medium mb-2">Office Location</h3>
                    <p class="text-gray-600">
                        123 Crypto Street<br>
                        Digital City, DC 12345<br>
                        United States
                    </p>
                </div>

                <div>
                    <h3 class="text-lg font-medium mb-4">Connect With Us</h3>
                    <div class="flex space-x-4">
                        <a href="https://twitter.com/coinsna" target="_blank" rel="noopener noreferrer" 
                           class="text-gray-400 hover:text-blue-500 transition-colors">
                            <span class="sr-only">Twitter</span>
                            <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                            </svg>
                        </a>
                        <a href="https://telegram.com/coinsna" target="_blank" rel="noopener noreferrer"
                           class="text-gray-400 hover:text-blue-500 transition-colors">
                            <span class="sr-only">Telegram</span>
                            <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .24z"/>
                            </svg>
                        </a>
                        <a href="https://discord.gg/coinsna" target="_blank" rel="noopener noreferrer"
                           class="text-gray-400 hover:text-indigo-500 transition-colors">
                            <span class="sr-only">Discord</span>
                            <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <!-- Contact Form -->
        <div>
            <h2 class="text-2xl font-semibold mb-6">Send us a Message</h2>
            <form class="space-y-4" on:submit|preventDefault={handleSubmit}>
                <div>
                    <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                        type="text"
                        id="name"
                        bind:value={formData.name}
                        class="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        required
                    />
                </div>

                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        id="email"
                        bind:value={formData.email}
                        class="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        required
                    />
                </div>

                <div>
                    <label for="subject" class="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <input
                        type="text"
                        id="subject"
                        bind:value={formData.subject}
                        class="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        required
                    />
                </div>

                <div>
                    <label for="message" class="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea
                        id="message"
                        bind:value={formData.message}
                        rows="5"
                        class="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        required
                    ></textarea>
                </div>

                <button
                    type="submit"
                    class="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Send Message
                </button>
            </form>
        </div>
    </div>
</div>