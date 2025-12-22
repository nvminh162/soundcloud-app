/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    reactStrictMode: true,
    swcMinify: true,
    modularizeImports: {
        '@mui/icons-material': {
            transform: '@mui/icons-material/{{member}}',
        },
    },
    images: {
        // local dev
        /* remotePatterns: [
            {
                // protocol: 'https', // production
                // hostname: 's3.amazonaws.com', // production
                protocol: 'http', // localhost
                hostname: 'localhost', // localhost
                port: '8000',
                pathname: '/images/**',
            },
        ], */
        // with docker
        remotePatterns: [
            {
                // protocol: 'https', // production
                // hostname: 's3.amazonaws.com', // production
                protocol: 'http', // localhost
                hostname: 'host.docker.internal', // localhost with docker
                port: '8001',
                pathname: '/images/**',
            },
        ],
    },
    /*
    +thẻ <img src=?/> mặc định sẽ dùng src
    +thẻ <Image src=?/> sẽ convert sang srcset='/_next/image?url=?&w=?&h=?' => sẽ có khái niệm là responsive image
    (ứng với một loại màn hình nextjs sẽ load 1 hình ảnh nhất định Laptop(big), Tablet(medium), Mobile(small) => nextjs đã làm chia kích thước màn hình responsive sẵn rồi!)
     */
};

module.exports = nextConfig;
