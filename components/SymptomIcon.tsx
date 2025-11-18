import React from 'react';

interface SymptomIconProps {
  icon: string;
  className?: string;
}

const SymptomIcon: React.FC<SymptomIconProps> = ({ icon, className = 'w-6 h-6' }) => {
  const commonProps = {
    className,
    viewBox: '0 0 64 64',
    xmlns: 'http://www.w3.org/2000/svg',
    fill: 'none',
    stroke: 'currentColor',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    strokeWidth: '3',
  };

  switch (icon) {
    case 'prognosis': // Clipboard with pulse line
      return (
        <svg {...commonProps} aria-label="Prognosis icon">
            <path d="M20,10H14a2,2,0,0,0-2,2V52a2,2,0,0,0,2,2H50a2,2,0,0,0,2-2V12a2,2,0,0,0-2-2H44" stroke="#78909c"/>
            <path d="M40,10V6a2,2,0,0,0-2-2H26a2,2,0,0,0-2,2v4" stroke="#78909c"/>
            <path d="M18,34h8l4-8,4,16,4-12,4,4h8" stroke="#f44336"/>
        </svg>
      );
    case 'medication': // Pill/capsule
      return (
        <svg {...commonProps} aria-label="Medication icon">
            <path d="M32,16,48,32" stroke="#4dd0e1" />
            <path d="M16,32,32,48" stroke="#90a4ae" />
            <path d="M48,32A22.6,22.6,0,0,0,32,16,22.6,22.6,0,0,0,16,32,22.6,22.6,0,0,0,32,48,22.6,22.6,0,0,0,48,32Z" />
        </svg>
      );
    case 'diet': // Apple
      return (
        <svg {...commonProps} aria-label="Diet icon">
            <path d="M44,22a12,12,0,0,0-24,0c0,12,12,20,12,20s12-8,12-20Z" stroke="#8bc34a"/>
            <path d="M32,12a4,4,0,0,1,4,4" stroke="#795548"/>
        </svg>
      );
    case 'head': // Headache
      return (
        <svg {...commonProps} aria-label="Headache icon">
            <path d="M42,50A20,20 0,1,0 22,30" stroke="#78909c" />
            <path d="M22,30V14h8" stroke="#78909c" />
            <path d="M48.4,15.6l-4,4m-2.8-2.8l4-4" stroke="#f44336" />
            <path d="M54,25H50m2.8-2.8l-2.8,2.8" stroke="#f44336" />
        </svg>
      );
    case 'fever': // Thermometer
        return (
            <svg {...commonProps} aria-label="Thermometer icon for fever">
                <path d="M36.6,31.4l-18,18a7.4,7.4 0,0,1-10.4,0,7.4,7.4 0,0,1,0-10.4l18-18" stroke="#90a4ae" />
                <path d="M29,24l5.6,5.6" stroke="#90a4ae" />
                <path d="M34,19l5.6,5.6" stroke="#90a4ae" />
                <path d="M47,20v-4h-4" stroke="#90a4ae" />
                <path d="M43,16l-4-4" stroke="#90a4ae" />
                <circle cx="16" cy="46" r="6" fill="#f44336" stroke="none" />
            </svg>
        );
    case 'cough': // Person coughing
        return (
            <svg {...commonProps} aria-label="Icon of a person coughing">
                <path d="M42,42V30A10,10 0,0,0 32,20h0A10,10 0,0,0 22,30V48" stroke="#78909c" />
                <path d="M28,24a6,6 0,0,1-12,0" stroke="#78909c" />
                <path d="M48,30l4-2m-2,6l4,2m-10-8l-4-2" stroke="#4dd0e1" />
            </svg>
        );
    case 'lungs': // Lungs
      return (
        <svg {...commonProps} aria-label="Lungs icon">
            <path d="M20,20A12,12 0,0,0 8,32v12H20" stroke="#4dd0e1" />
            <path d="M44,20A12,12 0,0,1 56,32v12H44" stroke="#4dd0e1" />
            <path d="M20,20v24h8V12h-4a4,4 0,0,0-4,4z" stroke="#4dd0e1" />
            <path d="M44,20v24h-8V12h4a4,4 0,0,1,4,4z" stroke="#4dd0e1" />
        </svg>
      );
    case 'stomach': // Person with stomach pain
      return (
        <svg {...commonProps} aria-label="Stomach pain icon">
            <circle cx="32" cy="18" r="6" stroke="#78909c" />
            <path d="M32,24v12" stroke="#78909c" />
            <path d="M22,54V40l10-6,10,6v14" stroke="#78909c" />
            <path d="M26,34l-8,2V22l8,4" stroke="#78909c" />
            <path d="M38,34l8,2V22l-8,4" stroke="#78909c" />
            <path d="M34.8,42.8l-2.8-2.8l-4.2,4.2l-2.8-2.8" stroke="#f44336" />
            <path d="M34.8,47.2l-2.8,2.8l-4.2-4.2l-2.8,2.8" stroke="#f44336" />
        </svg>
      );
    case 'skin': // Arm with rash
      return (
        <svg {...commonProps} aria-label="Skin rash icon">
            <path d="M14,26l8-8,28,28-8,8Z" stroke="#ffc107" />
            <circle cx="28" cy="24" r="2" fill="#f44336" stroke="none"/>
            <circle cx="22" cy="30" r="1.5" fill="#f44336" stroke="none"/>
            <circle cx="36" cy="34" r="2.5" fill="#f44336" stroke="none"/>
            <circle cx="42" cy="28" r="1" fill="#f44336" stroke="none"/>
        </svg>
      );
    case 'joint': // Joint with pain
      return (
        <svg {...commonProps} aria-label="Joint pain icon">
            <path d="M32,12V24a8,8 0,0,0 8,8h8" stroke="#78909c" />
            <path d="M32,52V40a8,8 0,0,1 8-8h8" stroke="#78909c" />
            <path d="M21.2,21.2l-5.7,5.7m2.8-2.8l5.7-5.7" stroke="#f44336"/>
            <path d="M12,24h8m-2.3-5.7l-2.9,2.9" stroke="#f44336"/>
        </svg>
      );
    case 'dizzy': // Head with swirls
        return (
            <svg {...commonProps} aria-label="Dizziness icon">
                 <circle cx="32" cy="32" r="8" stroke="#78909c" />
                 <path d="M46,18A24,24 0,1,0 52,40" stroke="#4dd0e1" />
                 <path d="M18,46A24,24 0,1,0 12,24" stroke="#4dd0e1" strokeDasharray="6,8" />
            </svg>
        );
    case 'nausea': // Nauseous face
        return (
            <svg {...commonProps} aria-label="Nausea icon">
                <circle cx="32" cy="32" r="24" stroke="#8bc34a" />
                <path d="M22,26a2,2 0,0,1-4,0m20,0a2,2 0,0,0,4,0" stroke="#8bc34a" />
                <path d="M22,42s4-4,10-4,10,4,10,4" stroke="#8bc34a" />
                <path d="M24,40s4,4,8,4,8-4,8-4" stroke="#8bc34a" strokeDasharray="3,3" />
            </svg>
        );
    case 'fatigue': // Yawning person
        return (
            <svg {...commonProps} aria-label="Fatigue icon">
                 <circle cx="32" cy="18" r="8" stroke="#78909c" />
                 <path d="M22,48V32a10,10 0,0,1,20,0v16" stroke="#78909c" />
                 <path d="M24,42a8,8 0,0,0,16,0" stroke="#78909c" />
            </svg>
        );
    case 'other':
    default: // question icon
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
           <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-12h2v2h-2zm0 4h2v6h-2z"></path>
        </svg>
      );
  }
};

export default SymptomIcon;
