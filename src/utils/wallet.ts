import { t } from "../languages";

// export async function checkWallet() {
//     if (!(window && window.arweaveWallet)) {
//         alert(
//             'Sign in method not available in this browser. Please use a different browser or install the ArConnect extension.'
//         );
//         return false;
//     }
//     const permissions = await window.arweaveWallet.getPermissions();
//     if (permissions.length <= 0) {
//         alert(t('Sign in please'));
//         return false;
//     }
//     return true;
// }

export async function checkWallet() {
    function showMessage(message: string) {
        const messageElement = document.createElement('div');
        messageElement.textContent = message;
        messageElement.style.position = 'fixed';
        messageElement.style.top = '0';
        messageElement.style.left = '0';
        messageElement.style.width = '100%';
        messageElement.style.padding = '10px';
        messageElement.style.backgroundColor = 'red';
        messageElement.style.color = 'white';
        messageElement.style.zIndex = '1000';
        document.body.appendChild(messageElement);
        setTimeout(() => {
            document.body.removeChild(messageElement);
        }, 5000);
    }

    if (!(window && window.arweaveWallet)) {
        showMessage('Sign in method not available in this browser. Please use a different browser or install the ArConnect extension.');
        return false;
    }
    const permissions = await window.arweaveWallet.getPermissions();
    if (permissions.length <= 0) {
        showMessage(t('Sign in please'));
        return false;
    }
    return true;
}
