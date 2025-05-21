import { getCollection } from "astro:content";
import { Resvg } from "@resvg/resvg-js";
import satori from "satori";
import { readFileSync } from "fs";
import { join } from "path";

export async function getStaticPaths() {
  const posts = await getCollection("blog");

  return posts.map((post) => ({
    params: { slug: post.id },
    props: {
      title: post.data.title,
      description: post.data.description,
    },
  }));
}

const berkleyRegular = readFileSync(
  join(process.cwd(), "public", "fonts", "BerkeleyMono-Regular.woff"),
);

const berkleyBold = readFileSync(
  join(process.cwd(), "public", "fonts", "BerkeleyMono-Bold.woff"),
);

export async function GET({ props }: { props: { title: string } }) {
  const { title } = props;

  const width = 1200;
  const height = 630;

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "#101010",
          color: "#00ff80",
          fontFamily: "Berkeley Mono",
          padding: "4rem",
        },
        children: [
          {
            type: "h1",
            props: {
              style: {
                fontSize: "60px",
                fontWeight: "bold",
                textAlign: "center",
                margin: "0",
              },
              children: title,
            },
          },
          {
            type: "p",
            props: {
              style: {
                fontSize: "32px",
                margin: "1rem 0 0 0",
              },
              children: "lucasdelinhares.com",
            },
          },
        ],
      },
    },
    {
      width,
      height,
      fonts: [
        {
          name: "Berkeley Mono",
          data: berkleyRegular,
          weight: 400,
          style: "normal",
        },
        {
          name: "Berkeley Mono",
          data: berkleyBold,
          weight: 700,
          style: "normal",
        },
      ],
    },
  );

  const resvg = new Resvg(svg, {
    fitTo: {
      mode: "width",
      value: width,
    },
  });

  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  return new Response(pngBuffer, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
