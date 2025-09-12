import React from "react";

export default function Section({
  title,
  subtitle,
  description,
  imageSrc,
  imageAlt = "",
  imagePosition = "right", // or "left"
  breadcrumbs = [],
}) {
  return (
    <section className="py-12 px-4 md:px-20 font-sans text-[#1A2954]">
      {/* Breadcrumb */}
      {breadcrumbs.length > 0 && (
        <div className="text-sm text-gray-500 mb-2">
          {breadcrumbs.map((crumb, index) => (
            <span key={index}>
              {crumb}
              {index < breadcrumbs.length - 1 && " > "}
            </span>
          ))}
        </div>
      )}

      {/* Grid layout */}
      <div
        className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center ${
          imagePosition === "left" ? "md:flex-row-reverse" : ""
        }`}
      >
        {/* Text content */}
        <div>
          {title && (
            <h2 className="text-2xl md:text-3xl font-bold mb-2 border-b-2 border-blue-500 w-fit">
              {title}
            </h2>
          )}
          {subtitle && (
            <h3 className="text-lg text-blue-600 font-semibold mb-4">
              {subtitle}
            </h3>
          )}
          {description && (
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {description}
            </p>
          )}
        </div>

        {/* Image content */}
        {imageSrc && (
          <div className="w-full max-w-[500px] mx-auto">
            <img
            src={imageSrc}
            alt={imageAlt}
            className="w-full rounded-lg shadow-lg object-cover"
        />
        </div>
        )}
      </div>
    </section>
  );
}
