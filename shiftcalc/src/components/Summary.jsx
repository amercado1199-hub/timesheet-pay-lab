function Summary({ shifts }) {
const totalHours = shifts.reduce((sum, shift) => sum + shift.hoursWorked, 0);
const totalPay = shifts.reduce((sum, shift) => sum + shift.pay, 0);

return (
<div className="summary">
<h2>Summary</h2>
<p>
<strong>Total Hours:</strong> {totalHours.toFixed(2)}
</p>
<p>
<strong>Total Pay:</strong> ${totalPay.toFixed(2)}
</p>
</div>
);
}

export default Summary;
