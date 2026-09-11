import type { ReactNode } from "react";
import { cn } from "./cn";

type SectionIntroProps = {
  eyebrow: string;
  title: string;
  description: ReactNode;
  titleId: string;
  eyebrowClassName?: string;
  descriptionClassName?: string;
};

export default function SectionIntro({
  eyebrow,
  title,
  description,
  titleId,
  eyebrowClassName,
  descriptionClassName,
}: SectionIntroProps) {
  return (
    <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div>
        <p className={cn("mb-3 eyebrow", eyebrowClassName)}>{eyebrow}</p>
        <h2
          id={titleId}
          className="max-w-2xl text-4xl font-black tracking-tight sm:text-6xl"
        >
          {title}
        </h2>
      </div>
      <p className={cn("max-w-sm sm:text-right", descriptionClassName)}>
        {description}
      </p>
    </div>
  );
}
