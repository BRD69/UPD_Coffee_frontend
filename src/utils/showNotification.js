import { toast } from 'react-hot-toast';

export function showNotification(message, type = 'success') {
    if (window.innerWidth <= 768) {
        toast[type](message, { duration: 2000, position: 'top-center' });
    } else {
        toast[type](message, {
            duration: 2000,
            position: 'bottom-right',
            style: {
                background: type === 'success' ? '#e6f9ed' : '#fdeaea',
                color: type === 'success' ? '#218838' : '#c0392b',
                border: '1px solid ' + (type === 'success' ? '#b7e4c7' : '#f5c6cb'),
                borderRadius: '10px',
                fontSize: '15px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
            },
            iconTheme: {
                primary: type === 'success' ? '#34c759' : '#e74c3c',
                secondary: '#fff',
            },
        });
    }
}