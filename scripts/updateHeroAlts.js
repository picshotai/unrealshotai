#!/usr/bin/env node
/**
 * Update alt tags in HeroSection.tsx image arrays across landing pages with contextual, SEO-friendly variations.
 * - Generates unique alt text per image using category-specific descriptors
 * - Keeps page keyword context (derived from directory)
 * - Safely scopes replacement to the `const images = [ ... ]` block only
 */

const fs = require('fs');
const path = require('path');

const root = '/Users/kishanchaudhary/Music/dodostarter/components/landing';

const dirKeywordMap = {
  'ai-bat-mitzvah-photoshoot': 'AI Bat Mitzvah Photoshoot',
  'ai-chef-headshots': 'AI Chef Headshots',
  'ai-christmas-photoshoot': 'AI Christmas Photoshoot',
  'ai-dating-photoshoot': 'AI Dating Photoshoot',
  'ai-diwali-photoshoot': 'AI Diwali Photoshoot',
  'ai-fantasy-photoshoot': 'AI Fantasy Photoshoot',
  'ai-glamour-photoshoot': 'AI Glamour Photoshoot',
  'ai-halloween-photoshoot': 'AI Halloween Photoshoot',
  'ai-influencer-generator': 'AI Influencer Portraits',
  'ai-instagram-photoshoot': 'AI Instagram Photoshoot',
  'ai-maternity-photoshoot': 'AI Maternity Photoshoot',
  'ai-real-estate-headshots': 'AI Real Estate Headshots',
  'ai-speaker-photoshoot': 'AI Speaker Photoshoot',
  'ai-yearbook': 'AI Yearbook Portraits',
  'black-swan-photoshoot': 'Black Swan Photoshoot',
  'corporate-headshots': 'Corporate Headshots',
  'denim-wear-photoshoot': 'Denim Wear Photoshoot',
  'doctor-headshots': 'Doctor Headshots',
  'founder-headshots': 'Founder Headshots',
  'lawyer-headshots': 'Lawyer Headshots',
  'linkedin-headshots': 'LinkedIn Headshots',
  'natural-looks-photoshoot': 'Natural Looks Photoshoot',
  'neutral-muse-photoshoot': 'Neutral Muse Photoshoot',
  'office-outfit-photoshoot': 'Office Outfit Photoshoot',
  'personal-branding-photoshoot': 'Personal Branding Photoshoot',
  'professional-headshots': 'Professional Headshots',
  'resume-headshots': 'Resume Headshots',
  'street-style-photoshoot': 'Street Style Photoshoot',
  'stylish-ai-portraits': 'Stylish AI Portraits',
  'vintage-photoshoot': 'Vintage Photoshoot',
};

const VARIANTS = {
  HEADSHOT: [
    'Close-up professional headshot with neutral background',
    'Business portrait in studio lighting',
    'Smiling headshot in formal attire',
    'Natural light portrait with soft background blur',
    'Confident pose, business casual look',
    'Profile angle with warm lighting',
    'Minimalist background, sharp focus',
    'Office setting headshot, polished look',
    'High-contrast portrait, strong presence',
    'Soft-focus headshot for approachable style',
  ],
  PHOTOSHOOT: [
    'Creative portrait with styled outfit',
    'Glamour look with soft studio lighting',
    'Editorial pose with dramatic shadows',
    'Outdoor scene with natural light',
    'Fashion-inspired portrait, bold colors',
    'Classic look against textured backdrop',
    'Candid pose, lifestyle feel',
    'Minimalist studio setup, clean lines',
    'Artistic composition with unique framing',
    'Vintage-inspired portrait aesthetics',
  ],
  PORTRAIT: [
    'Modern portrait with soft lighting',
    'Casual pose, lifestyle background',
    'Professional yet relaxed expression',
    'Color-pop styling with clean backdrop',
    'Friendly smile, approachable tone',
    'Editorial framing with dynamic angles',
    'Muted tones, minimalist look',
    'Warm light, natural ambiance',
    'Bold contrast, standout presence',
    'Creative crop, compelling composition',
  ],
  GENERIC: [
    'Sample image, soft lighting portrait',
    'Studio portrait with neutral background',
    'Smiling subject in polished styling',
    'Outdoor background, natural light',
    'Business casual look, clean finish',
    'Profile angle, warm tones',
    'Minimalist setup, sharp focus',
    'Editorial touch, modern feel',
    'Black-and-white mood portrait',
    'Soft-focus style, elegant look',
  ],
};

function classifyCategory(dirName) {
  if (dirName.includes('headshots')) return 'HEADSHOT';
  if (dirName.includes('photoshoot')) return 'PHOTOSHOOT';
  if (dirName.includes('portraits') || dirName.includes('influencer') || dirName.includes('yearbook')) return 'PORTRAIT';
  return 'GENERIC';
}

function updateFile(filePath, keyword, dirName) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Find the images array block
  const imagesBlockRegex = /const\s+images\s*=\s*\[([\s\S]*?)\]/m;
  const match = content.match(imagesBlockRegex);
  if (!match) {
    return { updated: false, reason: 'images array not found' };
  }

  const originalBlock = match[0];
  const inside = match[1];

  const category = classifyCategory(dirName);
  const variants = VARIANTS[category];

  let index = 0;
  const replacedInside = inside.replace(/alt:\s*(["'])(.*?)\1/g, (m, q) => {
    const variant = variants[index % variants.length];
    index += 1;
    return `alt: ${q}${keyword}: ${variant} | Unrealshot AI${q}`;
  });

  const newBlock = originalBlock.replace(inside, replacedInside);

  if (newBlock === originalBlock) {
    return { updated: false, reason: 'no alt replacements needed' };
  }

  const newContent = content.replace(originalBlock, newBlock);
  fs.writeFileSync(filePath, newContent, 'utf8');
  return { updated: true };
}

function main() {
  const entries = fs.readdirSync(root, { withFileTypes: true });
  const results = [];

  for (const dirent of entries) {
    if (!dirent.isDirectory()) continue;
    const dirName = dirent.name;
    const keyword = dirKeywordMap[dirName];
    if (!keyword) continue;

    const heroPath = path.join(root, dirName, 'HeroSection.tsx');
    if (!fs.existsSync(heroPath)) {
      results.push({ dir: dirName, status: 'skipped', reason: 'HeroSection.tsx not found' });
      continue;
    }

    try {
      const res = updateFile(heroPath, keyword, dirName);
      results.push({ dir: dirName, status: res.updated ? 'updated' : 'unchanged', reason: res.reason });
    } catch (e) {
      results.push({ dir: dirName, status: 'error', reason: e && e.message });
    }
  }

  // Print summary
  console.log('Update alt tags summary:');
  for (const r of results) {
    console.log(`${r.dir}: ${r.status}${r.reason ? ' - ' + r.reason : ''}`);
  }
}

main();