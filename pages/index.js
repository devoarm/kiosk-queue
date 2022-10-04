import React, { useState, useEffect } from "react";
import Image from "next/image";
import cardImage from "../assets/card.png";
import logoMOPH from "../assets/logoMOPH.png";
import ArrowImage from "../assets/Arrows-Down-icon.png";
import ReceiptImage from "../assets/receipt.png";
import Link from "next/link";
import { useRouter } from "next/router";
import mqtt from "mqtt";
export default function Home() {
  const router = useRouter();
  const [status, setStatus] = useState(false);
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
      }
    });
  }, []);

  return (
    <div className="h-screen w-full bg-green-400 absolute">
      {!status ? (
        <div className="flex bg-red-500 h-10 justify-center items-center">
          <h1 className="text-lg text-white">กำลังเชื่อมต่อ . . .</h1>
        </div>
      ) : null}
      <div className="mt-5">
        <div className="flex items-center justify-center">
          <Image src={logoMOPH} width={100} height={100} />
          <h1 className="text-center text-6xl font-bold">
            โรงพยาบาลอรัญประเทศ
          </h1>
        </div>
      </div>

      <div className="flex justify-center">
        <Link href="/cardNumberPad">
          <div className="bg-purple-700 h-48 w-60	 text-center py-20 rounded-xl m-5">
            <h1 className="text-3xl text-white">กรอกเลขบัตร</h1>
          </div>
        </Link>
        {/* <div className="bg-purple-700 h-48 w-60	 text-center py-20 rounded-xl m-5">
          <h1 className="text-3xl text-white">แสกนใบนำทาง</h1>
        </div> */}
      </div>
      <div className="flex mt-24 justify-between ">
        <div className="text-center">
          <div>
            <Image src={cardImage} width={370} height={200} />
            <h1 className="text-4xl text-center">กรุณาเสียบบัตรประชาชน</h1>
          </div>
          <div>
            <Image src={ArrowImage} width={150} height={150} />
          </div>
        </div>
        <div className="text-center">
          <div>
            <Image src={ReceiptImage} width={370} height={200} />
            <h1 className="text-4xl text-center">รับบัตรคิว</h1>
          </div>
          <div>
            <Image src={ArrowImage} width={150} height={150} />
          </div>
        </div>
      </div>
    </div>
  );
}
