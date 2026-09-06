import React from "react";
import { Link } from "react-router-dom";

interface AnimatedLinkProps {
  to?: string;
  href?: string;
  children: React.ReactNode;
  className?: string;
  underlineColor?: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
}

export const AnimatedLink: React.FC<AnimatedLinkProps> = ({
  to,
  href,
  children,
  className = "",
  underlineColor = "bg-[#D4AF37]",
  target,
  rel,
  onClick,
}) => {
  const content = (
    <span className={`relative inline-flex items-center group overflow-hidden py-0.5 ${className}`}>
      <span className="transition-transform duration-300 group-hover:-translate-y-[1px]">
        {children}
      </span>
      <span
        className={`absolute bottom-0 left-0 w-full h-[1px] ${underlineColor} origin-left scale-x-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100`}
      />
    </span>
  );

  if (to) {
    return (
      <Link to={to} onClick={onClick} className="inline-block">
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} target={target} rel={rel} onClick={onClick} className="inline-block">
        {content}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className="inline-block border-0 bg-transparent p-0 text-left">
      {content}
    </button>
  );
};
