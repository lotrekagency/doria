import CookieBox from './doria.js';

let loadScript = (src) => {
    let script = document.createElement('script');
    script.src = src;
    document.body.appendChild(script);
    return new Promise((resolve, reject) => {
        script.addEventListener('load', function() {
            resolve();
        });
    })
}

export { CookieBox, loadScript };
