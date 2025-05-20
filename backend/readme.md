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




import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const emptyTime = { startTime: "", toTime: "", id: null };
const emptyDate = { dayOfWeek: "", times: [{ ...emptyTime }], id: null };

function DoctorScheduleForm() {
const { doctorId } = useParams();
const [dates, setDates] = useState([]);
const [message, setMessage] = useState("");

useEffect(function () {
if (doctorId) {
fetch(`/api/schedule/${doctorId}`)
.then(res => res.json())
.then(data => setDates(data.dates || []))
.catch(err => setMessage("Lỗi tải dữ liệu: " + err.message));
} else {
setDates([{ ...emptyDate }]);
}
}, [doctorId]);

function handleAddDate() {
setDates([...dates, { ...emptyDate }]);
}

function handleRemoveDate(index) {
const updated = [...dates];
updated.splice(index, 1);
setDates(updated);
}

function handleAddTime(dateIndex) {
const updated = [...dates];
updated[dateIndex].times.push({ ...emptyTime });
setDates(updated);
}

function handleRemoveTime(dateIndex, timeIndex) {
const updated = [...dates];
updated[dateIndex].times.splice(timeIndex, 1);
setDates(updated);
}

function handleDateChange(index, field, value) {
const updated = [...dates];
updated[index][field] = value;
setDates(updated);
}

function handleTimeChange(dateIndex, timeIndex, field, value) {
const updated = [...dates];
updated[dateIndex].times[timeIndex][field] = value;
setDates(updated);
}

async function handleSubmit(e) {
e.preventDefault();
const payload = {
doctorId: doctorId ? parseInt(doctorId) : null,
dates: dates,
};

    try {
      const res = await fetch("/api/schedule/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setMessage("Lưu lịch làm việc thành công!");
      } else {
        const err = await res.text();
        setMessage("Lỗi: " + err);
      }
    } catch (err) {
      setMessage("Lỗi kết nối: " + err.message);
    }
}

async function deleteDateOnServer(dateId) {
if (!window.confirm("Bạn có chắc muốn xóa ngày làm này không?")) return;
try {
const res = await fetch(`/api/schedule/date/${dateId}`, { method: "DELETE" });
if (!res.ok) throw new Error("Xóa thất bại");
setDates(prev => prev.filter(d => d.id !== dateId));
setMessage("Đã xóa ngày làm.");
} catch (err) {
setMessage("Lỗi xóa ngày làm: " + err.message);
}
}

async function deleteTimeOnServer(timeId, dateIndex, timeIndex) {
if (!window.confirm("Bạn có chắc muốn xóa khung giờ này không?")) return;
try {
const res = await fetch(`/api/schedule/time/${timeId}`, { method: "DELETE" });
if (!res.ok) throw new Error("Xóa thất bại");

      const updated = [...dates];
      updated[dateIndex].times.splice(timeIndex, 1);
      setDates(updated);
      setMessage("Đã xóa giờ làm.");
    } catch (err) {
      setMessage("Lỗi xóa giờ làm: " + err.message);
    }
}

return React.createElement("div", { style: { maxWidth: 600, margin: "0 auto" } },
React.createElement("h2", null, doctorId ? "Cập nhật lịch làm việc bác sĩ" : "Thêm lịch làm việc bác sĩ"),
message && React.createElement("p", { style: { color: "green" } }, message),
React.createElement("form", { onSubmit: handleSubmit },
dates.map(function (date, dateIndex) {
return React.createElement("div", {
key: dateIndex,
style: { border: "1px solid #ccc", padding: 10, marginBottom: 15 }
},
React.createElement("label", null, "Thứ (0-CN, 1-T2,...): "),
React.createElement("input", {
type: "number",
value: date.dayOfWeek,
onChange: function (e) {
handleDateChange(dateIndex, "dayOfWeek", e.target.value);
},
required: true
}),
doctorId ? React.createElement("button", {
type: "button",
onClick: function () {
if (date.id) {
deleteDateOnServer(date.id);
} else {
handleRemoveDate(dateIndex);
}
},
style: { marginLeft: 10 }
}, "Xóa ngày") : null,

          React.createElement("div", { style: { marginLeft: 20 } },
            date.times.map(function (time, timeIndex) {
              return React.createElement("div", { key: timeIndex, style: { marginTop: 5 } },
                React.createElement("input", {
                  type: "time",
                  value: time.startTime,
                  onChange: function (e) {
                    handleTimeChange(dateIndex, timeIndex, "startTime", e.target.value);
                  },
                  required: true
                }),
                " đến ",
                React.createElement("input", {
                  type: "time",
                  value: time.toTime,
                  onChange: function (e) {
                    handleTimeChange(dateIndex, timeIndex, "toTime", e.target.value);
                  },
                  required: true
                }),
                React.createElement("button", {
                  type: "button",
                  onClick: function () {
                    if (time.id) {
                      deleteTimeOnServer(time.id, dateIndex, timeIndex);
                    } else {
                      handleRemoveTime(dateIndex, timeIndex);
                    }
                  }
                }, "X")
              );
            }),
            React.createElement("button", {
              type: "button",
              onClick: function () {
                handleAddTime(dateIndex);
              },
              style: { marginTop: 5 }
            }, "+ Thêm giờ")
          )
        );
      }),
      React.createElement("button", { type: "button", onClick: handleAddDate }, "+ Thêm ngày làm"),
      React.createElement("br"),
      React.createElement("br"),
      React.createElement("button", { type: "submit" }, "Lưu")
    )
);
}

export default DoctorScheduleForm;
