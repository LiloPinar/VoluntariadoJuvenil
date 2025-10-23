import React from 'react';
import { Header } from '@/components/Header';
import { useLocale } from '@/i18n/LocaleContext';

const Login = () => {
  const { t } = useLocale();

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPage={t('inicio_sesion')} />
      <main className="container px-4 py-16">
        <h1 className="text-2xl font-bold mb-4">{t('login_title')}</h1>
        <p className="text-muted-foreground">{t('login_desc')}</p>
      </main>
    </div>
  );
};

export default Login;
