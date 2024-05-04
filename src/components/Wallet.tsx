import { useVoerkaI18n } from '@voerkai18n/react';
import React, { useEffect, useState } from 'react';
import { PermissionType } from 'arconnect';
const permissions: PermissionType[] = ['ACCESS_ADDRESS', 'SIGNATURE', 'SIGN_TRANSACTION', 'DISPATCH'];

const Wallet: React.FC = () => {
    const { t } = useVoerkaI18n();
    const [address, setAddress] = useState('');

    useEffect(() => {
        const fetch = async () => {
            if (!(window && window.arweaveWallet)) {
                return;
            }

            const permissions = await window.arweaveWallet.getPermissions();
            if (permissions.includes('ACCESS_ADDRESS')) {
                const address = await window.arweaveWallet.getActiveAddress();
                setAddress(address);
            }
        };

        fetch();
    }, []);

    const fetchAddress = async () => {
        if (!(window && window.arweaveWallet)) {
            alert(t('Sign in method not available in this browser.\nPlease use a different browser or install the ArConnect extension.'));
            return;
        }
        await window.arweaveWallet.connect(permissions, {
            name: 'DeWiki',
            logo: 'H6-G3FiknMDKBF4zGHnKNojhKCU5v-37rk4aCTao0-4',
        });
        try {
            const address = await window.arweaveWallet.getActiveAddress();
            setAddress(address);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            {address ? (
                <button className="px-4 py-2 text-indigo-color border border-solid border-indigo-color">
                    {address.slice(0, 4)}...{address.slice(-3)}
                </button>
            ) : (
                <button
                    onClick={fetchAddress}
                    className="px-4 py-2 text-white bg-gradient-to-r from-violet-400 to-indigo-color"
                >
                    {t('Sign In')}
                </button>
            )}
        </>
    );
};

export default Wallet;
