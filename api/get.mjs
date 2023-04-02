//import { fetch } from "node-fetch";
import { GenContributionData } from "./internal/GenContributionData.mjs";


// url: '/api/get?username=<username>',
export default async (request, response) => {
    const Search = request.url.split("?")[1];

    /**
     * @type {String} JSON or SVG
     */
    const Type = GetQueryString(Search, "type").toUpperCase()

    const UserName = GetQueryString(Search, "username");
    let ContributionData = await GenContributionData(UserName, Type);
    
    response.send(ContributionData);
}
function GetQueryString (search, name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = search.match(reg);

    return !!r ? r[2] : 0 ;
    // 如果 r {Array} 爲 Truly 就返回 r[2]
}

//let ContributionsData = fetch();