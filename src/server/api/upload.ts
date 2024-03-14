import protectRoutes from "~/server/protectRoutes";

import path from "path";
import { promises as fs } from "fs";
const __dirname = path.resolve(path.dirname(""));
import inventory from `public/inventory.json`;

export default defineEventHandler(async (event) => {
  await protectRoutes(event);

  const body = await readBody(event);

  inventory.inventory.push(body);

  await fs.writeFile(path.join(__dirname,`/src/public/inventory.json`), JSON.stringify(inventory, null, 2),
    { 
      encoding: "utf-8",
    });
  return body;
});
