import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import mqtt from "mqtt";
import Link from "next/link";

const CardNumberPad = () => {
  const router = useRouter();
  const [status, setStatus] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (cardNumber.length < 13 || cardNumber.length > 13) {
      Swal.fire({
        title: "ไม่สำเร็จ!",
        text: "เลขบัตรไม่ถูกต้อง",
        icon: "error",
      });
    } else {
      router.push(`/selectServicePoint/${cardNumber}`);
    }
  };
  useEffect(() => {
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
  }, []);
  return (
    <div className="h-screen bg-green-200">
      {!status ? (
        <div className="flex bg-red-500 h-10 justify-center items-center">
          <h1 className="text-lg text-white">กำลังเชื่อมต่อ . . .</h1>
        </div>
      ) : null}
      <div className="text-center">
        <h1 className="text-4xl">กรุณากรอกเลขบัตร หรือเสียบบัตรประชาชน</h1>
      </div>
      <div className="flex justify-center">
        <h1 className="text-9xl w-min px-20 h-32 rounded-xl bg-blue-200">
          {cardNumber}
        </h1>
      </div>
      <div className="flex justify-center">
        <div className="grid grid-cols-3 justify-center">
          <button
            className="bg-purple-700 m-2 h-40 w-96 text-center rounded-lg"
            onClick={(e) => {
              setCardNumber(cardNumber + "1");
            }}
          >
            <h1 className="text-9xl text-white">1</h1>
          </button>
          <button
            className="bg-purple-700 m-2 h-40 w-96 text-center rounded-lg"
            onClick={(e) => {
              setCardNumber(cardNumber + "2");
            }}
          >
            <h1 className="text-9xl text-white">2</h1>
          </button>
          <button
            className="bg-purple-700 m-2 h-40 w-96 text-center rounded-lg"
            onClick={(e) => {
              setCardNumber(cardNumber + "3");
            }}
          >
            <h1 className="text-9xl text-white">3</h1>
          </button>
          <button
            className="bg-purple-700 m-2 h-40 w-96 text-center rounded-lg"
            onClick={(e) => {
              setCardNumber(cardNumber + "4");
            }}
          >
            <h1 className="text-9xl text-white">4</h1>
          </button>
          <button
            className="bg-purple-700 m-2 h-40 w-96 text-center rounded-lg"
            onClick={(e) => {
              setCardNumber(cardNumber + "5");
            }}
          >
            <h1 className="text-9xl text-white">5</h1>
          </button>
          <button
            className="bg-purple-700 m-2 h-40 w-96 text-center rounded-lg"
            onClick={(e) => {
              setCardNumber(cardNumber + "6");
            }}
          >
            <h1 className="text-9xl text-white">6</h1>
          </button>
          <button
            className="bg-purple-700 m-2 h-40 w-96 text-center rounded-lg"
            onClick={(e) => {
              setCardNumber(cardNumber + "7");
            }}
          >
            <h1 className="text-9xl text-white">7</h1>
          </button>
          <button
            className="bg-purple-700 m-2 h-40 w-96 text-center rounded-lg"
            onClick={(e) => {
              setCardNumber(cardNumber + "8");
            }}
          >
            <h1 className="text-9xl text-white">8</h1>
          </button>
          <button
            className="bg-purple-700 m-2 h-40 w-96 text-center rounded-lg"
            onClick={(e) => {
              setCardNumber(cardNumber + "9");
            }}
          >
            <h1 className="text-9xl text-white">9</h1>
          </button>
          <button
            className="bg-green-600 m-2 h-40 w-96 text-center rounded-lg"
            onClick={handleSubmit}
          >
            <h1 className="text-9xl text-white">ตกลง</h1>
          </button>
          <button
            className="bg-purple-700 m-2 h-40 w-96 text-center rounded-lg"
            onClick={(e) => {
              setCardNumber(cardNumber + "0");
            }}
          >
            <h1 className="text-9xl text-white">0</h1>
          </button>
          <button
            className="bg-red-700 m-2 h-40 w-96 text-center rounded-lg"
            onClick={(e) => {
              var sli = cardNumber.slice(0, -1);
              setCardNumber(sli);
            }}
          >
            <h1 className="text-9xl text-white">ลบ</h1>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardNumberPad;
