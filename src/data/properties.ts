export interface PropertyType {
  id: string;
  name: string;
  collection: 'Starter' | 'Family' | 'Signature';
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
  livingRoom: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800',
  kitchen: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=800',
  masterBed: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&q=80&w=800',
  bath: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&q=80&w=800',
  multifunction: 'https://images.unsplash.com/photo-1593696140826-c58b021acf8b?auto=format&fit=crop&q=80&w=800',
  outdoor: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800'
};

export const properties: PropertyType[] = [
  {
    id: 't21',
    name: 'Type 21',
    collection: 'Starter',
    specs: { area: '21 m²', beds: 1, baths: 1, features: ['1 Multifunction Room'] },
    description: 'Perfect for singles or new couples looking for a compact, highly functional space.',
    images: { ...defaultImages, exterior: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800' }
  },
  {
    id: 't36',
    name: 'Type 36',
    collection: 'Starter',
    specs: { area: '36 m²', beds: 2, baths: 1, features: ['Mini Living Room'] },
    description: 'The most popular, budget-friendly choice for small families with smart layouts.',
    images: { ...defaultImages, exterior: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&q=80&w=800' }
  },
  {
    id: 't45',
    name: 'Type 45',
    collection: 'Family',
    specs: { area: '45 m²', beds: 2, baths: 1, features: ['Large Living Room', 'Carport'] },
    description: 'High demand for young families and investors, offering spacious daily living areas.',
    images: { ...defaultImages, exterior: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800' }
  },
  {
    id: 't54',
    name: 'Type 54',
    collection: 'Family',
    specs: { area: '54 m²', beds: 3, baths: 2, features: ['Separate Family Room'] },
    description: 'Great for families with children, providing dedicated zones for privacy and gathering.',
    images: { ...defaultImages, exterior: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=800' }
  },
  {
    id: 't60',
    name: 'Type 60',
    collection: 'Family',
    specs: { area: '60 m²', beds: 3, baths: 2, features: ['2 Floors', 'Semi-open Rear Area'] },
    description: 'Maximized vertical space with seamless indoor-outdoor integration at the rear.',
    images: { ...defaultImages, exterior: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=800' }
  },
  {
    id: 't70',
    name: 'Type 70',
    collection: 'Signature',
    specs: { area: '70 m²', beds: 4, baths: 3, features: ['Large Yard', 'Spacious Garage'] },
    description: 'Middle-upper class residence with expansive outdoor space and premium finishes.',
    images: { ...defaultImages, exterior: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&q=80&w=800' }
  },
  {
    id: 't90-120',
    name: 'Type 90 & 120',
    collection: 'Signature',
    specs: { area: '90-120 m²', beds: 5, baths: 4, features: ['Maid\'s Room', 'Indoor Garden', 'En-suite Baths'] },
    description: 'Premium scale living with specialized rooms, architectural indoor gardens, and ultimate luxury.',
    images: { ...defaultImages, exterior: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=800' }
  }
];
