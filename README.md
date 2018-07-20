# Doria

🍪 The cookie box loved by cookies' fanatics

## Usage

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
