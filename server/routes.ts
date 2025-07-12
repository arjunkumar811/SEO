import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { urlAnalysisSchema, insertSeoAnalysisSchema } from "@shared/schema";
import axios from "axios";
import * as cheerio from "cheerio";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/analyze-seo", async (req, res) => {
    try {
      const { url } = urlAnalysisSchema.parse(req.body);
      
      // Fetch website HTML
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        timeout: 10000
      });
      
      const html = response.data;
      const $ = cheerio.load(html);
      
      // Extract meta tags
      const title = $('title').text() || $('meta[property="og:title"]').attr('content') || '';
      const description = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || '';
      
      // Extract Open Graph tags
      const ogTags: Record<string, string> = {};
      $('meta[property^="og:"]').each((_, element) => {
        const property = $(element).attr('property');
        const content = $(element).attr('content');
        if (property && content) {
          ogTags[property] = content;
        }
      });
      
      // Extract Twitter Card tags
      const twitterTags: Record<string, string> = {};
      $('meta[name^="twitter:"]').each((_, element) => {
        const name = $(element).attr('name');
        const content = $(element).attr('content');
        if (name && content) {
          twitterTags[name] = content;
        }
      });
      
      // Calculate SEO score and recommendations
      const analysis = analyzeSEO(title, description, ogTags, twitterTags);
      
      // Store analysis
      const seoAnalysis = await storage.createSeoAnalysis({
        url,
        title,
        description,
        ogTags,
        twitterTags,
        score: analysis.score,
        recommendations: analysis.recommendations
      });
      
      res.json({
        ...seoAnalysis,
        analysis: {
          titleAnalysis: analysis.titleAnalysis,
          descriptionAnalysis: analysis.descriptionAnalysis,
          ogAnalysis: analysis.ogAnalysis,
          twitterAnalysis: analysis.twitterAnalysis
        }
      });
    } catch (error) {
      console.error('SEO Analysis Error:', error);
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Failed to analyze website SEO' });
      }
    }
  });
  
  app.get("/api/seo-analysis/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const analysis = await storage.getSeoAnalysis(id);
      
      if (!analysis) {
        return res.status(404).json({ message: 'Analysis not found' });
      }
      
      res.json(analysis);
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve analysis' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

function analyzeSEO(title: string, description: string, ogTags: Record<string, string>, twitterTags: Record<string, string>) {
  const recommendations: string[] = [];
  let score = 0;
  
  // Title analysis
  const titleAnalysis = {
    length: title.length,
    status: 'good' as 'good' | 'warning' | 'error',
    message: ''
  };
  
  if (title.length === 0) {
    titleAnalysis.status = 'error';
    titleAnalysis.message = 'Title tag is missing';
    recommendations.push('Add a title tag to your page');
  } else if (title.length < 30) {
    titleAnalysis.status = 'warning';
    titleAnalysis.message = 'Title is too short';
    recommendations.push('Extend title to 30-60 characters');
  } else if (title.length > 60) {
    titleAnalysis.status = 'warning';
    titleAnalysis.message = 'Title is too long';
    recommendations.push('Shorten title to under 60 characters');
  } else {
    titleAnalysis.status = 'good';
    titleAnalysis.message = 'Title length is optimal';
    score += 25;
  }
  
  // Description analysis
  const descriptionAnalysis = {
    length: description.length,
    status: 'good' as 'good' | 'warning' | 'error',
    message: ''
  };
  
  if (description.length === 0) {
    descriptionAnalysis.status = 'error';
    descriptionAnalysis.message = 'Meta description is missing';
    recommendations.push('Add a meta description to your page');
  } else if (description.length < 120) {
    descriptionAnalysis.status = 'warning';
    descriptionAnalysis.message = 'Description is too short';
    recommendations.push('Extend meta description to 120-160 characters');
  } else if (description.length > 160) {
    descriptionAnalysis.status = 'warning';
    descriptionAnalysis.message = 'Description is too long';
    recommendations.push('Shorten meta description to under 160 characters');
  } else {
    descriptionAnalysis.status = 'good';
    descriptionAnalysis.message = 'Description length is optimal';
    score += 25;
  }
  
  // Open Graph analysis
  const requiredOgTags = ['og:title', 'og:description', 'og:image', 'og:url'];
  const presentOgTags = requiredOgTags.filter(tag => ogTags[tag]);
  
  const ogAnalysis = {
    present: presentOgTags.length,
    total: requiredOgTags.length,
    status: presentOgTags.length === requiredOgTags.length ? 'good' : 
           presentOgTags.length >= 2 ? 'warning' : 'error' as 'good' | 'warning' | 'error',
    message: presentOgTags.length === requiredOgTags.length ? 
      'All essential Open Graph tags are present' :
      `Missing ${requiredOgTags.length - presentOgTags.length} Open Graph tags`
  };
  
  if (ogAnalysis.status === 'good') {
    score += 25;
  } else if (ogAnalysis.status === 'warning') {
    score += 15;
    recommendations.push('Add missing Open Graph tags for better social sharing');
  } else {
    recommendations.push('Add Open Graph tags for social media sharing');
  }
  
  // Twitter Cards analysis
  const requiredTwitterTags = ['twitter:card', 'twitter:title', 'twitter:description'];
  const presentTwitterTags = requiredTwitterTags.filter(tag => twitterTags[tag]);
  
  const twitterAnalysis = {
    present: presentTwitterTags.length,
    total: requiredTwitterTags.length,
    status: presentTwitterTags.length === requiredTwitterTags.length ? 'good' : 
           presentTwitterTags.length >= 1 ? 'warning' : 'error' as 'good' | 'warning' | 'error',
    message: presentTwitterTags.length === requiredTwitterTags.length ? 
      'All essential Twitter Card tags are present' :
      `Missing ${requiredTwitterTags.length - presentTwitterTags.length} Twitter Card tags`
  };
  
  if (twitterAnalysis.status === 'good') {
    score += 25;
  } else if (twitterAnalysis.status === 'warning') {
    score += 10;
    recommendations.push('Add missing Twitter Card tags for better social sharing');
  } else {
    recommendations.push('Add Twitter Card meta tags for social media sharing');
  }
  
  return {
    score,
    recommendations,
    titleAnalysis,
    descriptionAnalysis,
    ogAnalysis,
    twitterAnalysis
  };
}
