import React, { useState, useEffect } from "react";
import { toast } from "../../utils/toast";
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

  // Multi-select
  const [selectedAnimals, setSelectedAnimals] = useState([]);
  const [usageData, setUsageData] = useState([]); // [{ farm_animal_id, quantity_used }]
  const [globalUsageType, setGlobalUsageType] = useState("");
  const [globalRemark, setGlobalRemark] = useState("");

  // ฟิลด์ฟอร์ม เพิ่มสัตว์
  const [animalId, setAnimalId] = useState("");
  const [typeId, setTypeId] = useState("");
  const [quantityReceived, setQuantityReceived] = useState("");

  const [animalsOptions, setAnimalsOptions] = useState([]);
  const [typesOptions, setTypesOptions] = useState([]);

  const getAnimalsFarm = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_URL_API + `animal/${farmId}`
      );
      setAllData(res.data.data);
    } catch (err) {
      toast.error("ไม่สามารถดึงข้อมูลสัตว์ในฟาร์มได้");
      console.log("Error Get Animals Farm", err);
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
      getAnimalsFarm();
    } catch (err) {
      toast.error("เกิดข้อผิดพลาดในการเพิ่มสัตว์");
      console.error(err);
    }
  };

  // เลือก/ยกเลิกเลือกสัตว์
  const handleSelectAnimal = (animal, checked) => {
    if (checked) {
      setSelectedAnimals([...selectedAnimals, animal]);
      setUsageData([
        ...usageData,
        {
          farm_animal_id: animal.farm_animal_id,
          quantity_used: "",
        },
      ]);
    } else {
      setSelectedAnimals(
        selectedAnimals.filter(
          (a) => a.farm_animal_id !== animal.farm_animal_id
        )
      );
      setUsageData(
        usageData.filter((u) => u.farm_animal_id !== animal.farm_animal_id)
      );
    }
  };

  const handleUsageChange = (index, field, value) => {
    const updated = [...usageData];
    updated[index][field] = value;
    setUsageData(updated);
  };

  const handleUseAnimals = async (e) => {
    e.preventDefault();

    // ตรวจสอบข้อมูลครบ
    if (!globalUsageType) {
      toast.error("กรุณาเลือกประเภทการใช้งาน");
      return;
    }

    // ตรวจสอบข้อมูลครบและไม่เกินจำนวนคงเหลือ
    for (let i = 0; i < usageData.length; i++) {
      const data = usageData[i];
      const animal = selectedAnimals.find(
        (a) => a.farm_animal_id === data.farm_animal_id
      );
      if (!data.quantity_used) {
        toast.error("กรุณากรอกจำนวนที่ใช้ให้ครบทุกตัวสัตว์");
        return;
      }
      if (parseInt(data.quantity_used) > animal.quantity) {
        toast.error(
          `จำนวนใช้มากกว่าที่คงเหลือสำหรับสัตว์ ${animal.animal_name}`
        );
        return;
      }
    }

    try {
      const res = await axios.post(
        import.meta.env.VITE_URL_API + "animal/use",
        {
          usages: usageData.map((u) => ({
            ...u,
            quantity_used: parseInt(u.quantity_used),
            farmer_id: farmId,
          })),
          usage_type: globalUsageType,
          remark: globalRemark,
        }
      );
      toast.success(res.data.msg);
      setIsOpenUse(false);
      setSelectedAnimals([]);
      setUsageData([]);
      setGlobalUsageType("");
      setGlobalRemark("");
      getAnimalsFarm();
    } catch (err) {
      toast.error(
        err.response?.data?.msg || "เกิดข้อผิดพลาดในการบันทึกการใช้สัตว์"
      );
      console.error(err);
    }
  };

  return (
    <div>
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
        <div className="card-body flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <h3 className="text-xl font-bold">ข้อมูลสัตว์ในฟาร์ม</h3>
          <div className="flex gap-2">
            <button
              className="btn bg-green-600 hover:bg-green-700 text-white"
              onClick={() => setIsOpenApp(true)}>
              <CirclePlus className="mr-2" /> เพิ่มข้อมูลสัตว์
            </button>
            <button
              className="btn bg-blue-500 hover:bg-blue-600 text-white"
              onClick={() => selectedAnimals.length > 0 && setIsOpenUse(true)}
              disabled={selectedAnimals.length === 0}>
              <Settings className="mr-2" /> ใช้สัตว์ที่เลือก (
              {selectedAnimals.length})
            </button>
          </div>
        </div>
      </div>

      <div className="mt-3 w-full overflow-auto">
        <table className="table bg-base-100 w-full">
          <thead>
            <tr>
              <th>เลือก</th>
              <th>ล๊อตที่</th>
              <th>ชื่อสัตว์</th>
              <th>ประเภท</th>
              <th>จำนวนที่รับเข้า</th>
              <th>จำนวนคงเหลือ</th>
              <th>วันที่รับเข้า</th>
              <th>วันที่อัปเดต</th>
            </tr>
          </thead>
          <tbody>
            {pageData.length > 0 ? (
              pageData.map((item) => (
                <tr key={item.farm_animal_id}>
                  <td>
                    <input
                      type="checkbox"
                      disabled={item.quantity <= 0}
                      checked={selectedAnimals.some(
                        (a) => a.farm_animal_id === item.farm_animal_id
                      )}
                      onChange={(e) =>
                        handleSelectAnimal(item, e.target.checked)
                      }
                    />
                  </td>
                  <td>{item.lot_code}</td>
                  <td>{item.animal_name}</td>
                  <td>{item.type_name || "-"}</td>
                  <td>{item.quantity_received}</td>
                  <td>{item.quantity}</td>
                  <td>{dayjs(item.created_at).format("DD MMMM YYYY")}</td>
                  <td>{dayjs(item.updated_at).format("DD MMMM YYYY")}</td>
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
      </div>

      {/* Modal เพิ่มสัตว์ */}
      {isOpenAdd && (
        <dialog open className="modal">
          <div className="modal-box">
            <h2 className="font-bold text-lg mb-4">เพิ่มข้อมูลสัตว์</h2>
            <form onSubmit={handleAddAnimal} className="flex flex-col gap-3">
              <div>
                <label className="font-medium">ประเภทสัตว์</label>
                <select
                  className="select select-bordered w-full"
                  value={animalId}
                  onChange={async (e) => {
                    const id = e.target.value;
                    setAnimalId(id);
                    if (id) {
                      try {
                        const res = await axios.get(
                          import.meta.env.VITE_URL_API + `animal_type/${id}`
                        );
                        setTypesOptions(res.data);
                      } catch {
                        setTypesOptions([]);
                      }
                    } else setTypesOptions([]);
                  }}
                  required>
                  <option value="">เลือกประเภทสัตว์</option>
                  {animalsOptions.map((a) => (
                    <option key={a.animal_id} value={a.animal_id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-medium">สายพันธุ์</label>
                <select
                  className="select select-bordered w-full"
                  value={typeId}
                  onChange={(e) => setTypeId(e.target.value)}
                  disabled={!animalId}
                  required>
                  <option value="">เลือกสายพันธุ์</option>
                  {typesOptions.map((t) => (
                    <option key={t.type_id} value={t.type_id}>
                      {t.type_name}
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

      {/* Modal ใช้สัตว์หลายตัว */}
      {isOpenUse && selectedAnimals.length > 0 && (
        <dialog open className="modal">
          <div className="modal-box max-h-[70vh] overflow-auto">
            <h2 className="font-bold text-lg mb-4">บันทึกการใช้สัตว์หลายตัว</h2>
            <form onSubmit={handleUseAnimals} className="flex flex-col gap-4">
              {/* ฟิลด์รวม */}
              <div className="p-4 border rounded bg-blue-50">
                <h3 className="font-semibold text-lg mb-3">ข้อมูลการใช้งาน</h3>

                <div className="mb-3">
                  <label className="font-medium">ประเภทการใช้งาน</label>
                  <select
                    className="select select-bordered w-full"
                    value={globalUsageType}
                    onChange={(e) => setGlobalUsageType(e.target.value)}
                    required>
                    <option value="">เลือกประเภทการใช้งาน</option>
                    <option value="ขาย">ขาย</option>
                    <option value="เชือด">เชือด</option>
                    <option value="ตาย">ตาย</option>
                    <option value="อื่นๆ">อื่นๆ</option>
                  </select>
                </div>

                <div>
                  <label className="font-medium">หมายเหตุ</label>
                  <textarea
                    className="textarea textarea-bordered w-full"
                    rows={2}
                    value={globalRemark}
                    onChange={(e) => setGlobalRemark(e.target.value)}
                    placeholder="ระบุรายละเอียดเพิ่มเติม..."
                  />
                </div>
              </div>

              {/* รายการสัตว์ที่เลือก */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">
                  รายการสัตว์ที่เลือก ({selectedAnimals.length} ตัว)
                </h3>
                {selectedAnimals.map((animal, index) => (
                  <div
                    key={animal.farm_animal_id}
                    className="p-3 border rounded bg-gray-100">
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <p>
                        <strong>ล๊อตที่:</strong> {animal.lot_code}
                      </p>
                      <p>
                        <strong>สัตว์:</strong> {animal.animal_name}
                      </p>
                      <p>
                        <strong>ประเภท:</strong> {animal.type_name || "-"}
                      </p>
                      <p>
                        <strong>จำนวนคงเหลือ:</strong> {animal.quantity}
                      </p>
                    </div>

                    <div>
                      <label className="font-medium">จำนวนที่ใช้</label>
                      <input
                        type="number"
                        className="input input-bordered w-full"
                        min={1}
                        max={animal.quantity}
                        value={usageData[index]?.quantity_used || ""}
                        onChange={(e) =>
                          handleUsageChange(
                            index,
                            "quantity_used",
                            e.target.value
                          )
                        }
                        required
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => {
                    setIsOpenUse(false);
                    setSelectedAnimals([]);
                    setUsageData([]);
                    setGlobalUsageType("");
                    setGlobalRemark("");
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
  );
}

export default Animal;
