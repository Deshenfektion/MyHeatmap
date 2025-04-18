import { Antonio } from "next/font/google";
import { Bebas_Neue } from "next/font/google";
import { Barlow_Condensed } from "next/font/google";
import { Rajdhani } from "next/font/google";
import { Saira_Condensed } from "next/font/google";

const saira = Saira_Condensed({ subsets: ["latin"], weight: ["400", "700"] });
const rajdhani = Rajdhani({ subsets: ["latin"], weight: ["400", "600"] });
const barlow = Barlow_Condensed({ subsets: ["latin"], weight: ["400", "700"] });
const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400" });
const antonio = Antonio({ subsets: ["latin"], weight: ["400", "700"] });

export { saira, rajdhani, barlow, bebas, antonio };
