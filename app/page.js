"use client";

import HeroSection from "@/components/HeroSection";
import FloatingFAQ from "@/components/FloatingFAQ";
import OurStory from "@/components/OurStory";
import EventDetails from "@/components/EventDetails";
import Gallery from "@/components/Gallery";
import Footer from "@/components/Footer";

export default function Home() {
	return (
		<main className="flex flex-col items-center justify-center">
			{/* Hero Section */}
			<section className="relative w-full h-screen bg-cream overflow-hidden">
				<HeroSection />
			</section>

			{/* Our Story */}
			<section className="w-full">
				<OurStory />
			</section>

			{/* Event Details */}
			<section className="w-full  text-center">
				<EventDetails />
			</section>

			{/* Gallery */}
			<section className="w-full  text-center">
				<Gallery />
			</section>
			<>
				<FloatingFAQ /> {/* appears bottom-left on Home only */}
			</>

			{/* Footer */}
			<footer className="w-full bg-[#F8F8F8] py-6 text-center text-gray-600 font-body">
				<p>Made with ❤️ by David & Martina | © 2025</p>
			</footer>
		</main>
	);
}
