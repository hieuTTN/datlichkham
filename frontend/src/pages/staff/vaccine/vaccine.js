import React, {useEffect, useRef, useState} from "react";
import {Button, Card, Col, Input, InputNumber, Pagination, Popconfirm, Row, Select, Table, Tag,} from "antd";
import {VaccineApi} from "../../../services/staff/Vaccine.api";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faFilter, faListAlt, faTrash} from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";
import ModalHandle from "./modal/modalHandle";
import {AppNotification} from "../../../components/AppNotification";
import * as XLSX from "xlsx";
import {faAdd} from "@fortawesome/free-solid-svg-icons/faAdd";
import "./style.css"

const {Option} = Select;
const Vaccine = () => {
  const [modalHandle, setModalHandle] = useState({
    status: false,
    id: "",
  });
  const fileInputRef = useRef(null);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [vaccines, setVaccines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formSearch, setFormSearch] = useState({
    name: "",
    price: "",
    status: "",
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    handleGetVaccines(formSearch);
  }, [formSearch]);
  useEffect(() => {
    handleGetVaccines({...formSearch, page: currentPage, limit: pageSize});
  }, [currentPage, pageSize]);

  // view thông tin
  const handleGetVaccines = async (formSearch) => {
    setLoading(true);
    await VaccineApi.vaccines(formSearch)
        .then((res) => {
          setTotal(res.data.totalElements);
          setCurrentPage(res.data.pageable.pageNumber + 1);
          setPageSize(res.data.size);
          const dataVacines = res.data.content;
          setVaccines(
              updatedList(dataVacines, formSearch.page, formSearch.limit)
          );
          setTimeout(() => {
            setLoading(false);
          }, 500);
        })
        .catch((err) => {
          console.log(err);
        });
  };
  const updatedList = (data, currentPage, pageSize) => {
    return data.map((item, index) => ({
      ...item,
      stt: (currentPage - 1) * pageSize + index + 1,
    }));
  };

  // xóa
  const handleDelete = (id) => {
    VaccineApi.deleteVaccine({id: id})
        .then((res) => {
          setVaccines(vaccines.filter((item) => item.id !== id));
          AppNotification.success("Xóa thành công");
        })
        .catch((err) => {
          const errorMessage = err.response.data.defaultMessage || null;
          if (errorMessage) {
            AppNotification.error(errorMessage);
          }
        });
  };

  // chuyển page
  const onPageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };
  const handleFileChange = (e) => {
    const fileUpload = e.target.files[0];
    if (!fileUpload) {
      AppNotification.error("Vui lòng chọn file");
      return;
    }
    const formData = new FormData();
    formData.append("file", fileUpload);

    VaccineApi.importVaccine(formData)
        .then((response) => {
          AppNotification.success("Nhập dữ liệu thành công");
          handleGetVaccines(formSearch);
        })
        .catch((err) => {
          const message = err.response.data.defaultMessage;
          if (message) {
            AppNotification.error(message);
            return;
          }
          AppNotification.error("Nhập dữ liệu không thành công");
        });
  };
  const handleIconClick = () => {
    console.log(fileInputRef.current);
    fileInputRef.current.click();
  };

  const handleExport = () => {
    try {
      const formattedData = vaccines.map((item, index) => ({
        STT: index + 1,
        "Tên Vaccine": item?.name,
        "Số lượng Vaccine": item?.inventory,
        Giá: item?.price,
        "Loại Vaccine": item?.vaccineType?.typeName,
        "Độ tuổi": item?.ageGroup?.ageRange,
        "Nhà sản xuất": item?.manufacturer?.name,
        "Ngày tạo": item?.createdDate
            ? dayjs(item?.createdDate).format("HH:mm:ss DD-MM-YYYY")
            : null,
        "Trạng thái":
            item?.status === "ACTIVE" ? "Kinh doanh" : "Ngừng kinh doanh",
      }));
      const worksheet = XLSX.utils.json_to_sheet(formattedData, {
        header: [
          "STT",
          "Tên Vaccine",
          "Số lượng Vaccine",
          "Giá",
          "Loại Vaccine",
          "Độ tuổi",
          "Nhà sản xuất",
          "Ngày tạo",
          "Trạng thái",
        ],
      });
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
      XLSX.writeFile(workbook, "vaccine_data.xlsx");
      AppNotification.success("Xuất dữ liệu thành công");
    } catch (error) {
      AppNotification.success("Xuất dữ liệu không thành công");
    }
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
    },
    {
      title: "Tên Vaccine",
      dataIndex: "nameVaccine",
      key: "name1",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => a.price - b.price,
      render: (price) => price,
    },
    {
      title: "Số lượng",
      dataIndex: "inventory",
      key: "inventory",
      sorter: (a, b) => a.inventory - b.inventory,
      render: (inventory) => inventory,
    },
    {
      title: "Loại vaccine",
      dataIndex: "vaccineType",
      key: "vaccineType",
      align: "center",
      render: (_, record) => {
        return <div>{record?.vaccineType?.typeName}</div>;
      },
    },
    {
      title: "Nhà sản xuất",
      dataIndex: "manufacturer",
      key: "manufacturer",
      align: "center",
      render: (_, record) => {
        return <div>{record?.manufacturer?.name}</div>;
      },
    },
    {
      title: "Độ tuổi",
      dataIndex: "ageGroup",
      key: "ageGroup",
      align: "center",
      render: (_, record) => {
        return <div>{record?.ageGroup?.ageRange}</div>;
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdDate",
      key: "createdDate",
      align: "center",
      render: (date) => dayjs(date).format("HH:mm:ss DD-MM-YYYY"),
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (text) => {
        return (
            <Tag
                className={"tag-status"}
                color={
                  text === "ACTIVE" ? "green" : text === "INACTIVE" ? "gold" : "red"
                }
            >
              {text === "ACTIVE"
                  ? "Kinh doanh"
                  : text === "INACTIVE"
                      ? "Ngừng kinh doanh"
                      : "Đã xóa"}
            </Tag>
        );
      },
    },
    {
      title: "Hành động",
      dataIndex: "hanhDong",
      key: "hanhDong",
      align: "center",
      render: (text, record) => (
          <div style={{display: "flex", justifyContent: "center", gap: "10px"}}>
            <Button
                type="primary"
                title="Chỉnh sửa thể loại"
                style={{backgroundColor: "green", borderColor: "green"}}
                onClick={() =>
                    setModalHandle({
                      ...modalHandle,
                      status: true,
                      id: record.id,
                      type: "update",
                    })
                }
            >
              <FontAwesomeIcon icon={faEdit}/>
            </Button>
            <Popconfirm
                title="Thông báo"
                description="Bạn có chắc chắn muốn xóa không ?"
                onConfirm={() => {
                  handleDelete(record.id);
                }}
                okText="Có"
                cancelText="Không"
            >
              <Button
                  type="primary"
                  title="Chi tiết thể loại"
                  style={{backgroundColor: "red", borderColor: "red"}}
              >
                <FontAwesomeIcon icon={faTrash}/>
              </Button>
            </Popconfirm>
          </div>
      ),
    },
  ];
  const statusOptions = [
    {label: "Tất cả", value: ""},
    {label: "Kinh doanh", value: "ACTIVE"},
    {label: "Ngừng kinh doanh", value: "INACTIVE"},
  ];
  return (
      <React.Fragment>
        <h3>Quản lý Vaccine</h3>
        <Card>
          <div className="filter-container">
            <FontAwesomeIcon icon={faFilter} size="2x"/>
            <span style={{fontSize: "18px", fontWeight: "500"}}>Bộ lọc</span>
          </div>
          <Row justify={"space-between"}>
            <Col span={7}>
              <Input
                  style={{width: "100%", height:40}}
                  placeholder="Tìm theo tên"
                  onChange={(e) => {
                    setFormSearch({...formSearch, name: e.target.value});
                  }}
              />
            </Col>
            <Col span={7}>
              <InputNumber
                  style={{width: "100%", height:40}}
                  placeholder="Tìm theo giá"
                  onChange={(value) => {
                    setFormSearch({...formSearch, price: value});
                  }}
                  type="number"
              />
            </Col>
            <Col span={7}>
              <Select
                  showSearch
                  style={{
                    width: "100%",
                    height:40
                  }}
                  optionFilterProp="children"
                  onChange={(value) => {
                    setFormSearch({...formSearch, status: value});
                  }}
                  filterOption={(input, option) =>
                      option.children.toLowerCase().includes(input.toLowerCase())
                  }
                  value={formSearch?.status}
              >
                {statusOptions.map((status) => (
                    <Option key={status.value} value={status.value}>
                      {status.label}
                    </Option>
                ))}
              </Select>
            </Col>
          </Row>
          <div
              style={{
                marginTop: 20,
                marginBottom: 20,
                display: "flex",
                alignItems: "center",
              }}
          >

            {/* <div style={{ marginRight: 10 }}>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <Button
            title="Import"
            icon={<UploadOutlined />}
            onClick={handleIconClick}
          ></Button>
        </div>
        <Button
          title="Export"
          icon={<DownloadOutlined />}
          onClick={handleExport}
        ></Button> */}
          </div>
        </Card>

        <Card className={"table-container"}>
          <div className={"table-container-title"}>
            <FontAwesomeIcon
                icon={faListAlt}
                style={{fontSize: "26px", marginRight: "10px"}}
            />
            <span style={{fontSize: "18px", fontWeight: "500"}}>Danh sách vaccine</span>
          </div>
          <Button
              icon={(<FontAwesomeIcon icon={faAdd}/>)}
              style={{marginRight: 10, height: 40, marginTop: 20,marginBottom:20, backgroundColor:"#3366CC", color:"white", float:"right"}}
              onClick={() =>
                  setModalHandle({...modalHandle, status: true, type: "create"})
              }
          >
            Thêm mới
          </Button>

          <Table
              columns={columns}
              dataSource={vaccines || []}
              pagination={false}
              loading={loading}
          />
          <div
              style={{
                display: "flex",
                width: "100%",
                marginTop: 30,
                marginBottom: 30,
              }}
          >
            <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={total}
                showSizeChanger
                onChange={onPageChange}
                style={{marginLeft: "auto"}}
            />
          </div>
        </Card>


        <ModalHandle
            modalHandle={modalHandle}
            setModalHandle={setModalHandle}
            setVaccines={setVaccines}
        />
      </React.Fragment>
  );
};

export default Vaccine;
