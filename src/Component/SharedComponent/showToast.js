import { toast }  from 'react-toastify';

 export const showToast = (message , type ) => {
    toast(message , { type} );
 }