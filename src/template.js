export default class Template {

    constructor(templateId, destination, content, data) {
        this.templateId = templateId;
        this.destination = destination;
        this.data = data;
        this.content = content;
    }

    render() {
        let cache = {};
        let tmpl = (str, data) => {
            // Figure out if we're getting a template, or if we need to
            // load the template - and be sure to cache the result.
            let fn = !/\W/.test(str) ?
              cache[str] = cache[str] ||
                tmpl(document.getElementById(str) ? document.getElementById(str).innerHTML : this.content) :
                // Generate a reusable function that will serve as a template
                // generator (and which will be cached).
                new Function("obj",
                    "var p=[],print=function(){p.push.apply(p,arguments);};" +

                    // Introduce the data as local variables using with(){}
                    "with(obj){p.push('" +

                    // Convert the template into pure JavaScript
                    str
                    .replace(/[\r\t\n]/g, " ")
                    .split("<%").join("\t")
                    .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                    .replace(/\t=(.*?)%>/g, "',$1,'")
                    .split("\t").join("');")
                    .split("%>").join("p.push('")
                    .split("\r").join("\\'") + "');}return p.join('');"
                );

            // Provide some basic currying to the user
            return data ? fn( data ) : fn;
        };
        let results = document.getElementById(this.destination);
        results.innerHTML = tmpl(this.templateId, this.data);
    }
}

export {Template}
