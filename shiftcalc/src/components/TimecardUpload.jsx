import { useState } from "react";

function TimecardUpload({ onImageSelect }) {
const [preview, setPreview] = useState(null);

function handleFileChange(e) {
const file = e.target.files[0];
if (!file) return;

setPreview(URL.createObjectURL(file));
onImageSelect(file);
}

return (
<div className="upload-box">
<h2>Upload Time Card</h2>
<input type="file" accept="image/*" onChange={handleFileChange} />

{preview && (
<img
className="preview-image"
src={preview}
alt="Time card preview"
/>
)}
</div>
);
}

export default TimecardUpload;

