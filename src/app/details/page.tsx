"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

const NASA_API_KEY = "4O9HBCWRE9YgYIuitbLjoSRgI1VyGbkm7TjXKV1G";

export default function Details() {
  const searchParams = useSearchParams();
  const date = searchParams.get("date");
  const [image, setImage] = useState<any>(null);

  useEffect(() => {
    if (!date) return;
    fetch(`https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}&date=${date}`)
      .then((res) => res.json())
      .then((data) => setImage(data))
      .catch((error) => console.error("Error fetching details:", error));
  }, [date]);

  if (!image) return <p>Loading...</p>;

  return (
    <div className="details-container">
      {image.media_type === "image" ? (
        <Image src={image.url} alt={image.title} width={800} height={600} loading="lazy" />
      ) : (
        <iframe width="800" height="600" src={image.url} title={image.title} allowFullScreen></iframe>
      )}
      <h2>{image.title}</h2>
      <p><strong>Date:</strong> {image.date}</p>
      <p><strong>Explanation:</strong> {image.explanation}</p>
      {image.copyright && <p><strong>Credit:</strong> {image.copyright}</p>}
    </div>
  );
}
