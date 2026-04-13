import { useEffect, useState } from "react";
import { createWorker } from "tesseract.js";

function App() {
const [date, setDate] = useState("");
const [startTime, setStartTime] = useState("");
const [endTime, setEndTime] = useState("");
const [breakMinutes, setBreakMinutes] = useState("");
const [hourlyRate, setHourlyRate] = useState("");

const [entries, setEntries] = useState(() => {
const savedEntries = localStorage.getItem("shiftEntries");
return savedEntries ? JSON.parse(savedEntries) : [];
});

const [image, setImage] = useState(null);
const [ocrText, setOcrText] = useState("");
const [detectedTimes, setDetectedTimes] = useState([]);
const [isReadingImage, setIsReadingImage] = useState(false);
const [ocrError, setOcrError] = useState("");

useEffect(() => {
localStorage.setItem("shiftEntries", JSON.stringify(entries));
}, [entries]);

function handleImageChange(e) {
const file = e.target.files[0];
if (!file) return;

const imageUrl = URL.createObjectURL(file);
setImage(imageUrl);
setOcrText("");
setDetectedTimes([]);
setOcrError("");
}

async function handleReadImage() {
if (!image) return;

setIsReadingImage(true);
setOcrError("");
setOcrText("");
setDetectedTimes([]);

let worker;

try {
worker = await createWorker("eng");

const {
data: { text },
} = await worker.recognize(image);

setOcrText(text);
autoFillFromText(text);
} catch (error) {
console.error(error);
setOcrError("Could not read text from image. Try a clearer photo.");
} finally {
if (worker) {
await worker.terminate();
}
setIsReadingImage(false);
}
}

function autoFillFromText(text) {
const cleaned = text.replace(/\n/g, " ").trim();

const timeMatches =
cleaned.match(/\b(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM|am|pm)?\b/g) || [];

setDetectedTimes(timeMatches);

if (timeMatches.length >= 2) {
setStartTime(convertTo24Hour(timeMatches[0]));
setEndTime(convertTo24Hour(timeMatches[1]));
}

const breakMatch = cleaned.match(/break[:\s]+(\d{1,3})/i);
if (breakMatch) {
setBreakMinutes(breakMatch[1]);
}
}

function convertTo24Hour(timeString) {
const match = timeString.match(/(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)?/);
if (!match) return "";

let hours = Number(match[1]);
const minutes = match[2];
const period = match[3]?.toUpperCase();

if (period === "PM" && hours !== 12) hours += 12;
if (period === "AM" && hours === 12) hours = 0;

return `${String(hours).padStart(2, "0")}:${minutes}`;
}

function handleSubmit(e) {
e.preventDefault();

const start = new Date(`2000-01-01T${startTime}`);
const end = new Date(`2000-01-01T${endTime}`);

let diffMs = end - start;
if (diffMs < 0) {
diffMs += 24 * 60 * 60 * 1000;
}

const totalHours = diffMs / (1000 * 60 * 60);
const breakHours = Number(breakMinutes || 0) / 60;
const hoursWorked = Math.max(totalHours - breakHours, 0);
const regularPay = hoursWorked * Number(hourlyRate || 0);

const newEntry = {
date,
startTime,
endTime,
breakMinutes: Number(breakMinutes || 0),
hourlyRate: Number(hourlyRate || 0),
hoursWorked,
regularPay,
};

setEntries([...entries, newEntry]);

setDate("");
setStartTime("");
setEndTime("");
setBreakMinutes("");
setHourlyRate("");
setOcrText("");
setDetectedTimes([]);
setOcrError("");
setImage(null);
}

function handleDelete(indexToDelete) {
const updatedEntries = entries.filter((_, index) => index !== indexToDelete);
setEntries(updatedEntries);
}

function exportCSV() {
if (entries.length === 0) return;

const headers =
"Date,Start Time,End Time,Break Minutes,Hourly Rate,Hours Worked,Regular Pay";

const rows = entries.map((entry) =>
[
entry.date,
entry.startTime,
entry.endTime,
entry.breakMinutes,
entry.hourlyRate,
entry.hoursWorked.toFixed(2),
entry.regularPay.toFixed(2),
].join(",")
);

const csv = [headers, ...rows].join("\n");
const blob = new Blob([csv], { type: "text/csv" });
const url = URL.createObjectURL(blob);

const a = document.createElement("a");
a.href = url;
a.download = "shiftcalc-shifts.csv";
a.click();

URL.revokeObjectURL(url);
}

const totalHoursWorked = entries.reduce(
(sum, entry) => sum + entry.hoursWorked,
0
);

const weightedBasePay = entries.reduce(
(sum, entry) => sum + entry.hoursWorked * entry.hourlyRate,
0
);

const averageRate =
totalHoursWorked > 0 ? weightedBasePay / totalHoursWorked : 0;

const regularHours = Math.min(totalHoursWorked, 40);
const overtimeHours = Math.max(totalHoursWorked - 40, 0);
const regularPay = regularHours * averageRate;
const overtimePay = overtimeHours * averageRate * 1.5;
const totalEarned = regularPay + overtimePay;

return (
<div className="app">
<h1>ShiftCalc</h1>

<form onSubmit={handleSubmit}>
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

<label className="upload-label">Upload Time Card Image</label>
<input type="file" accept="image/*" onChange={handleImageChange} />

{image && (
<div className="image-preview">
<img src={image} alt="Uploaded time card" className="preview-image" />

<button
type="button"
onClick={handleReadImage}
disabled={isReadingImage}
>
{isReadingImage ? "Reading Image..." : "Extract Text From Image"}
</button>
</div>
)}

{ocrError && <p className="error-text">{ocrError}</p>}

{ocrText && (
<div className="ocr-box">
<h3>OCR Text</h3>
<pre>{ocrText}</pre>
</div>
)}

{detectedTimes.length > 0 && (
<div className="ocr-box">
<h3>Detected Times</h3>
{detectedTimes.map((time, index) => (
<div key={`${time}-${index}`} style={{ marginBottom: "8px" }}>
<button
type="button"
onClick={() => setStartTime(convertTo24Hour(time))}
style={{ marginRight: "8px" }}
>
Use {time} as Start
</button>

<button
type="button"
onClick={() => setEndTime(convertTo24Hour(time))}
>
Use {time} as End
</button>
</div>
))}
</div>
)}

<button type="submit">Add Shift</button>
</form>

<div style={{ marginTop: "20px" }}>
<button type="button" onClick={exportCSV}>
Export CSV
</button>
</div>

<h2>Shifts</h2>

{entries.length === 0 ? (
<p>No shifts added yet.</p>
) : (
entries.map((entry, index) => (
<div key={index} className="shift-item">
<p>
{entry.date} | {entry.startTime} - {entry.endTime} |{" "}
{entry.hoursWorked.toFixed(2)} hrs | ${entry.regularPay.toFixed(2)}
</p>

<button className="delete-btn" onClick={() => handleDelete(index)}>
Delete
</button>
</div>
))
)}

<h2>Total Hours: {totalHoursWorked.toFixed(2)}</h2>
<h2>Regular Hours: {regularHours.toFixed(2)}</h2>
<h2>Overtime Hours: {overtimeHours.toFixed(2)}</h2>
<h2>Regular Pay: ${regularPay.toFixed(2)}</h2>
<h2>Overtime Pay: ${overtimePay.toFixed(2)}</h2>
<h2>Total Earned: ${totalEarned.toFixed(2)}</h2>
</div>
);
}

export default App;


