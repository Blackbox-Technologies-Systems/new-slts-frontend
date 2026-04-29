/** @type {import('next').NextConfig} */
const nextConfig = {
	// async rewrites() {
	//   return [{
	//     source: '/api/proxy/:path*',
	//     destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
	//   }]
	// },
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "api.dicebear.com",
			},
			{
				protocol: "https",
				hostname: "avatars.githubusercontent.com",
			},
			{
				protocol: "https",
				hostname: "images.unsplash.com",
			},
		],
	},
};

export default nextConfig;
