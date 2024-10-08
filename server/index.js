import express from "express"
import "dotenv/config"
import Replicate from "replicate"
import axios from "axios"
import cors from "cors"
import fs from "fs"
import { readFile } from "node:fs/promises";
const app = express();

const replicate = new Replicate();
app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ extended: true, limit: "200mb" }));

app.use(cors({
  credentials: false,
  origin: "*"
}));

app.post("/removebg", async (req, res) => {
  const { base64Image } = req.body;

  let buff = Buffer.from(base64Image, 'base64');
  fs.writeFileSync('image.jpg', buff);



  const input = {
    image: await readFile("image.jpg"),
  }

  console.log(input)
  try {
    const output = await replicate.run("lucataco/remove-bg:95fcc2a26d3899cd6c2691c900465aaeff466285a65c14638cc5f36f34befaf1", { input });

    console.log(output);

    if (!output) return res.json({
      message: "We're cooked"
    })


    fs.rmSync("image.jpg");

    return res.json({
      url: output
    });
  } catch (error) {
    console.log(error)
    return res.json({
    })
  }
});


app.post("/dress", async (req, res) => {
  const { garm_img, garment_desc, human_img_b64, human_img, category } = req.body;

console.log(garm_img, garment_desc, human_img_b64, human_img);

if (human_img_b64) {
    let human_buff = Buffer.from(human_img_b64, 'base64');

    fs.writeFileSync('human_image.jpg', human_buff);
  }



  const input = {
    garm_img,
    human_img: human_img_b64 ? await readFile("human_image.jpg") : human_img,
    garment_des: garment_desc,
    category,
    crop: true
  };

  const output = await replicate.run("cuuupid/idm-vton:c871bb9b046607b680449ecbae55fd8c6d945e0a1948644bf2361b3d021d3ff4", { input });

  if (!output) {
    return res.json({
      message: "We're cooked"
    })
  }

//  fs.rmSync("garm_image.jpg");

  if (human_img_b64) {
    fs.rmSync("human_image.jpg");
  }


  // let image = await axios.get(output, { responseType: "blob" });

  return res.json({
    url: output
  });
})

app.listen(3000, () => {
  console.log("Server started on port 3000")
})
