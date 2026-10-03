import React from 'react';

/**
 * Consistent page header: icon + title + subtitle on the left,
 * optional badge / action buttons on the right.
 */
export const PageHeader = ({ icon: Icon, title, subtitle, badge, actions }) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#27272A] pb-6">
    <div>
      <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
        {Icon && <Icon className="w-8 h-8 text-[#E50914]" />}
        <span>{title}</span>
      </h1>
      {subtitle && <p className="text-xs sm:text-sm text-zinc-400 mt-1">{subtitle}</p>}
    </div>
    {(badge || actions) && (
      <div className="flex flex-wrap items-center gap-3">
        {badge}
        {actions}
      </div>
    )}
  </div>
);

export default PageHeader;
