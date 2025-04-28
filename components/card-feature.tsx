import React from "react";

interface CardFeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function CardFeature({
  icon,
  title,
  description,
}: Readonly<CardFeatureProps>) {
  return (
    <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
      <div className="rounded-full bg-primary/10 p-3">{icon}</div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-muted-foreground">{description}</p>
    </div>
  );
}
