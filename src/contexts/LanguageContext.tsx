import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LanguageContextType {
  language: 'en' | 'sw';
  setLanguage: (lang: 'en' | 'sw') => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    'nav.home': 'Home',
    'nav.howItWorks': 'How It Works',
    'nav.insurance': 'Insurance Plans',
    'nav.donate': 'Donate',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.login': 'Login',
    'nav.joinNow': 'Join Now',
    'nav.logout': 'Logout',
    'hero.title': 'Healthcare for Every Kenyan',
    'hero.subtitle': 'Affordable insurance, medical aid, and community support for underserved patients. Powered by transparent blockchain technology.',
    'hero.joinNow': 'Join Now',
    'hero.donateNow': 'Donate Now',
    'hero.watchHow': 'Watch How It Works',
    'login.title': 'Welcome Back',
    'login.subtitle': 'Sign in to access your healthcare account',
    'login.email': 'Email or Phone Number',
    'login.password': 'Password',
    'login.rememberMe': 'Remember me',
    'login.forgotPassword': 'Forgot your password?',
    'login.signIn': 'Sign In',
    'login.signingIn': 'Signing In...',
    'register.title': 'Join TibaTrust',
    'register.subtitle': 'Create your account to access affordable healthcare'
  },
  sw: {
    'nav.home': 'Nyumbani',
    'nav.howItWorks': 'Jinsi Inavyofanya Kazi',
    'nav.insurance': 'Mipango ya Bima',
    'nav.donate': 'Changia',
    'nav.about': 'Kuhusu',
    'nav.contact': 'Wasiliana',
    'nav.login': 'Ingia',
    'nav.joinNow': 'Jiunge Sasa',
    'nav.logout': 'Toka',
    'hero.title': 'Huduma za Afya kwa Kila Mkenya',
    'hero.subtitle': 'Bima ya bei nafuu, msaada wa kimatibabu, na msaada wa jamii kwa wagonjwa wasiohudumika. Inaendeshwa na teknolojia ya uwazi wa blockchain.',
    'hero.joinNow': 'Jiunge Sasa',
    'hero.donateNow': 'Changia Sasa',
    'hero.watchHow': 'Angalia Jinsi Inavyofanya Kazi',
    'login.title': 'Karibu Tena',
    'login.subtitle': 'Ingia ili kufikia akaunti yako ya huduma za afya',
    'login.email': 'Barua pepe au Nambari ya Simu',
    'login.password': 'Nenosiri',
    'login.rememberMe': 'Nikumbuke',
    'login.forgotPassword': 'Umesahau nenosiri lako?',
    'login.signIn': 'Ingia',
    'login.signingIn': 'Kuingia...',
    'register.title': 'Jiunge na TibaTrust',
    'register.subtitle': 'Unda akaunti yako ili kupata huduma za afya za bei nafuu'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'en' | 'sw'>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};