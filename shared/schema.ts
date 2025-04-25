import { pgTable, text, serial, integer, boolean, date, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table (from template)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Business Profile table
export const businessProfiles = pgTable("business_profiles", {
  id: serial("id").primaryKey(),
  businessType: text("business_type").notNull(),
  industrySector: text("industry_sector").notNull(),
  teamSize: text("team_size").notNull(),
  fundingStage: text("funding_stage").notNull(),
  growthGoals: json("growth_goals").$type<string[]>().notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  email: text("email"),
});

export const businessProfileInsertSchema = createInsertSchema(businessProfiles, {
  businessType: (schema) => schema.min(1, "Business type is required"),
  industrySector: (schema) => schema.min(1, "Industry sector is required"),
  teamSize: (schema) => schema.min(1, "Team size is required"),
  fundingStage: (schema) => schema.min(1, "Funding stage is required"),
  growthGoals: (schema) => schema.refine((val) => val && val.length > 0, "At least one growth goal is required"),
}).omit({ id: true, createdAt: true });

export type BusinessProfile = typeof businessProfiles.$inferSelect;
export type InsertBusinessProfile = z.infer<typeof businessProfileInsertSchema>;

// Support Resources table
export const supportResources = pgTable("support_resources", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // funding, mentorship, networking, etc.
  description: text("description").notNull(),
  applyUrl: text("apply_url").notNull(),
  applyText: text("apply_text"),
  amount: text("amount"),
  deadline: text("deadline"),
  location: text("location"),
  duration: text("duration"),
  shariaCompliant: boolean("sharia_compliant").default(true).notNull(),
  suitableFor: json("suitable_for").$type<{
    businessTypes: string[];
    industrySectors: string[];
    teamSizes: string[];
    fundingStages: string[];
    growthGoals: string[];
  }>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const supportResourcesInsertSchema = createInsertSchema(supportResources, {
  name: (schema) => schema.min(1, "Name is required"),
  description: (schema) => schema.min(1, "Description is required"),
  type: (schema) => schema.min(1, "Type is required"),
  applyUrl: (schema) => schema.url("Apply URL must be a valid URL"),
  suitableFor: (schema) => schema.refine((val) => 
    val && 
    val.businessTypes && val.businessTypes.length > 0 && 
    val.industrySectors && val.industrySectors.length > 0 && 
    val.teamSizes && val.teamSizes.length > 0 && 
    val.fundingStages && val.fundingStages.length > 0 && 
    val.growthGoals && val.growthGoals.length > 0, 
    "All suitable for categories must have at least one item"
  ),
}).omit({ id: true, createdAt: true });

export type Support = typeof supportResources.$inferSelect;
export type InsertSupport = z.infer<typeof supportResourcesInsertSchema>;

// Matches table to record which profiles matched with which support resources
export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  businessProfileId: integer("business_profile_id").references(() => businessProfiles.id).notNull(),
  supportResourceId: integer("support_resource_id").references(() => supportResources.id).notNull(),
  matchScore: integer("match_score").notNull(), // A score from 0-100 indicating match quality
  insights: json("insights").$type<string[]>(), // Array of personalized insights
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const matchesRelations = relations(matches, ({ one }) => ({
  businessProfile: one(businessProfiles, {
    fields: [matches.businessProfileId],
    references: [businessProfiles.id],
  }),
  supportResource: one(supportResources, {
    fields: [matches.supportResourceId],
    references: [supportResources.id],
  }),
}));

export type Match = typeof matches.$inferSelect;

// Email logs to track sent emails
export const emailLogs = pgTable("email_logs", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  businessProfileId: integer("business_profile_id").references(() => businessProfiles.id).notNull(),
  sentAt: timestamp("sent_at").defaultNow().notNull(),
  success: boolean("success").notNull(),
  errorMessage: text("error_message"),
});

export type EmailLog = typeof emailLogs.$inferSelect;
