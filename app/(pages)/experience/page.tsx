import { FC } from 'react';

const Experience: FC = () => {
  return (
    <section className="bg-black py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-4xl font-bold text-white mb-16 text-center tracking-tight">professional experience</h2>
        <div className="space-y-12">
          {experiences.map((experience, index) => (
            <ExperienceCard key={index} {...experience} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface ExperienceProps {
  company: string;
  position: string;
  duration: string;
  description: string[];
}

const ExperienceCard: FC<ExperienceProps> = ({ company, position, duration, description }) => (
  <div className="bg-black rounded-lg p-4 shadow-xl transition-all duration-300 hover:shadow-2xl hover:bg-zinc-750">
    <h3 className="text-2xl font-semibold text-emerald-400 mb-2">{company}</h3>
    <p className="text-xl text-zinc-200 font-medium mb-1">{position}</p>
    <p className="text-sm text-zinc-400 mb-4">{duration}</p>
    <ul className="list-disc list-inside text-zinc-300 space-y-2">
      {description.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  </div>
);

const experiences = [
  {
    company: 'Vent AI',
    position: 'Founder',
    duration: 'March 2023 - Present',
    description: [
      'Led development of an AI companion app, bridging the gap between friendship and therapy',
      'Built frontend using React & Next.js, and backend with TypeScript in Express',
      'Developed a mobile app with Expo and React Native',
      'Engineered memory solutions for LLMs to enhance user experience',
      'Optimized Retrieval Augmented Generation (RAG) for delivering accurate context to models with low latency',
      'Conducted user research and usability testing to iterate on product design',
    ],
  },
  {
    company: 'Unstructured',
    position: 'Developer Advocate Engineer',
    duration: 'July 2023 - December 2023',
    description: [
      `Led team's community outreach program, scaling API adoption from 0 to 3500 users`,
      'Developed tailored RAG systems for enterprise clients using open-source and closed-source LLMs',
      'Authored technical documents, blogs, and social media posts to maximize product usage',
      'Built and maintained comprehensive technical documentation for OSS and hosted solutions',
      'Engaged with customers and community members, gathering feedback to drive product improvements',
      'Fine-tuned open-source embedding models and LLMs, including LLama and Mistral, for on-premise systems'
    ],
  },
  {
    company: 'Gemini',
    position: 'Associate',
    duration: 'January 2022 - July 2023',
    description: [
      'Developed data dashboards using Looker to track product performance and user engagement',
      'Served as key liaison between clients and engineering/product management teams',
      'Contributed to expanding self-service tool user base from 0 to 1,500 users in 9 months, personally responsible for 40% growth',
      `Generated external financial reports using Snowflake and Pandas for enterprise partners' tax documentation`,
      'Translated client feedback into actionable insights for new product features'
    ],
  },
  {
    company: 'University of California, Davis',
    position: 'Deep Learning Researcher (Intern)',
    duration: 'May 2019 - June 2020',
    description: [
      'Led research team leveraging SOTA computer vision models on drone-captured imagery, achieving 93% classification accuracy',
      'Collected large quantities of raw drone data for agriculture yield prediction',
      'Managed ML pipeline including preprocessing, training, and testing of multiple CNNs'
    ],
  },
  {
    company: 'Ottimate (Formerly PlateIQ)',
    position: 'Software Engineer (Intern)',
    duration: 'June 2018 - September 2018',
    description: [
      'Developed computer vision models for invoice layout type detection and field localization, achieving 91% accuracy',
      'Managed and processed labeled data from Mechanical Turk, refining dataset for model training',
      'Analyzed OCR system errors and developed NLP error correction models, improving accuracy by 10%'
    ],
  },
  {
    company: 'TextRecruit',
    position: 'AI Engineer',
    duration: 'August 2017 - March 2018',
    description: [
      'Developed chatbots for HR using IBM Watson to facilitate company onboarding and recruiting',
      'Created and maintained robust automated testing suite for early issue identification and resolution',
      'Contributed to more stable and reliable software product through improved testing processes'
    ],
  },
];

export default Experience;