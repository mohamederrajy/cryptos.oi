// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      user: {
        email: string;
        [key: string]: any;
      } | null;
      token: string | null;
    }
    // interface PageData {}
    // interface Platform {}
  }
}

declare global {
    interface Window {
        userSession?: {
            user: any;
            isVerified: boolean;
            token: string;
            isAuthenticated: boolean;
        } | null;
        grecaptcha: any;
        onRecaptchaVerify: (token: string) => void;
    }
}

// declare global "glightbox";

export { }

/// <reference types="@sveltejs/kit" />
