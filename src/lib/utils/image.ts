import { PUBLIC_API_URL } from '$env/static/public';

export function getProfileImageUrl(imagePath: string) {
    if (!imagePath) return '';
    return imagePath.startsWith('http') ? imagePath : `${PUBLIC_API_URL}/${imagePath}`;
} 