import layoutAdmin from "../layout/admin/Layout";
import layoutLogin from "../layout/customer/loginlayout/login";
import layoutStaff from "../layout/staff/Layout";

//admin
import homeAdmin from '../pages/admin/index'
import userAdmin from '../pages/admin/user'
import AdminCategory from '../pages/admin/category'
import AdminBlog from '../pages/admin/blog'
import AdminAddBlog from '../pages/admin/addblog'
import AdminHistoryPay from '../pages/admin/historypay'
import AdminDeductionHistory from '../pages/admin/deductionhistory'
import AdminRealEstate from '../pages/admin/realestate'
import AdminReport from '../pages/admin/report'
import AdminThongbao from '../pages/admin/thongbao'
import ThongKeAdmin from '../pages/admin/thongke'


//public
import login from "../pages/public/login";
import regisPage from '../pages/public/regis'
import index from "../pages/public/index";
import TraCuuLichTiem from "../pages/public/tracuulichtiem";
import LichTiemDaQua from "../pages/public/lichtiemdaqua";
import TimKiemVacxin from "../pages/public/timkiemvaccine";
import confirmPage from '../pages/public/confirm'
import forgotPage from '../pages/public/forgot'
import datLaiMatKhauPage from '../pages/public/datlaimatkhau'

//customer
import dangkytiemchung from "../pages/customer/dangkytiemchung";
import taikhoan from "../pages/customer/taikhoan";
import thongbao from "../pages/customer/thongbao";
import XacNhanDangky from "../pages/customer/xacnhandangky";
import ThanhCong from "../pages/customer/thanhcong";

//staff
import StaffChat from "../pages/staff/chat";
import Vaccine from "../pages/staff/vaccine/vaccine";
import VaccineInventory from "../pages/staff/vaccineInventory/VaccineInventory";
import CustomerSchedule from "../pages/staff/customerSchedule/CustomerSchedule";

const publicRoutes = [
    {path: "/", component: index},
    { path: "/tim-kiem-vaccine", component: TimKiemVacxin },
    {path: "/index", component: index},
    {path: "/login", component: login, layout: layoutLogin},
    {path: "/regis", component: regisPage, layout: layoutLogin},
    { path: "/confirm", component: confirmPage, layout: layoutLogin },
    { path: "/forgot", component: forgotPage, layout: layoutLogin },
    { path: "/datlaimatkhau", component: datLaiMatKhauPage, layout: layoutLogin },
    {path: "/tra-cuu-lich-tiem", component: TraCuuLichTiem},
    {path: "/lich-tiem-da-qua", component: LichTiemDaQua},
];

const customerRoutes = [
    {path: "/dang-ky-tiem-chung", component: dangkytiemchung},
    {path: "/tai-khoan", component: taikhoan},
    {path: "/thong-bao", component: thongbao},
    {path: "/xac-nhan-dang-ky", component: XacNhanDangky},
    {path: "/thanh-cong", component: ThanhCong},
];


const adminRoutes = [
    { path: "/admin/index", component: homeAdmin, layout: layoutAdmin },
    { path: "/admin/user", component: userAdmin, layout: layoutAdmin },
    { path: "/admin/category", component: AdminCategory, layout: layoutAdmin },
    { path: "/admin/blog", component: AdminBlog, layout: layoutAdmin },
    { path: "/admin/add-blog", component: AdminAddBlog, layout: layoutAdmin },
    { path: "/admin/history-pay", component: AdminHistoryPay, layout: layoutAdmin },
    { path: "/admin/deduction-history", component: AdminDeductionHistory, layout: layoutAdmin },
    { path: "/admin/real-estate", component: AdminRealEstate, layout: layoutAdmin },
    { path: "/admin/report", component: AdminReport, layout: layoutAdmin },
    { path: "/admin/thong-bao", component: AdminThongbao, layout: layoutAdmin },
    { path: "/admin/thong-ke", component: ThongKeAdmin, layout: layoutAdmin },
];


const staffRoutes = [
    {path: "/staff/chat", component: StaffChat, layout: layoutStaff},
    {path: "/staff/vaccine", component: Vaccine, layout: layoutStaff},
    {path: "/staff/vaccine-inventory", component: VaccineInventory, layout: layoutStaff},
    {path: "/staff/customer-schedule", component: CustomerSchedule, layout: layoutStaff},
];



export {publicRoutes, adminRoutes, customerRoutes, staffRoutes};
