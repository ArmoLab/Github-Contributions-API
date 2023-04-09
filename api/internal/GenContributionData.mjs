import fetch from "node-fetch";
import HTMLParser from "node-html-parser";
import { CreatElement } from "./CreatElement.mjs";
/**
 * 
 * @param {String}      UserName 
 * @param {String}      Type            "JSON"||"SVG"
 * 
 * @param {Object}      ColorDefine 
 * @namespace           ColorDefine
 * @property {String}   BackgroundColor Hex without `#`
 * @property {Number}   RectOpacity     Opacity of Rects
 * @property {Array}    RectColors      Color of Rects [(L0),(L1),(L2),(L3),(L4)]
 * @returns 
 */
export async function GenContributionData (UserName, Type, ColorDefine) {
    let RawHTML = 
        await fetch(`https://cros-cf.ooze.gq/?https://github.com/${UserName}`)
            .then(res => res.text())
            .then(res => {return HTMLParser.parse(res)})

    if (Type === "JSON") {
        return GenJSON(RawHTML, UserName)
    } else if (Type === "SVG") {
        console.log(ColorDefine.RectColors)
        if (!ColorDefine.RectColors || ColorDefine.RectColors.length !== 5) {
            ColorDefine.RectColors = [
                "161b22",
                "0e4429",
                "006d32",
                "26a641",
                "39d353"
            ]
        }
        if (ColorDefine.RectOpacity<0 || ColorDefine.RectOpacity >1) {
            ColorDefine.RectOpacity = 1;
        }
        if (!ColorDefine.BackgroundColor) {
            ColorDefine.BackgroundColor = "0d1117";
        }
        if (!ColorDefine.TextColor) {
            ColorDefine.TextColor = "e6edf3";
        }

        return GenSVG(RawHTML, UserName, ColorDefine).toString();
    }
}

/**
 * @param Contributions {Array}
 */
function GenSVG (RawHTML, UserName, ColorDefine) {
    const UserData = GenJSON(RawHTML, UserName);
    let Contributions = UserData.Contributions;
    /**
     * @namespace   Contributions[i0][i1]
     * @property    {String} Date
     * @property    {String} Level
     */

    // init SVG Root
    let SVGRoot = 
        CreatElement(
            "svg", 
            {
                "height": 200,
                "width": 757,
                "xmlns": "http://www.w3.org/2000/svg",
            }
        )

    // bg
    SVGRoot.appendChild(
        CreatElement(
            "rect", 
            {
                "height": 200,
                "width": 757,
                "rx": 8,
                "rx": 8,
                "fill": `#${ColorDefine.BackgroundColor}`,
            }
        )
    );

    // Title
    SVGRoot.appendChild(
        CreatElement(
            "text", 
            {
                "class": "title",
                "dx": 20,
                "dy": 36
            },
            `${UserData.Username}'s GitHub Contributions Summary - last year`
        )
    );

    //init yearly root
    let YearlyRoot = 
        CreatElement(
            "g", 
            {"transform": "translate(35, 70)"}
        )

    SVGRoot.appendChild(YearlyRoot);

    for (let i0=0; i0<Contributions.length; i0++) {
        // weekly
        let WeeklyRoot = 
            CreatElement(
                "g",
                {"transform": `translate(${i0 * 14}, 0)`}
            )
        YearlyRoot.appendChild(WeeklyRoot);
        for (let i1=0; i1<Contributions[i0].length; i1++) {
            // daily
            WeeklyRoot.appendChild(
                CreatElement(
                    "rect",
                    {
                        "width": 10,
                        "height": 10,
                        "rx": 2,
                        "ry": 2,
                        "x": 14 - i0,
                        "y": 13 * i1,
                        "class": "L" + Contributions[i0][i1].Level,
                    }
                )
            )
        }
    }
    YearlyRoot.innerHTML +=
        `<text dx="-15" dy="8" style="display: none;">Sun</text>`+
        `<text dx="-15" dy="22">Mon</text>`+
        `<text dx="-15" dy="32" style="display: none;">Tue</text>`+
        `<text dx="-15" dy="48">Wed</text>`+
        `<text dx="-15" dy="57" style="display: none;">Thu</text>`+
        `<text dx="-15" dy="73">Fri</text>`+
        `<text dx="-15" dy="81" style="display: none;">Sat</text>`;
        
    let Months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let nums = [14, 66, 131, 183, 248, 300, 352, 417, 469, 521, 586, 638];
    for (let i=0, AddTimes = 0, LastSeenMonth = ""; i<Contributions.length && AddTimes<12; i++) {
        let MonthNow = Contributions[i][0].Date.split("-")[1] -2+1;
        if (LastSeenMonth !== MonthNow) {
            YearlyRoot.appendChild(
                CreatElement(
                    "text",
                    {
                        "y": -7,
                        "x": nums[AddTimes]
                    },
                    Months[MonthNow]
                )
            )
            AddTimes++;
            LastSeenMonth = MonthNow;
        }
    }


    // init infomation for GCAPI.
    SVGRoot.innerHTML += 
        `<text class="desc" transform="translate(20, 177)" text-anchor="start">`+
            `Total ${UserData.Total} Contributions | `+
            `By kobe-koto/Github-Contributions-API | `+
            `Gen at ${new Date().toUTCString()}`+
        `</text>`;
    SVGRoot.innerHTML += 
        `<g transform="translate(676, 168)">`+
            `<rect width="10" height="10" rx="2" ry="2" x="00" y="0" class="L0"></rect>`+
            `<rect width="10" height="10" rx="2" ry="2" x="12" y="0" class="L1"></rect>`+
            `<rect width="10" height="10" rx="2" ry="2" x="24" y="0" class="L2"></rect>`+
            `<rect width="10" height="10" rx="2" ry="2" x="36" y="0" class="L3"></rect>`+
            `<rect width="10" height="10" rx="2" ry="2" x="48" y="0" class="L4"></rect>`+
        `</g>`;
    SVGRoot.innerHTML +=
        `<style>
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
            rect.L0 {
                fill: {{CL0}};
            }
            rect.L1 {
                fill: {{CL1}};
            }
            rect.L2 {
                fill: {{CL2}};
            }
            rect.L3 {
                fill: {{CL3}};
            }
            rect.L4 {
                fill: {{CL4}};
            }
        </style>`
        .replace(/{{CL0}}/g, "#" + ColorDefine.RectColors[0])
        .replace(/{{CL1}}/g, "#" + ColorDefine.RectColors[1])
        .replace(/{{CL2}}/g, "#" + ColorDefine.RectColors[2])
        .replace(/{{CL3}}/g, "#" + ColorDefine.RectColors[3])
        .replace(/{{CL4}}/g, "#" + ColorDefine.RectColors[4])
        .replace(/e6edf3/g, ColorDefine.TextColor)

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

