export type Wallpaper = {
id: string;
title?: string;
url: string; // Tam çözünürlüklü görsel URL'si
thumb?: string; // İsteğe bağlı küçük önizleme
fileName?: string;// Kaydederken kullanmak için (örn: "neon-hills.jpg")
};


export const WALLPAPERS: Wallpaper[] = [
{
id: 'neon-hills',
title: 'Neon Hills',
url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=2048',
thumb: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600',
fileName: 'neon-hills.jpg',
},
{
id: 'cosmic-waves',
title: 'Cosmic Waves',
url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=2048',
thumb: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600',
fileName: 'cosmic-waves.jpg',
},
{
id: 'city-night',
title: 'City Night',
url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=2048',
thumb: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600',
fileName: 'city-night.jpg',
},
{
id: 'pastel-sky',
title: 'Pastel Sky',
url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=2048',
thumb: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600',
fileName: 'pastel-sky.jpg',
},
];