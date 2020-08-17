/**
 * "PrizeTable" route
 *
 * @desc This is the route for a prize-table.
 * .
 */

import { Router } from "express";
import { advancedResults } from "../middleware/advancedResults";
import { PrizeTable } from "../api/models/PrizeTable";
import { getPrizeTables } from "../api/controllers/prize-table";

const router = Router();

router.route("/").get(advancedResults(PrizeTable, ""), getPrizeTables);

export default router;
