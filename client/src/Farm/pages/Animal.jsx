import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import Pagination from "../../admin/components/Pagination";
import { CirclePlus, Settings } from "lucide-react";
import axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/th";

dayjs.locale("th");

function Animal() {
  const [allData, setAllData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const farmId = localStorage.getItem("farmer_id");
  const [isOpenAdd, setIsOpenApp] = useState(false);
  const [isOpenUse, setIsOpenUse] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState(null);

  // ฟิลด์ฟอร์ม
  const [animalId, setAnimalId] = useState("");
  const [typeId, setTypeId] = useState("");
  const [quantityReceived, setQuantityReceived] = useState("");

  // ฟิลด์ฟอร์มการใช้สัตว์
  const [quantityUsed, setQuantityUsed] = useState("");
  const [usageType, setUsageType] = useState("");
  const [remark, setRemark] = useState("");

  const [animalsOptions, setAnimalsOptions] = useState([]);
  const [typesOptions, setTypesOptions] = useState([]);

  const getAnimalsFarm = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_URL_API + `animal/${farmId}`
      );
      setAllData(res.data.data);
      toast.success("ดึงข้อมูลสัตว์ในฟาร์มสำเร็จ");
    } catch (err) {
      toast.error("ไม่สามารถดึงข้อมูลสัตว์ในฟาร์มได้");
      console.log("Error Get Animals Farm");
    }
  };

  const getAnimalsOptions = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_URL_API + "animal");
      setAnimalsOptions(res.data);
    } catch (err) {
      console.log("Error fetching animals options");
    }
  };

  useEffect(() => {
    getAnimalsFarm();
    getAnimalsOptions();
  }, []);

  const pageData = allData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddAnimal = async (e) => {
    e.preventDefault();
    if (!animalId || !quantityReceived) {
      toast.error("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    try {
      const res = await axios.post(import.meta.env.VITE_URL_API + "animal", {
        farmer_id: farmId,
        animal_id: animalId,
        type_id: typeId || null,
        quantity_received: parseInt(quantityReceived),
      });
      toast.success(res.data.msg);
      setIsOpenApp(false);
      setAnimalId("");
      setTypeId("");
      setQuantityReceived("");
      getAnimalsFarm(); // รีเฟรชข้อมูล
    } catch (err) {
      toast.error("เกิดข้อผิดพลาดในการเพิ่มสัตว์");
      console.error(err);
    }
  };

  const handleUseAnimal = async (e) => {
    e.preventDefault();
    if (!quantityUsed || !usageType) {
      toast.error("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    if (parseInt(quantityUsed) > selectedAnimal.quantity) {
      toast.error("จำนวนใช้มากกว่าที่คงเหลือ");
      return;
    }

    try {
      const res = await axios.post(
        import.meta.env.VITE_URL_API + "animal/use",
        {
          farm_animal_id: selectedAnimal.farm_animal_id,
          quantity_used: parseInt(quantityUsed),
          usage_type: usageType,
          remark: remark || null,
        }
      );
      toast.success(res.data.msg);
      setIsOpenUse(false);
      setQuantityUsed("");
      setUsageType("");
      setRemark("");
      setSelectedAnimal(null);
      getAnimalsFarm(); // รีเฟรชข้อมูล
    } catch (err) {
      toast.error(
        err.response?.data?.msg || "เกิดข้อผิดพลาดในการบันทึกการใช้สัตว์"
      );
      console.error(err);
    }
  };

  const openUseModal = (animal) => {
    setSelectedAnimal(animal);
    setIsOpenUse(true);
  };

  return (
    <div>
      <ToastContainer />
      <div className="bg-white rounded-lg shadow-sm p-4 mb-3">
        <div className="breadcrumbs text-sm">
          <ul>
            <li>
              <a href="/profile" className="text-blue-600 hover:text-blue-800">
                หน้าแรก
              </a>
            </li>
            <li>
              <a className="text-black">บันทึกข้อมูลสัตว์</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="card bg-base-100 w-full shadow-md mt-3 rounded-xl">
        <div className="card-body">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="w-full lg:w-auto">
              <h3 className="text-xl font-bold">ข้อมูลสัตว์ในฟาร์ม</h3>
            </div>

            <button
              className="btn bg-green-600 hover:bg-green-700 text-white w-full lg:w-[180px]"
              onClick={() => {
                setIsOpenApp(true);
              }}>
              <CirclePlus className="mr-2" /> เพิ่มข้อมูลสัตว์
            </button>
          </div>
        </div>
      </div>

      <div className="mt-3 w-full">
        <table className="table bg-base-100 w-full">
          <thead>
            <tr>
              <th>ล๊อตที่</th>
              <th>ชื่อสัตว์</th>
              <th>วันที่รับเข้า</th>
              <th>ประเภท</th>
              <th>จำนวนที่รับเข้า</th>
              <th>จำนวนคงเหลือ</th>
              <th>วันที่อัปเดต</th>
              <th>การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {pageData.length > 0 ? (
              pageData.map((item) => (
                <tr key={item.farm_animal_id}>
                  <td>{item.lot_code}</td>
                  <td>{item.animal_name}</td>
                  <td>{item.type_name}</td>
                  <td>{item.quantity_received}</td>
                  <td>{item.quantity}</td>
                  <td>{dayjs(item.created_at).format("DD MMMM YYYY")}</td>
                  <td>{dayjs(item.updated_at).format("DD MMMM YYYY")}</td>
                  <td>
                    <button
                      className="btn btn-sm bg-green-500 hover:bg-green-600 text-white"
                      onClick={() => openUseModal(item)}
                      disabled={item.quantity <= 0}>
                      <Settings className="w-4 h-4 mr-1" />
                      จัดการ
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center py-4">
                  ไม่พบข้อมูล
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(allData.length / itemsPerPage)}
          onPageChange={setCurrentPage}
        />

        {/* Modal เพิ่มสัตว์ */}
        {isOpenAdd && (
          <dialog open className="modal">
            <div className="modal-box">
              <h2 className="font-bold text-lg mb-4">เพิ่มข้อมูลสัตว์</h2>
              <form onSubmit={handleAddAnimal} className="flex flex-col gap-3">
                <div>
                  <label className="font-medium">สัตว์</label>
                  <select
                    className="select select-bordered w-full"
                    value={animalId}
                    onChange={async (e) => {
                      const selectedAnimalId = e.target.value;
                      setAnimalId(selectedAnimalId);

                      if (selectedAnimalId) {
                        try {
                          const res = await axios.get(
                            import.meta.env.VITE_URL_API +
                              `animal_type/${selectedAnimalId}`
                          );
                          setTypesOptions(res.data);
                        } catch (err) {
                          console.log("Error fetching types options");
                          setTypesOptions([]);
                        }
                      } else {
                        setTypesOptions([]);
                      }
                    }}
                    required>
                    <option value="">เลือกสัตว์</option>
                    {animalsOptions.map((animal) => (
                      <option key={animal.animal_id} value={animal.animal_id}>
                        {animal.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-medium">ประเภท</label>
                  <select
                    className="select select-bordered w-full"
                    value={typeId}
                    onChange={(e) => setTypeId(e.target.value)}
                    disabled={!animalId}
                    required>
                    <option value="">เลือกประเภท</option>
                    {typesOptions.map((type) => (
                      <option key={type.type_id} value={type.type_id}>
                        {type.type_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-medium">จำนวนที่รับเข้า</label>
                  <input
                    type="number"
                    className="input input-bordered w-full"
                    value={quantityReceived}
                    onChange={(e) => setQuantityReceived(e.target.value)}
                    required
                    min={1}
                    max={99999999999}
                  />
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => setIsOpenApp(false)}>
                    ยกเลิก
                  </button>
                  <button type="submit" className="btn bg-green-500 text-white">
                    เพิ่มข้อมูล
                  </button>
                </div>
              </form>
            </div>
          </dialog>
        )}

        {/* Modal ใช้สัตว์ */}
        {isOpenUse && selectedAnimal && (
          <dialog open className="modal">
            <div className="modal-box">
              <h2 className="font-bold text-lg mb-4">บันทึกการใช้สัตว์</h2>
              <div className="mb-4 p-3 bg-gray-100 rounded">
                <p>
                  <strong>ล๊อตที่:</strong> {selectedAnimal.lot_code}
                </p>
                <p>
                  <strong>สัตว์:</strong> {selectedAnimal.animal_name}
                </p>
                <p>
                  <strong>ประเภท:</strong> {selectedAnimal.type_name || "-"}
                </p>
                <p>
                  <strong>จำนวนคงเหลือ:</strong> {selectedAnimal.quantity}
                </p>
              </div>
              <form onSubmit={handleUseAnimal} className="flex flex-col gap-3">
                <div>
                  <label className="font-medium">จำนวนที่ใช้</label>
                  <input
                    type="number"
                    className="input input-bordered w-full"
                    value={quantityUsed}
                    onChange={(e) => setQuantityUsed(e.target.value)}
                    required
                    min={1}
                    max={selectedAnimal.quantity}
                  />
                </div>

                <div>
                  <label className="font-medium">ประเภทการใช้งาน</label>
                  <select
                    className="select select-bordered w-full"
                    value={usageType}
                    onChange={(e) => setUsageType(e.target.value)}
                    required>
                    <option value="">เลือกประเภทการใช้งาน</option>
                    <option value="ขาย">ขาย</option>
                    <option value="เชือด">เชือด</option>
                    <option value="ตาย">ตาย</option>
                    <option value="อื่นๆ">อื่นๆ</option>
                  </select>
                </div>

                <div>
                  <label className="font-medium">หมายเหตุ (ไม่บังคับ)</label>
                  <textarea
                    className="textarea textarea-bordered w-full"
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    placeholder="ระบุรายละเอียดเพิ่มเติม..."
                    rows={3}
                  />
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => {
                      setIsOpenUse(false);
                      setSelectedAnimal(null);
                      setQuantityUsed("");
                      setUsageType("");
                      setRemark("");
                    }}>
                    ยกเลิก
                  </button>
                  <button type="submit" className="btn bg-blue-500 text-white">
                    บันทึก
                  </button>
                </div>
              </form>
            </div>
          </dialog>
        )}
      </div>
    </div>
  );
}

export default Animal;
