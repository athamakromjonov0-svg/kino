import React from 'react';

/**
 * Consistent page header: icon + title + subtitle on the left,
 * optional badge / action buttons on the right.
 */
export const PageHeader = ({ icon: Icon, title, subtitle, badge, actions }) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
    <div>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-[-0.02em] flex items-center gap-3">
        {Icon && <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-[#A78BFA]" />}
        <span>{title}</span>
      </h1>
      {subtitle && <p className="text-xs sm:text-sm text-[#9CA3AF] mt-1">{subtitle}</p>}
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
