import { GalleryItem } from '@/types';

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "gal-showcase",
    title: "Complete Agricultural Commodities Showcase",
    category: "Grain Quality",
    image: "/images/products/agro_commodities_showcase.jpg",
    description: "Our complete spectrum: Aged Basmati Rice, Unpolished Dals, MP Sharbati Wheat & Chakki Atta, and High-Protein Soybean Meal, Rapeseed Meal & DDGS.",
    tag: "Agro Portfolio"
  },
  {
    id: "gal-1",
    title: "Attri Heritage — Premium Basmati Packaging",
    category: "Products",
    image: "/images/products/attri-traditional-basmati.jpg",
    description: "Royal Emerald and Gold bag featuring authentic Indian heritage motifs and pristine aged Basmati grains.",
    tag: "Flagship Basmati"
  },
  {
    id: "gal-feed",
    title: "Attri Animal Feed — Soybean Meal, Rapeseed Meal & DDGS",
    category: "Products",
    image: "/images/products/attri-soybean-meal.jpg",
    description: "Commercial feed ingredients and distillers grains (Corn & Rice DDGS) with high protein, low moisture, and rich amino acid profiles.",
    tag: "Animal Feed"
  },
  {
    id: "gal-atta",
    title: "Attri Pure Sharbati Chakki Atta",
    category: "Products",
    image: "/images/products/attri-sharbati-atta.jpg",
    description: "100% stone-ground whole wheat chakki atta packaging locking in natural wheat bran and sweetness.",
    tag: "Wheat & Flour"
  },
  {
    id: "gal-toor",
    title: "Attri Select Toor Dal — 100% Unpolished",
    category: "Products",
    image: "/images/products/attri-toor-dal.jpg",
    description: "Premium unpolished yellow pigeon peas (Arhar Dal) packed with natural plant protein and authentic flavor.",
    tag: "Beans & Pulses"
  },
  {
    id: "gal-chana",
    title: "Attri Premium Chana Dal Packaging",
    category: "Products",
    image: "/images/products/attri-chana-dal.jpg",
    description: "Laser-sorted golden split Bengal gram chickpeas in moisture-protected commercial trade packaging.",
    tag: "Beans & Pulses"
  },
  {
    id: "gal-wheat",
    title: "Attri Gold MP Sharbati Whole Wheat Grain",
    category: "Products",
    image: "/images/products/attri-wheat-grain.jpg",
    description: "Sortex cleaned golden whole wheat grains direct from the black soils of Madhya Pradesh.",
    tag: "Wheat & Flour"
  },
  {
    id: "gal-doc",
    title: "Attri Golden Corn DDGS & Distillers Grains",
    category: "Packaging",
    image: "/images/products/attri-corn-ddgs.jpg",
    description: "High-energy 28% protein Golden Corn DDGS in commercial 50kg moisture-barrier packaging for poultry & cattle feeds.",
    tag: "Animal Feed"
  },
  {
    id: "gal-sona",
    title: "Attri Everyday — Sona Masoori Rice",
    category: "Products",
    image: "/images/products/attri-sona-masoori.jpg",
    description: "Lightweight, delicate medium grain rice in Steam, Raw, and Boiled processing finishes.",
    tag: "Daily Rice"
  },
  {
    id: "gal-ir64",
    title: "Attri Export — IR 64 Non-Basmati Rice",
    category: "Products",
    image: "/images/products/attri-classic-ir64.jpg",
    description: "High-yield commercial rice available in 5%, 15%, and 25% broken specifications for global export.",
    tag: "Export Grain"
  },
  {
    id: "gal-logo",
    title: "Official Brand Emblem & Quality Seal",
    category: "Packaging",
    image: "/images/branding/logo.jpg",
    description: "The official Attri Nexus insignia symbolizing agro commodity purity, global standards, and excellence.",
    tag: "Brand Identity"
  }
];

export const GALLERY_CATEGORIES = [
  "All",
  "Products",
  "Grain Quality",
  "Packaging"
] as const;
