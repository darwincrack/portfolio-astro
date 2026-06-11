import type { ImageMetadata } from 'astro';
import project1 from '../images/project1.avif';
import project2 from '../images/project2.avif';
import project3 from '../images/project3.avif';
import project4 from '../images/project4.avif';
import project5 from '../images/project5.avif';
import project6 from '../images/project6.avif';
import project7 from '../images/project7.avif';
import project8 from '../images/project8.avif';
import project9 from '../images/project9.avif';
import project10 from '../images/project10.avif';
import project11 from '../images/project11.avif';
import project12 from '../images/project12.avif';
import project13 from '../images/project13.avif';
import project13_1 from '../images/project13.1.avif';
import project13_2 from '../images/project13.2.avif';
import project14 from '../images/project14.avif';
import project15 from '../images/project15.avif';
import project16 from '../images/project16.avif';
import project16_1 from '../images/project16_1.avif';
import project16_2 from '../images/project16_2.avif';
import project17 from '../images/project17.avif';
import project17_1 from '../images/project17_1.avif';
import project17_2 from '../images/project17_2.avif';
import project18 from '../images/project18.avif';
import project19 from '../images/project19.avif';
import projectsupport1 from '../images/projectsupport1.avif';

export const projectImages = {
  project1,
  project2,
  project3,
  project4,
  project5,
  project6,
  project7,
  project8,
  project9,
  project10,
  project11,
  project12,
  project13,
  'project13.1': project13_1,
  'project13.2': project13_2,
  project14,
  project15,
  project16,
  project16_1,
  project16_2,
  project17,
  project17_1,
  project17_2,
  project18,
  project19,
  projectsupport1,
} as const satisfies Record<string, ImageMetadata>;

export type ProjectImageKey = keyof typeof projectImages;

export function resolveProjectImage(key: string): ImageMetadata | undefined {
  return projectImages[key as ProjectImageKey];
}

export const projectImageKeys = Object.keys(projectImages) as ProjectImageKey[];
