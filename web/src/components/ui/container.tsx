import React from "react";

/**
 * Container component to centralize content with a max width for desktop,
 * and appropriate padding for mobile.
 */
export default function Container({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={`mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 ${className}`}
            data-testid="container"
        >
            {children}
        </div>
    );
}
