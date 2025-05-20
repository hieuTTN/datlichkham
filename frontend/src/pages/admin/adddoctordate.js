import React, { useEffect, useState } from "react";
import axios from "axios";
import {toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { getMethod ,postMethodPayload} from '../../services/request';

const TIME_SLOTS = [
  "08:00 - 09:00",
  "09:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "12:00 - 13:00",
  "13:00 - 14:00",
  "14:00 - 15:00",
  "15:00 - 16:00",
  "16:00 - 17:00",
  "17:00 - 18:00",
  "18:00 - 19:00",
];

const DoctorScheduleForm = () => {
  const [dates, setDates] = useState([]);
    const [doctor, setDoctor] = useState(null);

  const emptyDate = () => ({
    dayOfWeek: "",
    times: [], // Array of selected time slot strings
    id: null,
  });

  useEffect(() => {
    var uls = new URL(document.URL)
    var doctorId = uls.searchParams.get("doctor");
    const getData = async () => {
        const response = await getMethod('/api/doctor-date/admin/doctor-schedule?doctorId=' + doctorId);
        const result = await response.json();

        const convertedDates = result.dates.map((date) => ({
        ...date,
        times: date.times.map((time) => `${time.startTime} - ${time.toTime}`)
        }));

        setDates(convertedDates);
        setDoctor(result.doctor)
    };
    getData();
  },[]);

  const handleDateChange = (index, value) => {
    const updated = [...dates];
    updated[index].dayOfWeek = value;
    setDates(updated);
  };

  const toggleTimeSlot = (dateIndex, slot) => {
    const updated = [...dates];
    const times = updated[dateIndex].times;
    if (times.includes(slot)) {
      updated[dateIndex].times = times.filter((t) => t !== slot);
    } else {
      updated[dateIndex].times = [...times, slot];
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = dates.map((date) => ({
      dayOfWeek: date.dayOfWeek,
      times: date.times.map((slot) => {
        const [startTime, toTime] = slot.split(" - ");
        return { startTime, toTime };
      }),
      id: date.id,
    }));
    var uls = new URL(document.URL)
    var doctorId = uls.searchParams.get("doctor");  
    var datetime = {
        doctorId: doctorId,
        dates: payload
    }
    const response = await postMethodPayload('/api/doctor-date/admin/save', datetime)
    if (response.status < 300) {
        Swal.fire({
            title: "Thông báo",
            text: "Thêm/cập nhật thành công!",
            preConfirm: () => {
                window.location.href = 'doctordate?doctor='+doctorId
            }
        });
    } else {
        toast.error("Thêm/ sửa thất bại");
    }
  };

  return (
    <>
     <div class="col-sm-12 header-sps">
        <div class="title-add-admin">
            <h4>Lịch làm việc của bác sỹ {doctor?.fullName} - Chuyên khoa: {doctor?.specialty.name}</h4>
        </div>
    </div>
    <form onSubmit={handleSubmit}>
      {dates.map((date, dateIndex) => (
        <div key={dateIndex} style={{ border: "1px solid #ccc", marginBottom: "1rem", padding: "1rem" }}>
          <label>
            Day of Week:
            <input
              type="text"
              className="inpngay"
              value={date.dayOfWeek}
              onChange={(e) => handleDateChange(dateIndex, e.target.value)}
              placeholder="e.g. 2"
            />
          </label>
          <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => removeDate(dateIndex)} style={{ marginLeft: "10px" }}>
            Remove Day
          </button>

          <div style={{ marginTop: "1rem", display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {TIME_SLOTS.map((slot) => (
              <button
                type="button"
                key={slot}
                onClick={() => toggleTimeSlot(dateIndex, slot)}
                style={{
                  padding: "0.5rem 1rem",
                  border: "1px solid",
                  borderColor: date.times.includes(slot) ? "#28a745" : "#ccc",
                  backgroundColor: date.times.includes(slot) ? "#d4edda" : "#f8f9fa",
                  cursor: "pointer",
                }}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      ))}
      <button type="button" onClick={addDate} className="btn btn-outline-danger">
        Thêm ngày làm việc
      </button>
      <button type="submit" style={{ marginLeft: "10px" }} className="btn btn-outline-primary">
        Lưu lịch làm việc
      </button>
    </form>
    </>
  );
};

export default DoctorScheduleForm;
