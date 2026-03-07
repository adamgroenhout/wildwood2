import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const pages = defineCollection({
  loader: glob({ pattern: '*.json', base: 'src/content' }),
  schema: z.object({
    // Common fields
    title: z.string().optional(),
    seo_title: z.string().optional(),
    subtitle: z.string().optional(),
    
    // settings.json specific
    site_name: z.string().optional(),
    site_title: z.string().optional(),
    site_description: z.string().optional(),
    tagline: z.string().optional(),
    logo: z.string().optional(),
    header_cta_text: z.string().optional(),
    header_cta_href: z.string().optional(),
    navigation: z.array(z.object({
      name: z.string(),
      href: z.string(),
      subItems: z.array(z.object({
        name: z.string(),
        href: z.string()
      })).optional()
    })).optional(),
    footer_columns: z.array(z.object({
      title: z.string(),
      links: z.array(z.object({
        name: z.string(),
        href: z.string()
      }))
    })).optional(),

    // homepage.json specific
    hero_title: z.string().optional(),
    hero_image: z.string().optional(),
    hero_alt: z.string().optional(),
    cta_text: z.string().optional(),
    cta_url: z.string().optional(),
    specialties: z.array(z.object({
      name: z.string(),
      url: z.string()
    })).optional(),
    resources_items: z.array(z.object({
      title: z.string(),
      content: z.string()
    })).optional(),
    is_this_you_items: z.array(z.object({
      title: z.string(),
      subtitle: z.string().optional(),
      body: z.string()
    })).optional(),
    how_to_start_items: z.array(z.object({
      number: z.string(),
      title: z.string(),
      text: z.string()
    })).optional(),

    // Catch-all for other fields
  }).passthrough()
});

const services = defineCollection({
  loader: glob({ pattern: '*.json', base: 'src/content/services' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    seo_title: z.string(),
    sections: z.array(z.discriminatedUnion('type', [
      z.object({
        type: z.literal('text'),
        title: z.string().optional(),
        body: z.string(),
        style: z.enum(['standard', 'highlighted']).optional()
      }),
      z.object({
        type: z.literal('list'),
        title: z.string().optional(),
        items: z.array(z.string())
      })
    ])),
    cta_text: z.string(),
    cta_url: z.string()
  })
});

export const collections = { pages, services };
