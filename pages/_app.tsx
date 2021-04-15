import "tailwindcss/tailwind.css";
import "../styles/globals.css";
import {useEffect} from 'react';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
          // Registration was successful
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(err) {
          // registration failed :(
          console.log('ServiceWorker registration failed: ', err);
        });
      });
    }
  }, []);
  return <Component {...pageProps} />;
}

export default MyApp;
