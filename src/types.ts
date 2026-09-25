export interface ServiceItem {
  id: string;
  title: string;
  icon: string; // lucide icon name
  image: string;
  shortDesc: string;
  details: string;
  price: string;
  turnaround: string;
}

export interface BuildItem {
  id: string;
  image: string;
  carModel: string;
  category: 'Tuning' | 'Custom' | 'Performance' | 'Detailing';
  workDone: string;
  instagramUrl: string;
}

export interface GoogleReview {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  avatar: string;
}

export interface Booking {
  id: string;
  name: string;
  phone: string;
  service: string;
  date: string;
  carDetails: string;
  notes?: string;
  status: 'pending' | 'confirmed';
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  date: string;
  author: string;
  authorTitle: string;
  category: string;
  readTime: string;
  coverImage: string;
  summary: string;
  content: string[];
  tags: string[];
}
