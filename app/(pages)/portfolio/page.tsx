import { FC } from 'react';
import Link from 'next/link';

const Portfolio: FC = () => {
  return (
    <section className="bg-black py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-4xl font-bold text-white mb-16 text-center tracking-tight">portfolio</h2>
        <div className="space-y-12">
          {projects.map((project, index) => (
            <ProjectCard key={index} {...project} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface ProjectProps {
  title: string;
  description: string;
  techStack: string[];
  link: string;
}

const ProjectCard: FC<ProjectProps> = ({ title, description, techStack, link }) => (
  <div className="bg-black rounded-lg p-4 shadow-xl transition-all duration-300 hover:shadow-2xl hover:bg-zinc-750">
    {link ? (
      <Link href={link} passHref>
        <h3 className="text-2xl font-semibold text-emerald-400 mb-2 cursor-pointer hover:text-emerald-300 transition-colors duration-300">
          {title}
        </h3>
      </Link>
    ) : (
      <h3 className="text-2xl font-semibold text-emerald-400 mb-2">{title}</h3>
    )}
    <p className="text-zinc-300 mb-4">{description}</p>
    <div className="flex flex-wrap mb-4">
      {techStack.map((tech, index) => (
        <span
          key={index}
          className="bg-zinc-800 text-zinc-400 rounded-full px-3 py-1 text-sm mr-2 mb-2"
        >
          {tech}
        </span>
      ))}
    </div>
  </div>
);

const projects = [
  {
    title: 'Vent',
    description: 'A digital person to help solve the loneliness pandemic.',
    techStack: ['Vercel', 'Next JS', 'Tailwind', 'AWS', 'LLMs', 'Groq', 'Whisper', 'Eleven Labs', 'Splunk', 'MySQL', 'Pinecone'],
    link: 'https://www.jackretterer.xyz/',
  },
  {
    title: 'Advocate AI',
    description: 'Helps college students and young professionals understand and navigate the legal world. Went through Founder University Cohort 7.',
    techStack: ['Vercel', 'Next JS', 'Spring Boot', 'Django', 'AWS', 'Mistral', 'GPT'],
    link: 'https://advocateai.xyz',
  },
  {
    title: 'Bridgeworx Consulting',
    description: 'A team of experienced GTM experts within the field of Med Device.',
    techStack: ['Vercel', 'Next JS', 'Typescript', 'Tailwind'],
    link: 'https://bridgeworx.co',
  },
  {
    title: 'R.A. Scheuring',
    description: 'Built a portfolio website for R.A. Scheuring. Writer of DRYP: The Final Pandemic.',
    techStack: ['Vercel', 'Next JS', 'Mailchimp', 'Typescript', 'Tailwind'],
    link: 'https://rascheuring.vercel.app/',
  },
  {
    title: 'Blockchain Developer',
    description: 'Built a variety of NFT & DeFi applications.',
    techStack: ['Vercel', 'React', 'AWS'],
    link: 'https://twitter.com/BallerSociety_',
  },
  {
    title: 'Hardware Engineer',
    description: 'Built a server from the ground up to mine cryptocurrencies.',
    techStack: ['Harddrives', 'GPUs', 'Linux', 'SSDs', 'JBODs'],
    link: 'https://twitter.com/jaretterer',
  },
];

export default Portfolio;