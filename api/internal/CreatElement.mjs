import HTMLParser from "node-html-parser";
/**
 * 
 * @param {String} TagName 
 * @param {Array} Attrs
 * @param {String} Content
 */
export function CreatElement (TagName, Attrs, Content) {
    let Target = HTMLParser.parse(`<${TagName}></${TagName}>`).querySelector(TagName);
    for (let i=0; i<Attrs.length; i++) {
        Target.setAttribute(Attrs[i].name, Attrs[i].value.toString());
    }
    if (Content) {
        Target.innerHTML = Content;
    }
    return Target;
}