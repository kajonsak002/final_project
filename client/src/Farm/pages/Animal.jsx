import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import Pagination from "../../admin/components/Pagination";
import { CirclePlus, Save, Settings, X } from "lucide-react";
import axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/th";
import { toast } from "../../utils/toast";

dayjs.locale("th");

function Animal() {
  const [allData, setAllData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const farmId = localStorage.getItem("farmer_id");

  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [isOpenUse, setIsOpenUse] = useState(false);

  const [animalId, setAnimalId] = useState("");
  const [typeId, setTypeId] = useState("");
  const [quantityReceived, setQuantityReceived] = useState("");

  const [animalsOptions, setAnimalsOptions] = useState([]);
  const [typesOptions, setTypesOptions] = useState([]);

  const [selectedAnimals, setSelectedAnimals] = useState([]);

  // 👉 state สำหรับ modal pagination
  const [modalPage, setModalPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const getAnimalsFarm = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_URL_API + `animal/${farmId}`
      );
      setAllData(res.data.data);
    } catch (err) {
      toast.error("ไม่สามารถดึงข้อมูลสัตว์ในฟาร์มได้");
      console.error(err);
    }
  };

  const getAnimalsOptions = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_URL_API + "animal");
      setAnimalsOptions(res.data);
    } catch (err) {
      console.error(err);
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
      setIsOpenAdd(false);
      setAnimalId("");
      setTypeId("");
      setQuantityReceived("");
      getAnimalsFarm();
    } catch (err) {
      toast.error("เกิดข้อผิดพลาดในการเพิ่มสัตว์");
      console.error(err);
    }
  };

  const handleUseAnimal = async (e) => {
    e.preventDefault();
    if (selectedAnimals.length === 0) {
      toast.error("กรุณาเลือกสัตว์ก่อนจัดการ");
      return;
    }

    const invalid = selectedAnimals.some(
      (a) =>
        !a.quantityUsed || !a.usageType || parseInt(a.quantityUsed) > a.quantity
    );
    if (invalid) {
      toast.error("กรุณากรอกจำนวนและประเภทการใช้งานให้ถูกต้อง");
      return;
    }

    try {
      const details = selectedAnimals.map((a) => ({
        lot_id: a.farm_animal_id,
        quantity_used: parseInt(a.quantityUsed),
        action: a.usageType,
        remark: a.remark || null,
      }));
      const usage_date = new Date().toISOString().split("T")[0];

      const res = await axios.post(
        import.meta.env.VITE_URL_API + "animal/use",
        { usage_date, description: "บันทึกการใช้สัตว์", details }
      );

      toast.success(res.data.msg);
      setSelectedAnimals([]);
      setIsOpenUse(false);
      getAnimalsFarm();
    } catch (err) {
      toast.error(
        err.response?.data?.msg || "เกิดข้อผิดพลาดในการบันทึกการใช้สัตว์"
      );
      console.error(err);
    }
  };

  const updateSelectedAnimal = (index, field, value) => {
    const updated = [...selectedAnimals];
    updated[index][field] = value;
    setSelectedAnimals(updated);
  };

  return (
    <div className="p-4">
      <ToastContainer />
      {/* Breadcrumb */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-3">
        <div className="breadcrumbs text-sm">
          <ul className="flex gap-2">
            <li>
              <a href="/profile" className="text-blue-600 hover:text-blue-800">
                หน้าแรก
              </a>
            </li>
            <li className="text-black">บันทึกข้อมูลสัตว์</li>
          </ul>
        </div>
      </div>

      {/* Card ข้อมูลสัตว์ */}
      <div className="card bg-base-100 shadow-md rounded-xl mb-3 p-4 flex flex-col lg:flex-row justify-between items-center">
        <h3 className="text-xl font-bold mb-2 lg:mb-0">ข้อมูลสัตว์ในฟาร์ม</h3>
        <div className="flex gap-2 w-full lg:w-auto">
          <button
            className="btn bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
            onClick={() => setIsOpenAdd(true)}>
            <CirclePlus /> เพิ่มข้อมูลสัตว์
          </button>
          <button
            className="btn bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
            onClick={() => {
              if (selectedAnimals.length === 0) {
                toast.error("กรุณาเลือกสัตว์ก่อนจัดการ");
                return;
              }
              setIsOpenUse(true);
              setModalPage(1); // reset หน้าเวลาเปิด modal ใหม่
            }}>
            {" "}
            <Save /> บันทึกการจำหน่าย
          </button>
        </div>
      </div>

      {/* ตารางสัตว์ */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md p-2">
        <table className="table w-full text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={
                    allData.length > 0 &&
                    selectedAnimals.length === allData.length
                  }
                  onChange={(e) => {
                    if (e.target.checked) setSelectedAnimals([...allData]);
                    else setSelectedAnimals([]);
                  }}
                />
              </th>
              <th>ล๊อต</th>
              <th>ชื่อสัตว์</th>
              <th>ประเภท</th>
              <th>จำนวนรับเข้า</th>
              <th>จำนวนคงเหลือ</th>
              <th>วันที่รับเข้า</th>
              <th>วันที่อัปเดต</th>
            </tr>
          </thead>
          <tbody>
            {pageData.length > 0 ? (
              pageData.map((item) => {
                const isChecked = selectedAnimals.some(
                  (a) => a.farm_animal_id === item.farm_animal_id
                );
                return (
                  <tr key={item.farm_animal_id} className="hover:bg-gray-50">
                    <td>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedAnimals((prev) => [...prev, item]);
                          } else {
                            setSelectedAnimals((prev) =>
                              prev.filter(
                                (a) => a.farm_animal_id !== item.farm_animal_id
                              )
                            );
                          }
                        }}
                      />
                    </td>
                    <td>{item.lot_code}</td>
                    <td>{item.animal_name}</td>
                    <td>{item.type_name || "-"}</td>
                    <td>{item.quantity_received}</td>
                    <td
                      className={
                        item.quantity === 0 ? "text-red-500 font-bold" : ""
                      }>
                      {item.quantity}
                    </td>
                    <td>{dayjs(item.created_at).format("DD MMM YYYY")}</td>
                    <td>{dayjs(item.updated_at).format("DD MMM YYYY")}</td>
                  </tr>
                );
              })
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
      </div>

      {/* Modal เพิ่มสัตว์ */}
      {isOpenAdd && (
        <dialog open className="modal">
          <div className="modal-box max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg">เพิ่มข้อมูลสัตว์</h2>
              <button onClick={() => setIsOpenAdd(false)}>
                <X />
              </button>
            </div>
            <form onSubmit={handleAddAnimal} className="grid gap-4">
              <div>
                <label>สัตว์</label>
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
                      } catch {
                        setTypesOptions([]);
                      }
                    } else setTypesOptions([]);
                  }}
                  required>
                  <option value="">เลือกสัตว์</option>
                  {animalsOptions.map((a) => (
                    <option key={a.animal_id} value={a.animal_id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label>ประเภท</label>
                <select
                  className="select select-bordered w-full"
                  value={typeId}
                  onChange={(e) => setTypeId(e.target.value)}
                  disabled={!animalId}>
                  <option value="">เลือกประเภท</option>
                  {typesOptions.map((t) => (
                    <option key={t.type_id} value={t.type_id}>
                      {t.type_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label>จำนวนที่รับเข้า</label>
                <input
                  type="number"
                  className="input input-bordered w-full"
                  value={quantityReceived}
                  onChange={(e) => setQuantityReceived(e.target.value)}
                  min={1}
                  required
                />
              </div>

              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setIsOpenAdd(false)}>
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

      {/* Modal ใช้สัตว์หลายล๊อต */}
      {isOpenUse && selectedAnimals.length > 0 && (
        <dialog open className="modal">
          <div className="modal-box max-w-3xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg">บันทึกการจำหน่าย/ใช้สัตว์</h2>
              <button onClick={() => setIsOpenUse(false)}>
                <X />
              </button>
            </div>

            {/* Pagination Modal */}
            {(() => {
              const totalPages = Math.ceil(
                selectedAnimals.length / ITEMS_PER_PAGE
              );
              const startIndex = (modalPage - 1) * ITEMS_PER_PAGE;
              const pagedAnimals = selectedAnimals.slice(
                startIndex,
                startIndex + ITEMS_PER_PAGE
              );

              return (
                <form
                  onSubmit={handleUseAnimal}
                  className="flex flex-col gap-4">
                  {pagedAnimals.map((a, idx) => (
                    <div
                      key={a.farm_animal_id}
                      className="border p-3 rounded bg-gray-50 grid gap-2">
                      <p>
                        <strong>ล๊อต:</strong> {a.lot_code} |{" "}
                        <strong>สัตว์:</strong> {a.animal_name} |{" "}
                        <strong>ประเภท:</strong> {a.type_name || "-"} |{" "}
                        <strong>จำนวนคงเหลือ:</strong> {a.quantity}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <select
                          className="select select-bordered w-full"
                          value={a.usageType || ""}
                          onChange={(e) =>
                            updateSelectedAnimal(
                              startIndex + idx,
                              "usageType",
                              e.target.value
                            )
                          }
                          required>
                          <option value="">เลือกประเภทการใช้งาน</option>
                          <option value="ขาย">ขาย</option>
                          <option value="เชือด">เชือด</option>
                          <option value="ตาย">ตาย</option>
                          <option value="อื่นๆ">อื่นๆ</option>
                        </select>
                        <input
                          type="number"
                          placeholder="จำนวนที่ใช้"
                          className="input input-bordered w-full"
                          min={1}
                          max={a.quantity}
                          value={a.quantityUsed || ""}
                          onChange={(e) =>
                            updateSelectedAnimal(
                              startIndex + idx,
                              "quantityUsed",
                              e.target.value
                            )
                          }
                          required
                        />
                        <input
                          type="text"
                          placeholder="หมายเหตุ"
                          className="input input-bordered w-full"
                          value={a.remark || ""}
                          onChange={(e) =>
                            updateSelectedAnimal(
                              startIndex + idx,
                              "remark",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                  ))}

                  {/* footer */}
                  <div className="flex flex-col md:flex-row justify-between items-center gap-3 mt-4">
                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="join">
                        <button
                          type="button"
                          className="join-item btn"
                          disabled={modalPage === 1}
                          onClick={() => setModalPage((p) => p - 1)}>
                          «
                        </button>
                        <button className="join-item btn">
                          {modalPage} / {totalPages}
                        </button>
                        <button
                          type="button"
                          className="join-item btn"
                          disabled={modalPage === totalPages}
                          onClick={() => setModalPage((p) => p + 1)}>
                          »
                        </button>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="btn btn-outline"
                        onClick={() => setIsOpenUse(false)}>
                        ยกเลิก
                      </button>
                      <button
                        type="submit"
                        className="btn bg-blue-500 text-white">
                        บันทึก
                      </button>
                    </div>
                  </div>
                </form>
              );
            })()}
          </div>
        </dialog>
      )}
    </div>
  );
}

export default Animal;
