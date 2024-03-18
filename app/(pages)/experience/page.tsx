export default function Experience() {
    return (
        <section className="bg-black py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-white mb-12 text-center">professional experience</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {experiences.map((experience, index) => (
                <div
                  key={index}
                  className="bg-gray-800 rounded-lg shadow-lg p-6 transform hover:scale-105 transition duration-300"
                >
                  <h3 className="text-xl font-semibold text-teal-400 mb-2">{experience.company}</h3>
                  <p className="text-gray-300 font-medium mb-2">{experience.position}</p>
                  <p className="text-gray-400 text-sm mb-4">{experience.duration}</p>
                  <p className="text-gray-200">{experience.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
  }
  
  const experiences = [
    {
      company: 'Advocate AI',
      position: 'Founder/CEO',
      duration: 'March 2023 - Present',
      description: 'Founded a startup and wore many hats.',
    },
    {
      company: 'Unstructured',
      position: 'Developer Advocate Engineer',
      duration: 'July 2023 - December 2023',
      description: 'Second developer relations engineer on a growing Gen AI company.',
    },
    {
        company: 'Gemini',
        position: 'Business Development Associate',
        duration: 'July 2023 - December 2023',
        description: 'Acted as a technical resource for the business development team.',
      },
      {
        company: 'Intertek',
        position: 'Safety Engineer',
        duration: 'June 2021 - January 2022',
        description: 'Ensured that products were safe for consumers.',
      },
      {
        company: 'University of California, Davis',
        position: 'Deep Learning Researcher (Intern)',
        duration: 'May 2019 - June 2020',
        description: 'Applied Computer Vision techniques to drone images to do yield prediction for agriculture.',
      },
      {
        company: 'Ottimate (Formerly PlateIQ)',
        position: 'Software Engineer (Intern)',
        duration: 'June 2018 - September 2018',
        description: 'Worked on AP automation with Computer Vision and NLP.',
      },
      {
        company: 'Text Recruit',
        position: 'Software Engineer (Intern)',
        duration: 'August 2017 - March 2018',
        description: 'Built AI chatbots for onboarding, recruiting and HR.',
      },
    // Add the rest of your experiences here
  ];