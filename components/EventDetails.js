// File: components/EventDetails.js
"use client";

import { motion } from "framer-motion";

export default function EventDetails() {
	return (
		<motion.section
			initial={{ opacity: 0, y: 50 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8 }}
			className="w-full bg-[#f2f1ed] py-20 px-6 text-center"
		>
			<h2 className="text-4xl font-title text-rosegold mb-6">Event Details</h2>

			<div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8 font-body text-gray-700">
				<div className="w-full md:w-1/2 text-left space-y-4">
					<h3 className="text-2xl font-semibold text-rosegold">
						📍 Church Ceremony
					</h3>
					<p>
						<strong>Date:</strong> September 27, 2025
					</p>
					<p>
						<strong>Time:</strong> 3:30 PM
					</p>
					<p>
						<strong>Location:</strong> St. Mark Coptic Orthodox Church
						Cleopatra, Heliopolis, Cairo
					</p>

					<a
						href="https://www.google.com/maps/place/St.+Mark+Coptic+Orthodox+Church+Cleopatra/@30.0951366,31.3333083,17z/data=!4m6!3m5!1s0x1458158a9a0d791f:0x7529fe67e633be7c!8m2!3d30.0924217!4d31.3295776!16s%2Fm%2F04jlrh4?entry=ttu&g_ep=EgoyMDI1MDUwNy4wIKXMDSoJLDEwMjExNDUzSAFQAw%3D%3D"
						target="_blank"
						rel="noopener noreferrer"
						className="inline-block mt-4 bg-[#B76E79] hover:bg-[#d1848e] text-white py-2 px-6 rounded-full text-sm transition-colors"
					>
						View on Google Maps
					</a>
					<a
						href="data:text/calendar;charset=utf8,BEGIN:VCALENDAR%0AVERSION:2.0%0ABEGIN:VEVENT%0ADTSTART:20250927T123000Z%0ADTEND:20250927T140000Z%0ASUMMARY:David%20%26%20Martina's%20Wedding%20Ceremony%0ALOCATION:Saint%20Mark%20Church,%20Heliopolis,%20Cairo%0ADESCRIPTION:Join%20us%20at%20the%20church%20to%20witness%20our%20wedding%20ceremony!%0AEND:VEVENT%0AEND:VCALENDAR"
						download="David_Martina_Church_Ceremony.ics"
						className="inline-block mt-4 bg-[#B76E79] hover:bg-[#d1848e] text-white py-2 px-6 rounded-full text-sm transition-colors"
					>
						Add to Calendar
					</a>
				</div>

				<div className="w-full md:w-1/2 flex justify-center">
					<img
						src="/images/church.png"
						alt="Church"
						className="w-64 md:w-80 max-w-full h-auto"
					/>
				</div>
			</div>
		</motion.section>
	);
}
