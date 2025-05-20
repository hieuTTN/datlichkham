{
"doctorId": 1,
"dates": [
{
"id": 10,
"dayOfWeek": 1,
"times": [
{ "id": 100, "startTime": "09:00", "toTime": "10:00" },
{ "startTime": "10:30", "toTime": "11:30" } // thêm mới vì không có id
]
},
{
"dayOfWeek": 3,
"times": [
{ "startTime": "14:00", "toTime": "15:00" }
]
}
]
}



import React, { useEffect, useState } from "react";
import axios from "axios";

const DoctorScheduleForm = ({ doctorId }) => {
const [dates, setDates] = useState([]);

// Factory function: tạo bản sao mới mỗi lần gọi
const emptyTime = () => ({ startTime: "", toTime: "", id: null });
const emptyDate = () => ({ dayOfWeek: "", times: [emptyTime()], id: null });

useEffect(() => {
if (doctorId) {
axios.get(`/api/doctors/${doctorId}/schedules`).then((res) => {
setDates(res.data);
});
} else {
setDates([emptyDate()]);
}
}, [doctorId]);

const handleDateChange = (index, value) => {
const updated = [...dates];
updated[index].dayOfWeek = value;
setDates(updated);
};

const handleTimeChange = (dateIndex, timeIndex, field, value) => {
const updated = [...dates];
updated[dateIndex].times[timeIndex][field] = value;
setDates(updated);
};

const addDate = () => {
setDates([...dates, emptyDate()]);
};

const removeDate = (index) => {
const updated = [...dates];
updated.splice(index, 1);
setDates(updated);
};

const addTime = (dateIndex) => {
const updated = [...dates];
updated[dateIndex].times.push(emptyTime());
setDates(updated);
};

const removeTime = (dateIndex, timeIndex) => {
const updated = [...dates];
updated[dateIndex].times.splice(timeIndex, 1);
setDates(updated);
};

const handleSubmit = async (e) => {
e.preventDefault();
const payload = { doctorId, dates };
await axios.post("/api/doctors/schedules/save", payload);
alert("Saved successfully");
};

return (
<form onSubmit={handleSubmit}>
{dates.map((date, dateIndex) => (
<div key={dateIndex} style={{ marginBottom: "1rem", border: "1px solid #ccc", padding: "1rem" }}>
<label>
Day of Week:
<input
type="text"
value={date.dayOfWeek}
onChange={(e) => handleDateChange(dateIndex, e.target.value)}
/>
</label>
<button type="button" onClick={() => removeDate(dateIndex)}>
Remove Day
</button>
<div>
{date.times.map((time, timeIndex) => (
<div key={timeIndex} style={{ marginTop: "0.5rem" }}>
<label>
Start Time:
<input
type="time"
value={time.startTime}
onChange={(e) =>
handleTimeChange(dateIndex, timeIndex, "startTime", e.target.value)
}
/>
</label>
<label>
To Time:
<input
type="time"
value={time.toTime}
onChange={(e) =>
handleTimeChange(dateIndex, timeIndex, "toTime", e.target.value)
}
/>
</label>
<button type="button" onClick={() => removeTime(dateIndex, timeIndex)}>
Remove Time
</button>
</div>
))}
</div>
<button type="button" onClick={() => addTime(dateIndex)}>
Add Time
</button>
</div>
))}
<button type="button" onClick={addDate}>
Add Date
</button>
<button type="submit">Save</button>
</form>
);
};

export default DoctorScheduleForm;
