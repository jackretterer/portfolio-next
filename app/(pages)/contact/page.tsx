import { FC } from 'react';

const ContactPage: FC = () => {
    return (
        <div className="h-[90vh] bg-black text-white flex flex-col">
            <div className="flex-grow flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl w-full space-y-16">
                    <h1 className="text-5xl font-extrabold text-center tracking-tight">
                        Contact Me
                    </h1>
                    <p className="text-xl text-zinc-300 text-center leading-relaxed max-w-3xl mx-auto">
                        Reach out via Twitter or LinkedIn.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;