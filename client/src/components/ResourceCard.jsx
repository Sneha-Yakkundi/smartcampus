import { useState } from "react";

function ResourceCard({ resource, onBook }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition duration-300"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-32 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl">📦</span>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {resource.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                    {resource.description}
                </p>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                        <span className="text-gray-500 dark:text-gray-400">Location</span>
                        <p className="text-gray-900 dark:text-white font-semibold">{resource.location}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                        <span className="text-gray-500 dark:text-gray-400">Capacity</span>
                        <p className="text-gray-900 dark:text-white font-semibold">{resource.capacity}</p>
                    </div>
                </div>

                {/* Status */}
                <div className="mb-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        resource.status === "available" 
                            ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                            : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                    }`}>
                        {resource.status || "Available"}
                    </span>
                </div>

                {/* Button */}
                {isHovered && (
                    <button
                        onClick={() => onBook && onBook(resource.id)}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-200"
                    >
                        Book Now
                    </button>
                )}
            </div>
        </div>
    );
}

export default ResourceCard;
