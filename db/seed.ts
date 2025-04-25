import { db } from "./index";
import { supportResources } from "@shared/schema";

async function seed() {
  try {
    console.log("🌱 Seeding database...");

    // Insert support resources
    const supportData = [
      {
        name: "Innovate UK Smart Grants",
        type: "funding",
        description: "Funding for game-changing innovations from any sector or business of any size.",
        applyUrl: "https://www.ukri.org/councils/innovate-uk/",
        applyText: "Apply Now",
        amount: "£25,000 - £500,000",
        deadline: "24 Nov 2023",
        shariaCompliant: true,
        suitableFor: {
          businessTypes: ["startup", "scale-up", "established"],
          industrySectors: ["tech", "healthcare", "manufacturing", "education", "creative"],
          teamSizes: ["micro", "small", "medium", "large"],
          fundingStages: ["seed", "early", "growth"],
          growthGoals: ["funding", "products", "digital"]
        }
      },
      {
        name: "IFG Business Advisory",
        type: "mentorship",
        description: "Specialized business mentorship with experts who understand ethical business practices and principles.",
        applyUrl: "https://www.islamic-finance.com/",
        applyText: "Learn More",
        duration: "12-month programme",
        shariaCompliant: true,
        suitableFor: {
          businessTypes: ["startup", "scale-up", "social-enterprise", "family-business"],
          industrySectors: ["all"],
          teamSizes: ["solo", "micro", "small"],
          fundingStages: ["pre-revenue", "seed", "early"],
          growthGoals: ["advisory", "networking", "expansion"]
        }
      },
      {
        name: "Cur8 Business Network",
        type: "networking",
        description: "Connect with like-minded business owners committed to ethical practices and sustainable growth.",
        applyUrl: "https://cur8.network/",
        applyText: "Join Network",
        location: "London, Birmingham, Manchester",
        shariaCompliant: true,
        suitableFor: {
          businessTypes: ["all"],
          industrySectors: ["all"],
          teamSizes: ["all"],
          fundingStages: ["all"],
          growthGoals: ["networking", "expansion", "advisory"]
        }
      },
      {
        name: "Ethical Business Accelerator",
        type: "accelerator",
        description: "A 6-month intensive program designed to help ethical businesses scale rapidly while maintaining their values.",
        applyUrl: "https://ethicalbusinessaccelerator.org/",
        applyText: "Apply for Next Cohort",
        duration: "6-month program",
        deadline: "15 Jan 2024",
        shariaCompliant: true,
        suitableFor: {
          businessTypes: ["startup", "scale-up", "social-enterprise"],
          industrySectors: ["tech", "food", "retail", "finance", "healthcare"],
          teamSizes: ["micro", "small"],
          fundingStages: ["seed", "early", "growth"],
          growthGoals: ["funding", "expansion", "advisory", "digital"]
        }
      },
      {
        name: "Halal Investment Fund",
        type: "funding",
        description: "Equity investment for businesses following ethical financial principles, with a focus on long-term growth.",
        applyUrl: "https://halalinvestmentfund.com/",
        applyText: "Request Investment",
        amount: "£50,000 - £1,000,000",
        shariaCompliant: true,
        suitableFor: {
          businessTypes: ["scale-up", "established", "family-business"],
          industrySectors: ["tech", "food", "healthcare", "education", "manufacturing", "retail"],
          teamSizes: ["small", "medium"],
          fundingStages: ["growth", "established"],
          growthGoals: ["funding", "expansion"]
        }
      },
      {
        name: "Ethical Tech Alliance",
        type: "networking",
        description: "A community of technology businesses committed to ethical product development and responsible innovation.",
        applyUrl: "https://ethicaltechalliance.org/",
        applyText: "Join Alliance",
        location: "Online + quarterly events in major cities",
        shariaCompliant: true,
        suitableFor: {
          businessTypes: ["startup", "scale-up", "established"],
          industrySectors: ["tech", "creative"],
          teamSizes: ["all"],
          fundingStages: ["all"],
          growthGoals: ["networking", "digital", "products"]
        }
      },
      {
        name: "Community Business Grant",
        type: "funding",
        description: "Grant funding for businesses that create positive impact in their local communities.",
        applyUrl: "https://communitybusinessfund.co.uk/",
        applyText: "Check Eligibility",
        amount: "Up to £50,000",
        deadline: "Rolling applications",
        shariaCompliant: true,
        suitableFor: {
          businessTypes: ["social-enterprise", "startup", "family-business"],
          industrySectors: ["food", "retail", "education", "healthcare", "creative", "professional"],
          teamSizes: ["solo", "micro", "small"],
          fundingStages: ["pre-revenue", "seed", "early"],
          growthGoals: ["funding", "expansion", "products"]
        }
      },
      {
        name: "Export Growth Service",
        type: "advisory",
        description: "Specialized advice and support for businesses looking to expand internationally in an ethical way.",
        applyUrl: "https://exportgrowth.service/",
        applyText: "Book Consultation",
        shariaCompliant: true,
        suitableFor: {
          businessTypes: ["scale-up", "established"],
          industrySectors: ["all"],
          teamSizes: ["small", "medium", "large"],
          fundingStages: ["growth", "established"],
          growthGoals: ["expansion", "advisory"]
        }
      },
      {
        name: "Digital Skills Training Grant",
        type: "training",
        description: "Funding for staff training in digital skills, with a focus on ethical and responsible tech adoption.",
        applyUrl: "https://digitalskillstraining.org/",
        applyText: "Apply for Training",
        amount: "50% of costs up to £5,000",
        shariaCompliant: true,
        suitableFor: {
          businessTypes: ["all"],
          industrySectors: ["all"],
          teamSizes: ["micro", "small", "medium"],
          fundingStages: ["all"],
          growthGoals: ["digital", "advisory"]
        }
      }
    ];

    // Check if support resources already exist
    const existingResources = await db.select().from(supportResources);
    
    if (existingResources.length === 0) {
      console.log("Inserting support resources...");
      await db.insert(supportResources).values(supportData);
      console.log(`✅ Inserted ${supportData.length} support resources`);
    } else {
      console.log(`⏭️ Skipping support resources seeding, ${existingResources.length} resources already exist`);
    }

    console.log("✅ Seeding completed successfully");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  }
}

seed();
