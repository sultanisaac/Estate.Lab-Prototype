export interface StyleType {
  id: string;
  name: string;
  description: string;
  image: string;
  features: string[];
}

export const styles: StyleType[] = [
  {
    id: 'minimalis',
    name: 'Minimalis Modern',
    description: 'Clean geometric shapes, highly functional, and space-saving.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
    features: ['Geometric Lines', 'Hidden Storage', 'Neutral Palette']
  },
  {
    id: 'tropis',
    name: 'Tropis Modern',
    description: 'Large windows, cross-ventilation, natural materials (wood/stone), suited for Indonesian heat.',
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=800',
    features: ['High Ceilings', 'Natural Airflow', 'Wood & Stone']
  },
  {
    id: 'skandinavia',
    name: 'Skandinavia',
    description: 'Bright neutral colors, wood elements, abundant natural light.',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
    features: ['Warm Wood', 'White Dominant', 'Cozy Aesthetic']
  },
  {
    id: 'industrial',
    name: 'Industrial',
    description: 'Unfinished concept, exposed cement, open pipes, black iron accents.',
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=800',
    features: ['Exposed Brick/Concrete', 'Metal Accents', 'Raw Finishes']
  }
];
