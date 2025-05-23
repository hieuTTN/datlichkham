import { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { getMethod, postMethod, postMethodPayload } from '../../services/request';
import logomini from '../../assest/images/logomini.svg';
import { formatTime} from '../../services/date';
import { formatMoney} from '../../services/money';
import Swal from 'sweetalert2';

function DatLichKham() {
  const [center, setCenter] = useState([]);
  const [trungTam, setTrungTam] = useState(null);
  const [indexSchedule, setIndexSchedule] = useState(null);
  const [indexDoctor, setindexDoctor] = useState(null);
  const [indexTime, setindexTime] = useState(null);
  const [chuyenKhoas, setChuyenKhoas] = useState([]);
  const [chuyenKhoa, setChuyenKhoa] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [doctor, setDoctor] = useState(null);
  const [date, setDate] = useState(null);
  const [times, setTimes] = useState([]);
  const [time, setTime] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    getCoSoKham();
    getChuyenKhoa();
    initDoctor();
    getUserInfor();
  }, []);

  const getUserInfor = async() =>{
      var response = await postMethod('/api/user/user/user-logged');
      if(response.status > 300){
        Swal.fire({
            title: "Thông báo",
            text: "Hãy đăng nhập lại!",
            preConfirm: () => {
                window.location.href = 'login'
            }
        });
      }
      else{
        var result = await response.json();
        setUser(result)
      }
  };

  const getCoSoKham = async() =>{
      var response = await getMethod('/api/center/public/find-all-list');
      var result = await response.json();
      setCenter(result)
  };

  const getChuyenKhoa = async() =>{
      var response = await getMethod('/api/specialty/public/find-all-list');
      var result = await response.json();
      setChuyenKhoas(result)
  };

  async function changeCenter(item, index) {
    setIndexSchedule(index)
    setTrungTam(item)
    getDoctor(item, chuyenKhoa);
  }

  async function changeChuyenKhoa(item) {
    setChuyenKhoa(item)
    getDoctor(trungTam, item);
  }

  async function getDoctor(center, specialty) {
    if(trungTam != null && chuyenKhoa != null){
        var response = await getMethod(`/api/doctor/public/search-all?specialtyId=${specialty.id}&centerId=${center.id}`);
        var result = await response.json();
        setDoctors(result)
    }
    else{
      setDoctors([])
    }
    setindexDoctor(null)
    setDoctor(null)
    clearDate();
  }

  async function initDoctor() {
    var response = await getMethod(`/api/doctor/public/search-all-list`);
    var result = await response.json();
    setDoctors(result)
  }

  async function changeDoctor(item, index) {
    setindexDoctor(index)
    setDoctor(item);
    clearDate();
  }

  async function changeDate() {
    setDate(document.getElementById("chonngay").value)
    var response = await getMethod(`/api/doctor-time/public/find-by-doctor?doctorId=${doctor.id}&bookDate=${document.getElementById("chonngay").value}`);
    var result = await response.json();
    setTimes(result)
    setTime(null)
    setindexTime(null)
  }

  function clearDate(){
    setDate(null);
    setTime(null)
    setTimes([])
    setindexTime(null);
    try {
      document.getElementById("chonngay").value = ''
    } catch (error) {
    }
  }

  async function changeTime(item, index) {
    setTime(item)
    setindexTime(index)
  }

  async function checkout(event) {
    event.preventDefault();
    var obj = {
      "fullName":event.target.elements.fullname.value,
      "email":event.target.elements.email.value,
      "phone":event.target.elements.phone.value,
      "gender":event.target.elements.gioitinh.value,
      "dob":event.target.elements.dob.value,
      "address":event.target.elements.address.value,
      "diseaseDescription":event.target.elements.motabenh.value,
      "timeId":time.id,
      "doctorId":doctor.id,
    }
    window.localStorage.setItem("benhnhan", JSON.stringify(obj));
    var dto = {
      "returnUrl":"http://localhost:3000/checkpayment",
      "doctorId":doctor.id
    }
    var response = await postMethodPayload('/api/vnpay/urlpayment',dto);
    if(response.status < 300){
      var result = await response.json();
      window.location.href = result.url
    }
    else{
      toast.error("Tạo link thanh toán thất bại")
    }
  }

  return (
      <div className='container-fluid'>
        <div className='container-web'>
          <div className='col-sm-9'>
            <p className='link-head-section'>
              <a href="https://vnvc.vn/">Trang chủ</a>
              <span class="separator"> » </span>
              <span class="last">Đăng ký thông tin lịch khám</span>
            </p>
            <div className='section-content-web'>
              <div className='flex-section'>
                <div className='divsc-dkytiem'><img src={logomini} className='img-section-dky-tiem'/></div>
                <h2 className='title-dki-tiem-chung'>ĐĂNG KÝ LỊCH KHÁM</h2>
              </div>
            </div>
            <p className='ghi-chu-tiem-chung'>Đăng ký thông tin tiêm chủng để tiết kiệm thời gian khi đến làm thủ tục tại quầy Lễ tân cho Quý Khách hàng, việc đăng ký thông tin tiêm chủng chưa hỗ trợ đặt lịch hẹn chính xác theo giờ.</p>

            <div className='form-dky-tiem'>
              <div className='row'>
                  <div className='col-sm-12'>
                    <span className='title-form-dki-tiem dichvu-dky-tiem'>CHỌN CƠ SỞ KHÁM GẦN NHẤT</span>
                    <div className='row listdiadiemtiem'>
                      {center.map((item, index)=>{
                          return <div className='col-sm-3'>
                            <div key={item.id} onClick={() => changeCenter(item, index)}
                                className={`singletgtiem h-100 ${indexSchedule === index ? 'activetiem' : ''}`} >
                              <i className='fa fa-home'></i> {item.centerName}<br/>
                              <i className='fa fa-road'></i> Địa chỉ: {item.street}, {item.ward}, {item.district}, {item.city}<br/>
                            </div>
                          </div>
                      })}
                    </div>
                  </div>
                  <div className='col-sm-6'>
                    <label className='lb-form-dky-tiem'><span>*</span> Chọn chuyên khoa khám</label>
                    <Select
                        value={chuyenKhoa}
                        onChange={changeChuyenKhoa}
                        options={chuyenKhoas}
                        getOptionLabel={(option) => option.name} 
                        getOptionValue={(option) => option.id}    
                        placeholder="Chọn Chuyên Khoa Khám"
                    />
                  </div>
                  {doctors.length > 0 && 
                  <div className='col-sm-12'>
                    <label className='lb-form-dky-tiem'><span>*</span> Chọn Bác Sỹ Khám</label>
                    <div className='row'>
                      {doctors.map((item, index)=>{
                      return <div className="col-md-4 mb-4">
                                  <div onClick={()=>changeDoctor(item, index)} className={`${indexDoctor === index ? 'activedoctordl' : ''} card text-center h-100 shadow singlebslist pointer`}>
                                      <img src={item.user.avatar} className="imgdoctorlistdl"/>
                                      <div className="card-bodys">
                                          <p className="text-muted mb-1">Trình độ: {item.degree}, Chuyên khoa: {item.specialty.name}</p>
                                          <h5>{item.fullName}</h5>
                                          <hr style={{ borderTop: "2px solid orange", width: "80%", margin: "auto" }} />
                                          <span className='pricebsdl'>Phí khám: {formatMoney(item.consultationFee)}</span>
                                          <span className='positionbsdl'>{item.position}</span>
                                      </div>
                                  </div>
                              </div>
                      })}
                    </div>
                  </div>
                  }
                    <div className='col-sm-6'>
                      {doctor != null &&<>
                      <label className='lb-form-dky-tiem'><span>*</span> Chọn ngày khám</label>
                      <input onChange={()=>changeDate()} id='chonngay' type='date' className='form-control' />
                      </>}

                      {times.length > 0 &&
                      <><label className='lb-form-dky-tiem'><span>*</span> Chọn thời gian</label>
                      <div style={{ marginTop: "1rem", display: "flex", flexWrap: "wrap", gap: "10px" }}>
                      {times.map((item, index)=>{
                        return <button onClick={()=>changeTime(item, index)} type="button" className={`${indexTime === index ? 'timetableactive' : ''} timetable`}>{formatTime(item.startTime)} - {formatTime(item.toTime)}</button>
                      })}
                      </div></>}
                    </div>
                  {
                    time != null &&
                    <form onSubmit={checkout} className='col-sm-6'>
                      <span className='title-form-dki-tiem dichvu-dky-tiem'>THÔNG TIN VÀ THANH TOÁN</span>
                      <div className='row'>
                        <div className='col-sm-6'>
                           <label className='lb-form'>Họ tên của bạn</label>
                            <input defaultValue={user?.fullname} name='fullname' className='form-control' required />
                        </div>
                        <div className='col-sm-6'>
                          <label className='lb-form'>Email</label>
                          <input defaultValue={user?.username} name='email' className='form-control' required />
                        </div>
                        <div className='col-sm-5'>
                          <label className='lb-form'>Số điện thoại</label>
                          <input defaultValue={user?.phone} name='phone' className='form-control' required />
                        </div>
                        <div className='col-sm-3'>
                          <label className='lb-form'>Giới tính</label>
                          <select name='gioitinh' className='form-control'>
                            <option value='Nam'>Nam</option>
                            <option value='Nữ'>Nữ</option>
                          </select>
                        </div>
                        <div className='col-sm-4'>
                          <label className='lb-form'>Ngày sinh</label>
                          <input name='dob' type='date' className='form-control' required/>
                        </div>
                        <div className='col-sm-12'>
                          <label className='lb-form'>Địa chỉ</label>
                          <input name='address' className='form-control' required/>
                        </div>
                        <div className='col-sm-12'>
                          <label className='lb-form'>Nhập mô tả bệnh</label>
                          <textarea name='motabenh' className='form-control' required></textarea>
                        </div>
                      </div>
                      <span className='luuydatlich'>Lưu ý: Khi nhấp vào xác nhận đặt lịch khám, bạn sẽ phải thanh toán phí khám là {formatMoney(doctor?.consultationFee)} để hoàn tất đặt lịch</span>
                      <br/>
                      <button className='btn btn-primary form-control'>Xác nhận thanh toán / đặt lịch khám</button>
                    </form>
                  }
                </div>
              </div>
            </div>

          </div>
      </div>
  );

}

export default DatLichKham;
