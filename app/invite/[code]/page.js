import InvitePageClient from "./InvitePageClient";

export default async function Page(props) {
	const { code } = props.params; // ✅ Avoids direct access
	return <InvitePageClient code={code} />;
}
