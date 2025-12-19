import { db } from "../src/db";
import { nodes } from "../src/db/schema";

const seedMassive = async () => {
  console.log("🚀 Starting MASSIVE seeding (This might take a few seconds)...");

  // Clear existing
  await db.delete(nodes);

  const totalNodesTarget = 2500;
  let createdCount = 0;

  // Root Folders
  const rootFolders = ["System", "Users", "Program Files", "Projects", "Media"];

  const queue: { id: string; depth: number }[] = [];

  // Create Roots
  for (const name of rootFolders) {
    const [root] = await db
      .insert(nodes)
      .values({
        name,
        type: "FOLDER",
        parentId: null,
      })
      .returning();

    queue.push({ id: root.id, depth: 0 });
    createdCount++;
  }

  // BFS generation to create breadth and depth
  while (queue.length > 0 && createdCount < totalNodesTarget) {
    const current = queue.shift()!;

    // Limits
    const maxFilesPerFolder = 10;
    const maxSubFolders = 5;
    const maxDepth = 20; // Ensure deep nesting

    // Determine how many children to create
    // If not too deep, create more subfolders to ensure breadth
    // If very deep, stop creating subfolders
    const subFolderCount =
      current.depth < maxDepth
        ? Math.floor(Math.random() * maxSubFolders) + 1
        : 0;
    const fileCount = Math.floor(Math.random() * maxFilesPerFolder) + 1;

    // Create Subfolders
    for (let i = 0; i < subFolderCount; i++) {
      if (createdCount >= totalNodesTarget) break;

      const [sub] = await db
        .insert(nodes)
        .values({
          name: `Folder_${createdCount}_D${current.depth + 1}`,
          type: "FOLDER",
          parentId: current.id,
        })
        .returning();

      queue.push({ id: sub.id, depth: current.depth + 1 });
      createdCount++;
    }

    // Create Files
    for (let i = 0; i < fileCount; i++) {
      if (createdCount >= totalNodesTarget) break;

      await db.insert(nodes).values({
        name: `File_${createdCount}.dat`,
        type: "FILE",
        parentId: current.id,
        size: Math.floor(Math.random() * 1024 * 1024),
      });
      createdCount++;
    }

    if (createdCount % 100 === 0) {
      console.log(`... Generated ${createdCount} nodes`);
    }
  }

  console.log(`✅ Seeding COMPLETE! Total nodes: ${createdCount}`);
  console.log(
    `Run 'bun run dev' and refresh your browser to see the power! ⚡`
  );
  process.exit(0);
};

seedMassive();
