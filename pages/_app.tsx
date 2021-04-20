import "tailwindcss/tailwind.css";
import "../styles/globals.css";
import {useEffect, useState} from 'react';

function MyApp({ Component, pageProps }) {
  const [dark, setDark] = useState();
  useEffect(() => {
    setDark(JSON.parse(localStorage.getItem("dark") ?? "false"));
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
  return <div className={dark ? "dark" : ""}><Component {...pageProps} /></div>;
}

export default MyApp;
