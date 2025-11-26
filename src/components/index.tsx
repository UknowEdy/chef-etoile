import { ReactNode } from 'react';

interface PageTitleProps {
  title: string;
  subtitle?: string;
}

export function PageTitle({ title, subtitle }: PageTitleProps) {
  return (
    <>
      <div className="page-title">{title}</div>
      {subtitle && <div className="page-subtitle">{subtitle}</div>}
    </>
  );
}

interface SectionProps {
  title?: string;
  children: ReactNode;
}

export function Section({ title, children }: SectionProps) {
  return (
    <div className="section">
      {title && <div className="section-title">{title}</div>}
      {children}
    </div>
  );
}

interface ChefCardProps {
  name: string;
  location: string;
  distance: string;
  image?: string;
  slug: string;
}

export function ChefCard({ name, location, distance, image, slug }: ChefCardProps) {
  return (
    <a href={`/chef/${slug}`} className="chef-card">
      <img 
        src={image || '/placeholder-chef.jpg'} 
        alt={name}
        className="chef-card-image" 
      />
      <div className="chef-card-info">
        <div className="chef-card-name">{name}</div>
        <div className="chef-card-location">{location}</div>
        <div className="chef-card-distance">{distance}</div>
      </div>
    </a>
  );
}

interface MenuItemProps {
  title: string;
  description: string;
  mealType?: 'Midi' | 'Soir';
}

export function MenuItem({ title, description, mealType }: MenuItemProps) {
  return (
    <div className="menu-item">
      {mealType && (
        <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px', fontWeight: 600 }}>
          {mealType}
        </div>
      )}
      <div className="menu-item-title">{title}</div>
      <div className="menu-item-description">{description}</div>
    </div>
  );
}

interface SubscriptionCardProps {
  name: string;
  price: string;
  description: string;
  selected?: boolean;
  onClick?: () => void;
}

export function SubscriptionCard({ name, price, description, selected, onClick }: SubscriptionCardProps) {
  return (
    <div 
      className={`subscription-card ${selected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <div className="subscription-card-name">{name}</div>
      <div className="subscription-card-price">{price}</div>
      <div className="subscription-card-description">{description}</div>
    </div>
  );
}

interface WeekSelectorProps {
  weeks: string[];
  activeWeek: string;
  onWeekChange: (week: string) => void;
}

export function WeekSelector({ weeks, activeWeek, onWeekChange }: WeekSelectorProps) {
  return (
    <div className="week-selector">
      {weeks.map((week) => (
        <button
          key={week}
          className={`week-button ${activeWeek === week ? 'active' : ''}`}
          onClick={() => onWeekChange(week)}
        >
          {week}
        </button>
      ))}
    </div>
  );
}

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <div className="empty-state-title">{title}</div>
      <div className="empty-state-description">{description}</div>
    </div>
  );
}

export function Loader() {
  return (
    <div className="loader">
      <div className="spinner"></div>
    </div>
  );
}

interface WhatsAppButtonProps {
  phoneNumber: string;
  message: string;
  children: ReactNode;
}

export function WhatsAppButton({ phoneNumber, message, children }: WhatsAppButtonProps) {
  const handleClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <button className="btn btn-whatsapp" onClick={handleClick}>
      {children}
    </button>
  );
}

interface InfoRowProps {
  label: string;
  value: string | ReactNode;
}

export function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="info-row">
      <div className="info-row-label">{label}</div>
      <div className="info-row-value">{value}</div>
    </div>
  );
}

export { LogoIcon, LogoFull } from './Logo';
