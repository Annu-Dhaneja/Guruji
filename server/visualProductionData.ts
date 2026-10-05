import { EcomVisualProject, MarketplaceSpec } from '../src/types';
import { syncVisualProjectToSupabase } from './supabaseService';

export const initialVisualProjects: EcomVisualProject[] = [
  {
    id: 'PRJ-ECOM-901',
    userId: 'usr_annu_demo',
    brandName: 'Nectar Botanicals',
    title: 'Luxury Organic Face Serum - 7 Image Amazon Launch Suite',
    category: 'hero_white_bg',
    targetMarketplaces: ['amazon', 'shopify'],
    skuCount: 3,
    totalImagesRequested: 7,
    rushDelivery: true,
    aspectRatios: ['1:1', '4:5'],
    status: 'in_production',
    progressPercent: 65,
    clientName: 'Siddharth Rao',
    clientEmail: 'siddharth@nectarbotanicals.com',
    clientPhone: '+91 98200 45678',
    brief: 'High-end glass dropper bottle with gold foil labeling. Main shot requires Amazon pure white (RGB 255) with soft floor glass reflection. Secondary shots include droplet macro, ingredients graphic, and Scandinavian marble bathroom scene.',
    assignedDesigner: 'Annu Dhaneja',
    assignedQA: 'Vikram Joshi (Senior QA)',
    assets: [
      {
        id: 'ast-901-1',
        fileName: 'nectar_serum_hero_raw.jpg',
        fileUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1200&q=80',
        fileType: 'raw_input',
        stage: 'wip',
        aspectRatio: '1:1',
        beforeUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
        afterUrl: 'https://images.unsplash.com/photo-1608248597359-0099517cf366?auto=format&fit=crop&w=800&q=80',
        annotations: [
          {
            id: 'pin-1',
            x: 52,
            y: 38,
            comment: 'Slight glare on the gold typography - reduce highlight reflection by 15%',
            author: 'Siddharth (Client)',
            createdAt: '2026-09-22T10:14:00Z',
            resolved: true,
          },
          {
            id: 'pin-2',
            x: 48,
            y: 84,
            comment: 'Floor reflection looks natural! Keep this gradient intensity.',
            author: 'Vikram (QA)',
            createdAt: '2026-09-22T11:30:00Z',
            resolved: false,
          },
        ],
      },
      {
        id: 'ast-901-2',
        fileName: 'nectar_serum_lifestyle_staging.jpg',
        fileUrl: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=1200&q=80',
        fileType: 'processed_preview',
        stage: 'qa_pending',
        aspectRatio: '1:1',
      },
    ],
    revisions: [
      {
        id: 'rev-901-1',
        revisionNumber: 1,
        feedbackType: 'shadow_fix',
        notes: 'Refined contact shadow along bottom base for Amazon compliance and cleaned dust flecks on glass vial.',
        pins: [],
        status: 'addressed',
        createdAt: '2026-09-21T14:00:00Z',
      },
    ],
    deliverables: [
      {
        id: 'del-901-1',
        title: 'Hero Main Image (2000x2000 sRGB 255)',
        format: 'JPG',
        resolution: '2000 x 2000 px @ 300 DPI',
        downloadUrl: 'https://images.unsplash.com/photo-1608248597359-0099517cf366?auto=format&fit=crop&w=2000&q=85',
        fileSize: '2.4 MB',
        dimensions: '2000 x 2000',
        marketplaceOptimized: 'Amazon Seller Central Compliant',
      },
      {
        id: 'del-901-2',
        title: 'Layered Source Master (Vector Paths & Alpha Channel)',
        format: 'PSD',
        resolution: 'Full Sensor Source',
        downloadUrl: '#psd-export-nectar-serum',
        fileSize: '84.6 MB',
        dimensions: '6000 x 4000',
        marketplaceOptimized: 'Archival Master',
      },
    ],
    createdAt: '2026-09-20T08:30:00Z',
    updatedAt: '2026-09-22T12:00:00Z',
  },
  {
    id: 'PRJ-ECOM-902',
    userId: 'usr_annu_demo',
    brandName: 'Urban Loom Apparel',
    title: 'Merino Wool Knitwear - 3D Ghost Mannequin Suite (4 Colors)',
    category: 'ghost_mannequin',
    targetMarketplaces: ['amazon', 'flipkart', 'myntra'],
    skuCount: 4,
    totalImagesRequested: 12,
    rushDelivery: false,
    aspectRatios: ['3:4', '1:1'],
    status: 'qa_review',
    progressPercent: 90,
    clientName: 'Kavita Menon',
    clientEmail: 'kavita@urbanloom.in',
    clientPhone: '+91 97111 88990',
    brief: 'Crewneck sweaters photographed flat and on mannequin. Needs 3D hollow neck composite with woven brand label inserted, shoulder symmetry aligned, and wrinkles naturally smoothed.',
    assignedDesigner: 'Annu Dhaneja',
    assignedQA: 'Vikram Joshi',
    assets: [
      {
        id: 'ast-902-1',
        fileName: 'wool_knit_forest_green.jpg',
        fileUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1200&q=80',
        fileType: 'highres_final',
        stage: 'qa_pending',
        aspectRatio: '3:4',
        beforeUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80',
        afterUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80',
      },
    ],
    revisions: [],
    deliverables: [
      {
        id: 'del-902-1',
        title: 'Myntra Fashion Pack (3:4 1080x1440)',
        format: 'JPG',
        resolution: '1080 x 1440 px',
        downloadUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1440&q=85',
        fileSize: '1.8 MB',
        dimensions: '1080 x 1440',
        marketplaceOptimized: 'Myntra Fashion Approved',
      },
    ],
    createdAt: '2026-09-18T10:15:00Z',
    updatedAt: '2026-09-22T16:30:00Z',
  },
  {
    id: 'PRJ-ECOM-903',
    userId: 'usr_annu_demo',
    brandName: 'Zest & Co.',
    title: 'Cold Pressed Olive Oil - Quick Commerce Zepto & Blinkit Tile Set',
    category: 'packaging_3d',
    targetMarketplaces: ['zepto', 'blinkit', 'amazon'],
    skuCount: 2,
    totalImagesRequested: 4,
    rushDelivery: true,
    aspectRatios: ['1:1'],
    status: 'delivered',
    progressPercent: 100,
    clientName: 'Harsh Vardhan',
    clientEmail: 'harsh@zestoil.com',
    clientPhone: '+91 99887 76655',
    brief: 'High-contrast mobile tile pack for 10-minute grocery delivery apps. Label nutrition badges and 500ml volume indicator must be crystal sharp on smartphone screens.',
    assignedDesigner: 'Annu Dhaneja',
    assignedQA: 'Vikram Joshi',
    assets: [
      {
        id: 'ast-903-1',
        fileName: 'olive_oil_500ml_bottle.png',
        fileUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=1200&q=80',
        fileType: 'highres_final',
        stage: 'delivered',
        aspectRatio: '1:1',
      },
    ],
    revisions: [],
    deliverables: [
      {
        id: 'del-903-1',
        title: 'Zepto Mobile Optimized Tile (1000x1000 Transparent PNG)',
        format: 'PNG',
        resolution: '1000 x 1000 px',
        downloadUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=1000&q=85',
        fileSize: '1.2 MB',
        dimensions: '1000 x 1000',
        marketplaceOptimized: 'Quick Commerce High Visibility',
      },
    ],
    createdAt: '2026-09-15T09:00:00Z',
    updatedAt: '2026-09-17T11:00:00Z',
  },
];

export let visualProjectsData: EcomVisualProject[] = [...initialVisualProjects];

export function getVisualProjects(email?: string): EcomVisualProject[] {
  if (!email || email === 'annudhaneja@gmail.com') {
    return visualProjectsData;
  }
  return visualProjectsData.filter(
    p => p.clientEmail.toLowerCase() === email.toLowerCase() || p.userId === email
  );
}

export function getVisualProjectById(id: string): EcomVisualProject | undefined {
  return visualProjectsData.find(p => p.id === id);
}

export function createVisualProject(data: Partial<EcomVisualProject>): EcomVisualProject {
  const newProject: EcomVisualProject = {
    id: `PRJ-ECOM-${Math.floor(1000 + Math.random() * 9000)}`,
    brandName: data.brandName || 'Untitled Brand',
    title: data.title || 'E-Commerce Visual Production Suite',
    category: data.category || 'hero_white_bg',
    targetMarketplaces: data.targetMarketplaces || ['amazon', 'flipkart'],
    skuCount: data.skuCount || 1,
    totalImagesRequested: data.totalImagesRequested || 5,
    rushDelivery: Boolean(data.rushDelivery),
    aspectRatios: data.aspectRatios || ['1:1'],
    status: 'submitted',
    progressPercent: 15,
    clientName: data.clientName || 'Valued Merchant',
    clientEmail: data.clientEmail || 'client@example.com',
    clientPhone: data.clientPhone || '',
    brief: data.brief || '',
    assignedDesigner: 'Annu Dhaneja',
    assignedQA: 'Vikram Joshi (Senior QA)',
    assets: data.assets || [],
    revisions: [],
    deliverables: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  visualProjectsData.unshift(newProject);
  syncVisualProjectToSupabase(newProject);
  return newProject;
}

export function updateVisualProject(id: string, updates: Partial<EcomVisualProject>): EcomVisualProject | null {
  const index = visualProjectsData.findIndex(p => p.id === id);
  if (index === -1) return null;

  visualProjectsData[index] = {
    ...visualProjectsData[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  syncVisualProjectToSupabase(visualProjectsData[index]);
  return visualProjectsData[index];
}

export function addAssetAnnotation(
  projectId: string,
  assetId: string,
  annotation: { x: number; y: number; comment: string; author: string }
): EcomVisualProject | null {
  const project = visualProjectsData.find(p => p.id === projectId);
  if (!project) return null;

  const asset = project.assets.find(a => a.id === assetId);
  if (!asset) return null;

  if (!asset.annotations) asset.annotations = [];
  const newPin = {
    id: `pin-${Date.now()}`,
    x: annotation.x,
    y: annotation.y,
    comment: annotation.comment,
    author: annotation.author,
    createdAt: new Date().toISOString(),
    resolved: false,
  };

  asset.annotations.push(newPin);
  project.updatedAt = new Date().toISOString();
  syncVisualProjectToSupabase(project);
  return project;
}
