// import "./globals.css";

// export const metadata = {
// 	title: "David & Martina Wedding",
// 	description: "Join us for the celebration!",
// };

// export default function RootLayout({ children }) {
// 	return (
// 		<html lang="en">
// 			<body className="bg-cream font-body text-gray-800 antialiased">
// 				{children}
// 			</body>
// 		</html>

// 	);
// }

import "./globals.css";
import { Cormorant_Garamond } from "next/font/google";

const cormorant = Cormorant_Garamond({
	subsets: ["latin"],
	weight: ["300", "400", "500", "600"],
	display: "swap",
});

// export const metadata = {
// 	title: "David & Martina Wedding",
// 	description: "Join us for the celebration!",
// };

export const metadata = {
	metadataBase: new URL("https://david-martina.com"),
	title: {
		default: "David & Martina | Wedding",
		template: "%s • David & Martina",
	},
	description:
		"Join us to celebrate our wedding! Ceremony at St. Mark Coptic Orthodox Church and reception to follow.",
	keywords: ["David & Martina", "wedding", "Coptic Orthodox", "Cairo"],
	authors: [{ name: "David & Martina" }],
	themeColor: "#ffffff",
	robots: { index: true, follow: true },
	alternates: { canonical: "/" },
	openGraph: {
		title: "David & Martina | Wedding",
		description:
			"Save the date and celebrate with us! Ceremony at St. Mark; reception to follow.",
		url: "https://david-martina.com",
		siteName: "David & Martina",
		images: [{ url: "/opengraph-image.png", width: 1200, height: 630 }],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "David & Martina | Wedding",
		description:
			"Save the date and celebrate with us! Ceremony at St. Mark; reception to follow.",
		images: ["/opengraph-image.png"], // you can reuse the same image as OG
	},
	icons: {
		icon: [
			{ url: "/favicon.ico", sizes: "any" },
			{ url: "/icon-32.png", type: "image/png", sizes: "32x32" },
			{ url: "/icon-192.png", type: "image/png", sizes: "192x192" },
			{ url: "/icon-512.png", type: "image/png", sizes: "512x512" }, // add this
		],
		apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
		other: [
			{ rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#B76E79" },
		],
	},
	manifest: "/site.webmanifest",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en" className={cormorant.className}>
			<body className="bg-cream font-body text-gray-800 antialiased">
				{children}
			</body>
		</html>
	);
}
