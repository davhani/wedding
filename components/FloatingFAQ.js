"use client";
import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";

const faqs = [
	{
		q: "I received a code, what to do next?",
		a: "Click on 'Join the Celebration' button and follow the steps.",
	},
	{
		q: "No code received - Am I still invited?",
		a: "Absolutely! Everyone is welcome at the church ceremony 💒. Reception entry is by code due to limited capacity.",
	},
	{
		q: "I received a code, why is it shown invalid?",
		a: "Codes are case-sensitive, so please make sure you enter it exactly as given. If it still doesn’t work, feel free to reach out to David or Martina so we can help resolve it.",
	},
	{
		q: "How do I know my table number?",
		a: "We’ll send your table number via WhatsApp closer to the wedding day. At the venue, a team member at the entrance will have the seating list and can guide you to your table.",
	},
	{
		q: "Can I bring a plus one?",
		a: "Everyone is welcome to the church ceremony. For the reception, only names listed under your invitation code are confirmed. If you’d like to bring someone else, kindly check with David or Martina in advance to see if we can make it work.",
	},
];

export default function FloatingFAQ() {
	const [open, setOpen] = useState(false);
	const controls = useAnimation();

	// accessibility flag
	const [reduced, setReduced] = useState(false);
	useEffect(() => {
		const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
		setReduced(mq.matches);
		const onChange = (e) => setReduced(e.matches);
		if (mq.addEventListener) mq.addEventListener("change", onChange);
		else mq.addListener(onChange);
		return () => {
			if (mq.removeEventListener) mq.removeEventListener("change", onChange);
			else mq.removeListener(onChange);
		};
	}, []);

	// --- Repeating jump every 3 seconds (pauses while open, respects reduced motion)
	useEffect(() => {
		if (reduced || open) return;
		let intervalId;
		const play = () =>
			controls.start({
				y: [0, -12, 0, -8, 0],
				transition: {
					duration: 1.1,
					ease: "easeOut",
					times: [0, 0.25, 0.5, 0.75, 1],
				},
			});
		const first = setTimeout(() => {
			play();
			intervalId = setInterval(play, 3000);
		}, 800);
		return () => {
			clearTimeout(first);
			if (intervalId) clearInterval(intervalId);
		};
	}, [controls, open, reduced]);

	// Close on ESC + lock body scroll when open
	useEffect(() => {
		const onKey = (e) => e.key === "Escape" && setOpen(false);
		window.addEventListener("keydown", onKey);
		if (open) {
			const prev = document.body.style.overflow;
			document.body.style.overflow = "hidden";
			return () => {
				document.body.style.overflow = prev;
				window.removeEventListener("keydown", onKey);
			};
		}
		return () => window.removeEventListener("keydown", onKey);
	}, [open]);

	return (
		<>
			{/* Floating container with halo + subtle hint */}
			<div className="fixed bottom-4 right-4 z-40">
				<div className="relative h-20 w-20">
					{/* Pulsing halo rings (disabled when open or reduced motion) */}
					{!open && !reduced && (
						<>
							<motion.span
								aria-hidden
								className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/25 blur-md"
								style={{ width: 96, height: 96 }}
								animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
								transition={{
									duration: 1.8,
									repeat: Infinity,
									repeatDelay: 0.8,
								}}
							/>
							<motion.span
								aria-hidden
								className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/20 blur-md"
								style={{ width: 110, height: 110 }}
								animate={{ scale: [1, 1.8, 1], opacity: [0.35, 0, 0.35] }}
								transition={{
									duration: 2.2,
									repeat: Infinity,
									repeatDelay: 1.2,
									delay: 0.3,
								}}
							/>
						</>
					)}

					{/* The button (gradient + soft glow) */}
					<motion.button
						onClick={() => setOpen(true)}
						animate={controls}
						className="relative z-10 h-20 w-20 rounded-full
                       bg-gradient-to-br from-emerald-600 to-emerald-700
                       text-white font-semibold
                       border-2 border-white/70
                       shadow-[0_12px_28px_rgba(16,185,129,0.45)]
                       hover:from-emerald-700 hover:to-emerald-800 active:scale-95
                       transition"
						aria-label="Open FAQs"
						title="Open FAQs"
					>
						FAQ
					</motion.button>
				</div>

				{/* Constant nudge: minimal caption + arrow (not clickable) */}
				{!open && !reduced && (
					<motion.div
						className="absolute right-[6.2rem] bottom-7 hidden sm:flex items-center gap-1
                       pointer-events-none select-none"
						initial={{ opacity: 0, y: 2 }}
						animate={{ opacity: [0, 1, 0], y: [2, 0, 2] }}
						transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 0.6 }}
					>
						<span className="text-emerald-800/95 text-sm font-medium drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]">
							Tap for FAQs
						</span>
						<motion.span
							aria-hidden
							className="text-emerald-700"
							animate={{ x: [0, 2, 0] }}
							transition={{ duration: 1.2, repeat: Infinity }}
						>
							→
						</motion.span>
					</motion.div>
				)}
			</div>

			{/* Overlay modal */}
			{open && (
				<div
					className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
					onClick={() => setOpen(false)}
					aria-modal="true"
					role="dialog"
				>
					<div
						className="absolute left-1/2 top-1/2 w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-2xl"
						onClick={(e) => e.stopPropagation()}
					>
						{/* Header */}
						<div className="flex items-center justify-between border-b px-5 py-3">
							<h3 className="text-lg font-semibold text-gray-800">
								Frequently Asked Questions
							</h3>
							<button
								onClick={() => setOpen(false)}
								className="rounded-md p-2 hover:bg-gray-100"
								aria-label="Close"
								title="Close"
							>
								✕
							</button>
						</div>

						{/* Content (scrollable) */}
						<div className="max-h-[70vh] overflow-y-auto px-5 py-4 space-y-3">
							{faqs.map((item, i) => (
								<details key={i} className="group rounded-lg border p-4">
									<summary className="cursor-pointer list-none flex items-center justify-between">
										<span className="font-medium text-gray-800">{item.q}</span>
										<span className="text-emerald-700 group-open:hidden">
											＋
										</span>
										<span className="text-emerald-700 hidden group-open:inline">
											−
										</span>
									</summary>
									<p className="mt-3 text-gray-600">{item.a}</p>
								</details>
							))}
						</div>

						{/* Footer */}
						<div className="border-t px-5 py-3 flex justify-end">
							<button
								onClick={() => setOpen(false)}
								className="rounded-full px-4 py-2 text-sm font-medium text-white bg-emerald-700 hover:bg-emerald-800"
							>
								Close
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
