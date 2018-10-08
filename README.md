# Doria

🍪 The cookie box loved by cookies' fanatics

## Build
```sh
    git clone https://github.com/lotrekagency/doria
    npm i
    npm run build
```
And you have in `lib` folder, compiled Doria Lib
## Usage
```js
    let doria = new DoriaCookieBox();
    doria.addCookieSettings('default', 'Default', 'Accept default cookies', true);
    doria.addCookieSettings('marketing', 'Marketing', 'Accept Marketing cookies');
    doria.on('default', () => {
        // Execute your script
    })
    doria.on('marketing', () => {
        // Execute your script
    })
    doria.bake()
```
See demo on [index.html](https://github.com/lotrekagency/doria/blob/master/index.html)
