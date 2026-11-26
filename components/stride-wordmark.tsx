import Image from "next/image";

export default function StrideWordmark() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

  return (
    <Image
      className="stride-wordmark"
      src={basePath + "/stride-wordmark.webp"}
      width={752}
      height={239}
      alt="Stride by CapitalSense"
      loading="eager"
      unoptimized
    />
  );
}
