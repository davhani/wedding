"use client";

import { useEffect, useState } from "react";

const CountdownSection = () => {
	const calculateTimeLeft = () => {
		const difference = +new Date("2025-09-27T16:00:00") - +new Date();
		let timeLeft = {};

		if (difference > 0) {
			timeLeft = {
				days: Math.floor(difference / (1000 * 60 * 60 * 24)),
				hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
				minutes: Math.floor((difference / 1000 / 60) % 60),
				seconds: Math.floor((difference / 1000) % 60),
			};
		}
		return timeLeft;
	};

	const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

	useEffect(() => {
		const timer = setInterval(() => {
			setTimeLeft(calculateTimeLeft());
		}, 1000);
		return () => clearInterval(timer);
	}, []);

	if (
		!timeLeft.days &&
		!timeLeft.hours &&
		!timeLeft.minutes &&
		!timeLeft.seconds
	) {
		const formatTime = (value) => String(value).padStart(2, "0");
		return (
			<section className="opacity-80 py-1 px-4 text-center">
				<h2 className="text-3xl md:text-4xl font-title text-rosegold mb-10">
					Today is the day! 🎉
				</h2>
				<div className="flex justify-center gap-2 max-w-3xl mx-auto bg-[#B76E79] text-white rounded-xl shadow-xl overflow-hidden">
					{[
						{ label: "DAYS", value: "00" },
						{ label: "HOURS", value: "00" },
						{ label: "MINUTES", value: "00" },
						{ label: "SECONDS", value: "00" },
					].map((item, idx, arr) => (
						<div
							key={item.label}
							className="flex flex-col items-center justify-center px-4 py-6"
						>
							<span className="text-4xl md:text-5xl font-bold tabular-nums">
								{formatTime(item.value)}
							</span>
							<span className="text-xs md:text-sm text-yellow-300 mt-1">
								{item.label}
							</span>
							{idx < arr.length - 1 && (
								<div className="hidden md:block absolute right-0 top-1/2 transform -translate-y-1/2 w-px h-10 bg-white/40"></div>
							)}
						</div>
					))}
				</div>
			</section>
		);
	}

	const formatTime = (value) => String(value).padStart(2, "0");

	return (
		<section className="opacity-80 py-1 px-4 text-center">
			<h2 className="text-3xl md:text-4xl font-title text-rosegold mb-10">
				Time Left for Our Big Day!
			</h2>
			<div className="flex justify-center gap-2 max-w-3xl mx-auto bg-[#B76E79] text-white rounded-xl shadow-xl overflow-hidden">
				{[
					{ label: "DAYS", value: timeLeft.days },
					{ label: "HOURS", value: timeLeft.hours },
					{ label: "MINUTES", value: timeLeft.minutes },
					{ label: "SECONDS", value: timeLeft.seconds },
				].map((item, idx, arr) => (
					<div
						key={item.label}
						className="flex flex-col items-center justify-center px-4 py-6"
					>
						<span className="text-4xl md:text-5xl font-bold tabular-nums">
							{formatTime(item.value)}
						</span>
						<span className="text-xs md:text-sm text-yellow-300 mt-1">
							{item.label}
						</span>
						{idx < arr.length - 1 && (
							<div className="hidden md:block absolute right-0 top-1/2 transform -translate-y-1/2 w-px h-10 bg-white/40"></div>
						)}
					</div>
				))}
			</div>
		</section>
	);
};

export default CountdownSection;
