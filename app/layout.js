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

export const metadata = {
	title: "David & Martina Wedding",
	description: "Join us for the celebration!",
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
