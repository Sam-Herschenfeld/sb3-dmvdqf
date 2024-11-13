export interface Testimonial {
  rating: number;
  text: string;
  author: string;
}

export interface Feature {
  icon: React.FC<{ className?: string }>;
  title: string;
  description: string;
}