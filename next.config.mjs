/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
            },
        ],
    },
    env: {
        NEXT_PUBLIC_WATSONX_API_KEY: process.env.WATSONX_API_KEY, // Expose API key
        NEXT_PUBLIC_KINDE_CLIENT_ID : process.env.KINDE_CLIENT_ID,

        NEXT_PUBLIC_KINDE_CLIENT_SECRET : process.env.KINDE_CLIENT_SECRET,
        NEXT_PUBLIC_KINDE_ISSUER_URL: process.env.KINDE_ISSUER_URL,
        NEXT_PUBLIC_KINDE_SITE_URL:process.env.KINDE_SITE_URL,

        NEXT_PUBLIC_KINDE_POST_LOGOUT_REDIRECT_URL:process.env.KINDE_POST_LOGOUT_REDIRECT_URL,

NEXT_PUBLIC_KINDE_POST_LOGIN_REDIRECT_URL:process.env.KINDE_POST_LOGIN_REDIRECT_URL,
NEXT_PUBLIC_CONVEX_DEPLOYMENT:process.env.CONVEX_DEPLOYMENT,
NEXT_PUBLIC_CONVEX_URL:process.env.NEXT_PUBLIC_CONVEX_URL,
NEXT_PUBLIC_GENERATE_TEXT_API:process.env.NEXT_PUBLIC_GENERATE_TEXT_API,
NEXT_PUBLIC_GENERATE_ENGLISH_API:process.env.NEXT_PUBLIC_GENERATE_ENGLISH_API,

    },
};

export default nextConfig;
