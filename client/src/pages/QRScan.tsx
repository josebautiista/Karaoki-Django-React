import React, { useContext, useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import { AiOutlineScan } from "react-icons/ai";
import { FiCamera } from "react-icons/fi";
import { AppContext, AppContextType } from "../context/AppProvider";
import { useNavigate } from "react-router-dom";

export const QRScan = () => {
  const scanner = useRef<QrScanner>();
  const videoEl = useRef<HTMLVideoElement>(null);
  const qrBoxEl = useRef<HTMLDivElement>(null);
  const [qrOn, setQrOn] = useState<boolean>(true);
  const [scannedResult, setScannedResult] = useState<string | undefined>("");
  const { setIdMesa } = useContext(AppContext) as AppContextType;

  const navigate = useNavigate();

  const onScanSuccess = (result: QrScanner.ScanResult) => {
    setScannedResult(result?.data);
    setIdMesa(Number(result?.data));
    navigate("/loginUser");
  };

  const onScanFail = (err: string | Error) => {
    console.log(err);
  };

  useEffect(() => {
    if (videoEl.current && !scanner.current) {
      scanner.current = new QrScanner(videoEl.current, onScanSuccess, {
        onDecodeError: onScanFail,
        preferredCamera: "environment",
        highlightScanRegion: true,
        highlightCodeOutline: true,
        overlay: qrBoxEl.current || undefined,
      });

      scanner.current
        .start()
        .then(() => setQrOn(true))
        .catch((err) => {
          if (err) setQrOn(false);
        });
    }

    return () => {
      if (!videoEl.current) {
        scanner.current?.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (scannedResult) {
      alert(scannedResult);
    }
  }, [scannedResult]);

  useEffect(() => {
    if (!qrOn) {
      alert(
        "Camera is blocked or not accessible. Please allow camera in your browser permissions and Reload."
      );
    }
  }, [qrOn]);

  const extractParamFromUrl = (url: string): string => {
    const parts = url.split("/");
    return parts[parts.length - 1];
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      QrScanner.scanImage(file)
        .then((result) => {
          setScannedResult(result);
          const params = extractParamFromUrl(result);
          const id = atob(params);
          console.log("id", id);
          setIdMesa(Number(id));
          navigate("/loginUser");
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className="w-full h-screen max-w-screen-lg mx-auto flex flex-col items-center justify-center bg-gray-100">
      <div className="text-center mb-6">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
          ¡Bienvenido!
        </h2>
        <p className="text-lg md:text-xl text-gray-600">
          Escanea el código QR para comenzar.
        </p>
      </div>

      <div className="relative w-4/5 md:w-3/5 lg:w-2/5 h-1/2 md:h-2/3 mb-6">
        <video
          ref={videoEl}
          className="w-full h-full object-cover rounded-md shadow-lg"
        />
        <div
          ref={qrBoxEl}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div
            className={`relative w-48 h-48 md:w-64 md:h-64 border-4 ${
              scannedResult ? "border-green-500" : "border-white"
            } border-dashed rounded-lg transition-colors duration-300`}
          >
            <AiOutlineScan className="absolute text-white w-6 h-6 md:w-8 md:h-8 top-2 left-2 animate-pulse" />
            <AiOutlineScan className="absolute text-white w-6 h-6 md:w-8 md:h-8 top-2 right-2 rotate-90 animate-pulse" />
            <AiOutlineScan className="absolute text-white w-6 h-6 md:w-8 md:h-8 bottom-2 left-2 -rotate-90 animate-pulse" />
            <AiOutlineScan className="absolute text-white w-6 h-6 md:w-8 md:h-8 bottom-2 right-2 rotate-180 animate-pulse" />
          </div>
        </div>
      </div>

      <label className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md cursor-pointer shadow-md hover:bg-blue-700 transition">
        <FiCamera className="text-xl" />
        <span>Subir Imagen</span>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      {scannedResult && (
        <p className="absolute top-4 left-4 z-50 text-white bg-gray-800 px-4 py-2 rounded-lg shadow-lg">
          Resultado: {scannedResult}
        </p>
      )}
    </div>
  );
};
