import { scenario1 } from "./scenario1.ts";
import { scenario2 } from "./scenario2.ts";
import { scenario3 } from "./scenario3.ts";
import { scenario4 } from "./scenario4.ts";
import { scenario5 } from "./scenario5.ts";
import type { Scenario } from "./types";

export const scenarios: Scenario[] = [scenario1, scenario2, scenario3, scenario4, scenario5];

export { scenario1 };
export type * from "./types";
