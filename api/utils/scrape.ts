import axios from "axios";
import { JSDOM } from "jsdom";
import { PrizeTable } from "../models/PrizeTable";

const officialRulesUrl = "https://www.withyotta.com/official-rules";

export const periodicallyScrapePrizeTable = (interval: number) => {
  setInterval(async () => {
    // Get data from yotta's official rules page
    const res = await axios.get(officialRulesUrl);

    // Convert into Document Object
    const DOM = new JSDOM(res.data, {
      contentType: "text/html",
      runScripts: "outside-only",
    });

    // Get prize table data
    const prizeTableData = getPrizeTableFromDom(DOM);

    // Extract prize table rows from prize table data
    const prizeTableRows = extractRowsFromPrizeTable(prizeTableData);

    // Save prize table
    await PrizeTable.create({
      rows: prizeTableRows,
    });

    return prizeTableRows;
  }, interval);
};

const getPrizeTableFromDom = function (DOM: any) {
  /**
   * This table appears to be the first table on the page,
   *    but this may not always be true.
   */
  const prizeTable = DOM.window.eval(
    `document.getElementsByClassName("w-layout-grid")[0]`
  );
  return prizeTable;
};

const extractRowsFromPrizeTable = function (prizeTable: Element) {
  /**
   * This table is made up of div blocks and not header, row,
   *    and data elements, so the header blocks need to be
   *    filtered out. The remaining blocks need to be placed
   *    into groups of 4 and have any excess html removed
   */

  const tableBodyData: string[] = [];
  prizeTable.childNodes.forEach((childNode: any, index: number) => {
    if (
      childNode.textContent &&
      !childNode.textContent.includes("break-word") && // Filter out error-generating blank cells
      ![
        // Filter out header data
        "Matching Yotta Ball",
        "Number of Matching Numbers",
        "Prize*",
        "Odds",
      ].includes(childNode.textContent)
    ) {
      tableBodyData.push(childNode.textContent); // Remove excess html
    }
  });

  // Place into groups of 4
  const tableRows = [];
  for (let i = 0; i < tableBodyData.length; i += 4) {
    let tableRow = [
      tableBodyData[i],
      tableBodyData[i + 1],
      tableBodyData[i + 2],
      tableBodyData[i + 3],
    ];
    tableRows.push(tableRow);
  }

  function getDataFromTableRows(tableRows: string[][]) {
    const data = tableRows.map((tableRow) => {
      const [hasYotta, matchingNumbers, prize, odds] = tableRow;
      console.info([hasYotta, matchingNumbers, prize, odds]);
      return {
        yotta: hasYotta === "Yes",
        shared: !prize.includes("per ticket"),
        matches: parseInt(matchingNumbers.split(" of ")[0]),
        annuity: prize.includes("**") && !prize.includes("Tesla") ? 40 : 0, // years
        // Prize is in cents, USD
        prize: determinePrizeValue(prize),
        odds: {
          numerator: parseInt(odds.split(":")[0]),
          denominator: parseInt(odds.split(":")[1].replace(/,/g, "")),
        },
      };
    });
    return data;
  }

  // Extract data
  const data = getDataFromTableRows(tableRows);
  console.info("Captured Data:", data);
  return data;
};

const determinePrizeValue = (prize: string) => {
  return prize.includes("**")
    ? prize.includes("Tesla")
      ? 37990 // Current MSRP of Tesla (and value from Yotta's site)
      : 5800000 * 100 // TODO: fix 40 year annuity calculation
    : parseInt(
        (
          parseFloat(prize.slice(1).split(" per ")[0].replace(/,/g, "")) * 100
        ).toString()
      );
};
