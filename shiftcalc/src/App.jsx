import { useState, useEffect } from "react";
import "./index.css";

function App() {
const [date, setDate] = useState("");
const [startTime, setStartTime] = useState("");
const [endTime, setEndTime] = useState("");
const [breakMinutes, setBreakMinutes] = useState(30);
const [hourlyRate, setHourlyRate] = useState(15);
const [shifts, setShifts] = useState([]);
const [image, setImage] = useState(null);

// Load saved data
useEffect(() => {
const saved = localStorage.getItem("shifts");
if (saved) setShifts(JSON.parse(saved));
}, []);

// Save data
useEffect(() => {
localStorage.setItem("shifts", JSON.stringify(shifts));
}, [shifts]);

function calculateHours(start, end, breakMin) {
const startDate = new Date(`1970-01-01T${start}:00`);
const endDate = new Date(`1970-01-01T${end}:00`);

let diff = (endDate - startDate) / 1000 / 60 / 60;
diff -= breakMin / 60;

return diff > 0 ? diff : 0;
}

function handleAddShift(e) {
e.preventDefault();

const hours = calculateHours(startTime, endTime, breakMinutes);

const overtimeHours = hours > 8 ? hours - 8 : 0;
const regularHours = hours > 8 ? 8 : hours;

const regularPay = regularHours * hourlyRate;
const overtimePay = overtimeHours * hourlyRate * 1.5;

const newShift = {
date,
hours,
regularHours,
overtimeHours,
regularPay,
overtimePay,
};

setShifts([...shifts, newShift]);

// Reset form
setDate("");
setStartTime("");
setEndTime("");
}

const totalHours = shifts.reduce((sum, s) => sum + s.hours, 0);
const totalRegular = shifts.reduce((sum, s) => sum + s.regularHours, 0);
const totalOT = shifts.reduce((sum, s) => sum + s.overtimeHours, 0);
const totalRegularPay = shifts.reduce((sum, s) => sum + s.regularPay, 0);
const totalOTPay = shifts.reduce((sum, s) => sum + s.overtimePay, 0);

function exportCSV() {
const rows = [
["Date", "Hours", "Regular Hours", "OT Hours", "Regular Pay", "OT Pay"],
...shifts.map((s) => [
s.date,
s.hours.toFixed(2),
s.regularHours.toFixed(2),
s.overtimeHours.toFixed(2),
s.regularPay.toFixed(2),
s.overtimePay.toFixed(2),
]),
];

const csv = rows.map((r) => r.join(",")).join("\n");
const blob = new Blob([csv], { type: "text/csv" });

const link = document.createElement("a");
link.href = URL.createObjectURL(blob);
link.download = "shifts.csv";
link.click();
}

return (
<div className="app">
<div className="card">
<h1>ShiftCalc</h1>

<form onSubmit={handleAddShift}>
<div className="field-group">
<label>Date</label>
<input
type="date"
value={date}
onChange={(e) => setDate(e.target.value)}
required
/>
</div>

<div className="field-group">
<label>Start Time</label>
<input
type="time"
value={startTime}
onChange={(e) => setStartTime(e.target.value)}
required
/>
</div>

<div className="field-group">
<label>End Time</label>
<input
type="time"
value={endTime}
onChange={(e) => setEndTime(e.target.value)}
required
/>
</div>

<input
type="number"
placeholder="Break minutes"
value={breakMinutes}
onChange={(e) => setBreakMinutes(e.target.value)}
/>

<input
type="number"
placeholder="Hourly rate"
value={hourlyRate}
onChange={(e) => setHourlyRate(e.target.value)}
/>

<label>Upload Time Card Image</label>
<input type="file" onChange={(e) => setImage(e.target.files[0])} />

<button type="submit">Add Shift</button>
</form>

<button className="export" onClick={exportCSV}>
Export CSV
</button>

<h2>Shifts</h2>
{shifts.length === 0 && <p>No shifts added yet.</p>}

<div className="totals">
<p>Total Hours: {totalHours.toFixed(2)}</p>
<p>Regular Hours: {totalRegular.toFixed(2)}</p>
<p>Overtime Hours: {totalOT.toFixed(2)}</p>
<p>Regular Pay: ${totalRegularPay.toFixed(2)}</p>
<p>Overtime Pay: ${totalOTPay.toFixed(2)}</p>
<p>Total Pay: ${(totalRegularPay + totalOTPay).toFixed(2)}</p>
</div>
</div>
</div>
);
}

export default App;
