"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

const CountdownSection = dynamic(() => import("./CountdownSection"), {
	ssr: false,
});

const HeroSection = () => {
	return (
		<section className="relative w-full bg-cream overflow-hidden">
			{/* Background Image */}
			<div className="absolute inset-0 -z-10">
				<img
					src="/images/hero-david-martina.jpg"
					alt="David and Martina"
					className="w-full h-full object-cover opacity-50"
				/>
			</div>

			{/* Content */}
			<div className="min-h-screen flex flex-col justify-center items-center text-center px-4 pt-50 pb-10">
				<h1 className="text-4xl md:text-6xl font-title text-rosegold mb-4">
					David & Martina
				</h1>
				<p className="text-lg md:text-xl font-body text-gray-700 mb-6">
					September 27, 2025 • Cairo, Egypt
				</p>
				<Link
					href="./invite"
					className="bg-[#B76E79] hover:bg-[#d1848e] text-white font-body py-3 px-8 rounded-full text-lg transition-colors duration-300 shadow-md mb-6"
				>
					Join the Celebration
				</Link>

				{/* Countdown Below Button */}
				<CountdownSection />
			</div>
		</section>
	);
};

export default HeroSection;
