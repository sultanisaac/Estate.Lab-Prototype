export interface Milestone {
  year: string;
  title: string;
  desc: string;
}

export interface AdvisoryStandard {
  id: string;
  title: string;
  desc: string;
}

export interface AboutMeData {
  name: string;
  roleTag: string;
  title: string;
  headlineQuote: string;
  bio1: string;
  bio2: string;
  portraitUrl: string;
  statusBadge: {
    status: string;
    subtext: string;
  };
  standards: AdvisoryStandard[];
  milestones: Milestone[];
}

export interface Testimonial {
  id: number | string;
  name: string;
  role: string;
  rating: number;
  text: string;
  avatar: string;
}

export interface WebsiteContent {
  aboutMe: AboutMeData;
  testimonials: Testimonial[];
}

export const initialAboutMe: AboutMeData = {
  name: "Sultan Isaac",
  roleTag: "Principal Advisor",
  title: "Licensed Real Estate Broker & Architecture Specialist",
  headlineQuote: '"A home is the physical architecture of your peace, legacy, and ambition."',
  bio1: "Welcome. I'm Sultan Isaac, a private real estate advisor and broker dedicated exclusively to curated architectural homes. Over the past 15 years, I have helped discerning individuals, growing families, and selective investors navigate the complexities of acquiring properties where exceptional design meets flawless legal due diligence.",
  bio2: "Unlike traditional brokerage models focused on volume, my practice is intentionally boutique. I represent you as an independent fiduciary—filtering noise, curating only residences that meet strict architectural criteria, and unlocking off-market opportunities that never reach public listings.",
  portraitUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800",
  statusBadge: {
    status: "Active Advisory",
    subtext: "Currently managing private allocations & bespoke viewings"
  },
  standards: [
    {
      id: "std-1",
      title: "$40M+ Closed Volume",
      desc: "Represented high-net-worth clients and design-forward families across prime residential corridors."
    },
    {
      id: "std-2",
      title: "15+ Years In Advisory",
      desc: "Deep immersion in contemporary tropical, minimalist, and Scandinavian residential architecture."
    },
    {
      id: "std-3",
      title: "100% Client Discretion",
      desc: "Confidential negotiation and quiet off-market pocket listings shielded from public MLS listings."
    },
    {
      id: "std-4",
      title: "Architectural Vetting",
      desc: "Every listing is vetted for cross-ventilation, structural integrity, and long-term resale appreciation."
    }
  ],
  milestones: [
    { year: "2010", title: "Architectural Foundations", desc: "Began career collaborating with renowned Southeast Asian architects and boutique real estate firms." },
    { year: "2015", title: "Private Client Group", desc: "Launched dedicated buyer representation advisory focusing on luxury custom residences." },
    { year: "2020", title: "Estate.Lab Advisory", desc: "Founded Estate.Lab to bridge architectural excellence with transparent, tech-forward real estate transactions." },
    { year: "Present", title: "Bespoke Portfolio", desc: "Advising an exclusive roster of private collectors, executives, and modern families across Indonesia." }
  ]
};

export const initialTestimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Andi & Sarah',
    role: 'Type 60 Owners, Jakarta',
    rating: 5,
    text: "Found the perfect Tropical Modern home within our budget. The Type 60's cross-ventilation keeps it cool all day!",
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 2,
    name: 'Michelle T.',
    role: 'Type 45 Owner, Bandung',
    rating: 5,
    text: "Amazing transparency and the legal team handled everything. Our Type 45 feels incredibly spacious and bright.",
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 3,
    name: 'Budi & Clara',
    role: 'Type 50 Owners, Surabaya',
    rating: 5,
    text: "Estate.Lab made buying our first home easy. The Industrial unit is stunning and smart features are a game changer!",
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 4,
    name: 'Diana R.',
    role: 'Type 90 Owner, Bali',
    rating: 5,
    text: "Upgraded to the Minimalist Collection. The architecture maximizes light beautifully—they truly understand modern living.",
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 5,
    name: 'Reza Pratama',
    role: 'Type 21 Owner, South Jakarta',
    rating: 5,
    text: "As a young tech professional, Type 21 is the ultimate studio. Compact, high ceilings, and zero wasted square meters.",
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 6,
    name: 'Hendro & Maya',
    role: 'Type 72 Owners, Tangerang',
    rating: 5,
    text: "The indoor garden and double-height ceiling make our family gatherings feel like a luxury resort stay.",
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 7,
    name: 'Clarissa W.',
    role: 'Type 36 Owner, Yogyakarta',
    rating: 5,
    text: "From 3D blueprint walkthroughs to key handover, everything was delivered exactly on schedule with immaculate finishing.",
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 8,
    name: 'Kevin S.',
    role: 'Type 80 Owner, Medan',
    rating: 5,
    text: "The raw brick and black steel industrial aesthetics get compliments from every guest. Truly standout architecture.",
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150'
  },
  {
    id: 9,
    name: 'dr. Farhan & Aisyah',
    role: 'Type 85 Owners, Semarang',
    rating: 5,
    text: "We opted for the custom pool layout. The seamless indoor-outdoor transition gives us a sanctuary after long hospital shifts.",
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150'
  }
];

const STORAGE_KEY = 'dev_website_content';

export function getWebsiteContent(): WebsiteContent {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        aboutMe: { ...initialAboutMe, ...(parsed.aboutMe || {}) },
        testimonials: Array.isArray(parsed.testimonials) && parsed.testimonials.length > 0 
          ? parsed.testimonials 
          : initialTestimonials
      };
    }
  } catch (e) {
    console.error('Error reading website content from localStorage', e);
  }
  return {
    aboutMe: initialAboutMe,
    testimonials: initialTestimonials
  };
}

export function saveWebsiteContent(content: WebsiteContent): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    window.dispatchEvent(new Event('website_content_updated'));
  } catch (e) {
    console.error('Error saving website content to localStorage', e);
  }
}
