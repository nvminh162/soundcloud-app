import type { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*', // cho phép các con bot của các ông lớn <gg, fb, ms, ... đào dữ liệu>
        allow: ['/'],
        disallow: '/private/',
      },
      {
        userAgent: ['Applebot', 'Bingbot'],
        disallow: ['/'],
      },
    ],
    sitemap: 'http://localhost:3000/sitemap.xml',
  }
}