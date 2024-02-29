import inventory from `public/inventory.json`;

export default defineEventHandler(async (event) => {
  return inventory;
});

