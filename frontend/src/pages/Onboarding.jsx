import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import Button from '../components/Button';
import { ArrowRight } from 'lucide-react';
import beeLogo from '../assets/bee-logo.png';
import slide1Img from '../assets/onboarding_slide1.png';
import slide2Img from '../assets/onboarding_slide2.png';
import slide3Img from '../assets/onboarding_slide3.png';

const slides = [
    {
        id: 1,
        title: (
            <>
                Book a Tempo in <br />
                <span className="text-[#F5A623]">Under 2 Minutes</span>
            </>
        ),
        description: 'The fastest way to move cargo across the city. No haggling. No phone calls. Just open CargoBee and book your ride.',
        image: slide1Img,
    },
    {
        id: 2,
        title: (
            <>
                Verified & Trusted <br />
                <span className="text-[#F5A623]">Driver Partners</span>
            </>
        ),
        description: 'Every CargoBee driver undergoes strict background checks for your safety.',
        image: slide2Img,
    },
    {
        id: 3,
        title: (
            <>
                Live GPS <br />
                <span className="text-[#F5A623]">Trip Tracking</span>
            </>
        ),
        description: 'Monitor your cargo in real-time from pickup to secure delivery.',
        image: slide3Img,
    }
];

const Onboarding = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const navigate = useNavigate();

    const handleNext = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(prev => prev + 1);
        } else {
            navigate('/login');
        }
    };

    const handleSkip = () => {
        navigate('/login');
    };

    // Simple touch swipe detection
    const [touchStart, setTouchStart] = useState(null);

    const onTouchStart = (e) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchEnd = (e) => {
        if (!touchStart) return;
        const touchEnd = e.changedTouches[0].clientX;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe && currentSlide < slides.length - 1) {
            setCurrentSlide(prev => prev + 1);
        }
        if (isRightSwipe && currentSlide > 0) {
            setCurrentSlide(prev => prev - 1);
        }
    };

    const slide = slides[currentSlide];

    return (
        <PageWrapper className="flex flex-col h-screen relative bg-background page-enter font-sans overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center p-6 lg:px-12 lg:py-8 z-10 w-full shrink-0">
                <div className="font-bold text-xl flex items-center gap-2 text-accent">
                    <img src={beeLogo} alt="CargoBee" className="w-8 h-8 object-contain" />
                    CargoBee
                </div>
                <button
                    onClick={handleSkip}
                    className="bg-gray-100 dark:bg-gray-200 hover:bg-gray-200 dark:hover:bg-gray-300 text-accent font-semibold text-sm px-5 py-2 rounded-full transition-colors"
                >
                    Skip Intro
                </button>
            </div>

            {/* Main Content Split Layout */}
            <div
                className="flex-1 flex flex-col lg:flex-row items-center w-full max-w-7xl mx-auto"
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
            >
                {/* Left: Image Carousel */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 h-[45vh] lg:h-full">
                    <div className="relative w-full max-w-md aspect-square bg-surface rounded-[40px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] p-3 lg:p-4 transition-all duration-500">
                        {slide.image ? (
                            <img
                                src={slide.image}
                                alt={`Slide ${slide.id}`}
                                className="w-full h-full object-cover rounded-[32px] transition-opacity duration-500"
                            />
                        ) : (
                            <div className="w-full h-full bg-accent/5 rounded-[32px] relative overflow-hidden border border-border flex items-center justify-center">
                                <div className="text-6xl animate-bounce">🚐</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Text and Controls */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center items-start p-8 lg:p-16 lg:pr-24">
                    <div className="w-full max-w-lg">
                        <h1 className="text-4xl lg:text-5xl font-black leading-[1.15] mb-6 text-accent">
                            {slide.title}
                        </h1>
                        <p className="text-textSecondary leading-relaxed text-base lg:text-lg mb-6">
                            {slide.description}
                        </p>

                        {/* Amber Horizontal Divider */}
                        <div className="w-12 h-1 bg-[#F5A623] rounded-full mb-8"></div>

                        {/* Dots */}
                        <div className="flex gap-2 mb-10">
                            {slides.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${currentSlide === idx ? 'w-10 bg-[#F5A623]' : 'w-2 bg-gray-200 dark:bg-gray-400'
                                        }`}
                                />
                            ))}
                        </div>

                        {/* Button */}
                        <Button
                            onClick={handleNext}
                            className="py-4 px-8 text-lg rounded-2xl flex items-center justify-center gap-3 w-full sm:w-auto min-w-[200px] bg-[#F5A623] hover:bg-[#d98b18] text-white border-none"
                        >
                            {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
                            <ArrowRight size={20} />
                        </Button>

                        {/* Login Link */}
                        <p className="mt-6 text-sm text-textSecondary font-medium">
                            Already have an account?{' '}
                            <button onClick={() => navigate('/login')} className="text-[#F5A623] font-bold hover:underline">
                                Log in
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};

export default Onboarding;
