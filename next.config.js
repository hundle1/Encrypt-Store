/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["res.cloudinary.com"]
    },
    async headers() {
        return [
            {
                source: "/api/:path*",
                headers: [
                    { key: "Access-Control-Allow-Origin", value: "*" },
                    { key: "Access-Control-Allow-Methods", value: "POST, GET, OPTIONS" },
                    { key: "Access-Control-Allow-Headers", value: "Content-Type" },
                ],
            },
        ];
    }
};

module.exports = nextConfig;
