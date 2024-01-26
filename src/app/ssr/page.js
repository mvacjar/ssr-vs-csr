import Content from "@/components/content";
import { API_KEY } from "@/constants";
import styles from "../page.module.css";
import SSRReload from "@/components/ssrReload";
import { imageUrlToBase64 } from "@/helpers";

async function getData() {
  const response = await fetch(
    `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&count=1&thumbs=true`,
    { cache: "no-cache" }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  const [json] = await response.json();

  if (json.url) {
    json.url = await imageUrlToBase64(json.url);
  }

  return json;
}

export default async function SSR() {
  const data = await getData();

  return (
    <main className={styles.main}>
      <div className={styles.title}>SERVER-SIDE RENDERED</div>
      <SSRReload />
      {data ? <Content data={data} /> : <div>Loading...</div>}
    </main>
  );
}
