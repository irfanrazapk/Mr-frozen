/**
 * MR. FROZEN - CENTRALIZED THEME COLOR CONFIGURATION
 * 
 * Changing color tokens in this single file updates the entire website:
 * Header, Hero, Product Cards, Buttons, Badges, Footer, Admin, Cart, Checkout, etc.
 * 
 * Approximate brand color direction from official Mr. Frozen references:
 * - Primary Dark Green: #075B45
 * - Secondary Forest Green: #0B6B4F
 * - Leaf Green: #54A82F
 * - Light Green Accent: #EAF5E5
 * - Cream / Warm White: #FAFAF5
 * - Pure White: #FFFFFF
 * - Text Primary: #12352B
 */

export interface ThemeColors {
  primary: string;
  primaryHover: string;
  secondary: string;
  secondaryHover: string;
  leafGreen: string;
  leafGreenHover: string;
  lightGreen: string;
  cream: string;
  white: string;
  textDark: string;
  textMuted: string;
  textSubtle: string;
  surfaceCard: string;
  surfaceMuted: string;
  borderColor: string;
  borderLight: string;
  accent: string;
  badgeBg: string;
  badgeText: string;
  success: string;
  warning: string;
  error: string;
}

export const themeConfig = {
  brand: {
    name: 'MR. FROZEN',
    tagline: 'GOOD FOOD • FROZEN FRESH',
  },
  colors: {
    // Brand primary greens
    primary: '#075B45',        // Deep Forest Green
    primaryHover: '#054836',   // Slightly darker forest green
    secondary: '#0B6B4F',      // Secondary Forest Green
    secondaryHover: '#08533d', 
    leafGreen: '#54A82F',      // Fresh Leaf Green
    leafGreenHover: '#469125', 
    lightGreen: '#EAF5E5',     // Fresh crisp pale green background
    
    // Neutrals & Surfaces
    cream: '#FAFAF5',          // Warm off-white page background
    white: '#FFFFFF',          // Crisp pure white for cards & popups
    textDark: '#12352B',       // Deep rich forest-black text
    textMuted: '#476358',      // Muted pine text
    textSubtle: '#78958A',     // Subtle text for timestamps & hints
    surfaceCard: '#FFFFFF',    // Standard card background
    surfaceMuted: '#F4F7F2',   // Secondary surface for table rows & light sections
    
    // Borders & Accents
    borderColor: '#DFE8DB',    // Gentle natural divider
    borderLight: '#EDF2EA',    // Hairline divider
    accent: '#54A82F',         // Highlight & active indicator
    
    // Status & Utility
    badgeBg: '#EAF5E5',
    badgeText: '#075B45',
    success: '#1B8755',
    warning: '#D97706',
    error: '#DC2626',
  } satisfies ThemeColors,
  fonts: {
    display: "'Outfit', 'Plus Jakarta Sans', sans-serif",
    body: "'Plus Jakarta Sans', sans-serif",
  },
  radii: {
    button: '0.75rem',  // rounded-xl
    card: '1rem',       // rounded-2xl
    badge: '0.5rem',    // rounded-lg
  }
};

/**
 * Returns CSS variable declarations to inject into :root
 */
export function getThemeCssVariables(): string {
  const { colors } = themeConfig;
  return `
    --brand-primary: ${colors.primary};
    --brand-primary-hover: ${colors.primaryHover};
    --brand-secondary: ${colors.secondary};
    --brand-secondary-hover: ${colors.secondaryHover};
    --brand-leaf: ${colors.leafGreen};
    --brand-leaf-hover: ${colors.leafGreenHover};
    --brand-light: ${colors.lightGreen};
    --surface-cream: ${colors.cream};
    --surface-white: ${colors.white};
    --text-dark: ${colors.textDark};
    --text-muted: ${colors.textMuted};
    --text-subtle: ${colors.textSubtle};
    --surface-card: ${colors.surfaceCard};
    --surface-muted: ${colors.surfaceMuted};
    --border-main: ${colors.borderColor};
    --border-light: ${colors.borderLight};
    --accent-main: ${colors.accent};
    --status-success: ${colors.success};
    --status-warning: ${colors.warning};
    --status-error: ${colors.error};
  `;
}
