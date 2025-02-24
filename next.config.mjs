/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        domains: ["lh3.googleusercontent.com"],
    },
    env: {
        WATSONX_API_KEY: process.env.WATSONX_API_KEY, // Expose API key
    },
};

export default nextConfig;
