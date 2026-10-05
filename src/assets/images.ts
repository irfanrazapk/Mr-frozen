// Centralized product & brand imagery registry
import heroFeastImg from './images/hero_frozen_feast_1791189764564.jpg';
import shamiKebabImg from './images/product_shami_kebab_1791189781292.jpg';
import chickenNuggetsImg from './images/product_chicken_nuggets_1791189802779.jpg';
import seekhKebabImg from './images/product_seekh_kebab_1791189813576.jpg';
import tenderPopsImg from './images/product_tender_pops_1791189826702.jpg';

const toSrc = (img: any): string => {
  if (typeof img === 'string') return img;
  if (img && typeof img === 'object' && 'src' in img) return img.src;
  return '/images/hero_feast.jpg';
};

export const brandImages = {
  heroBanner: toSrc(heroFeastImg),
  products: {
    chickenShamiKebab: toSrc(shamiKebabImg),
    beefShamiKebab: toSrc(shamiKebabImg),
    chickenNuggets: toSrc(chickenNuggetsImg),
    chickenSeekhKebab: toSrc(seekhKebabImg),
    chickenTenderPops: toSrc(tenderPopsImg),
    plainParatha: toSrc(heroFeastImg),
    crispyFries: toSrc(chickenNuggetsImg),
    cheeseBalls: toSrc(tenderPopsImg),
  }
};
