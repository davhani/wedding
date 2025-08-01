"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const IMAGES = Array.from({ length: 12 }, (_, i) => `/images/us${i + 1}.jpg`);

export default function Gallery() {
	const [currentPage, setCurrentPage] = useState(0);
	const [selectedIndex, setSelectedIndex] = useState(null);

	const imagesPerPage = 6;
	const totalPages = Math.ceil(IMAGES.length / imagesPerPage);
	const startIndex = currentPage * imagesPerPage;
	const endIndex = startIndex + imagesPerPage;
	const currentImages = IMAGES.slice(startIndex, endIndex);

	const handlePrevPage = () => {
		if (currentPage > 0) setCurrentPage((prev) => prev - 1);
	};

	const handleNextPage = () => {
		if (currentPage < totalPages - 1) setCurrentPage((prev) => prev + 1);
	};

	const closeModal = () => setSelectedIndex(null);
	const showPrevImage = () => setSelectedIndex((i) => (i > 0 ? i - 1 : i));
	const showNextImage = () =>
		setSelectedIndex((i) => (i < IMAGES.length - 1 ? i + 1 : i));

	return (
		<motion.section
			initial={{ opacity: 0, y: 50 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8 }}
			className="w-full bg-pink-100 py-20 px-6 text-center"
		>
			<h2 className="text-4xl font-title text-rosegold mb-10">Our Gallery</h2>

			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
				{currentImages.map((src, idx) => (
					<img
						key={idx + startIndex}
						src={src}
						alt={`Photo ${idx + 1}`}
						onClick={() => setSelectedIndex(startIndex + idx)}
						className="w-full h-64 object-cover rounded-lg shadow-md cursor-pointer hover:opacity-80 transition"
					/>
				))}
			</div>

			<div className="mt-10 flex justify-center gap-8 items-center">
				<button
					onClick={handlePrevPage}
					disabled={currentPage === 0}
					className="flex items-center gap-2 px-5 py-2 border-2 border-rosegold text-rosegold font-body rounded-full hover:bg-rosegold hover:text-white disabled:opacity-40 transition"
				>
					<ChevronLeft /> Previous
				</button>

				<span className="text-rosegold font-body text-lg">
					Page {currentPage + 1} of {totalPages}
				</span>

				<button
					onClick={handleNextPage}
					disabled={currentPage === totalPages - 1}
					className="flex items-center gap-2 px-5 py-2 border-2 border-rosegold text-rosegold font-body rounded-full hover:bg-rosegold hover:text-white disabled:opacity-40 transition"
				>
					Next <ChevronRight />
				</button>
			</div>

			{/* Lightbox Modal */}
			{selectedIndex !== null && (
				<div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
					<button
						onClick={closeModal}
						className="absolute top-6 right-6 text-white text-3xl"
					>
						<X size={32} />
					</button>

					<button
						onClick={showPrevImage}
						disabled={selectedIndex === 0}
						className="absolute left-6 text-white"
					>
						<ChevronLeft size={48} />
					</button>

					<img
						src={IMAGES[selectedIndex]}
						alt={`Photo ${selectedIndex + 1}`}
						className="max-h-[90vh] max-w-[90vw] rounded shadow-lg"
					/>

					<button
						onClick={showNextImage}
						disabled={selectedIndex === IMAGES.length - 1}
						className="absolute right-6 text-white"
					>
						<ChevronRight size={48} />
					</button>
				</div>
			)}
		</motion.section>
	);
}
