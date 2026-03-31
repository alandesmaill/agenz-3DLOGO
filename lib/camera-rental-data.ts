import type { LucideIcon } from 'lucide-react';
import {
  Camera,
  Aperture,
  HardDrive,
  Monitor,
  Wifi,
  SlidersHorizontal,
  Layers,
  Crosshair,
  Battery,
  Square,
  PersonStanding,
} from 'lucide-react';

export interface EquipmentItem {
  name: string;
  brand: string;
  qty: number;
  notes?: string;
  image?: string;
}

export interface EquipmentCategory {
  id: string;
  name: string;
  icon: LucideIcon;
  description?: string;
  items: EquipmentItem[];
}

export interface CameraPackage {
  id: string;
  name: string;
  tagline: string;
  description: string;
  cameraBody: string;
  packageImage: string;
  accentColor: string;
  highlights: string[];
  productionSetIncludes: string[];
  equipmentCategories: EquipmentCategory[];
}

export const cameraPackages: CameraPackage[] = [
  {
    id: 'arri-alexa-35',
    name: 'ARRI Alexa 35 Package',
    tagline: 'Cinema-Grade Production Packages',
    description:
      'The complete ARRI Alexa 35 production package with Signature Prime lenses. Everything you need for professional cinema production — from camera body to EasyRig, lenses to monitoring — in a single comprehensive rental.',
    cameraBody: 'ARRI Alexa 35',
    packageImage: '/images/camera-rental/arri-alexa-35-package.webp',
    accentColor: '#00ffff',
    highlights: ['ARRI Alexa 35', 'Signature Primes', '19mm Studio', 'Full Package'],
    productionSetIncludes: [
      'ARRI Alexa 35 Camera Body',
      '19mm Studio Bridge Plate (BPA-7)',
      'LBUS (Lens Bus Unit) Receiver',
      'ARRI Electronic Viewfinder (EVF-2)',
      'ARRI Hand Grip Set (LGR-1)',
      'LPL Lens Mount',
      'Power & Data Junction Box',
      'LMB 4x5 Matte Box Assembly',
      'Support Rods 150mm / 240mm / 340mm',
      'Top Handle with Accessory Slot',
    ],
    equipmentCategories: [
      {
        id: 'camera-body',
        name: 'Camera Body',
        icon: Camera,
        description: 'Production-ready ARRI Alexa 35 in 19mm Studio configuration',
        items: [
          {
            name: 'Alexa 35 Production Set (19mm Studio)',
            brand: 'ARRI',
            qty: 1,
            image: '/images/camera-rental/camera-body/alexa-35-production-set.webp',
          },
        ],
      },
      {
        id: 'lenses',
        name: 'Lenses',
        icon: Aperture,
        description: 'ARRI Signature Prime lenses — T1.8 across all focal lengths',
        items: [
          { name: 'Signature Prime 18mm T1.8 M', brand: 'ARRI', qty: 1, image: '/images/camera-rental/lenses/Signature Prime 18mm T1.8 M.webp' },
          { name: 'Signature Prime 25mm T1.8 M', brand: 'ARRI', qty: 1, image: '/images/camera-rental/lenses/Signature Prime 25mm T1.8 M.webp' },
          { name: 'Signature Prime 35mm T1.8 M', brand: 'ARRI', qty: 1, image: '/images/camera-rental/lenses/Signature Prime 35mm T1.8 M.webp' },
          { name: 'Signature Prime 47mm T1.8 M', brand: 'ARRI', qty: 1, image: '/images/camera-rental/lenses/Signature Prime 47mm T1.8 M.webp' },
          { name: 'Signature Prime 75mm T1.8 M', brand: 'ARRI', qty: 1, image: '/images/camera-rental/lenses/Signature Prime 75mm T1.8 M.webp' },
        ],
      },
      {
        id: 'memory',
        name: 'Memory',
        icon: HardDrive,
        description: 'CODEX high-speed recording media and docking solutions',
        items: [
          { name: 'CODEX Memory 2TB + Dock Bundle', brand: 'CODEX', qty: 4, image: '/images/camera-rental/memory/CODEX Memory 2TB + Dock Bundle.webp' },
          { name: 'Compact Drive Dock (TB3)', brand: 'CODEX', qty: 1, image: '/images/camera-rental/memory/Compact Drive Dock (TB3).webp' },
        ],
      },
      {
        id: 'monitors',
        name: 'Monitors',
        icon: Monitor,
        description: "Full monitoring suite from on-camera to large director's monitors",
        items: [
          { name: 'SmallHD Cine 24"', brand: 'SmallHD', qty: 1, image: '/images/camera-rental/monitors/SmallHD Cine 24".webp' },
          { name: 'SmallHD Cine 18"', brand: 'SmallHD', qty: 1, image: '/images/camera-rental/monitors/SmallHD Cine 18".webp' },
          { name: 'ARRI 4K 7" Monitor', brand: 'ARRI', qty: 1, image: '/images/camera-rental/monitors/ARRI 4K 7" Monitor.webp' },
          { name: 'SmallHD 7" Monitor', brand: 'SmallHD', qty: 1, image: '/images/camera-rental/monitors/SmallHD 7" Monitor.webp' },
          { name: 'TVLogic F-7HS Bundle', brand: 'TVLogic', qty: 1, image: '/images/camera-rental/monitors/TVLogic F-7HS Bundle.webp' },
        ],
      },
      {
        id: 'wireless',
        name: 'Wireless',
        icon: Wifi,
        description: 'VAXIS Storm 3000 wireless video transmission system',
        items: [
          { name: 'Storm 3000 Transmitter', brand: 'VAXIS', qty: 1, image: '/images/camera-rental/wireless/Storm 3000 Transmitter.webp' },
          { name: 'Storm 3000 RX Kit', brand: 'VAXIS', qty: 3, image: '/images/camera-rental/wireless/Storm 3000 RX Kit.webp' },
          { name: 'Blade Antenna', brand: 'VAXIS', qty: 10, image: '/images/camera-rental/wireless/Blade Antenna.webp' },
          { name: 'Channel Scanner', brand: 'VAXIS', qty: 1, image: '/images/camera-rental/wireless/Channel Scanner.webp' },
          { name: 'D-tap Power Cable', brand: 'VAXIS', qty: 1, image: '/images/camera-rental/wireless/D-tap Power Cable.webp' },
          { name: 'CamRade wetSuit Cover', brand: 'CamRade', qty: 1, image: '/images/camera-rental/wireless/CamRade wetSuit Cover.webp' },
        ],
      },
      {
        id: 'focus',
        name: 'Focus (Hi-5)',
        icon: SlidersHorizontal,
        description: 'Hi-5 wireless follow focus system with cforce motor',
        items: [
          {
            name: 'Hi-5 Hand Unit Basic Set',
            brand: 'ARRI',
            qty: 1,
            notes: 'LBUS cables sold separately',
            image: '/images/camera-rental/focus/Hi-5 Hand Unit Basic Set.webp',
          },
          { name: 'cforce mini Basic Set 2', brand: 'ARRI', qty: 1 },
        ],
      },
      {
        id: 'filters',
        name: 'Filters',
        icon: Layers,
        description: 'ARRI FSND and specialty filter package',
        items: [
          { name: 'FSND 0.3 + Tiffen Combo', brand: 'ARRI', qty: 1, image: '/images/camera-rental/filters/FSND 0.3 + Tiffen Combo.webp' },
          { name: 'FSND 0.6 + Tiffen Combo', brand: 'ARRI', qty: 1, image: '/images/camera-rental/filters/FSND 0.6 + Tiffen Combo.webp' },
          { name: 'FSND 0.9 + Tiffen Combo', brand: 'ARRI', qty: 1, image: '/images/camera-rental/filters/FSND 0.9 + Tiffen Combo.webp' },
          { name: 'Rota Pola Frame', brand: 'ARRI', qty: 1, image: '/images/camera-rental/filters/Rota Pola Frame.webp' },
          { name: '4x5.65" Clear Filter', brand: 'ARRI', qty: 1, image: '/images/camera-rental/filters/4x5.65" Clear Filter.webp' },
          { name: 'Glimmerglass 1/4', brand: 'Tiffen', qty: 1, image: '/images/camera-rental/filters/Glimmerglass 1-4.webp' },
          { name: 'Glimmerglass 1/8', brand: 'Tiffen', qty: 1, image: '/images/camera-rental/filters/Glimmerglass 1-8.webp' },
        ],
      },
      {
        id: 'tripod',
        name: 'Tripod',
        icon: Crosshair,
        description: 'Professional fluid head and hard tripod systems',
        items: [
          { name: 'Ultimate 2560 Fluid Head Package', brand: "O'Connor", qty: 1, image: '/images/camera-rental/tripod/Ultimate 2560 Fluid Head Package.webp' },
          { name: '150 II Hard Tripod', brand: 'Sachtler', qty: 1, image: '/images/camera-rental/tripod/150 II Hard Tripod.webp' },
        ],
      },
      {
        id: 'batteries',
        name: 'Batteries',
        icon: Battery,
        description: 'BEBOB B-Mount and V-Mount battery systems with chargers',
        items: [
          { name: 'BEBOB B-Mount 285Wh', brand: 'BEBOB', qty: 2, image: '/images/camera-rental/batteries/BEBOB B-Mount 285Wh.webp' },
          { name: 'BEBOB B-Mount 156Wh', brand: 'BEBOB', qty: 6, image: '/images/camera-rental/batteries/BEBOB B-Mount 156Wh.webp' },
          { name: 'BEBOB B-Mount Hotswap', brand: 'BEBOB', qty: 1, image: '/images/camera-rental/batteries/BEBOB B-Mount Hotswap.webp' },
          { name: 'V-Mount 285Wh', brand: 'BEBOB', qty: 6, image: '/images/camera-rental/batteries/V-Mount 285Wh.webp' },
          { name: 'Micro Battery 95Wh', brand: 'BEBOB', qty: 4, image: '/images/camera-rental/batteries/Micro Battery 95Wh.webp' },
          { name: 'B-Mount Charger', brand: 'BEBOB', qty: 2, notes: 'Included with battery sets', image: '/images/camera-rental/batteries/B-Mount Charger.webp' },
        ],
      },
      {
        id: 'matte-box',
        name: 'Matte Box',
        icon: Square,
        description: 'ARRI LMB 4x5 full kit with support rod set',
        items: [
          { name: 'LMB 4x5 Full Kit', brand: 'ARRI', qty: 1, image: '/images/camera-rental/matte-box/LMB 4x5 Full Kit.webp' },
          { name: 'Support Rod 150mm', brand: 'ARRI', qty: 1, image: '/images/camera-rental/matte-box/Support Rod 150mm.webp' },
          { name: 'Support Rod 240mm', brand: 'ARRI', qty: 1, image: '/images/camera-rental/matte-box/Support Rod 240mm.webp' },
          { name: 'Support Rod 340mm', brand: 'ARRI', qty: 1, image: '/images/camera-rental/matte-box/Support Rod 340mm.webp' },
        ],
      },
      {
        id: 'easyrig',
        name: 'EasyRig',
        icon: PersonStanding,
        description: 'Full EasyRig gimbal vest system for handheld operation',
        items: [
          {
            name: 'Vario 5 Large Easylock Gimbal Rig',
            brand: 'EasyRig',
            qty: 1,
            notes: 'EA033-Q + EA033-WB',
            image: '/images/camera-rental/easyrig/Vario 5 Large Easylock Gimbal Rig.webp',
          },
        ],
      },
    ],
  },
];
