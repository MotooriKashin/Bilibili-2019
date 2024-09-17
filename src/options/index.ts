import { Player } from "../player";
import stylesheet from "./index.css" with {type: 'css'};

document.adoptedStyleSheets = [stylesheet];

document.body.appendChild(new Player());