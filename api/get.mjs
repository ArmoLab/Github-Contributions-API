//import { fetch } from "node-fetch";
import { GenContributionData } from "./internal/GenContributionData.mjs";


// url: '/api/get?username=<username>',
export default async (request, response) => {
    const Search = request.url.split("?")[1];

    /**
     * @type {String} JSON or SVG
     */
    const Type = GetQueryString(Search, "type").toUpperCase(),
          UserName = GetQueryString(Search, "username");

    const ColorDefine = {
        BackgroundColor: GetQueryString(Search, "BackgroundColor"),
        TextColor: GetQueryString(Search, "TextColor"),
        RectColors: GetQueryString(Search, "RectColors").toString().replace(/%2C/gi, ",").split(","),
        RectOpacity: GetQueryString(Search, "RectOpacity")
    };

    let ContributionData = 
        (Type === "JSON" || Type === "SVG")
            ? await GenContributionData(UserName, Type, ColorDefine)
            : "? what do you mean";
    
    response.setHeader("Content-Type",
        Type === "JSON"
            ? "application/json;charset=UTF-8"
            : "image/svg+xml"
    );
    response.writeHead(200);
    response.write(ContributionData);
    response.end();

}
function GetQueryString (search, name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = search.match(reg);

    return !!r ? r[2] : 0 ;
}
