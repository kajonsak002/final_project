import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function AddGuileBook() {
  const [animal, setAnimal] = useState([]);
  const [animalType, setAnimalType] = useState([]);
  const [animalId, setAnimalId] = useState("");

  const getAnimal = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_URL_API + "animals");
      setAnimal(res.data);
    } catch (err) {
      console.log("Error getAnimal : ", err);
    }
  };

  const getAnimalType = async () => {
    if (!animalId) {
      setAnimalType([]);
      return;
    }

    try {
      const data = {
        animal_id: animalId,
      };
      console.log(import.meta.env.VITE_URL_API + "animalType", data);
      const res = await axios.post(
        import.meta.env.VITE_URL_API + "animalType",
        data
      );
      setAnimalType(res.data);
      console.log(res.data);
    } catch (err) {
      console.log("Error getAnimalType : ", err);
    }
  };

  useEffect(() => {
    getAnimal();
    if (animalId) {
      getAnimalType();
    }
  }, [animalId]);

  return (
    <>
      <div className="breadcrumbs text-md">
        <ul>
          <li>
            <Link to={"/admin/dashboard"}>หน้าเเรก</Link>
          </li>
          <li>
            <Link to={"/admin/book"}>จัดการคู่มือการเลี้ยงสัตว์</Link>
          </li>
          <li>เพิ่มข้อมูล</li>
        </ul>
      </div>

      <div className="card w-full bg-base-100 shadow-xl mt-3 h-full">
        <div className="card-body">
          <h2 className="card-title text-xl mb-4">เพิ่มคู่มือการเลี้ยงสัตว์</h2>
          <div className="flex w-full gap-4">
            <div className="w-1/3">
              <form>
                <div className="form-control mb-2">
                  <label className="label">
                    <span className="label-text text-black mb-2">
                      ชื่อสัตว์
                    </span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    required
                    value={animalId}
                    onChange={(e) => {
                      setAnimalId(e.target.value);
                    }}>
                    <option value="">เลือกสัตว์</option>
                    {animal.map((item) => (
                      <option key={item.animal_id} value={item.animal_id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-control mb-2">
                  <label className="label">
                    <span className="label-text text-black mb-2">ชนิด</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    required
                    disabled={!animalId || animalType.length === 0}>
                    <option value="">เลือกชนิด</option>
                    {animalType.map((item) => (
                      <option key={item.type_id} value={item.type_id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-control mb-2">
                  <label className="label">
                    <span className="label-text text-black mb-2">
                      เลือกรูปภาพปก
                    </span>
                  </label>
                  <input type="file" className="file-input w-full" />
                </div>
              </form>
              <div className="img-preview border border-amber-950 h-[400px]">
                <img src="#" alt="" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="text-editor w-full h-screen border border-primary"></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddGuileBook;
