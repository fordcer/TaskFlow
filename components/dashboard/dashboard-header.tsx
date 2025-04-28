import React from "react";

interface DashboardHeaderProps {
  heading: string;
  text?: string;
  children?: React.ReactNode;
}

export default function DashboardHeader({
  heading,
  text,
  children,
}: Readonly<DashboardHeaderProps>) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex flex-col">
        <p className="text-2xl md:text-4xl">{heading}</p>
        {text && <p className="md:text-lg text-muted-foreground">{text}</p>}
      </div>
      {children}
    </div>
  );
}
