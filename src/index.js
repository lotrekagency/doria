import CookieBox from './doria.js';

let loadScript = (src) => {
    let script = document.createElement('script');
    script.src = src;
    document.body.appendChild(script);
}

export { CookieBox, loadScript };
