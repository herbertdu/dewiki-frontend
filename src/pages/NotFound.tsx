import { useVoerkaI18n } from '@voerkai18n/react';
import ChangeLanguage from '../components/ChangeLanguage';
function NotFound() {
    const { t } = useVoerkaI18n();
    return (
        <div>
            <div className="flex justify-end">
                <ChangeLanguage />
            </div>
            <h1>{t('404: Page Not Found')}</h1>
        </div>
    );
}

export default NotFound;
