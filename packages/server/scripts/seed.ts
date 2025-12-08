import { db } from "../src/db";
import { nodes } from "../src/db/schema";

const seed = async () => {
  console.log("Seeding...");

  // Clear existing
  await db.delete(nodes); // Be careful in production, but okay for take home

  // Create Root Folders
  const rootFolders = [
    "Desktop",
    "Downloads",
    "Documents",
    "Pictures",
    "Music",
    "Videos",
  ];

  for (const name of rootFolders) {
    const [root] = await db
      .insert(nodes)
      .values({
        name,
        type: "FOLDER",
        parentId: null,
      })
      .returning();

    // Create files in Root Folder (New)
    for (let k = 1; k <= 3; k++) {
      await db.insert(nodes).values({
        name: `${name} File ${k}.txt`,
        type: "FILE",
        parentId: root.id,
        size: Math.floor(Math.random() * 5000),
      });
    }

    // Create subfolders
    for (let i = 1; i <= 3; i++) {
      const [sub] = await db
        .insert(nodes)
        .values({
          name: `${name} Sub ${i}`,
          type: "FOLDER",
          parentId: root.id,
        })
        .returning();

      // Create files in subfolder
      for (let j = 1; j <= 5; j++) {
        await db.insert(nodes).values({
          name: `File ${j}.txt`,
          type: "FILE",
          parentId: sub.id,
          size: Math.floor(Math.random() * 10000),
        });
      }

      // Create deeper nesting
      const [deepSub] = await db
        .insert(nodes)
        .values({
          name: `${name} Deep ${i}`,
          type: "FOLDER",
          parentId: sub.id,
        })
        .returning();
    }
  }

  console.log("Seeding done");
  process.exit(0);
};

seed();
