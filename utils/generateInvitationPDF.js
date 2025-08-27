// import jsPDF from "jspdf";

// export const generateInvitationPDF = async (guestNames = []) => {
// 	const doc = new jsPDF("p", "mm", "a4");

// 	const greeting = formatGuestGreeting(guestNames); // as we defined before

// 	const loadImageAsBase64 = async (url) => {
// 		try {
// 			const response = await fetch(url);
// 			if (!response.ok) {
// 				throw new Error(`Failed to load image: ${response.statusText}`);
// 			}

// 			const blob = await response.blob();
// 			return new Promise((resolve) => {
// 				const reader = new FileReader();
// 				reader.onloadend = () => resolve(reader.result);
// 				reader.readAsDataURL(blob);
// 			});
// 		} catch (err) {
// 			console.error("Image loading failed:", err);
// 			throw err;
// 		}
// 	};

// 	// Draw background
// 	const bg = await loadImageAsBase64("/images/invi.png");
// 	doc.addImage(bg, "PNG", 0, 0, 210, 297);

// 	// Set greeting text
// 	doc.setFont("helvetica", "normal");

// 	doc.setFontSize(20);
// 	doc.setTextColor("#B76E79");
// 	doc.text(greeting, 105, 65, { align: "center" });

// 	doc.save("David-Martina-Invitation.pdf");
// };

// const formatGuestGreeting = (fullNames) => {
// 	const firstNames = fullNames.map((n) => n.split(" ")[0]);
// 	if (firstNames.length === 1) return `Hello ${firstNames[0]},`;
// 	if (firstNames.length === 2)
// 		return `Dear ${firstNames[0]} and ${firstNames[1]}`;
// 	const last = firstNames.pop();
// 	return `Dear ${firstNames.join(", ")}, and ${last}`;
// };
//-----------------------------------------
// import html2canvas from "html2canvas";

// export const generateInvitationImage = async (guestNames = []) => {
// 	const greeting = formatGuestGreeting(guestNames);

// 	// Create a hidden render container
// 	const container = document.createElement("div");
// 	container.id = "invitation-canvas";
// 	container.style.width = "1240px";
// 	container.style.height = "1754px";
// 	container.style.position = "absolute";
// 	container.style.top = "-9999px";
// 	container.style.left = "-9999px";
// 	container.style.fontFamily = "Cormorant Garamond, serif";
// 	container.style.textAlign = "center";
// 	container.style.backgroundImage = "url('/images/invi.png')";
// 	container.style.backgroundSize = "cover";
// 	container.style.backgroundPosition = "center";
// 	container.style.display = "flex";
// 	container.style.flexDirection = "column";
// 	container.style.alignItems = "center";
// 	container.style.justifyContent = "flex-start";
// 	container.style.paddingTop = "300px";
// 	container.style.color = "#B76E79";

// 	const text = document.createElement("div");
// 	text.textContent = greeting;
// 	text.style.fontSize = "40px";
// 	text.style.fontWeight = "400";
// 	text.style.marginTop = "30px";

// 	const signature = document.createElement("img");
// 	signature.src = "/images/sig.png"; // Adjust path if needed
// 	signature.style.position = "absolute";
// 	signature.style.bottom = "120px";
// 	signature.style.right = "250px";
// 	signature.style.width = "200px";
// 	signature.style.opacity = "0.9";

// 	container.appendChild(signature);

// 	container.appendChild(text);
// 	document.body.appendChild(container);

// 	try {
// 		const canvas = await html2canvas(container, {
// 			useCORS: true,
// 			scale: 1, // Increase scale for sharper output
// 		});

// 		const image = canvas.toDataURL("image/png");

// 		const link = document.createElement("a");
// 		link.href = image;
// 		link.download = "David-Martina-Invitation.png";
// 		link.click();
// 	} catch (err) {
// 		console.error("Failed to generate invitation image:", err);
// 	} finally {
// 		document.body.removeChild(container);
// 	}
// };

// const formatGuestGreeting = (fullNames) => {
// 	const firstNames = fullNames.map((n) => n.split(" ")[0]);
// 	if (firstNames.length === 1) return `Hello ${firstNames[0]},`;
// 	if (firstNames.length === 2)
// 		return `Dear ${firstNames[0]} and ${firstNames[1]}`;
// 	const last = firstNames.pop();
// 	return `Dear ${firstNames.join(", ")}, and ${last}`;
// };

export const generateInvitationImage = async () => {
	const url = "/images/invi.png"; // place the file in /public/images/invi.png for Next.js

	try {
		// Fetch → Blob → force a friendly filename (more reliable across browsers)
		const res = await fetch(url);
		if (!res.ok) throw new Error(`HTTP ${res.status}`);
		const blob = await res.blob();
		const objectUrl = URL.createObjectURL(blob);

		const a = document.createElement("a");
		a.href = objectUrl;
		a.download = "David-Martina-Invitation.png";
		document.body.appendChild(a);
		a.click();
		a.remove();
		URL.revokeObjectURL(objectUrl);
	} catch (e) {
		// Fallback: direct link (works if same-origin and headers allow it)
		const a = document.createElement("a");
		a.href = url;
		a.download = "David-Martina-Invitation.png";
		document.body.appendChild(a);
		a.click();
		a.remove();
	}
};
