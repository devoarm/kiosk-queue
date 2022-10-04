import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
const axios = require("axios").default;
import Swal from "sweetalert2";

const BtServicePoint = ({ lable, servicePointId, hn }) => {
  const router = useRouter();
  const [apiUrl, setApiUrl] = useState("");
  const [token, setToken] = useState("");
  const [printerId, setPrinterId] = useState("");
  const handleClick = async () => {
    const _url = `${apiUrl}/queue/prepare/register`;
    const body = {
      hn: hn,
      servicePointId: servicePointId,
      priorityId: 2,
    };
    const rs = await axios.post(_url, body, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(rs.data.queueId);
    if (rs.data.statusCode === 200) {
      try {
        var topic = `/printer/${printerId}`;
        const _url = `${apiUrl}/print/queue/prepare/print`;
        const res = await axios.post(
          _url,
          {
            queueId: rs.data.queueId,
            topic: topic,
            printSmallQueue: "N",
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (rs.data) {
          var data = rs.data;
          if (data.statusCode === 200) {
            await Swal.fire({
              type: "success",
              text: "สำเร็จกรุณารอรับบัตรค่ะ",
              timer: 2000,
            });
            router.push(`/`);
          }
        }
      } catch (error) {
        console.log(error);
        Swal.fire({
          type: "error",
          text: "พิมพ์บัตรคิวไม่สำเร็จ",
          timer: 5000,
        });
      }
    }
  };
  useEffect(() => {
    setApiUrl(localStorage.getItem("apiUrl"));
    setToken(localStorage.getItem("token"));
    setPrinterId(localStorage.getItem("printerId"));
  }, [router]);

  return (
    <button
      className="bg-purple-700 h-48 m-2 text-center rounded-lg"
      onClick={handleClick}
    >
      <h1 className="text-7xl text-white">{lable}</h1>
    </button>
  );
};

export default BtServicePoint;
