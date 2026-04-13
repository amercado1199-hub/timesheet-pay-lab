import { useEffect, useState } from "react";

function ShiftForm({ onAddShift, initialData }) {
const [date, setDate] = useState("");
const [startTime, setStartTime] = useState("");
const [endTime, setEndTime] = useState("");
const [breakMinutes, setBreakMinutes] = useState("");
const [hourlyRate, setHourlyRate] = useState("");

useEffect(() => {
if (initialData) {
setDate(initialData.date || "");
setStartTime(initialData.startTime || "");
setEndTime(initialData.endTime || "");
setBreakMinutes(initialData.breakMinutes || "");
setHourlyRate(initialData.hourlyRate || "");
}
}, [initialData]);

function calculateHours(start, end, breakMins) {
const startDate = new Date(`2000-01-01T${start}`);
const endDate = new Date(`2000-01-01T${end}`);

let diffMs = endDate - startDate;

if (diffMs < 0) {
diffMs += 24 * 60 * 60 * 1000;
}

const diffHours = diffMs / (1000 * 60 * 60);
const breakHours = Number(breakMins || 0) / 60;

return Math.max(diffHours - breakHours, 0);
}

function handleSubmit(e) {
e.preventDefault();

const hoursWorked = calculateHours(startTime, endTime, breakMinutes);
const pay = hoursWorked * Number(hourlyRate);

const newShift = {
date,
startTime,
endTime,
breakMinutes: Number(breakMinutes || 0),
hourlyRate: Number(hourlyRate || 0),
hoursWorked,
pay,
};

onAddShift(newShift);

setDate("");
setStartTime("");
setEndTime("");
setBreakMinutes("");
setHourlyRate("");
}

return (
<form className="shift-form" onSubmit={handleSubmit}>
<h2>Add Shift</h2>

<input
type="date"
value={date}
onChange={(e) => setDate(e.target.value)}
required
/>

<input
type="time"
value={startTime}
onChange={(e) => setStartTime(e.target.value)}
required
/>

<input
type="time"
value={endTime}
onChange={(e) => setEndTime(e.target.value)}
required
/>

<input
type="number"
placeholder="Break minutes"
value={breakMinutes}
onChange={(e) => setBreakMinutes(e.target.value)}
/>

<input
type="number"
step="0.01"
placeholder="Hourly rate"
value={hourlyRate}
onChange={(e) => setHourlyRate(e.target.value)}
required
/>

<button type="submit">Add Shift</button>
</form>
);
}

export default ShiftForm;

