import HTMLParser from "node-html-parser";
/**
 * 
 * @param {String} TagName 
 * @param {Array} Attrs
 * @param {String} Content
 */
export function CreatElement (TagName, Attrs, Content) {
    let Target = HTMLParser.parse(`<${TagName}></${TagName}>`).querySelector(TagName);
    for (let i in Attrs) {
        Target.setAttribute(i, Attrs[i]);
    }
    if (Content) {
        Target.innerHTML = Content;
    }
    return Target;
}