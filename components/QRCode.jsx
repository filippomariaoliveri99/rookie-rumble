"use client";

import { useState } from "react";

export default function QRCode({ text, size = 280 }) {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  // goqr.me genera PNG QR di qualità professionale
  // ecc=H: error correction massima (resiste fino al 30% di danni)
  // margin=10: quiet zone ampia per migliore lettura
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(
    text
  )}&ecc=H&margin=10`;

  if (imgError) {
    return (
      <div
        className="flex flex-col items-center justify-center border border-red-300 bg-red-50 text-red-700 text-xs p-4 text-center"
        style={{ width: size, height: size }}
      >
        <div className="font-semibold mb-2">QR non generabile</div>
        <div className="text-[10px]">Copia il link qui sopra e mandalo manualmente al pubblico</div>
      </div>
    );
  }

  return (
    <div style={{ width: size, height: size, position: "relative" }}>
      {!imgLoaded && (
        <div className="absolute inset-0 flex items-center justify-center text-xs text-neutral-500">
          Generazione QR...
        </div>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={qrUrl}
        alt="QR Code per votare"
        width={size}
        height={size}
        style={{ display: "block", width: size, height: size }}
        onLoad={() => setImgLoaded(true)}
        onError={() => setImgError(true)}
      />
    </div>
  );
}
