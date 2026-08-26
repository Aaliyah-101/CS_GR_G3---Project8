import {useState, useRef} from 'react'

export default function AboutUs() {
    const [showMore, setShowMore] = useState(false)

    return (
        <div className="max-w-4xl mx-auto py-16">
            <h1 className="text-3xl font-bold mb-4">About Us</h1>
            <p className="text-lg text-sienna mb-6">
                We are a community of storytellers dedicated to creating and sharing visual narratives.
            </p>
            {showMore && (
                <p className="text-lg text-sienna mb-6">
                    Our mission is to empower individuals to express their creativity and share their stories with the world. Through our platform, users can upload their own images and create compelling visual narratives that resonate with others.
                </p>
            )}
            <button
                onClick={() => setShowMore(!showMore)}
                className="font-body text-amber hover:text-amber/80"
            >
                {showMore ? 'Show Less' : 'Show More'}
            </button>
        </div>
    )
}