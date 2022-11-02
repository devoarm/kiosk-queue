import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Swal from "sweetalert2";
import moment from "moment";
import BtServicePoint from "../../components/BtServicePoint";
import mqtt from "mqtt";

const axios = require("axios").default;

const SelectServicePoint = () => {
  const [apiUrl, setApiUrl] = useState("");
  const [token, setToken] = useState("");
  const [status, setStatus] = useState(false);  
  const router = useRouter();
  const [dataCid, setDataCid] = useState({});
  const [listServicePoint, setListServicePoint] = useState([]);
  const cardNumber = router.query.id;

  const getPatientInfo = async () => {
    const body = {
      cid: cardNumber,
    };
    const res = await axios.post(`${apiUrl}/kiosk/patient/info`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.data.statusCode == 200) {
      setDataCid(res.data.results);
    } else {
      Swal.fire({
        title: "ไม่สำเร็จ!",
        text: "ไม่มีข้อมูลเลขบัตรนี้",
        icon: "error",
      });
    }
  };
  const checkDate = () => {
    const currentDate = moment().format("dddd");
    console.log(currentDate);
    switch (currentDate) {
      // case "Monday":
      //   setListServicePoint([{ name: "TB/ARV", servicePointId: 78 }]);
      //   break;
      case "Tuesday":
        setListServicePoint([{ name: "คลินิกตรวจครรภ์", servicePointId: 78 }]);
        break;
      case "Wednesday":
        setListServicePoint([
          { name: "CAPD", servicePointId: 65 },
          { name: "คลินิกความดัน", servicePointId: 77 },
        ]);
        break;
      case "Thursday":
        setListServicePoint([
          // { name: "ANC", servicePointId: 78 },
          { name: "CKD-โรคไต", servicePointId: 62 },
          { name: "โรคหอบหืด/ถุงลมโป่งพอง", servicePointId: 75 },
          { name: "Wafarin-โรคหัวใจ", servicePointId: 67 },
          // { name: "วัยทอง", servicePointId: 79 },
        ]);
        break;
      case "Friday":
        setListServicePoint([{ name: "คลินิกเบาหวาน", servicePointId: 76 }]);
        break;
    }
    console.log(listServicePoint);
  };
  useEffect(() => {
    setApiUrl(localStorage.getItem("apiUrl"));
    setToken(localStorage.getItem("token"));
    var client;
    const username = "q4u";
    const password = "##q4u##";
    const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;

    client = mqtt.connect("ws://192.168.3.229:8888", {
      username: username,
      password: password,
      clientId: clientId,
      connectTimeout: 4000,
      reconnectPeriod: 1000,
    });
    client.on("connect", () => {
      setStatus(true);
      console.log("connected");

      client.subscribe(
        `kiosk/${localStorage.getItem("printerId")}`,
        (error) => {
          console.log(`Subscribe : kiosk/${localStorage.getItem("printerId")}`);
        }
      );
    });
    client.on("message", (_topic, playload) => {
      const msg = JSON.parse(playload);
      console.log(msg);
      if (msg.ok) {
        router.push(`/selectServicePoint/${msg.results.cid}`);
      } else {
        router.push(`/`);
      }
    });

    getPatientInfo();
    checkDate();
  }, [apiUrl, token]);

  return (
    <div className="h-screen bg-green-400">
      {!status ? (
        <div className="flex bg-red-500 h-10 justify-center items-center">
          <h1 className="text-lg text-white">กำลังเชื่อมต่อ . . .</h1>
        </div>
      ) : null}
      <div className="grid grid-cols-3 justify-items-center">
        <Link href="/">
          <button className="m-2 p-5 text-center rounded-lg bg-blue-500">
            <h1 className="text-5xl text-white">กลับ</h1>
          </button>
        </Link>
        <div className="block mt-2 p-6 max-w-lg bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
          <h5 className="mb-2 text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
            ข้อมูลส่วนตัว
          </h5>
          <p className="font-normal text-4xl text-gray-700 dark:text-gray-400">
            HN : {dataCid.hn}
          </p>
          <p className="font-normal mt-3 text-4xl text-gray-700 dark:text-gray-400">
            ชื่อ :{" "}
            <span className="text-black">
              {dataCid.firstName} {dataCid.lastName}
            </span>
          </p>
        </div>
        <div></div>
      </div>
      <div className="grid justify-items-center my-5">
        <h1 className="text-5xl text-center p-5 w-96 bg-yellow-300 rounded-lg">
          เลือกจุดบริการ
        </h1>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {listServicePoint.map((item, i) => (
          <BtServicePoint
            lable={item.name}
            servicePointId={item.servicePointId}
            hn={dataCid.hn}
            key={i}
            isVisit={dataCid.isVisit}
          />
        ))}
      </div>
    </div>
  );
};

export default SelectServicePoint;
