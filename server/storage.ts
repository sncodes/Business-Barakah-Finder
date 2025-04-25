import { db } from "@db";
import { 
  businessProfiles, 
  supportResources, 
  matches, 
  emailLogs, 
  type BusinessProfile,
  type InsertBusinessProfile,
  type Support,
  type Match
} from "@shared/schema";
import { eq, desc, and, inArray, or } from "drizzle-orm";

// Storage service for database operations
export const storage = {
  // Business Profile operations
  async createBusinessProfile(data: InsertBusinessProfile): Promise<BusinessProfile> {
    const [newProfile] = await db.insert(businessProfiles)
      .values(data)
      .returning();
    return newProfile;
  },

  async updateBusinessProfileEmail(id: number, email: string): Promise<void> {
    await db.update(businessProfiles)
      .set({ email })
      .where(eq(businessProfiles.id, id));
  },

  async getMostRecentBusinessProfile(): Promise<BusinessProfile | undefined> {
    const profiles = await db.select()
      .from(businessProfiles)
      .orderBy(desc(businessProfiles.createdAt))
      .limit(1);
    
    return profiles[0];
  },

  async getBusinessProfileById(id: number): Promise<BusinessProfile | undefined> {
    const profiles = await db.select()
      .from(businessProfiles)
      .where(eq(businessProfiles.id, id))
      .limit(1);
    
    return profiles[0];
  },

  // Support Resources operations
  async getAllSupportResources(): Promise<Support[]> {
    return await db.select().from(supportResources);
  },

  async getSupportResourceById(id: number): Promise<Support | undefined> {
    const resources = await db.select()
      .from(supportResources)
      .where(eq(supportResources.id, id))
      .limit(1);
    
    return resources[0];
  },

  // Matching operations
  async findMatches(businessProfileId: number): Promise<Match[]> {
    // Get the business profile
    const profile = await this.getBusinessProfileById(businessProfileId);
    
    if (!profile) {
      throw new Error("Business profile not found");
    }

    // Get all support resources
    const allResources = await this.getAllSupportResources();
    
    // Calculate match scores and insert matches
    const matchEntries: { 
      businessProfileId: number, 
      supportResourceId: number, 
      matchScore: number,
      insights?: string[] 
    }[] = [];

    const matchedInsights: Record<number, string[]> = {};
    
    for (const resource of allResources) {
      const matchScore = this.calculateMatchScore(profile, resource);
      
      // Only create a match if the score is above a threshold (e.g., 50)
      if (matchScore >= 50) {
        matchEntries.push({
          businessProfileId,
          supportResourceId: resource.id,
          matchScore
        });
        
        // Generate insights specific to this match
        const insights = this.generateMatchSpecificInsights(profile, resource);
        if (insights.length > 0) {
          matchedInsights[resource.id] = insights;
        }
      }
    }
    
    // Insert matches into database
    const insertedMatches = await db.insert(matches)
      .values(matchEntries)
      .returning();
    
    // Update matches with insights
    for (const match of insertedMatches) {
      if (matchedInsights[match.supportResourceId]) {
        await db.update(matches)
          .set({ insights: matchedInsights[match.supportResourceId] })
          .where(eq(matches.id, match.id));
      }
    }
    
    return insertedMatches;
  },

  async getMatchesForProfile(businessProfileId: number): Promise<Match[]> {
    return await db.select()
      .from(matches)
      .where(eq(matches.businessProfileId, businessProfileId))
      .orderBy(desc(matches.matchScore));
  },

  async getSupportResourcesForMatches(matchResults: Match[]): Promise<Support[]> {
    if (matchResults.length === 0) {
      return [];
    }
    
    const supportIds = matchResults.map(match => match.supportResourceId);
    
    return await db.select()
      .from(supportResources)
      .where(inArray(supportResources.id, supportIds));
  },

  async generateInsights(businessProfileId: number): Promise<string[]> {
    // Get the business profile
    const profile = await this.getBusinessProfileById(businessProfileId);
    
    if (!profile) {
      throw new Error("Business profile not found");
    }
    
    // Generate general insights based on the business profile
    const generalInsights = this.generateGeneralInsights(profile);
    
    // Get match-specific insights
    const matchResults = await this.getMatchesForProfile(businessProfileId);
    const allInsights: string[] = [...generalInsights];
    
    // Combine all insights from matches
    for (const match of matchResults) {
      if (match.insights && match.insights.length > 0) {
        allInsights.push(...match.insights);
      }
    }
    
    // Update the matches with combined insights
    await db.update(matches)
      .set({ insights: allInsights })
      .where(eq(matches.businessProfileId, businessProfileId));
    
    return allInsights;
  },

  async getInsightsForProfile(businessProfileId: number): Promise<string[]> {
    // Get the first match for the profile (which should have all insights)
    const matchResults = await db.select()
      .from(matches)
      .where(eq(matches.businessProfileId, businessProfileId))
      .limit(1);
    
    if (matchResults.length === 0 || !matchResults[0].insights) {
      // If no match exists or no insights, generate them now
      return await this.generateInsights(businessProfileId);
    }
    
    return matchResults[0].insights;
  },

  // Email log operations
  async logEmailSent(email: string, businessProfileId: number, success: boolean, errorMessage?: string): Promise<void> {
    await db.insert(emailLogs)
      .values({
        email,
        businessProfileId,
        success,
        errorMessage: errorMessage || null
      });
  },

  // Helper methods for calculating matches and generating insights
  calculateMatchScore(profile: BusinessProfile, resource: Support): number {
    let score = 0;
    const suitableFor = resource.suitableFor;
    
    // Check business type match
    if (suitableFor.businessTypes.includes(profile.businessType)) {
      score += 20;
    }
    
    // Check industry sector match
    if (suitableFor.industrySectors.includes(profile.industrySector) || 
        suitableFor.industrySectors.includes('all')) {
      score += 20;
    }
    
    // Check team size match
    if (suitableFor.teamSizes.includes(profile.teamSize) || 
        suitableFor.teamSizes.includes('all')) {
      score += 15;
    }
    
    // Check funding stage match
    if (suitableFor.fundingStages.includes(profile.fundingStage) || 
        suitableFor.fundingStages.includes('all')) {
      score += 15;
    }
    
    // Check growth goals match (points for each matching goal)
    const matchingGoals = profile.growthGoals.filter(goal => 
      suitableFor.growthGoals.includes(goal)
    );
    
    score += matchingGoals.length * 10;
    
    // Cap the score at 100
    return Math.min(score, 100);
  },

  generateGeneralInsights(profile: BusinessProfile): string[] {
    const insights: string[] = [];
    
    // Insights based on business type
    if (profile.businessType === 'startup') {
      insights.push('Consider exploring profit-sharing models for investment rather than traditional interest-based funding');
      insights.push('As a startup, building a strong ethical foundation now will make growth easier as you scale');
    } else if (profile.businessType === 'scale-up') {
      insights.push('Scale-ups often benefit from structured mentorship programs that provide both business and ethical guidance');
      insights.push('Consider partnering with aligned businesses to share resources and reduce costs');
    } else if (profile.businessType === 'social-enterprise') {
      insights.push('Social enterprises can often access special funding opportunities focused on community impact');
      insights.push('Measuring and reporting your social impact can strengthen applications for ethical business support');
    }
    
    // Insights based on industry
    if (profile.industrySector === 'tech') {
      insights.push('Ethical technology businesses often find success with B-Corp certification, which can open doors to aligned investors');
      insights.push('Tech businesses should consider how their products promote digital inclusion and access');
    } else if (profile.industrySector === 'food') {
      insights.push('Food businesses with ethical sourcing and transparent supply chains often qualify for specialized support programs');
      insights.push('Consider halal certification to expand your market reach and qualify for specialized funding');
    } else if (profile.industrySector === 'finance') {
      insights.push('Financial businesses should explore Islamic finance principles to broaden their ethical offering');
      insights.push('Consider joining specialized networks for ethical finance professionals');
    }
    
    // Insights based on team size
    if (profile.teamSize === 'solo' || profile.teamSize === 'micro') {
      insights.push('Small teams should leverage community resources and shared workspaces to reduce overhead costs');
      insights.push('Consider joining an incubator that specializes in ethical business practices');
    } else if (profile.teamSize === 'small') {
      insights.push('Your sector typically sees growth challenges around the 15-employee mark – investing in management structures now could help');
      insights.push('Businesses of your size often benefit from peer-learning networks with similar-sized organizations');
    }
    
    // Insights based on funding stage
    if (profile.fundingStage === 'pre-revenue' || profile.fundingStage === 'seed') {
      insights.push('Early-stage businesses should focus on building relationships with ethical investors before they need capital');
      insights.push('Consider crowd-funding platforms that align with ethical finance principles');
    } else if (profile.fundingStage === 'growth') {
      insights.push('Growth-stage businesses often need to balance scaling operations with maintaining their ethical standards');
      insights.push('Consider engaging with specialized ethical business accelerators');
    }
    
    // Insights based on growth goals
    if (profile.growthGoals.includes('funding')) {
      insights.push('When seeking funding, prepare to clearly articulate how your ethical principles create business value');
      insights.push('Different types of funding have different implications for your business control - research thoroughly');
    }
    
    if (profile.growthGoals.includes('expansion')) {
      insights.push('When expanding to new markets, consider partnering with local businesses that share your ethical values');
      insights.push('International expansion often benefits from cultural advisors who understand ethical business practices in target markets');
    }
    
    // Limit to 4 random insights to avoid overwhelming the user
    return this.getRandomElements(insights, 4);
  },

  generateMatchSpecificInsights(profile: BusinessProfile, resource: Support): string[] {
    const insights: string[] = [];
    
    // Generate insights specific to the match between profile and resource
    if (resource.type === 'funding' && profile.growthGoals.includes('funding')) {
      insights.push(`${resource.name} offers funding that aligns with ethical finance principles, which matches your funding goals`);
    }
    
    if (resource.type === 'mentorship' && profile.growthGoals.includes('advisory')) {
      insights.push(`The mentorship from ${resource.name} can help address the common challenges in your business stage`);
    }
    
    if (resource.type === 'networking' && profile.growthGoals.includes('networking')) {
      insights.push(`${resource.name} has a specific network for businesses in your industry that meets regularly`);
    }
    
    if (resource.shariaCompliant) {
      insights.push(`${resource.name} is fully compliant with ethical finance principles, making it suitable for your business values`);
    }
    
    return insights;
  },

  getRandomElements<T>(array: T[], n: number): T[] {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
  }
};
