import type { ClassValue } from "clsx";

declare module "clsx" {
  export default function clsx(...classes: ClassValue[]): string;
}

interface Tag {
  _id: string;
  name: string;
}

interface Author {
  _id: string;
  name: string;
  image: string;
}

interface Question {
  _id: string;
  title: string;
  tags: Tag[];
  author: Author;
  createdAt: Date;
  views: number;
  answers: number;
  upvotes: number;
}
