import fetch from "node-fetch";
import HTMLParser from "node-html-parser";

// HTMLParser.parse


export async function GenContributionData (UserName, Type) {
    let SVG = await FetchUserData(UserName);
    return Type === "JSON"
                ? JSON.stringify(GenContributionObject(SVG, UserName))
                : Type === "SVG" ? SVG.toString() : "? what do you mean"
}

/**
 * @param UserName {String}
 * @return {Object} Raw HTML
 */
async function FetchUserData (UserName) {
    let RawData = await fetch(`https://github.com/${UserName}`).then(res => res.text());
    return HTMLParser.parse(RawData).querySelector(".js-calendar-graph-svg");
}

function GenContributionObject (RawHTML, UserName) {
    const Obj = {};
    Obj.Username = UserName;
    Obj.GenAt = new Date().toUTCString();
    Obj.Contributions = [];
    for (let i1=0; i1<RawHTML.querySelector("g").querySelectorAll("g").length; i1++) {
        Obj.Contributions[i1] = [];
        let AWeek = RawHTML.querySelector("g").querySelectorAll("g")[i1].querySelectorAll("rect.ContributionCalendar-day");
        for (let i2=0; i2<AWeek.length; i2++) {
            Obj.Contributions[i1][i2] = {};
            let ADay = Obj.Contributions[i1][i2];
            let DayContributions = AWeek[i2].innerHTML.split(" contribution")[0];
            DayContributions = DayContributions === "No" ? 0 : DayContributions-1+1;

            ADay.Date = AWeek[i2].getAttribute("data-date");
            ADay.Level = AWeek[i2].getAttribute("data-level") -1+1;
            ADay.Contributions = DayContributions
        }
    }
    return Obj;
}