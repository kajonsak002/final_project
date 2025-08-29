import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import Pagination from "../../admin/components/Pagination";
import { CirclePlus } from "lucide-react";
import axios from "axios";

function Animal() {
  const [allData, setAllData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const farmId = localStorage.getItem("farmer_id");
  const [isOpenAdd, setIsOpenApp] = useState(false);

  // ฟิลด์ฟอร์ม
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
              <th>ประเภท</th>
              <th>จำนวนที่รับเข้า</th>
              <th>จำนวนคงเหลือ</th>
              <th>วันที่สร้าง</th>
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
                  <td>{new Date(item.created_at).toLocaleDateString()}</td>
                  <td>{new Date(item.updated_at).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-4">
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
                    disabled={!animalId}>
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
      </div>
    </div>
  );
}

export default Animal;
