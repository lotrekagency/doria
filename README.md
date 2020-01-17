# Doria
[![Build Status](https://travis-ci.org/lotrekagency/doria.svg?branch=master)](https://travis-ci.org/lotrekagency/doria)

🍪 The cookie box loved by cookies' fanatics

## Build
```sh
git clone https://github.com/lotrekagency/doria
yarn install
yarn build
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

## Development

To run test suite

    yarn test

See demo on [index.html](https://github.com/lotrekagency/doria/blob/master/index.html)
