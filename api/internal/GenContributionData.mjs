import fetch from "node-fetch";
import HTMLParser from "node-html-parser";

export async function GenContributionData (UserName, Type) {
    let RawHTML = 
        await fetch(`https://github.com/${UserName}`)
            .then(res => res.text())
            .then(res => {return HTMLParser.parse(res)})

    if (Type === "JSON") {
        return GenJSON(RawHTML, UserName)
    } else if (Type === "SVG") {
        return GenSVG(RawHTML, UserName).toString();
    }
}

/**
 * @param Contributions {Array}
 */
function GenSVG (RawHTML, UserName) {
    const UserData = GenJSON(RawHTML, UserName);
    let Contributions = UserData.Contributions;
    /**
     * @namespace   Contributions[i0][i1]
     * @property    {String} Date
     * @property    {String} Level
     */

    // init SVG Root
    let SVGRoot = HTMLParser.parse(`<svg height="188" width="757" xmlns="http://www.w3.org/2000/svg"></svg>`);
    SVGRoot = SVGRoot.querySelector("svg");

    // Title
    SVGRoot.innerHTML = `<text class="title" dx="0" dy="16">${UserData.Username}'s GitHub Contributions Summary - last year</text>`

    //init yearly root
    SVGRoot.innerHTML += `<g class="yearly" transform="translate(15, 50)"></g>`

    for (let i0=0; i0<Contributions.length; i0++) {
        // weekly
        SVGRoot.querySelector("g.yearly").innerHTML += `<g transform="translate(${i0 * 14}, 0)"></g>`
        let AWeek = SVGRoot.querySelector("g.yearly").querySelectorAll("g")[i0]
        for (let i1=0; i1<Contributions[i0].length; i1++) {
            // daily
            AWeek.innerHTML += 
                `<rect width="10" height="10" rx="2" ry="2" ` + 
                `x="${14 - i0}" ` +
                `y="${13 * i1}" `  +
                `data-level="${Contributions[i0][i1].Level}"` +
                `></rect>`
        }
    }
    SVGRoot.querySelector("g.yearly").innerHTML +=
        `<text dx="-15" dy="8" style="display: none;">Sun</text>`+
        `<text dx="-15" dy="22">Mon</text>`+
        `<text dx="-15" dy="32" style="display: none;">Tue</text>`+
        `<text dx="-15" dy="48">Wed</text>`+
        `<text dx="-15" dy="57" style="display: none;">Thu</text>`+
        `<text dx="-15" dy="73">Fri</text>`+
        `<text dx="-15" dy="81" style="display: none;">Sat</text>`;


    const AsIsSVG =HTMLParser.parse(RawHTML).querySelector(".js-calendar-graph-svg")
    if (AsIsSVG.querySelectorAll("text.ContributionCalendar-label[y=\"-7\"]").length === 0) {
        let q = AsIsAVG.querySelectorAll("text.ContributionCalendar-label[y=\"-8\"]");
        let nums = [14, 66, 131, 183, 248, 300, 352, 417, 469, 521, 586, 638];
        for (let i=0; i<q.length; i++) {
            q[0].setAttribute("x", nums[i])
            q[0].setAttribute("y", "-7")
        }
    }

    let TextX7 = AsIsSVG.querySelectorAll("text.ContributionCalendar-label[y=\"-7\"]");
    
    for (let i=0; i<TextX7.length; i++) {
        SVGRoot.querySelector("g.yearly").innerHTML += TextX7[i].outerHTML;
    }

    //     <text x="14" y="-7">Apr</text>
    //     <text x="66" y="-7">May</text>
    //     <text x="131" y="-7">Jun</text>
    //     <text x="183" y="-7">Jul</text>
    //     <text x="248" y="-7">Aug</text>
    //     <text x="300" y="-7">Sep</text>
    //     <text x="352" y="-7">Oct</text>
    //     <text x="417" y="-7">Nov</text>
    //     <text x="469" y="-7">Dec</text>
    //     <text x="521" y="-7">Jan</text>
    //     <text x="586" y="-7">Feb</text>
    //     <text x="638" y="-7">Mar</text>








    // init infomation for GCAPI.
    SVGRoot.innerHTML += 
        `<text class="desc" transform="translate(0, 157)" text-anchor="start">`+
            `Total ${UserData.Total} Contributions | `+
            `By kobe-koto/Github-Contributions-API | `+
            `Gen at ${new Date().toUTCString()}`+
        `</text>`;
    SVGRoot.innerHTML += 
        `<g transform="translate(656, 148)">`+
            `<rect width="10" height="10" rx="2" ry="2" x="00" y="0" data-level="0"></rect>`+
            `<rect width="10" height="10" rx="2" ry="2" x="12" y="0" data-level="1"></rect>`+
            `<rect width="10" height="10" rx="2" ry="2" x="24" y="0" data-level="2"></rect>`+
            `<rect width="10" height="10" rx="2" ry="2" x="36" y="0" data-level="3"></rect>`+
            `<rect width="10" height="10" rx="2" ry="2" x="48" y="0" data-level="4"></rect>`+
        `</g>`;
    SVGRoot.innerHTML +=
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
        </style>`;

    return SVGRoot;
}
function GenJSON (RawHTML, UserName) {
    let RawSVG = HTMLParser.parse(RawHTML).querySelector(".js-calendar-graph-svg");

    const Obj = {};
    Obj.Total = 
        RawHTML
            .querySelector("div.js-yearly-contributions")
            .querySelector("h2.f4.text-normal.mb-2")
            .innerHTML
            .replace(/(\n|,)/gi,"")
            .split("contribution")[0] -1+1;
    Obj.GenAt = new Date().toUTCString();
    Obj.Username = UserName;
    Obj.Contributions = [];
    for (let i1=0; i1<RawSVG.querySelector("g").querySelectorAll("g").length; i1++) {
        Obj.Contributions[i1] = [];
        let AWeek = RawSVG.querySelector("g").querySelectorAll("g")[i1].querySelectorAll("rect");
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

