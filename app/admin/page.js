"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AdminPage() {
	const [authenticated, setAuthenticated] = useState(false);
	const [passcode, setPasscode] = useState("");
	const [guests, setGuests] = useState([]);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	// Filters
	const [filterName, setFilterName] = useState("");
	const [filterCode, setFilterCode] = useState("");
	const [filterAttending, setFilterAttending] = useState("all");

	// Add guests
	const [newCode, setNewCode] = useState("");
	const [newNames, setNewNames] = useState(""); // one name per line
	const [defaultAttending, setDefaultAttending] = useState("unset"); // unset | yes | no
	const [adding, setAdding] = useState(false);

	// Editing
	const [editingId, setEditingId] = useState(null);
	const [editRow, setEditRow] = useState({
		guest_name: "",
		family_code: "",
		is_attending: null,
	});

	// Group view
	const [expandedGroups, setExpandedGroups] = useState(new Set()); // family_code strings
	const [groupMode, setGroupMode] = useState(true);

	useEffect(() => {
		if (authenticated) fetchGuests();
	}, [authenticated]);

	const fetchGuests = async () => {
		setLoading(true);
		const { data, error } = await supabase.from("rsvps").select("*");
		setLoading(false);
		if (error) {
			console.error("Error fetching guests:", error.message);
			setError("Failed to fetch guests.");
		} else {
			setGuests(data || []);
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (passcode === "DivoMarto1") setAuthenticated(true);
		else setError("Incorrect passcode.");
	};

	const exportCSV = (data) => {
		const csvRows = [
			["#", "Name", "Invitation Code", "Attending", "Message"],
			...data.map((guest, index) => [
				index + 1,
				guest.guest_name || "",
				guest.family_code || "",
				guest.is_attending ? "Yes" : "No",
				(guest.message || "").replace(/[\r\n]+/g, " "),
			]),
		];
		const csvContent = csvRows
			.map((row) => row.map((item) => `"${item}"`).join(","))
			.join("\n");
		const blob = new Blob([csvContent], { type: "text/csv" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `rsvp-guestlist-${Date.now()}.csv`;
		a.click();
		URL.revokeObjectURL(url);
	};

	// --- Add Guests (single or bulk) ---
	const handleAddGuests = async (e) => {
		e.preventDefault();
		setAdding(true);
		setError("");

		const trimmedCode = newCode.trim();
		const names = newNames
			.split("\n")
			.map((n) => n.trim())
			.filter((n) => n.length > 0);

		if (!trimmedCode || names.length === 0) {
			setError("Please provide a code and at least one guest name.");
			setAdding(false);
			return;
		}

		const defaultAttendValue =
			defaultAttending === "yes"
				? true
				: defaultAttending === "no"
				? false
				: null;

		const rows = names.map((guest_name) => ({
			guest_name,
			family_code: trimmedCode,
			is_attending: defaultAttendValue,
		}));

		const { error: insertError } = await supabase.from("rsvps").insert(rows);
		setAdding(false);
		if (insertError) {
			console.error(insertError);
			setError("Failed to add guests.");
			return;
		}

		setNewCode("");
		setNewNames("");
		setDefaultAttending("unset");
		fetchGuests();
	};

	// --- Edit / Save Row ---
	const startEdit = (guest) => {
		setEditingId(guest.id);
		setEditRow({
			guest_name: guest.guest_name || "",
			family_code: guest.family_code || "",
			is_attending:
				typeof guest.is_attending === "boolean" ? guest.is_attending : null,
		});
	};

	const cancelEdit = () => {
		setEditingId(null);
		setEditRow({ guest_name: "", family_code: "", is_attending: null });
	};

	const saveEdit = async (id) => {
		setLoading(true);
		const { error: updateError } = await supabase
			.from("rsvps")
			.update({
				guest_name: editRow.guest_name || null,
				family_code: editRow.family_code || null,
				is_attending:
					editRow.is_attending === "yes"
						? true
						: editRow.is_attending === "no"
						? false
						: typeof editRow.is_attending === "boolean"
						? editRow.is_attending
						: null,
			})
			.eq("id", id);
		setLoading(false);

		if (updateError) {
			console.error(updateError);
			setError("Failed to save changes.");
			return;
		}
		cancelEdit();
		fetchGuests();
	};

	// --- Filters ---
	const filteredGuests = guests.filter((guest) => {
		const nameMatch = guest.guest_name
			?.toLowerCase()
			.includes(filterName.toLowerCase());
		const codeMatch = guest.family_code
			?.toLowerCase()
			.includes(filterCode.toLowerCase());

		let attendingMatch = true;
		if (filterAttending === "yes") attendingMatch = guest.is_attending === true;
		if (filterAttending === "no") attendingMatch = guest.is_attending === false;

		return nameMatch && codeMatch && attendingMatch;
	});

	// Totals (overall and filtered)
	const totalsAll = {
		invited: guests.length,
		attending: guests.filter((g) => g.is_attending === true).length,
		notAttending: guests.filter((g) => g.is_attending === false).length,
		pending: guests.filter((g) => g.is_attending == null).length,
	};

	const totalsFiltered = {
		invited: filteredGuests.length,
		attending: filteredGuests.filter((g) => g.is_attending === true).length,
		notAttending: filteredGuests.filter((g) => g.is_attending === false).length,
		pending: filteredGuests.filter((g) => g.is_attending == null).length,
	};

	// --- Grouping helpers ---
	const groupsMap = filteredGuests.reduce((acc, g) => {
		const key = g.family_code || "—";
		if (!acc[key]) acc[key] = [];
		acc[key].push(g);
		return acc;
	}, {});
	const groupKeys = Object.keys(groupsMap).sort((a, b) =>
		a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" })
	);

	const isExpanded = (code) => expandedGroups.has(code);
	const toggleGroup = (code) => {
		const next = new Set(expandedGroups);
		next.has(code) ? next.delete(code) : next.add(code);
		setExpandedGroups(next);
	};
	const expandAll = () => setExpandedGroups(new Set(groupKeys));
	const collapseAll = () => setExpandedGroups(new Set());

	if (!authenticated) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
				<form
					onSubmit={handleSubmit}
					className="bg-white p-6 rounded shadow-md w-full max-w-sm"
				>
					<h2 className="text-2xl font-semibold mb-4 text-center">
						Admin Access
					</h2>
					<input
						type="password"
						placeholder="Enter passcode"
						value={passcode}
						onChange={(e) => setPasscode(e.target.value)}
						className="w-full border border-gray-300 p-2 rounded mb-4"
					/>
					{error && <p className="text-red-500 text-sm mb-2">{error}</p>}
					<button
						type="submit"
						className="w-full bg-[#B76E79] hover:bg-[#d1848e] text-white py-2 px-4 rounded"
					>
						Enter
					</button>
				</form>
			</div>
		);
	}

	return (
		<div className="p-4 sm:p-6">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
				<h1 className="text-2xl sm:text-3xl font-bold">Guest List</h1>
				<div className="flex flex-col sm:flex-row gap-2">
					<button
						onClick={() => exportCSV(filteredGuests)}
						className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
					>
						Download CSV
					</button>
					<button
						onClick={fetchGuests}
						className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded"
					>
						Refresh
					</button>
					<button
						onClick={() => setGroupMode((v) => !v)}
						className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
					>
						{groupMode ? "Ungroup" : "Group by Code"}
					</button>
					{groupMode && (
						<div className="flex gap-2">
							<button
								onClick={expandAll}
								className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded"
							>
								Expand All
							</button>
							<button
								onClick={collapseAll}
								className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded"
							>
								Collapse All
							</button>
						</div>
					)}
				</div>
			</div>

			{/* Add Guests Panel */}
			<div className="mb-6 rounded-lg border border-gray-200 p-4 bg-white">
				<h2 className="text-lg font-semibold mb-3">Add Guests</h2>
				<form
					onSubmit={handleAddGuests}
					className="grid grid-cols-1 sm:grid-cols-3 gap-3"
				>
					<div>
						<label className="block text-sm text-gray-700 mb-1">
							Invitation Code
						</label>
						<input
							type="text"
							placeholder="e.g. INV01"
							value={newCode}
							onChange={(e) => setNewCode(e.target.value)}
							className="border border-gray-300 p-2 rounded w-full"
						/>
					</div>

					<div className="sm:col-span-2">
						<label className="block text-sm text-gray-700 mb-1">
							Guest Names (one per line)
						</label>
						<textarea
							placeholder={"Martina\nDavid\nAnother Guest"}
							rows={3}
							value={newNames}
							onChange={(e) => setNewNames(e.target.value)}
							className="border border-gray-300 p-2 rounded w-full"
						/>
					</div>

					<div>
						<label className="block text-sm text-gray-700 mb-1">
							Default Attending
						</label>
						<select
							value={defaultAttending}
							onChange={(e) => setDefaultAttending(e.target.value)}
							className="border border-gray-300 p-2 rounded w-full"
						>
							<option value="unset">Unset</option>
							<option value="yes">Yes</option>
							<option value="no">No</option>
						</select>
					</div>

					<div className="sm:col-span-2 flex items-end">
						<button
							type="submit"
							disabled={adding}
							className="bg-[#B76E79] hover:bg-[#d1848e] text-white px-4 py-2 rounded disabled:opacity-60"
						>
							{adding ? "Adding..." : "Add Guest(s)"}
						</button>
					</div>
				</form>
			</div>

			{/* Filters */}
			<div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
				<input
					type="text"
					placeholder="Search by name"
					value={filterName}
					onChange={(e) => setFilterName(e.target.value)}
					className="border border-gray-300 p-2 rounded w-full"
				/>
				<input
					type="text"
					placeholder="Search by invitation code"
					value={filterCode}
					onChange={(e) => setFilterCode(e.target.value)}
					className="border border-gray-300 p-2 rounded w-full"
				/>
				<select
					value={filterAttending}
					onChange={(e) => setFilterAttending(e.target.value)}
					className="border border-gray-300 p-2 rounded w-full"
				>
					<option value="all">All</option>
					<option value="yes">Attending</option>
					<option value="no">Not Attending</option>
				</select>
			</div>

			{error && <p className="text-red-600 mb-3">{error}</p>}
			{loading && <p className="text-gray-600 mb-3">Loading…</p>}

			{filteredGuests.length === 0 ? (
				<p className="text-gray-600">No responses match the filters.</p>
			) : groupMode ? (
				// GROUPED VIEW with GLOBAL RUNNING INDEX
				<div className="space-y-4">
					{(() => {
						let globalCounter = 0; // increments across all visible rows
						return groupKeys.map((code) => {
							const list = groupsMap[code];
							const expanded = isExpanded(code);

							return (
								<div
									key={code}
									className="border border-gray-200 rounded bg-white"
								>
									<button
										onClick={() => toggleGroup(code)}
										className="w-full flex items-center justify-between px-4 py-3 text-left"
									>
										<span className="font-semibold">
											Code: <span className="font-mono">{code}</span>
										</span>
										<span className="text-sm text-gray-600">
											{list.length} guest{list.length > 1 ? "s" : ""} •{" "}
											{expanded ? "Hide" : "Show"}
										</span>
									</button>

									{expanded && (
										<div className="overflow-x-auto">
											<table className="min-w-full text-sm sm:text-base border-t border-gray-200">
												<thead className="bg-gray-50">
													<tr>
														<th className="border p-2">#</th>
														<th className="border p-2">Name</th>
														<th className="border p-2">Invitation Code</th>
														<th className="border p-2">Attending</th>
														<th className="border p-2">Message</th>
														<th className="border p-2">Actions</th>
													</tr>
												</thead>
												<tbody>
													{list.map((guest, idx) => {
														const isEditing = editingId === guest.id;
														const rowNumber = ++globalCounter; // GLOBAL index
														return (
															<tr key={guest.id ?? `${code}-${idx}`}>
																<td className="border p-2">{rowNumber}</td>
																<td className="border p-2">
																	{isEditing ? (
																		<input
																			className="border border-gray-300 p-1 rounded w-full"
																			value={editRow.guest_name}
																			onChange={(e) =>
																				setEditRow({
																					...editRow,
																					guest_name: e.target.value,
																				})
																			}
																		/>
																	) : (
																		guest.guest_name || "—"
																	)}
																</td>
																<td className="border p-2">
																	{isEditing ? (
																		<input
																			className="border border-gray-300 p-1 rounded w-full"
																			value={editRow.family_code}
																			onChange={(e) =>
																				setEditRow({
																					...editRow,
																					family_code: e.target.value,
																				})
																			}
																		/>
																	) : (
																		guest.family_code || "—"
																	)}
																</td>
																<td className="border p-2">
																	{isEditing ? (
																		<select
																			className="border border-gray-300 p-1 rounded w-full"
																			value={
																				typeof editRow.is_attending ===
																				"boolean"
																					? editRow.is_attending
																						? "yes"
																						: "no"
																					: "unset"
																			}
																			onChange={(e) =>
																				setEditRow({
																					...editRow,
																					is_attending:
																						e.target.value === "yes"
																							? true
																							: e.target.value === "no"
																							? false
																							: null,
																				})
																			}
																		>
																			<option value="unset">Unset</option>
																			<option value="yes">Yes</option>
																			<option value="no">No</option>
																		</select>
																	) : guest.is_attending ? (
																		"Yes"
																	) : guest.is_attending === false ? (
																		"No"
																	) : (
																		"—"
																	)}
																</td>
																<td className="border p-2">
																	{guest.message || "—"}
																</td>
																<td className="border p-2">
																	{isEditing ? (
																		<div className="flex gap-2">
																			<button
																				onClick={() => saveEdit(guest.id)}
																				className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
																			>
																				Save
																			</button>
																			<button
																				onClick={cancelEdit}
																				className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded"
																			>
																				Cancel
																			</button>
																		</div>
																	) : (
																		<button
																			onClick={() => startEdit(guest)}
																			className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
																		>
																			Edit
																		</button>
																	)}
																</td>
															</tr>
														);
													})}
												</tbody>
											</table>
										</div>
									)}
								</div>
							);
						});
					})()}
				</div>
			) : (
				// UNGROUPED VIEW
				<div className="overflow-x-auto">
					<table className="min-w-full text-sm sm:text-base border-collapse border border-gray-300 bg-white">
						<thead className="bg-gray-100">
							<tr>
								<th className="border p-2">#</th>
								<th className="border p-2">Name</th>
								<th className="border p-2">Invitation Code</th>
								<th className="border p-2">Attending</th>
								<th className="border p-2">Message</th>
								<th className="border p-2">Actions</th>
							</tr>
						</thead>
						<tbody>
							{filteredGuests.map((guest, idx) => {
								const isEditing = editingId === guest.id;
								return (
									<tr key={guest.id ?? idx}>
										<td className="border p-2">{idx + 1}</td>
										<td className="border p-2">
											{isEditing ? (
												<input
													className="border border-gray-300 p-1 rounded w-full"
													value={editRow.guest_name}
													onChange={(e) =>
														setEditRow({
															...editRow,
															guest_name: e.target.value,
														})
													}
												/>
											) : (
												guest.guest_name || "—"
											)}
										</td>
										<td className="border p-2">
											{isEditing ? (
												<input
													className="border border-gray-300 p-1 rounded w-full"
													value={editRow.family_code}
													onChange={(e) =>
														setEditRow({
															...editRow,
															family_code: e.target.value,
														})
													}
												/>
											) : (
												guest.family_code || "—"
											)}
										</td>
										<td className="border p-2">
											{isEditing ? (
												<select
													className="border border-gray-300 p-1 rounded w-full"
													value={
														typeof editRow.is_attending === "boolean"
															? editRow.is_attending
																? "yes"
																: "no"
															: "unset"
													}
													onChange={(e) =>
														setEditRow({
															...editRow,
															is_attending:
																e.target.value === "yes"
																	? true
																	: e.target.value === "no"
																	? false
																	: null,
														})
													}
												>
													<option value="unset">Unset</option>
													<option value="yes">Yes</option>
													<option value="no">No</option>
												</select>
											) : guest.is_attending ? (
												"Yes"
											) : guest.is_attending === false ? (
												"No"
											) : (
												"—"
											)}
										</td>
										<td className="border p-2">{guest.message || "—"}</td>
										<td className="border p-2">
											{isEditing ? (
												<div className="flex gap-2">
													<button
														onClick={() => saveEdit(guest.id)}
														className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
													>
														Save
													</button>
													<button
														onClick={cancelEdit}
														className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded"
													>
														Cancel
													</button>
												</div>
											) : (
												<button
													onClick={() => startEdit(guest)}
													className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
												>
													Edit
												</button>
											)}
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			)}

			{/* Summary */}
			<div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div className="rounded-lg border border-gray-200 bg-white p-4">
					<h3 className="font-semibold mb-2">All Totals</h3>
					<div className="flex flex-wrap gap-3 text-sm sm:text-base">
						<span className="px-3 py-1 rounded bg-gray-100">
							Invited: <strong>{totalsAll.invited}</strong>
						</span>
						<span className="px-3 py-1 rounded bg-green-100">
							Attending: <strong>{totalsAll.attending}</strong>
						</span>
						<span className="px-3 py-1 rounded bg-red-100">
							Not attending: <strong>{totalsAll.notAttending}</strong>
						</span>
						<span className="px-3 py-1 rounded bg-yellow-100">
							Pending: <strong>{totalsAll.pending}</strong>
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
