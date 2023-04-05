import fetch from "node-fetch";
import HTMLParser from "node-html-parser";

// HTMLParser.parse


export async function GenContributionData (UserName, Type) {
    let UserData = await FetchUserData(UserName);
    return Type === "JSON"
                ? JSON.stringify(GenContributionObject(UserData.RawSVG, UserData.total, UserName))
                : UserData.RawSVG.toString();
}

/**
 * @param UserName {String}
 * @return {Object} Raw HTML
 */
async function FetchUserData (UserName) {
    let RawHTML = await fetch(`https://github-com.husk.gq/${UserName}`)
                            .then(res => res.text())
                            .then(res => {return HTMLParser.parse(res)})
    let total = 
        RawHTML
            .querySelector("div.js-yearly-contributions")
            .querySelector("h2.f4.text-normal.mb-2")
            .innerHTML
            .replace(/\n/gi,"")
            .split("contribution")[0] -1+1;

    console.log(total)
    let RawSVG = HTMLParser.parse(RawHTML).querySelector(".js-calendar-graph-svg");
    
    RawSVG.setAttribute("height", "158")
    RawSVG.removeAttribute("class");
    RawSVG.querySelector("g").removeAttribute("data-hydro-click");
    RawSVG.querySelector("g").removeAttribute("data-hydro-click-hmac");
    RawSVG.querySelector("g").setAttribute("transform", "translate(15, 50)");

    let Rects = RawSVG.querySelectorAll("rect[class=\"ContributionCalendar-day\"]");
    for (let i=0; i<Rects.length; i++) {
        Rects[i].removeAttribute("class");
        Rects[i].innerHTML = Rects[i].innerHTML.split(" contribution")[0];
    }

    let Texts = RawSVG.querySelectorAll("text[class=\"ContributionCalendar-label\"]");
    for (let i=0; i<Texts.length; i++) {
        Texts[i].removeAttribute("class");
        Texts[i].removeAttribute("text-anchor");
    }

    RawSVG.innerHTML = 
        `<text class="title" dx="0" dy="16">${UserName}'s GitHub Contributions Summary - last year</text>` + 
        RawSVG.innerHTML;
    RawSVG.innerHTML += 
        `<text class="desc" transform="translate(0, 157)" text-anchor="start">
            Total ${total} Contributions | 
            By kobe-koto/Github-Contributions-API | 
            Gen at ${new Date().toUTCString()}
        </text>`
    RawSVG.innerHTML += 
        `<g transform="translate(656, 148)">
            <rect width="10" height="10" rx="2" ry="2" x="00" y="0" data-level="0"></rect>
            <rect width="10" height="10" rx="2" ry="2" x="12" y="0" data-level="1"></rect>
            <rect width="10" height="10" rx="2" ry="2" x="24" y="0" data-level="2"></rect>
            <rect width="10" height="10" rx="2" ry="2" x="36" y="0" data-level="3"></rect>
            <rect width="10" height="10" rx="2" ry="2" x="48" y="0" data-level="4"></rect>
        </g>`
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
                font-family: sans-serif;
                color: #e6edf3;
                fill: #e6edf3;
            }
            text.title {
                font-size: larger;
                font-weight: 600;
            }
            text.desc {
                font-size: normal;
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
        
    return { RawSVG, total };
}

function GenContributionObject (RawHTML, total, UserName) {
    const Obj = {};
    Obj.Total = total;
    Obj.Username = UserName;
    Obj.GenAt = new Date().toUTCString();
    Obj.Contributions = [];
    for (let i1=0; i1<RawHTML.querySelector("g").querySelectorAll("g").length; i1++) {
        Obj.Contributions[i1] = [];
        let AWeek = RawHTML.querySelector("g").querySelectorAll("g")[i1].querySelectorAll("rect");
        for (let i2=0; i2<AWeek.length; i2++) {
            Obj.Contributions[i1][i2] = {};
            let ADay = Obj.Contributions[i1][i2];
            let DayContributions = AWeek[i2].innerHTML;
            DayContributions = DayContributions === "No" ? 0 : DayContributions-1+1;

            ADay.Date = AWeek[i2].getAttribute("data-date");
            ADay.Level = AWeek[i2].getAttribute("data-level") -1+1;
            ADay.Contributions = DayContributions
        }
    }
    return Obj;
}