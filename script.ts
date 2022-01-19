const codes: Array<string> = ["UN", "EU", "AD", "AE", "AF", "AG", "AI", "AL", "AM", "AO", "AQ", "AR", "AS", "AT", "AU", "AW", "AX", "AZ", "BA", "BB", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BL", "BM", "BN", "BO", "BR", "BS", "BT", "BQ", "BV", "BW", "BY", "BZ", "CA", "CC", "CD", "CF", "CG", "CH", "CI", "CK", "CL", "CM", "CN", "CO", "CR", "CU", "CV", "CW", "CX", "CY", "CZ", "DE", "DJ", "DK", "DM", "DO", "DZ", "EC", "EE", "EG", "EH", "ER", "ES", "ET", "FI", "FJ", "FK", "FM", "FO", "FR", "GA", "GB", "GD", "GE", "GF", "GG", "GH", "GI", "GL", "GM", "GN", "GP", "GQ", "GR", "GS", "GT", "GU", "GW", "GY", "HK", "HM", "HN", "HR", "HT", "HU", "ID", "IE", "IL", "IM", "IN", "IO", "IQ", "IR", "IS", "IT", "JE", "JM", "JO", "JP", "KE", "KG", "KH", "KI", "KM", "KN", "KP", "KR", "KW", "KY", "KZ", "LA", "LB", "LC", "LI", "LK", "LR", "LS", "LT", "LU", "LV", "LY", "MA", "MC", "MD", "ME", "MF", "MG", "MH", "MK", "ML", "MM", "MN", "MO", "MP", "MQ", "MR", "MS", "MT", "MU", "MV", "MW", "MX", "MY", "MZ", "NA", "NC", "NE", "NF", "NG", "NI", "NL", "NO", "NP", "NR", "NU", "NZ", "OM", "PA", "PE", "PF", "PG", "PH", "PK", "PL", "PM", "PN", "PR", "PS", "PT", "PW", "PY", "QA", "RE", "RO", "RS", "RU", "RW", "SA", "SB", "SC", "SD", "SE", "SG", "SH", "SI", "SJ", "SK", "SL", "SM", "SN", "SO", "SR", "SS", "ST", "SV", "SX", "SY", "SZ", "TC", "TD", "TF", "TG", "TH", "TJ", "TK", "TL", "TM", "TN", "TO", "TR", "TT", "TV", "TW", "TZ", "UA", "UG", "UM", "US", "UY", "UZ", "VA", "VC", "VE", "VG", "VI", "VN", "VU", "WF", "WS", "XK", "YE", "YT", "ZA", "ZM", "ZW"];
// ISO country/region codes

enum GradientShape {
    ToBottomRight,
    ToBottomLeft,
    ToBottom,
    ToRight,
    ToLeft
};

const canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext("2d");

window.onload = () => {
    document.getElementById("board_right").style.height = `${window.innerHeight}px`;
    document.getElementById("countries_container").style.height = `${window.innerHeight}px`;
    document.getElementById("logo").style.top = `${0.5 * window.innerHeight - 0.5 * (document.getElementById("logo") as HTMLImageElement).height}px`;
    document.getElementById("direction_btns").style.top = `${0.15 * window.innerHeight + canvas.height + 40}px`;
    document.getElementById("avatar_input").style.top = `${0.15 * window.innerHeight + canvas.height + 80}px`;
    document.getElementById("download_btn").style.top = `${0.15 * window.innerHeight + canvas.height + 120}px`;
    document.getElementById("words").style.top = `${0.5 * window.innerHeight - 0.5 * (document.getElementById("words") as HTMLParagraphElement).clientHeight}px`;
}
//For mobile
if (canvas.offsetLeft + canvas.width > document.getElementById("words").offsetLeft)
    document.getElementById("words").remove();

if (document.getElementById("logo").offsetLeft + (document.getElementById("logo") as HTMLImageElement).width > canvas.offsetLeft)
    document.getElementById("logo").remove();

//For Huawei
const platform: string = navigator.userAgent.toLowerCase();
if (platform.includes("huawei") || platform.includes("honor")) {
    document.getElementById("avatar_input").removeAttribute("accept");
}

const avatar: HTMLImageElement = new Image(); //default avatar
avatar.src = "icons/avatar.png";
avatar.onload = () => {
    ctx.drawImage(avatar, 0, 0, 320, 320);
}

class Country {
    static selectedElement: HTMLButtonElement;
    static selectedShape: GradientShape = GradientShape.ToBottom;
    static canvas: HTMLCanvasElement = canvas;
    static avatar: HTMLImageElement = avatar;

    constructor(code: string) {
        const container: HTMLDivElement = document.getElementById("countries_container") as HTMLDivElement;
        //A national flag emoji consists of two symbols.
        //The symbols' unicodes are 127397 plus the unicodes of the two ISO-code letters.
        const emoji: string = String.fromCodePoint(code.charCodeAt(0) + 127397, code.charCodeAt(1) + 127397);
        const element = document.createElement("button");
        element.style.whiteSpace = "nowrap"
        element.innerText = code + " " + emoji;
        element.className = "country";
        element.id = code;
        element.addEventListener("click", Country.changeFlag)
        container.append(element); //Creates a button like: xx :).

        const a: HTMLAnchorElement = document.createElement("a");
        a.innerText = " ";
        container.append(a); //Creates a Space between coutries.

        if (container.scrollWidth > container.clientWidth) { //If overflow,
            container.insertBefore(document.createElement("br"), element); //Creates a line feed.
        }
    }

    static changeFlag(): void {
        Country.selectedElement.style.borderWidth = "0px"; //Resets the button selected last time.
        Country.selectedElement = this as any as HTMLButtonElement; //The "this" here points to clicked element as it's called by click event.
        Country.selectedElement.style.borderWidth = "3px";
        Country.redraw();
    }

    static redraw(): void {
        const ctx: CanvasRenderingContext2D = Country.canvas.getContext("2d");
        ctx.clearRect(0, 0, Country.canvas.width, Country.canvas.height);
        if (Country.avatar.width > Country.avatar.height)
            ctx.drawImage(Country.avatar, 0, 0, Country.canvas.height / Country.avatar.height * Country.avatar.width, Country.canvas.height);
        else
            ctx.drawImage(Country.avatar, 0, 0, Country.canvas.width, Country.avatar.height * Country.canvas.width / Country.avatar.width);
        Country.drawGradientImage(Country.selectedShape, `flags/${Country.selectedElement.id.toLowerCase()}.png`, Country.canvas);
    }

    static changeShape(shape: GradientShape): void {
        Country.selectedShape = shape;
        Country.redraw();
    }

    static changeAvatar(avatar: HTMLImageElement): void {
        Country.avatar = avatar;
        Country.redraw();
    }

    static drawGradientImage(shape: GradientShape, imageURL: string, target: HTMLCanvasElement): void {
        const image: HTMLImageElement = new Image();
        image.src = imageURL;
        const canvas: HTMLCanvasElement = document.createElement("canvas")
        const ctx: CanvasRenderingContext2D = canvas.getContext("2d");
        image.onload = () => {
            [canvas.width, canvas.height] = [image.width, image.height];
            ctx.drawImage(image, 0, 0);
            let imageData: ImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            let colors = imageData.data; //This array consists of RGBA values of every pixel.
            colors = Country.gradientify(shape, colors, image.width);
            ctx.putImageData(imageData, 0, 0);
            image.src = canvas.toDataURL();
            image.onload = () => {
                if (shape == GradientShape.ToBottom)
                    target.getContext("2d").drawImage(image, 0, 0);
                else
                    target.getContext("2d").drawImage(image, 0, 0, target.height / image.height * image.width, target.height);
            };
        }
    }

    static gradientify(shape: GradientShape, colors: Uint8ClampedArray, width: number): Uint8ClampedArray {
        switch (shape) {
            case GradientShape.ToBottom:
                for (let index = 3; index < colors.length; index += 4) {
                    const y: number = Math.floor(index / 4 / width); //a pixel's vertical coordinate 
                    const alpha: number = Math.floor((255 - 2 * y) * (255 / colors[index]) * 0.9);
                    colors[index] = alpha;
                }
                return colors;

            case GradientShape.ToBottomLeft:
                for (let index = 3; index < colors.length; index += 4) {
                    const x: number = Math.floor(index / 4 % width); //a pixel's horizontal coordinate 
                    const y: number = Math.floor(index / 4 / width);
                    const d: number = Math.sqrt(Math.pow(width - x, 2) + Math.pow(y, 2)); //a pixel's distance from the top-right corner
                    const alpha: number = Math.floor((255 - 1 * d) * (255 / colors[index]) * 0.95);
                    colors[index] = alpha;
                }
                return colors;

            case GradientShape.ToBottomRight:
                for (let index = 3; index < colors.length; index += 4) {
                    const x: number = Math.floor(index / 4 % width);
                    const y: number = Math.floor(index / 4 / width);
                    const d: number = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)); //a pixel's distance from the top-left corner
                    const alpha: number = Math.floor((255 - 2 * d) * (255 / colors[index]) * 0.95);
                    colors[index] = alpha;
                }
                return colors;

            case GradientShape.ToLeft:
                for (let index = 3; index < colors.length; index += 4) {
                    const x: number = Math.floor(index / 4 % width);
                    const alpha: number = Math.floor((255 - 1 * (width - x)) * (255 / colors[index]) * 0.9);
                    colors[index] = alpha;
                }
                return colors;

            case GradientShape.ToRight:
                for (let index = 3; index < colors.length; index += 4) {
                    const x: number = Math.floor(index / 4 % width);
                    const alpha: number = Math.floor((255 - 3 * x) * (255 / colors[index]) * 0.9);
                    colors[index] = alpha;
                }
                return colors;
        }
    }

    static download(): void {
        const element = document.createElement('a');
        element.href = Country.canvas.toDataURL();
        element.download = 'avatar.png';
        element.click();
    }
}

codes.forEach(code => {
    new Country(code);
});
Country.selectedElement = document.getElementById("UN") as HTMLButtonElement; //UN is default.
Country.redraw();

for (const e of document.getElementById("direction_btns").children) { //add listeners
    (e as HTMLButtonElement).onclick = () => {
        Country.changeShape({ "↓": GradientShape.ToBottom, "→": GradientShape.ToRight, "↘": GradientShape.ToBottomRight, "↙": GradientShape.ToBottomLeft, "←": GradientShape.ToLeft }[e.innerHTML]);
    }
}

document.getElementById("avatar_input").onchange = () => {
    const reader = new FileReader()
    reader.onload = function (e) {
        const avatar: HTMLImageElement = new Image();
        avatar.src = e.target.result.toString();
        avatar.onload = () => { Country.changeAvatar(avatar) };
    }
    reader.readAsDataURL((document.getElementById("avatar_input") as any).files[0])
}

document.getElementById("download_btn").onclick = Country.download;