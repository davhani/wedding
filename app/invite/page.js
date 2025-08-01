"use client";
import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function InviteEntryPage() {
	const [code, setCode] = useState("");
	const [error, setError] = useState("");
	const router = useRouter();

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!code.trim()) {
			setError("Please enter your family's code.");
			return;
		}

		const { data, error } = await supabase
			.from("rsvps")
			.select("*")
			.eq("family_code", code);

		if (error || !data || data.length === 0) {
			setError("Invitation code not found. Please try again.");
		} else {
			router.push(`/invite/${code}`);
		}
	};

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-cream px-4 py-12 relative">
			{/* Background image */}
			<img
				src="/images/hero-david-martina.jpg"
				alt="Wedding Background"
				className="absolute inset-0 w-full h-full object-cover opacity-20 blur-sm pointer-events-none"
			/>

			{/* Main content */}
			<div className="relative z-10 bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
				<h1 className="text-3xl font-title text-rosegold mb-4">
					Welcome to Our Wedding 🎉
				</h1>
				<p className="text-lg font-body text-gray-700 mb-6">
					Please enter your invitation code below to RSVP.
				</p>
				<p className="text-gray-700 font-body text-center mb-6">
					<strong>PS:</strong> If you&apos;re responding for you and a guest -
					or your family - you&apos;ll be able to find the names and RSVP for
					your entire group along the next pages.
				</p>

				<p className="text-gray-700 font-body text-center mb-6">
					<strong>Facing any troubles?</strong> Make sure you visit the FAQ in
					the homepage.
				</p>

				<form onSubmit={handleSubmit} className="w-full">
					<input
						type="text"
						placeholder="Enter invitation code"
						value={code}
						onChange={(e) => {
							setCode(e.target.value);
							setError("");
						}}
						className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-full text-center font-body text-lg focus:outline-none focus:ring-2 focus:ring-rosegold"
					/>

					{error && <p className="text-red-500 text-sm mb-3">{error}</p>}

					<button
						type="submit"
						className="bg-[#B76E79] hover:bg-[#d1848e] text-white font-body py-3 px-8 rounded-full text-lg transition-colors duration-300 shadow-md w-full"
					>
						Continue
					</button>
				</form>

				<a
					href="/"
					className="inline-block mt-6 text-rosegold font-body underline"
				>
					Back to Home
				</a>
			</div>
		</div>
	);
}
