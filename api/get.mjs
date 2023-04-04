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

    let ContributionData = 
        (Type === "JSON" || Type === "SVG")
            ? await GenContributionData(UserName, Type)
            : "? what do you mean";
    
    response.send(ContributionData);
}
function GetQueryString (search, name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = search.match(reg);

    return !!r ? r[2] : 0 ;
}
