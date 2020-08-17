import { Types, Document } from "mongoose";

export interface IPrizeTable extends Document {
  rows: [IPrizeDatum];
}

interface IPrizeDatum {
  yotta: boolean;
  shared: boolean;
  matches: number;
  annuity: number;
  prize: number;
  odds: {
    numerator: number;
    denominator: number;
  };
}
