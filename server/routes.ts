import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { mailer } from "./mailer";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fs from "fs";
import path from "path";
import { businessProfileInsertSchema } from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API route to submit business profile
  app.post("/api/business-profile", async (req, res) => {
    try {
      // Validate the request body
      const validatedData = businessProfileInsertSchema.parse(req.body);
      
      // Store business profile in the database
      const businessProfile = await storage.createBusinessProfile(validatedData);
      
      // Find matching support resources
      const matches = await storage.findMatches(businessProfile.id);
      
      // Generate insights based on business profile and matches
      const insights = await storage.generateInsights(businessProfile.id);
      
      return res.status(201).json({ 
        success: true, 
        message: "Business profile created successfully", 
        businessProfileId: businessProfile.id 
      });
    } catch (error) {
      console.error("Error creating business profile:", error);
      
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          success: false, 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      
      return res.status(500).json({ 
        success: false, 
        message: "Internal server error" 
      });
    }
  });

  // API route to check match status
  app.get("/api/match-status", async (req, res) => {
    // This is a simple endpoint that simulates the matching process being complete
    return res.status(200).json({ 
      isComplete: true 
    });
  });

  // API route to get match results
  app.get("/api/match-results", async (req, res) => {
    try {
      // In a real app, you would use an auth token or session to identify the user
      // For this demo, we'll just return the most recent business profile and its matches
      const recentProfile = await storage.getMostRecentBusinessProfile();
      
      if (!recentProfile) {
        return res.status(404).json({ 
          success: false, 
          message: "No business profile found" 
        });
      }
      
      // Get matches for the business profile
      const matchResults = await storage.getMatchesForProfile(recentProfile.id);
      const supportResources = await storage.getSupportResourcesForMatches(matchResults);
      
      // Get insights for the business profile
      const insights = await storage.getInsightsForProfile(recentProfile.id);
      
      return res.status(200).json({
        matches: supportResources,
        businessProfile: recentProfile,
        insights
      });
    } catch (error) {
      console.error("Error fetching match results:", error);
      return res.status(500).json({ 
        success: false, 
        message: "Internal server error" 
      });
    }
  });

  // API route to download results as PDF
  app.get("/api/download-results", async (req, res) => {
    try {
      // In a real app, you would use auth token to identify the user
      // For this demo, we'll just return the most recent business profile and its matches
      const recentProfile = await storage.getMostRecentBusinessProfile();
      
      if (!recentProfile) {
        return res.status(404).json({ 
          success: false, 
          message: "No business profile found" 
        });
      }
      
      // Get matches for the business profile
      const matchResults = await storage.getMatchesForProfile(recentProfile.id);
      const supportResources = await storage.getSupportResourcesForMatches(matchResults);
      
      // Get insights for the business profile
      const insights = await storage.getInsightsForProfile(recentProfile.id);
      
      // Create a PDF document
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      
      // Add title
      page.drawText("Your Business Support Matches", {
        x: 50,
        y: 800,
        size: 18,
        font: boldFont,
        color: rgb(0.05, 0.34, 0.38) // Primary color
      });
      
      // Add business profile information
      page.drawText("Business Profile:", {
        x: 50,
        y: 760,
        size: 14,
        font: boldFont,
        color: rgb(0.05, 0.34, 0.38)
      });
      
      let yPos = 730;
      const lineHeight = 20;
      
      page.drawText(`Business Type: ${recentProfile.businessType}`, {
        x: 50,
        y: yPos,
        size: 12,
        font: font
      });
      yPos -= lineHeight;
      
      page.drawText(`Industry Sector: ${recentProfile.industrySector}`, {
        x: 50,
        y: yPos,
        size: 12,
        font: font
      });
      yPos -= lineHeight;
      
      page.drawText(`Team Size: ${recentProfile.teamSize}`, {
        x: 50,
        y: yPos,
        size: 12,
        font: font
      });
      yPos -= lineHeight;
      
      page.drawText(`Funding Stage: ${recentProfile.fundingStage}`, {
        x: 50,
        y: yPos,
        size: 12,
        font: font
      });
      yPos -= lineHeight;
      
      page.drawText(`Growth Goals: ${recentProfile.growthGoals.join(", ")}`, {
        x: 50,
        y: yPos,
        size: 12,
        font: font
      });
      yPos -= lineHeight * 2;
      
      // Add matched support resources
      page.drawText("Recommended Support Options:", {
        x: 50,
        y: yPos,
        size: 14,
        font: boldFont,
        color: rgb(0.05, 0.34, 0.38)
      });
      yPos -= lineHeight * 1.5;
      
      for (const support of supportResources) {
        // Add new page if needed
        if (yPos < 150) {
          const newPage = pdfDoc.addPage([595.28, 841.89]);
          yPos = 800;
          page = newPage;
        }
        
        page.drawText(support.name, {
          x: 50,
          y: yPos,
          size: 12,
          font: boldFont
        });
        yPos -= lineHeight;
        
        page.drawText(`Type: ${support.type}`, {
          x: 70,
          y: yPos,
          size: 10,
          font: font
        });
        yPos -= lineHeight;
        
        // Wrap description text
        const descriptionLines = wrapText(support.description, font, 10, 450);
        for (const line of descriptionLines) {
          page.drawText(line, {
            x: 70,
            y: yPos,
            size: 10,
            font: font
          });
          yPos -= lineHeight;
        }
        
        if (support.amount) {
          page.drawText(`Amount: ${support.amount}`, {
            x: 70,
            y: yPos,
            size: 10,
            font: font
          });
          yPos -= lineHeight;
        }
        
        if (support.deadline) {
          page.drawText(`Deadline: ${support.deadline}`, {
            x: 70,
            y: yPos,
            size: 10,
            font: font
          });
          yPos -= lineHeight;
        }
        
        page.drawText(`Apply at: ${support.applyUrl}`, {
          x: 70,
          y: yPos,
          size: 10,
          font: font
        });
        yPos -= lineHeight * 1.5;
      }
      
      // Add insights if there's space, otherwise add a new page
      if (yPos < 200) {
        const newPage = pdfDoc.addPage([595.28, 841.89]);
        yPos = 800;
        page = newPage;
      }
      
      page.drawText("Personalized Insights:", {
        x: 50,
        y: yPos,
        size: 14,
        font: boldFont,
        color: rgb(0.05, 0.34, 0.38)
      });
      yPos -= lineHeight * 1.5;
      
      for (const insight of insights) {
        // Add new page if needed
        if (yPos < 150) {
          const newPage = pdfDoc.addPage([595.28, 841.89]);
          yPos = 800;
          page = newPage;
        }
        
        const insightLines = wrapText(`• ${insight}`, font, 10, 450);
        for (const line of insightLines) {
          page.drawText(line, {
            x: 50,
            y: yPos,
            size: 10,
            font: font
          });
          yPos -= lineHeight;
        }
        yPos -= lineHeight * 0.5;
      }
      
      // Add footer with date
      const currentDate = new Date().toLocaleDateString();
      page.drawText(`Generated on ${currentDate} by Business Baraka Finder`, {
        x: 50,
        y: 50,
        size: 10,
        font: font,
        color: rgb(0.5, 0.5, 0.5)
      });
      
      // Serialize the PDF to bytes
      const pdfBytes = await pdfDoc.save();
      
      // Set response headers
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=business-support-matches.pdf");
      
      // Send the PDF as the response
      res.send(Buffer.from(pdfBytes));
    } catch (error) {
      console.error("Error generating PDF:", error);
      res.status(500).json({ 
        success: false, 
        message: "Error generating PDF" 
      });
    }
  });

  // API route to send results via email
  app.post("/api/email-results", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ 
          success: false, 
          message: "Email is required" 
        });
      }
      
      // Get the most recent business profile
      const recentProfile = await storage.getMostRecentBusinessProfile();
      
      if (!recentProfile) {
        return res.status(404).json({ 
          success: false, 
          message: "No business profile found" 
        });
      }
      
      // Update the business profile with the email
      await storage.updateBusinessProfileEmail(recentProfile.id, email);
      
      // Get matches for the business profile
      const matchResults = await storage.getMatchesForProfile(recentProfile.id);
      const supportResources = await storage.getSupportResourcesForMatches(matchResults);
      
      // Get insights for the business profile
      const insights = await storage.getInsightsForProfile(recentProfile.id);
      
      // Send email with results
      const emailResult = await mailer.sendResultsEmail(email, {
        businessProfile: recentProfile,
        supportResources,
        insights
      });
      
      // Log the email
      await storage.logEmailSent(email, recentProfile.id, emailResult.success, emailResult.error);
      
      if (!emailResult.success) {
        return res.status(500).json({ 
          success: false, 
          message: "Failed to send email", 
          error: emailResult.error 
        });
      }
      
      return res.status(200).json({ 
        success: true, 
        message: "Email sent successfully" 
      });
    } catch (error) {
      console.error("Error sending email:", error);
      return res.status(500).json({ 
        success: false, 
        message: "Internal server error" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper function to wrap text
function wrapText(text: string, font: any, fontSize: number, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const width = font.widthOfTextAtSize(currentLine + word + ' ', fontSize);
    
    if (width < maxWidth) {
      currentLine += word + ' ';
    } else {
      lines.push(currentLine.trim());
      currentLine = word + ' ';
    }
  }
  
  if (currentLine.trim()) {
    lines.push(currentLine.trim());
  }
  
  return lines;
}
