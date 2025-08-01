// app/invite/[code]/page.js
import InvitePageClient from "./InvitePageClient";

export default async function Page({ params }) {
	const { code } = await params; // 👈 await params
	return <InvitePageClient code={code} />;
}
