"use client";
import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";

const faqs = [
	{
		q: "Why I didn't receive a code?",
		a: "Everyone is warmly invited to the church ceremony 💒, but the reception party has limited spots. If you didn’t receive a code, it means you’re invited to join us only at the church.",
	},
	{
		q: "I received a code, why is it shown invalid?",
		a: "Codes are case-sensitive, so please make sure you enter it exactly as given. If it still doesn’t work, feel free to reach out to David or Martina so we can help resolve it.",
	},
	{
		q: "How do I know my table number?",
		a: "Table numbers will be displayed at the reception venue, and our team will be there to guide you as soon as you arrive.",
	},
	{
		q: "Can I bring a plus one?",
		a: "Everyone is welcome to the church ceremony. For the reception, only names listed under your invitation link are confirmed. If you’d like to bring someone else, kindly check with David or Martina in advance to see if we can make it work.",
	},
	{
		q: "What kind of registries can I get and how do I deliver?",
		a: "We truly appreciate your generosity. Instead of a gift registry, we prefer monetary contributions, which can be handed to one of our family members during the ceremony or celebration.",
	},
];

export default function FloatingFAQ() {
	const [open, setOpen] = useState(false);
	const controls = useAnimation();

	// --- Repeating jump every 3 seconds (pauses while open, respects reduced motion)
	useEffect(() => {
		const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
		if (mq.matches || open) return;

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

		// first nudge after a short delay, then every 3s
		const first = setTimeout(() => {
			play();
			intervalId = setInterval(play, 3000);
		}, 800);

		return () => {
			clearTimeout(first);
			if (intervalId) clearInterval(intervalId);
		};
	}, [controls, open]);

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
			{/* Floating button */}
			<motion.button
				onClick={() => setOpen(true)}
				animate={controls}
				className="fixed bottom-4 right-4 z-40 h-14 w-14 rounded-full bg-emerald-700 hover:bg-emerald-800 active:scale-95 transition text-white font-semibold shadow-lg"
				aria-label="Open FAQs"
			>
				FAQ
			</motion.button>

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
