import { useEffect, useState } from "react";
import "./index.css";

function App() {
const [date, setDate] = useState("");
const [startTime, setStartTime] = useState("");
const [endTime, setEndTime] = useState("");
const [breakMinutes, setBreakMinutes] = useState(30);
const [hourlyRate, setHourlyRate] = useState(15);
const [shifts, setShifts] = useState([]);
const [image, setImage] = useState(null);

useEffect(() => {
const saved = localStorage.getItem("shifts");
if (saved) {
setShifts(JSON.parse(saved));
}
}, []);

useEffect(() => {
localStorage.setItem("shifts", JSON.stringify(shifts));
}, [shifts]);

function calculateHours(start, end, breakMin) {
const startDate = new Date(`1970-01-01T${start}:00`);
const endDate = new Date(`1970-01-01T${end}:00`);

let diff = (endDate - startDate) / 1000 / 60 / 60;

if (diff < 0) {
diff += 24;
}

diff -= Number(breakMin) / 60;

return diff > 0 ? diff : 0;
}

function handleAddShift(e) {
e.preventDefault();

if (!date || !startTime || !endTime) return;

const hours = calculateHours(startTime, endTime, breakMinutes);
const overtimeHours = hours > 8 ? hours - 8 : 0;
const regularHours = hours > 8 ? 8 : hours;

const regularPay = regularHours * Number(hourlyRate);
const overtimePay = overtimeHours * Number(hourlyRate) * 1.5;

const newShift = {
date,
startTime,
endTime,
breakMinutes: Number(breakMinutes),
hourlyRate: Number(hourlyRate),
hours,
regularHours,
overtimeHours,
regularPay,
overtimePay,
};

setShifts([...shifts, newShift]);

setDate("");
setStartTime("");
setEndTime("");
setBreakMinutes(30);
setHourlyRate(15);
setImage(null);
}

function handleDeleteShift(indexToDelete) {
const updated = shifts.filter((_, index) => index !== indexToDelete);
setShifts(updated);
}

function handleClearAll() {
setShifts([]);
localStorage.removeItem("shifts");
}

function exportCSV() {
if (shifts.length === 0) return;

const rows = [
[
"Date",
"Start Time",
"End Time",
"Break Minutes",
"Hourly Rate",
"Hours",
"Regular Hours",
"Overtime Hours",
"Regular Pay",
"Overtime Pay",
"Total Pay",
],
...shifts.map((shift) => [
shift.date,
shift.startTime,
shift.endTime,
shift.breakMinutes,
shift.hourlyRate,
shift.hours.toFixed(2),
shift.regularHours.toFixed(2),
shift.overtimeHours.toFixed(2),
shift.regularPay.toFixed(2),
shift.overtimePay.toFixed(2),
(shift.regularPay + shift.overtimePay).toFixed(2),
]),
];

const csvContent = rows.map((row) => row.join(",")).join("\n");
const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
const url = URL.createObjectURL(blob);

const link = document.createElement("a");
link.href = url;
link.setAttribute("download", "shiftcalc-data.csv");
document.body.appendChild(link);
link.click();
document.body.removeChild(link);
}

const totalHours = shifts.reduce((sum, shift) => sum + shift.hours, 0);
const totalRegularHours = shifts.reduce(
(sum, shift) => sum + shift.regularHours,
0
);
const totalOvertimeHours = shifts.reduce(
(sum, shift) => sum + shift.overtimeHours,
0
);
const totalRegularPay = shifts.reduce(
(sum, shift) => sum + shift.regularPay,
0
);
const totalOvertimePay = shifts.reduce(
(sum, shift) => sum + shift.overtimePay,
0
);
const totalPay = totalRegularPay + totalOvertimePay;

return (
<div className="app">
<div className="card">
<h1>ShiftCalc</h1>

<form onSubmit={handleAddShift}>
<div className="field-group">
<label htmlFor="date">Date</label>
<input
id="date"
type="date"
value={date}
onChange={(e) => setDate(e.target.value)}
required
/>
{!date && <span className="hint">Tap to select date</span>}
</div>

<div className="field-group">
<label htmlFor="startTime">Start Time</label>
<input
id="startTime"
type="time"
value={startTime}
onChange={(e) => setStartTime(e.target.value)}
required
/>
{!startTime && <span className="hint">Tap to select time</span>}
</div>

<div className="field-group">
<label htmlFor="endTime">End Time</label>
<input
id="endTime"
type="time"
value={endTime}
onChange={(e) => setEndTime(e.target.value)}
required
/>
{!endTime && <span className="hint">Tap to select time</span>}
</div>

<div className="field-group">
<label htmlFor="breakMinutes">Break Minutes</label>
<input
id="breakMinutes"
type="number"
placeholder="Break minutes"
value={breakMinutes}
onChange={(e) => setBreakMinutes(e.target.value)}
/>
</div>

<div className="field-group">
<label htmlFor="hourlyRate">Hourly Rate</label>
<input
id="hourlyRate"
type="number"
step="0.01"
placeholder="Hourly rate"
value={hourlyRate}
onChange={(e) => setHourlyRate(e.target.value)}
/>
</div>

<div className="field-group">
<label htmlFor="imageUpload">Upload Time Card Image</label>
<input
id="imageUpload"
type="file"
accept="image/*"
capture="environment"
onChange={(e) => setImage(e.target.files[0])}
/>
</div>

<button type="submit">Add Shift</button>
</form>

<div className="button-row">
<button type="button" className="secondary-btn" onClick={exportCSV}>
Export CSV
</button>

<button type="button" className="danger-btn" onClick={handleClearAll}>
Clear All
</button>
</div>

<h2>Shifts</h2>

{shifts.length === 0 ? (
<p className="empty-text">No shifts added yet.</p>
) : (
<div className="shift-list">
{shifts.map((shift, index) => (
<div key={index} className="shift-item">
<div className="shift-info">
<p><strong>Date:</strong> {shift.date}</p>
<p>
<strong>Time:</strong> {shift.startTime} - {shift.endTime}
</p>
<p><strong>Hours:</strong> {shift.hours.toFixed(2)}</p>
<p>
<strong>Regular:</strong> {shift.regularHours.toFixed(2)} hrs
</p>
<p>
<strong>Overtime:</strong> {shift.overtimeHours.toFixed(2)} hrs
</p>
<p>
<strong>Total Pay:</strong> $
{(shift.regularPay + shift.overtimePay).toFixed(2)}
</p>
</div>

<button
type="button"
className="delete-btn"
onClick={() => handleDeleteShift(index)}
>
Delete
</button>
</div>
))}
</div>
)}

<div className="totals">
<p>Total Hours: {totalHours.toFixed(2)}</p>
<p>Regular Hours: {totalRegularHours.toFixed(2)}</p>
<p>Overtime Hours: {totalOvertimeHours.toFixed(2)}</p>
<p>Regular Pay: ${totalRegularPay.toFixed(2)}</p>
<p>Overtime Pay: ${totalOvertimePay.toFixed(2)}</p>
<p>Total Pay: ${totalPay.toFixed(2)}</p>
</div>
</div>
</div>
);
}

export default App;

