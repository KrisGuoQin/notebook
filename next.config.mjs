/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },
    async redirects() {
        return [
            {
                source: '/',
                destination: '/home',
                permanent: true
            }
        ]
    }
};

export default nextConfig;
