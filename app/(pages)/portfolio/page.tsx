export default function Portfolio() {
  return (
    <section className="bg-black py-20 space-background">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-white mb-12 text-center">
          portfolio
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className="bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-700 hover:border-blue-500 transition duration-300"
            >
              <div className="mb-4">
                <h3 className="text-2xl font-semibold text-white">{project.title}</h3>
              </div>
              <p className="text-gray-300 mb-4">{project.description}</p>
              <div className="flex flex-wrap">
                {project.techStack.map((tech, index) => (
                  <span
                    key={index}
                    className="bg-gray-800 text-gray-400 rounded-full px-3 py-1 text-sm mr-2 mb-2"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="mt-6">
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-blue-500 text-white rounded-full px-6 py-3 text-lg font-semibold transition duration-300 hover:bg-blue-600"
                >
                  Explore
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const projects = [
  {
    title: 'Advocate AI',
    description:
      'Helps college students and young professionals understand and navigate the legal world. Went through Founder University Cohort 7.',
    techStack: ['Vercel', 'Next JS', 'Spring Boot', 'Django', 'AWS', 'Mistral', 'GPT'],
    link: 'https://advocateai.xyz',
  },
  {
    title: 'Vent',
    description: 'A digital person to help solve the loneliness pandemic.',
    techStack: ['Vercel', 'Next JS', 'Tailwind', 'Prisma', 'AWS', 'GPT (LLMs)', 'Elevan Labs'],
    link: 'https://www.jackretterer.xyz/',
  },
  {
    title: 'R.A. Scheuring',
    description: 'Built a portfolio website for an Author. Updated her website to use the latest technologies and best practices.',
    techStack: ['Vercel', 'Next JS', 'Mailchimp'],
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
    link: '',
  },
];