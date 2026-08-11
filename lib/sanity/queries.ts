import { groq } from 'next-sanity';

// ── Page Section Singletons ──
export const HERO_SECTION_QUERY = groq`*[_type == "heroSection" && _id == "heroSection"][0]`;
export const BRANDING_SECTION_QUERY = groq`*[_type == "brandingSection" && _id == "brandingSection"][0]`;
export const FOUNDER_SECTION_QUERY = groq`*[_type == "founderSection" && _id == "founderSection"][0]`;
export const GALLERY_SECTION_QUERY = groq`*[_type == "gallerySection" && _id == "gallerySection"][0]`;
export const CONTACT_SECTION_QUERY = groq`*[_type == "contactSection" && _id == "contactSection"][0]`;
export const FOOTER_SECTION_QUERY = groq`*[_type == "footerSection" && _id == "footerSection"][0]`;

// ── Content Lists ──
export const SERVICES_QUERY = groq`*[_type == "service"] | order(order asc){ _id, title, image }`;

export const FRAMES_QUERY = groq`*[_type == "frame"] | order(order asc){ _id, code, label, size, image }`;

export const LENSES_QUERY = groq`*[_type == "lens"] | order(order asc){ _id, code, label, image }`;

export const CONTACT_LENS_QUERY = groq`*[_type == "contactLensProduct"] | order(order asc){ _id, code, label, description, icon, image }`;

export const COLLECTIONS_QUERY = groq`*[_type == "collectionItem"] | order(order asc){ _id, icon, title, description, image }`;

export const TESTIMONIALS_QUERY = groq`*[_type == "testimonial"] | order(order asc){ _id, name, role, quote, photo }`;

export const FAQS_QUERY = groq`*[_type == "faqItem"] | order(order asc){ _id, question, answer }`;
