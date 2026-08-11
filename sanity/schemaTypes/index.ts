import { heroSection } from './heroSection';
import { brandingSection } from './brandingSection';
import { founderSection } from './founderSection';
import { contactSection } from './contactSection';
import { footerSection } from './footerSection';
import { gallerySection } from './gallerySection';
import { service } from './service';
import { frame } from './frame';
import { lens } from './lens';
import { contactLensProduct } from './contactLensProduct';
import { collectionItem } from './collectionItem';
import { testimonial } from './testimonial';
import { faqItem } from './faqItem';

export const schemaTypes = [
  // Page sections (singletons)
  heroSection,
  brandingSection,
  founderSection,
  gallerySection,
  contactSection,
  footerSection,
  // Content types
  service,
  frame,
  lens,
  contactLensProduct,
  collectionItem,
  testimonial,
  faqItem,
];
