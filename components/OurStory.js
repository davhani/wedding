"use client";

import { motion } from "framer-motion";

const timelineData = [
	{
		date: "October, 2023",
		title: "How We Met",
		text: "It all started with a twist of fate — and one mutual friend. Neither of us was supposed to be there that day. In fact, David almost skipped the gathering altogether. But as the universe would have it, he showed up... and so did Martina. We didn’t plan it, we didn’t expect it — and yet, that spontaneous moment led to the beginning of something incredibly real. One casual encounter, one unexpected meeting, and boom: our story began. Moral of the story? Always go to that random hangout — you never know who you’ll meet. 😉",
		image: "/images/h1.jpg",
	},

	{
		date: "November 2023",
		title: "Our First Trip",
		text: "Martina was heading to Dubai to visit her sister. David, on the other hand, pulled off what can only be described as an international romantic operation — he told her he had work in Dubai too. Spoiler alert: he didn’t. He just booked a trip to be closer to her and maybe sneak in a few outings. Mission accomplished — by the end of that trip, we had our first date, and we’ve been together ever since.",
		image: "/images/h2.jpg",
	},

	{
		date: "May 2024",
		title: "The Proposal 💍",
		text: "David was about to travel to the U.S. for two weeks, and Martina wasn’t thrilled about the long distance. What she didn’t know was that a surprise was in the works. Just days before the trip, he took her to the airport — no explanation, just trust. Moments later, they were stepping into a private aircraft where David popped the question midair. Shocked? Absolutely. Emotional? Definitely. It turned out to be one of the happiest and most unforgettable days of our lives.",
		image: "/images/h3.jpg",
	},

	{
		date: "September 2025",
		title: "The Big Day 💒",
		text: "If our journey so far has taught us anything, it’s that the best moments come with a little surprise — and our wedding is no exception. From unexpected meetings to sky-high proposals, it’s only fitting that our big day is wrapped in the same magic and mischief. We’re so excited for this next chapter, and we can’t wait to celebrate love, laughter, and everything in between.",
		image: "/images/h4.jpg",
	},
];

export default function OurStory() {
	return (
		<motion.section
			initial={{ opacity: 0, y: 50 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8 }}
			className="w-full bg-pink-100 py-16 px-6 text-center"
		>
			<h2 className="text-4xl font-title text-rosegold mb-6">Our Story</h2>
			<p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto mb-12">
				It all started with a simple hello, turned into endless laughs, travels,
				dreams, and here we are... excited to start the next chapter together
				with you!
			</p>

			<div className="space-y-16 max-w-4xl mx-auto">
				{timelineData.map((step, idx) => (
					<div
						key={idx}
						className={`flex flex-col md:flex-row items-center md:items-start md:justify-between gap-8 ${
							idx % 2 !== 0 ? "md:flex-row-reverse" : ""
						}`}
					>
						<img
							src={step.image}
							alt={step.title}
							className="w-full md:w-1/2 rounded-xl shadow-lg object-cover"
						/>
						<div className="md:w-1/2 text-left">
							<h3 className="text-2xl font-title text-rosegold mb-2">
								{step.title}
							</h3>
							<p className="text-sm text-gray-500 mb-1">{step.date}</p>
							<p className="font-body text-gray-700 leading-relaxed">
								{step.text}
							</p>
						</div>
					</div>
				))}
			</div>
		</motion.section>
	);
}
