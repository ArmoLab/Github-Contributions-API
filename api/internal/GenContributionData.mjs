import fetch from "node-fetch";
import HTMLParser from "node-html-parser";

// HTMLParser.parse


export async function GenContributionData (UserName, Type) {
    let SVG = await FetchUserData(UserName);
    return Type === "JSON"
                ? JSON.stringify(GenContributionObject(SVG, UserName))
                : SVG.toString();
}

/**
 * @param UserName {String}
 * @return {Object} Raw HTML
 */
async function FetchUserData (UserName) {
    let RawData = await fetch(`https://github.com/${UserName}`).then(res => res.text());
    let RawSVG = HTMLParser.parse(RawData).querySelector(".js-calendar-graph-svg");
    RawSVG.removeAttribute("class");
    RawSVG.setAttribute("height", "142")
    RawSVG.querySelector("g").removeAttribute("data-hydro-click");
    RawSVG.querySelector("g").removeAttribute("data-hydro-click-hmac");
    RawSVG.querySelector("g").setAttribute("transform", "translate(15, 50)");

    // <text class="title" dx="0" dy="16">One's GitHub Contributions Summary</text>
    let Rects = RawSVG.querySelectorAll("rect[class=\"ContributionCalendar-day\"]");
    for (let i=0; i<Rects.length; i++) {
        Rects[i].removeAttribute("class");
    }

    let Texts = RawSVG.querySelectorAll("text[class=\"ContributionCalendar-label\"]");
    for (let i=0; i<Texts.length; i++) {
        Texts[i].removeAttribute("class");
        Texts[i].removeAttribute("text-anchor");
    }


    RawSVG.innerHTML +=
        `<style>
            svg {
                background-color: #0d1117;
                border-radius: 8px;
                padding: 16px 20px;
            }
            text {
                font-size: 12px;
                font-weight: 400;
                color: #e6edf3;
                fill: #e6edf3;
            }
            text.title {
                font-size: larger;
                font-weight: 600;
            }
            rect[data-level="0"] {
                fill: #161b22;
            }
            rect[data-level="1"] {
                fill: #0e4429;
            }
            rect[data-level="2"] {
                fill: #006d32;
            }
            rect[data-level="3"] {
                fill: #26a641;
            }
            rect[data-level="4"] {
                fill: #39d353;
            }
        </style>`
        
    return RawSVG;
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