import inventory from `public/inventory.json`;
import protectRoutes from "~/server/protectRoutes";

export default defineEventHandler(async (event) => {
  await protectRoutes(event);

  return inventory;
});

