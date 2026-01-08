// Strapi API Configuration
// This module implements a resilient Strapi integration that ensures the website
// remains functional even when Strapi CMS is down or unavailable.

const STRAPI_URL = import.meta.env.PUBLIC_STRAPI_URL;
const STRAPI_TOKEN = import.meta.env.STRAPI_API_TOKEN;

// Log configuration status
if (!STRAPI_URL) {
  console.warn(
    '⚠️  PUBLIC_STRAPI_URL not set - using placeholder content for preview.\n' +
    'Set PUBLIC_STRAPI_URL in your .env file to fetch real content from Strapi.\n' +
    'Example: PUBLIC_STRAPI_URL=https://your-strapi-instance.com'
  );
} else {
  console.log(`✓ Strapi URL configured: ${STRAPI_URL}`);
}

// TypeScript Interfaces
export interface StrapiImageFormat {
  url: string;
  width: number;
  height: number;
}

export interface StrapiImageData {
  id: number;
  attributes: {
    url: string;
    alternativeText?: string;
    width: number;
    height: number;
    formats?: {
      thumbnail?: StrapiImageFormat;
      small?: StrapiImageFormat;
      medium?: StrapiImageFormat;
      large?: StrapiImageFormat;
    };
  };
}

export interface StrapiImage {
  data: StrapiImageData | null;
}

export interface CuisineData {
  id: number;
  attributes: {
    name: string;
  };
}

export interface CuisineRelation {
  data: CuisineData | null;
}

export interface MenuItemAttributes {
  name: string;
  description: string;
  price: number;
  isMadeToOrder: boolean;
  image: StrapiImage;
  cuisine: CuisineRelation;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

export interface MenuItem {
  id: number;
  attributes: MenuItemAttributes;
}

export interface StrapiResponse<T> {
  data: T[];
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Homepage Hero Section Types
export interface HeroSection {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: StrapiImage;
  primaryCtaText?: string;
  primaryCtaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
}

export interface HomepageAttributes {
  heroSection: HeroSection;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

export interface HomepageResponse {
  data: {
    id: number;
    attributes: HomepageAttributes;
  } | null;
  meta?: Record<string, unknown>;
}

export async function fetchStrapi<T = MenuItem>(endpoint: string): Promise<StrapiResponse<T>> {
  // If no Strapi URL configured, return empty data immediately
  if (!STRAPI_URL) {
    if (import.meta.env.DEV) {
      console.log(`ℹ️  Strapi not configured - returning empty data for ${endpoint}`);
    }
    return { data: [], meta: {} };
  }

  const url = `${STRAPI_URL}/api/${endpoint}?populate[image][fields][0]=url&populate[image][fields][1]=alternativeText&populate[image][fields][2]=formats&populate[cuisine][fields][0]=name`;
  
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    // Add authentication if token is available
    if (STRAPI_TOKEN) {
      headers['Authorization'] = `Bearer ${STRAPI_TOKEN}`;
    }
    
    const response = await fetch(url, { 
      headers,
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });
    
    if (!response.ok) {
      // Provide specific error messages based on status code
      let errorMessage = `Failed to fetch from Strapi: ${response.statusText}`;
      
      if (response.status === 404) {
        errorMessage = `Endpoint not found: ${endpoint}`;
      } else if (response.status === 401) {
        errorMessage = 'Authentication required. Please check your API token.';
      } else if (response.status === 403) {
        errorMessage = 'Access forbidden. Your API token may not have the required permissions.';
      } else if (response.status >= 500) {
        errorMessage = 'Strapi server error. Please try again later.';
      }
      
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    
    if (import.meta.env.DEV) {
      console.log(`✓ Successfully fetched ${data?.data?.length || 0} items from ${endpoint}`);
    }
    
    return data;
  } catch (error) {
    // Log detailed error in development, minimal in production
    if (import.meta.env.DEV) {
      console.error(`❌ Strapi fetch error for ${endpoint}:`, error);
      console.log('→ Returning empty data - pages will use fallback content');
    } else {
      // In production, just log that we're using fallback
      console.log(`Using fallback content for ${endpoint} (Strapi unavailable)`);
    }
    
    // Return empty data instead of throwing - allows graceful fallback
    return { data: [], meta: {} };
  }
}

// Fetch single type (like homepage)
export async function fetchStrapiSingle(endpoint: string): Promise<HomepageResponse> {
  // If no Strapi URL configured, return null data immediately
  if (!STRAPI_URL) {
    if (import.meta.env.DEV) {
      console.log(`ℹ️  Strapi not configured - returning null data for ${endpoint}`);
    }
    return { data: null, meta: {} };
  }

  const url = `${STRAPI_URL}/api/${endpoint}?populate[heroSection][populate]=heroImage`;
  
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (STRAPI_TOKEN) {
      headers['Authorization'] = `Bearer ${STRAPI_TOKEN}`;
    }
    
    const response = await fetch(url, { 
      headers,
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });
    
    if (!response.ok) {
      let errorMessage = `Failed to fetch ${endpoint}: ${response.statusText}`;
      
      if (response.status === 404) {
        errorMessage = `Endpoint not found: ${endpoint}`;
      } else if (response.status === 401) {
        errorMessage = 'Authentication required. Please check your API token.';
      } else if (response.status === 403) {
        errorMessage = 'Access forbidden. Your API token may not have the required permissions.';
      } else if (response.status >= 500) {
        errorMessage = 'Strapi server error. Please try again later.';
      }
      
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    
    if (import.meta.env.DEV) {
      console.log(`✓ Successfully fetched ${endpoint}`);
    }
    
    return data;
  } catch (error) {
    // Log detailed error in development, minimal in production
    if (import.meta.env.DEV) {
      console.error(`❌ Strapi fetch error for ${endpoint}:`, error);
      console.log('→ Returning null data - pages will use fallback content');
    } else {
      console.log(`Using fallback content for ${endpoint} (Strapi unavailable)`);
    }
    
    // Return null data instead of throwing - allows graceful fallback
    return { data: null, meta: {} };
  }
}

// Download image from Strapi and save it locally during build
// This ensures images are cached and the site works even when Strapi is down
export async function downloadStrapiImage(url: string | undefined | null): Promise<string | null> {
  if (!url) {
    if (import.meta.env.DEV) {
      console.log('ℹ️  No image URL provided, returning null');
    }
    return null;
  }
  
  // In development mode, use the full Strapi URL directly
  if (import.meta.env.DEV) {
    return getStrapiMedia(url);
  }
  
  // If it's a relative URL, make it absolute
  const fullUrl = url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
  
  // In build mode, download and cache images locally
  if (import.meta.env.PROD || import.meta.env.MODE === 'production') {
    try {
      // Extract filename from URL
      const urlPath = new URL(fullUrl).pathname;
      const filename = urlPath.split('/').pop();
      
      if (!filename) {
        console.warn(`⚠️  Could not extract filename from URL: ${fullUrl}`);
        return fullUrl; // Fallback to remote URL
      }
      
      // Download the image
      const response = await fetch(fullUrl);
      if (!response.ok) {
        console.warn(`⚠️  Failed to download image (${response.status}): ${fullUrl}`);
        return fullUrl; // Fallback to remote URL
      }
      
      // Get the image buffer
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      // Create uploads directory if it doesn't exist
      const fs = await import('fs');
      const path = await import('path');
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      
      // Save the image
      const localPath = path.join(uploadsDir, filename);
      fs.writeFileSync(localPath, buffer);
      
      console.log(`✓ Downloaded image: ${filename}`);
      
      // Return the local path (relative to public folder)
      return `/uploads/${filename}`;
    } catch (error) {
      console.error(`❌ Error downloading image ${fullUrl}:`, error);
      // Fallback to remote URL on error
      return fullUrl;
    }
  }
  
  // Should not reach here, but return full URL as fallback
  return getStrapiMedia(url);
}

export function getStrapiMedia(url: string | undefined | null): string | null {
  if (!url) return null;
  
  // If the URL is already absolute, return it
  if (url.startsWith('http')) {
    return url;
  }
  
  // If no Strapi URL configured, return null
  if (!STRAPI_URL) {
    return null;
  }
  
  // Otherwise, prepend the Strapi URL
  return `${STRAPI_URL}${url}`;
}
