"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { useWindowSize } from "@react-hook/window-size";
import { supabase } from "@/lib/supabaseClient";
import { generateInvitationImage } from "@/utils/generateInvitationPDF";

export default function InvitePageClient({ code }) {
	const [step, setStep] = useState(1);
	const [guests, setGuests] = useState([]);
	const [selectedGuests, setSelectedGuests] = useState([]);
	const [message, setMessage] = useState("");
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [width, height] = useWindowSize();
	const [loading, setLoading] = useState(true);
	const [isValidCode, setIsValidCode] = useState(true);
	const [hasConfirmed, setHasConfirmed] = useState(false);

	useEffect(() => {
		const fetchGuests = async () => {
			if (!code) return;
			const { data, error } = await supabase
				.from("rsvps")
				.select("guest_name, is_attending, message")
				.eq("family_code", code);

			if (error) {
				console.error("Error fetching guests:", error);
				setLoading(false);
				return;
			}

			if (!data || data.length === 0) {
				setIsValidCode(false);
				setLoading(false);
				return;
			}

			setGuests(data);
			setSelectedGuests(
				data.filter((g) => g.is_attending).map((g) => g.guest_name)
			);

			const existingMessages = data.map((g) => g.message).filter(Boolean);
			if (existingMessages.length > 0) setMessage(existingMessages[0]);

			setLoading(false);
		};
		fetchGuests();
	}, [code]);

	const toggleGuest = (guest) => {
		setSelectedGuests((prev) =>
			prev.includes(guest) ? prev.filter((g) => g !== guest) : [...prev, guest]
		);
	};

	const nextStep = () => setStep((prev) => prev + 1);
	const prevStep = () => setStep((prev) => prev - 1);

	const handleSubmit = async () => {
		if (!code || guests.length === 0) return;
		const updates = guests.map((guest) => ({
			family_code: code,
			guest_name: guest.guest_name,
			is_attending: selectedGuests.includes(guest.guest_name),
			message: message.trim() || null,
		}));
		const { error } = await supabase
			.from("rsvps")
			.upsert(updates, { onConflict: ["family_code", "guest_name"] });
		if (error) {
			console.error("Supabase error:", error.message);
			return;
		}
		setIsSubmitted(true);
	};

	const stepperText =
		step === 1
			? "Venue Details 🏛️"
			: step === 2
			? "Who's Attending? ✨"
			: "Send Your Wishes 💖";

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-cream text-center px-4">
				<img
					src="/images/hero-david-martina.jpg"
					alt="Wedding Background"
					className="absolute inset-0 w-full h-full object-cover opacity-20 blur-sm"
				/>
				<p className="font-body text-gray-600 text-lg animate-pulse">
					Loading...
				</p>
			</div>
		);
	}

	if (!isValidCode) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-cream text-center px-4">
				<img
					src="/images/hero-david-martina.jpg"
					alt="Wedding Background"
					className="absolute inset-0 w-full h-full object-cover opacity-20 blur-sm"
				/>
				<div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
					<h2 className="text-2xl font-title text-rosegold mb-4">
						Invalid Code ❌
					</h2>
					<p className="text-gray-700 font-body mb-6">
						The invitation link you used is invalid.
					</p>
					<a
						href="/"
						className="bg-[#B76E79] hover:bg-[#d1848e] text-white font-body py-3 px-8 rounded-full text-lg transition-colors duration-300 shadow-md"
					>
						Go Back
					</a>
				</div>
			</div>
		);
	}
	// Put these above your component's return:
	const useFirstNameOnly = true; // <- set to false if you want full names

	const firstPart = (name) => name.trim().split(/\s+/)[0]; // "George Hany" -> "George"
	const displayNames = (list) =>
		list.map((n) => (useFirstNameOnly ? firstPart(n) : n.trim()));

	const formatNameList = (names) => {
		const n = names.filter(Boolean);
		if (n.length === 0) return "";
		if (n.length === 1) return n[0];
		if (n.length === 2) return `${n[0]} and ${n[1]}`;
		return `${n.slice(0, -1).join(", ")} and ${n[n.length - 1]}`;
	};

	// Example salutation:
	const salutation = `Dear ${formatNameList(displayNames(selectedGuests))}`;
	if (isSubmitted) {
		return (
			<motion.div
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8 }}
				className="min-h-screen flex flex-col items-center justify-center bg-cream py-10 px-4"
			>
				<Confetti
					width={width}
					height={height}
					numberOfPieces={300}
					gravity={0.2}
					recycle={false}
				/>
				<img
					src="/images/hero-david-martina.jpg"
					alt="Wedding Background"
					className="absolute inset-0 w-full h-full object-cover opacity-20 blur-sm"
				/>
				<div className="relative z-10 bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
					<h2 className="text-3xl font-title text-rosegold mb-6">
						Thank you for RSVPing! 🎉
					</h2>
					<p className="text-lg font-body text-gray-700 mb-8">
						Bring your best dance moves and biggest smiles — it’s going to be
						one unforgettable party!
					</p>

					<div className="flex flex-col sm:flex-row justify-center gap-4">
						<button
							disabled={!hasConfirmed}
							onClick={() =>
								generateInvitationImage(displayNames(selectedGuests))
							}
							className={`${
								hasConfirmed
									? "bg-white border border-[#B76E79] text-[#B76E79] hover:bg-[#f9e2e4]"
									: "bg-gray-200 text-gray-400 border border-gray-300 cursor-not-allowed"
							} font-body py-3 px-6 rounded-full text-lg transition-colors duration-300 shadow-md`}
						>
							Download Invitation
						</button>

						<a
							href="/"
							className="bg-[#B76E79] hover:bg-[#d1848e] text-white font-body py-3 px-6 rounded-full text-lg transition-colors duration-300 shadow-md"
						>
							Back to Home
						</a>
					</div>
				</div>
			</motion.div>
		);
	}

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-cream py-10 px-4">
			<img
				src="/images/hero-david-martina.jpg"
				alt="Wedding Background"
				className="absolute inset-0 w-full h-full object-cover opacity-20 blur-sm"
			/>
			<div className="flex flex-col items-center mb-6">
				<h3 className="font-title text-rosegold text-xl mb-4">{stepperText}</h3>
				<div className="flex flex-row items-center gap-4">
					{[1, 2, 3].map((s) => (
						<div
							key={s}
							className={`w-4 h-4 rounded-full ${
								step === s ? "bg-rosegold" : "bg-gray-300"
							} shadow-md`}
						></div>
					))}
				</div>
			</div>
			<div className="relative z-10 bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
				{step === 1 && (
					<>
						<h2 className="text-2xl font-title text-rosegold mb-6 text-center">
							Let's Party! 🏛️
						</h2>

						<p className="text-gray-700 font-body text-center mb-4">
							We’re so excited to celebrate with you at the{" "}
							<strong>Holiday Inn Hotel, City Stars</strong> on{" "}
							<strong>September 27th, 2025</strong> at <strong>6:00 PM</strong>.
						</p>

						<p className="text-gray-700 font-body text-center mb-4">
							<strong>Dress Code:</strong> Formal Attire 👗🤵
						</p>

						<p className="text-gray-700 font-body text-center mb-6">
							<strong>Kids:</strong> Sweet dreams encouraged — let the little
							ones rest while we dance the night away! 🌙✨
						</p>

						<p className="text-gray-700 font-body text-center mb-6">
							Second thoughts or sudden excitement? You can swing back to this
							link and make changes until <u>September 15th, 2025.</u> We won’t
							judge, promise.
						</p>

						<p className="text-gray-700 font-body text-center mb-6">
							Love doesn’t come with reminders… but our wedding does! Tap ‘Add
							to Calendar’ so the day doesn’t sneak up on you!
						</p>
						<div className="flex justify-center mb-4">
							<a
								href="data:text/calendar;charset=utf8,BEGIN:VCALENDAR%0AVERSION:2.0%0ABEGIN:VEVENT%0ADTSTART:20250927T123000Z%0ADTEND:20250927T210000Z%0ASUMMARY:David%20%26%20Martina's%20Wedding%20Day%0ALOCATION:Saint%20Mark%20Church%20%26%20Holiday%20Inn%20City%20Stars%0ADESCRIPTION:Ceremony%20%40%203%3A30%20PM%2C%20followed%20by%20the%20party!%0ABEGIN:VALARM%0ATRIGGER:-PT24H%0AACTION:DISPLAY%0ADESCRIPTION:Reminder%20-%20David%20%26%20Martina's%20Wedding%20is%20tomorrow!%0AEND:VALARM%0AEND:VEVENT%0AEND:VCALENDAR"
								target="_blank"
								rel="noopener noreferrer"
								className="inline-block mt-4 bg-[#B76E79] hover:bg-[#d1848e] text-white py-2 px-6 rounded-full text-sm transition-colors"
							>
								Add to Calendar
							</a>
						</div>
						<div className="flex justify-center mb-4">
							<a
								href="https://www.google.com/maps/place/Holiday+Inn+Cairo+-+Citystars+by+IHG/@30.0751195,31.3453859,17.76z/data=!4m9!3m8!1s0x145840ece8b144c3:0x4a881706380acd69!5m2!4m1!1i2!8m2!3d30.0740861!4d31.3439836!16s%2Fg%2F1tf92928?entry=ttu&g_ep=EgoyMDI1MDUwNy4wIKXMDSoJLDEwMjExNDUzSAFQAw%3D%3D"
								target="_blank"
								rel="noopener noreferrer"
								className="bg-white border border-[#B76E79] text-[#B76E79] hover:bg-[#f9e2e4] font-body py-2 px-6 rounded-full text-sm transition-colors duration-300 shadow-md"
							>
								View on Google Maps
							</a>
						</div>

						{/* 💍 Signature */}
						<div className="w-full flex justify-end pr-4 mb-6 pt-6">
							<img
								src="/images/sig.png"
								alt="Signature"
								className="w-48 opacity-90"
							/>
						</div>

						<div className="flex flex-col items-center gap-3">
							<label className="flex items-center gap-2">
								<input
									type="checkbox"
									checked={hasConfirmed}
									onChange={() => setHasConfirmed(!hasConfirmed)}
									className="w-5 h-5 text-rosegold focus:ring-rosegold rounded"
								/>
								<span className="text-sm font-body text-gray-700">
									I’ve read all the details and let's make this memorable!
								</span>
							</label>
						</div>

						<div className="mt-10 flex justify-center">
							<button
								onClick={nextStep}
								disabled={!hasConfirmed}
								className={`${
									hasConfirmed
										? "bg-[#B76E79] hover:bg-[#d1848e]"
										: "bg-gray-300 cursor-not-allowed"
								} text-white font-body py-3 px-8 rounded-full text-lg transition-colors duration-300 shadow-md`}
							>
								Next
							</button>
						</div>
						<a
							href="/"
							className="inline-block mt-6 text-rosegold font-body underline"
						>
							Back to Home
						</a>
					</>
				)}

				{step === 2 && (
					<>
						<h2 className="text-2xl font-title text-rosegold mb-6 text-center">
							Who’s joining the party? 🎉
						</h2>
						<div className="flex flex-col gap-4">
							{guests.map((guest) => (
								<label
									key={guest.guest_name}
									className="flex items-center gap-3"
								>
									<input
										type="checkbox"
										checked={selectedGuests.includes(guest.guest_name)}
										onChange={() => toggleGuest(guest.guest_name)}
										className="w-5 h-5 text-rosegold focus:ring-rosegold rounded-md"
									/>
									<span className="font-body text-gray-700">
										{guest.guest_name}
									</span>
								</label>
							))}
						</div>
						<div className="mt-10 flex justify-between">
							<button
								onClick={prevStep}
								className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-body py-3 px-8 rounded-full text-lg transition-colors duration-300 shadow-md"
							>
								Back
							</button>
							<button
								onClick={nextStep}
								className="bg-[#B76E79] hover:bg-[#d1848e] text-white font-body py-3 px-8 rounded-full text-lg transition-colors duration-300 shadow-md"
							>
								Next
							</button>
						</div>
					</>
				)}

				{step === 3 && (
					<>
						<h2 className="text-2xl font-title text-rosegold mb-6 text-center">
							Leave us a Message 💬
						</h2>
						<textarea
							className="w-full h-32 p-4 border border-gray-300 rounded-md font-body text-gray-700 focus:ring-rosegold focus:border-rosegold transition-all duration-300"
							placeholder="Write your congratulations or a personal note here!"
							value={message}
							onChange={(e) => setMessage(e.target.value)}
						/>
						<div className="mt-10 flex justify-between">
							<button
								onClick={prevStep}
								className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-body py-3 px-8 rounded-full text-lg transition-colors duration-300 shadow-md"
							>
								Back
							</button>
							<button
								onClick={handleSubmit}
								className="bg-[#B76E79] hover:bg-[#d1848e] text-white font-body py-3 px-8 rounded-full text-lg transition-colors duration-300 shadow-md"
							>
								Submit
							</button>
						</div>
					</>
				)}
			</div>
		</div>
	);
}
