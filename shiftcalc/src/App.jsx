import { Routes, Route, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import "./index.css";

function Navbar() {
  return (
    <nav className="navbar">
      <h1>ShiftCalc</h1>

      <div>
        <NavLink to="/">Calculator</NavLink>
        <NavLink to="/holidays">Holidays</NavLink>
        <NavLink to="/about">About</NavLink>
      </div>
    </nav>
  );
}

function Calculator() {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [breakMinutes, setBreakMinutes] = useState(30);
  const [hourlyRate, setHourlyRate] = useState(15);
  const [shifts, setShifts] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("shifts");
    if (saved) setShifts(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("shifts", JSON.stringify(shifts));
  }, [shifts]);

  function calculateHours(start, end, breakMin) {
    const startDate = new Date(`1970-01-01T${start}:00`);
    const endDate = new Date(`1970-01-01T${end}:00`);

    let diff = (endDate - startDate) / 1000 / 60 / 60;

    if (diff < 0) diff += 24;

    diff -= Number(breakMin) / 60;

    return diff > 0 ? diff : 0;
  }

  function handleAddShift(e) {
    e.preventDefault();

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
  }

  function deleteShift(indexToDelete) {
    setShifts(shifts.filter((_, index) => index !== indexToDelete));
  }

  function clearAllShifts() {
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
    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

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
    <div className="card">
      <h2>Time Card Calculator</h2>

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

        <div className="field-group">
          <label>Break Minutes</label>
          <input
            type="number"
            value={breakMinutes}
            onChange={(e) => setBreakMinutes(e.target.value)}
          />
        </div>

        <div className="field-group">
          <label>Hourly Rate</label>
          <input
            type="number"
            step="0.01"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
          />
        </div>

        <button type="submit">Add Shift</button>
      </form>

      <div className="button-row">
        <button type="button" className="secondary-btn" onClick={exportCSV}>
          Export CSV
        </button>

        <button type="button" className="danger-btn" onClick={clearAllShifts}>
          Clear All
        </button>
      </div>

      <h2>Shifts</h2>

      {shifts.length === 0 ? (
        <p className="empty-text">No shifts added yet.</p>
      ) : (
        <div className="shift-list">
          {shifts.map((shift, index) => (
            <div className="shift-item" key={index}>
              <div>
                <p>
                  <strong>Date:</strong> {shift.date}
                </p>
                <p>
                  <strong>Time:</strong> {shift.startTime} - {shift.endTime}
                </p>
                <p>
                  <strong>Hours:</strong> {shift.hours.toFixed(2)}
                </p>
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
                onClick={() => deleteShift(index)}
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
  );
}

function Holidays() {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getHolidays() {
      try {
        const response = await fetch(
          "https://date.nager.at/api/v3/NextPublicHolidays/US"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch holidays");
        }

        const data = await response.json();
        setHolidays(data);
      } catch {
        setError("Unable to load holidays. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    getHolidays();
  }, []);

  return (
    <div className="card">
      <h2>Upcoming U.S. Holidays</h2>
      <p className="subtitle">
        This page fetches real holiday data from an external API.
      </p>

      {loading && <p className="empty-text">Loading holidays...</p>}

      {error && <p className="error-text">{error}</p>}

      {!loading && !error && holidays.length === 0 && (
        <p className="empty-text">No holidays found.</p>
      )}

      {!loading && !error && (
        <div className="holiday-grid">
          {holidays.map((holiday) => (
            <div className="holiday-card" key={`${holiday.date}-${holiday.name}`}>
              <h3>{holiday.name}</h3>
              <p>{holiday.localName}</p>
              <p>
                <strong>{holiday.date}</strong>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function About() {
  return (
    <div className="card">
      <h2>About ShiftCalc</h2>

      <p>
        ShiftCalc is a React application that helps users track work shifts,
        calculate regular and overtime pay, save shift records with localStorage,
        export records as a CSV file, and view upcoming U.S. holidays using an
        external API.
      </p>

      <h3>Project Features</h3>
      <ul className="about-list">
        <li>React Router navigation</li>
        <li>Controlled form inputs</li>
        <li>State management with useState</li>
        <li>Side effects with useEffect</li>
        <li>localStorage persistence</li>
        <li>CSV export feature</li>
        <li>External API integration</li>
        <li>Loading, error, and empty states</li>
      </ul>
    </div>
  );
}

export default function App() {
  return (
    <div className="app">
      <Navbar />

      <main className="page">
        <Routes>
          <Route path="/" element={<Calculator />} />
          <Route path="/holidays" element={<Holidays />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </div>
  );
}
