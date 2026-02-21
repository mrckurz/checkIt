import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ImpressumPage() {
  const { t } = useTranslation();

  return (
    <div className="px-4 py-5 space-y-6">
      {/* Back Button */}
      <div className="flex items-center gap-2">
        <Link
          to="/settings"
          className="p-2 -ml-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold">{t('impressum.title')}</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5 space-y-6 text-sm leading-relaxed">
        {/* Legal Info */}
        <section>
          <h2 className="font-semibold text-base mb-2">
            {t('impressum.legalTitle')}
          </h2>
          <p className="font-medium">{t('impressum.owner')}</p>
          <p className="text-gray-500 dark:text-gray-400">
            {t('impressum.ownerDetail')}
          </p>
        </section>

        {/* Contact */}
        <section>
          <h2 className="font-semibold text-base mb-2">
            {t('impressum.contact')}
          </h2>
          <p>
            <a
              href={`mailto:${t('impressum.email')}`}
              className="text-primary hover:underline"
            >
              {t('impressum.email')}
            </a>
          </p>
        </section>

        {/* Disclosure */}
        <section>
          <h2 className="font-semibold text-base mb-2">
            {t('impressum.disclosureTitle')}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {t('impressum.disclosureText')}
          </p>
        </section>

        {/* Liability */}
        <section>
          <h2 className="font-semibold text-base mb-2">
            {t('impressum.liabilityTitle')}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {t('impressum.liabilityText')}
          </p>
        </section>

        {/* Copyright */}
        <section>
          <h2 className="font-semibold text-base mb-2">
            {t('impressum.copyrightTitle')}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {t('impressum.copyrightText')}
          </p>
        </section>

        {/* ODR */}
        <section>
          <h2 className="font-semibold text-base mb-2">
            {t('impressum.odrTitle')}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {t('impressum.odrText')}{' '}
            <a
              href={t('impressum.odrLink')}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline break-all"
            >
              {t('impressum.odrLink')}
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
