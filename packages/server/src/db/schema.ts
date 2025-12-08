import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  bigint,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const nodeTypeEnum = pgEnum("node_type", ["FOLDER", "FILE"]);

export const nodes = pgTable("nodes", {
  id: uuid("id").defaultRandom().primaryKey(),
  parentId: uuid("parent_id"),
  name: varchar("name", { length: 255 }).notNull(),
  type: nodeTypeEnum("type").notNull(),
  size: bigint("size", { mode: "number" }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const nodesRelations = relations(nodes, ({ one, many }) => ({
  parent: one(nodes, {
    fields: [nodes.parentId],
    references: [nodes.id],
    relationName: "parent_child",
  }),
  children: many(nodes, {
    relationName: "parent_child",
  }),
}));
