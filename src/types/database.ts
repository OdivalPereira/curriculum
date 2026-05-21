export interface PersonalInfo {
  id?: string;
  full_name: string;
  headline_pt: string;
  headline_en: string;
  headline_es: string;
  bio_pt: string;
  bio_en: string;
  bio_es: string;
  avatar_url?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin_url?: string;
  instagram_url?: string;
}

export interface Experience {
  id: string;
  company: string;
  role_pt: string;
  role_en: string;
  role_es: string;
  period_text_pt: string;
  period_text_en: string;
  period_text_es: string;
  description_pt: string;
  description_en: string;
  description_es: string;
  technologies: string[];
  order_index?: number;
}

export interface Project {
  id: string;
  title_pt: string;
  title_en: string;
  title_es: string;
  description_pt: string;
  description_en: string;
  description_es: string;
  image: string;
  tags: string[];
  link: string;
}
