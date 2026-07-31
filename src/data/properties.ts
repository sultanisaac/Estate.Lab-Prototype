export interface PropertyType {
  id: string;
  name: string;
  collection: 'Starter' | 'Family';
  style: string;
  specs: {
    area: string;
    beds: number;
    baths: number;
    features: string[];
  };
  description: string;
  images: {
    exterior: string;
    livingRoom: string;
    kitchen: string;
    masterBed: string;
    bath: string;
    multifunction: string;
    outdoor: string;
  };
}

const defaultImages = {
  exterior: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800',
  livingRoom: '/generated-images/default_living_room_1785481099723.png',
  kitchen: '/generated-images/default_kitchen_1785481111143.png',
  masterBed: '/generated-images/default_master_bed_1785481119505.png',
  bath: '/generated-images/default_bath_1785481129693.png',
  multifunction: '/generated-images/default_living_room_1785481099723.png',
  outdoor: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800'
};

export const properties: PropertyType[] = [
  {
    id: 't21',
    name: 'Type 21',
    collection: 'Starter',
    style: 'minimalis',
    specs: { area: '21 m²', beds: 1, baths: 1, features: ['1 Multifunction Room'] },
    description: 'Perfect for singles or new couples looking for a compact, highly functional space.',
    images: { ...defaultImages, exterior: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800' }
  },
  {
    id: 't36',
    name: 'Type 36',
    collection: 'Starter',
    style: 'minimalis',
    specs: { area: '36 m²', beds: 2, baths: 1, features: ['Mini Living Room'] },
    description: 'The most popular, budget-friendly choice for small families with smart layouts.',
    images: { 
      ...defaultImages, 
      exterior: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&q=80&w=800',
      livingRoom: '/generated-images/t36_living_room_1785480771065.png',
      kitchen: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=800',
      masterBed: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&q=80&w=800',
      bath: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
      outdoor: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&q=80&w=800'
    }
  },
  {
    id: 't45',
    name: 'Type 45',
    collection: 'Family',
    style: 'skandinavia',
    specs: { area: '45 m²', beds: 2, baths: 1, features: ['Large Living Room', 'Carport'] },
    description: 'High demand for young families and investors, offering spacious daily living areas.',
    images: { 
      ...defaultImages, 
      exterior: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
      livingRoom: '/generated-images/t45_living_room_1785480779282.png'
    }
  },
  {
    id: 't54',
    name: 'Type 54',
    collection: 'Family',
    style: 'tropis',
    specs: { area: '54 m²', beds: 3, baths: 2, features: ['Separate Family Room'] },
    description: 'Great for families with children, providing dedicated zones for privacy and gathering.',
    images: { ...defaultImages, exterior: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=800' }
  },
  {
    id: 't60',
    name: 'Type 60',
    collection: 'Family',
    style: 'industrial',
    specs: { area: '60 m²', beds: 3, baths: 2, features: ['2 Floors', 'Semi-open Rear Area'] },
    description: 'Maximized vertical space with seamless indoor-outdoor integration at the rear.',
    images: { 
      ...defaultImages, 
      exterior: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=800',
      livingRoom: '/generated-images/t60_living_room_1785480789248.png'
    }
  },
  {
    id: 't24',
    name: 'Type 24',
    collection: 'Starter',
    style: 'industrial',
    specs: { area: '24 m²', beds: 1, baths: 1, features: ['Compact Kitchen', 'Exposed Concrete Accent'] },
    description: 'An edgy, space-optimized studio for urban professionals.',
    images: { 
      ...defaultImages, 
      exterior: 'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&q=80&w=800',
      livingRoom: '/generated-images/t24_living_room_1785480797602.png'
    }
  },
  {
    id: 't28',
    name: 'Type 28',
    collection: 'Starter',
    style: 'skandinavia',
    specs: { area: '28 m²', beds: 1, baths: 1, features: ['Bright Interior', 'Wooden Floors'] },
    description: 'A warm, light-filled minimal space perfect for first-time buyers.',
    images: { ...defaultImages, exterior: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&q=80&w=800' }
  },
  {
    id: 't30',
    name: 'Type 30',
    collection: 'Starter',
    style: 'tropis',
    specs: { area: '30 m²', beds: 1, baths: 1, features: ['Cross Ventilation', 'Small Patio'] },
    description: 'Breezy and natural, integrating outdoor elements in a compact footprint.',
    images: { 
      ...defaultImages, 
      exterior: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=800',
      livingRoom: '/generated-images/t30_living_room_1785480808038.png'
    }
  },
  {
    id: 't32',
    name: 'Type 32',
    collection: 'Starter',
    style: 'minimalis',
    specs: { area: '32 m²', beds: 2, baths: 1, features: ['Hidden Storage', 'Sleek Lines'] },
    description: 'Clean geometry and smart storage solutions for a clutter-free lifestyle.',
    images: { 
      ...defaultImages, 
      exterior: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
      livingRoom: '/generated-images/t32_living_room_1785480818955.png'
    }
  },
  {
    id: 't40',
    name: 'Type 40',
    collection: 'Starter',
    style: 'industrial',
    specs: { area: '40 m²', beds: 2, baths: 1, features: ['Open Ceiling', 'Metal Fixtures'] },
    description: 'A stylish, raw aesthetic with expanded living space for growing needs.',
    images: { ...defaultImages, exterior: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=800' }
  },
  {
    id: 't50',
    name: 'Type 50',
    collection: 'Family',
    style: 'minimalis',
    specs: { area: '50 m²', beds: 3, baths: 2, features: ['Integrated Kitchen', 'Carport'] },
    description: 'A sophisticated balance of form and function for the modern family.',
    images: { 
      ...defaultImages, 
      exterior: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
      livingRoom: '/generated-images/t50_living_room_1785480827015.png'
    }
  },
  {
    id: 't65',
    name: 'Type 65',
    collection: 'Family',
    style: 'skandinavia',
    specs: { area: '65 m²', beds: 3, baths: 2, features: ['Large Windows', 'Cozy Family Area'] },
    description: 'Spacious and inviting with abundant natural light and warm textures.',
    images: { 
      ...defaultImages, 
      exterior: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&q=80&w=800',
      livingRoom: '/generated-images/t65_living_room_1785480836283.png'
    }
  },
  {
    id: 't72',
    name: 'Type 72',
    collection: 'Family',
    style: 'tropis',
    specs: { area: '72 m²', beds: 3, baths: 2, features: ['Indoor Garden', 'High Ceilings'] },
    description: 'A luxurious resort-like feel blending indoor comfort with tropical nature.',
    images: { ...defaultImages, exterior: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=800' }
  },
  {
    id: 't80',
    name: 'Type 80',
    collection: 'Family',
    style: 'industrial',
    specs: { area: '80 m²', beds: 4, baths: 3, features: ['Loft Space', 'Exposed Brick'] },
    description: 'Expansive, bold, and distinct. Designed for families who appreciate raw character.',
    images: { 
      ...defaultImages, 
      exterior: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800',
      livingRoom: '/generated-images/t80_living_room_1785480844864.png'
    }
  },
  {
    id: 't85',
    name: 'Type 85',
    collection: 'Family',
    style: 'tropis',
    specs: { area: '85 m²', beds: 4, baths: 3, features: ['Pool Option', 'Airflow Design'] },
    description: 'The pinnacle of family living with seamless natural integration and premium space.',
    images: { ...defaultImages, exterior: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&q=80&w=800' }
  }
];
