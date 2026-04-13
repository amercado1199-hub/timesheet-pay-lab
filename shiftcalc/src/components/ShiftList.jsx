function ShiftList({ shifts, onDeleteShift }) {
return (
<div className="shift-list">
<h2>Saved Shifts</h2>

{shifts.length === 0 ? (
<p>No shifts added yet.</p>
) : (
shifts.map((shift, index) => (
<div className="shift-card" key={index}>
<p>
<strong>Date:</strong> {shift.date}
</p>
<p>
<strong>Start:</strong> {shift.startTime}
</p>
<p>
<strong>End:</strong> {shift.endTime}
</p>
<p>
<strong>Break:</strong> {shift.breakMinutes} min
</p>
<p>
<strong>Hours:</strong> {shift.hoursWorked.toFixed(2)}
</p>
<p>
<strong>Pay:</strong> ${shift.pay.toFixed(2)}
</p>

<button onClick={() => onDeleteShift(index)}>Delete</button>
</div>
))
)}
</div>
);
}

export default ShiftList;

