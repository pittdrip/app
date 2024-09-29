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
  const { garm_img_b64, garment_desc, human_img_b64 } = req.body;


  const garm_img_data = `data;${mime};base64;${garm_img_b64}`
  const human_img_data = `data;${mime};base64;${human_img_b64}`

  const input = {
    garm_img: garm_img_data,
    human_img_data: human_img_data,
    garment_des: garment_desc
  };

  const output = await replicate.run("cuuupid/idm-vton:c871bb9b046607b680449ecbae55fd8c6d945e0a1948644bf2361b3d021d3ff4", { input });

  if (!output) {
    return res.json({
      message: "We're cooked"
    })
  }

  let image = await axios.get(output, { responseType: "blob" });

  return res.send(image);
})

app.listen(3000, () => {
  console.log("Server started on port 3000")
})
