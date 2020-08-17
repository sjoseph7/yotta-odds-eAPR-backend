/**
 * Mongoose "PrizeTable" Schema
 *
 * @desc This is the schema for a PrizeTable.
 */

import { Schema, model, Types } from "mongoose";
import { IPrizeTable } from "../interfaces/IPrizeTable";

const PrizeDatumSchema = new Schema(
  {
    yotta: {
      type: Boolean
    },
    shared: {
      type: Boolean
    },
    matches: {
      type: Number
    },
    annuity: {
      type: Number
    },
    prize: {
      type: Number
    },
    odds: {
      type: {
        numerator: {
          type: Number
        },
        denominator: {
          type: Number
        }
      }
    }
  },
  {
    _id: false
  }
);

const PrizeTableSchema = new Schema(
  {
    rows: {
      type: [PrizeDatumSchema]
    }
  },
  {
    timestamps: true // This adds fields "createdAt" and "updatedAt" upon any creation or update events
  }
);

export let PrizeTable = model<IPrizeTable>("prize-table", PrizeTableSchema);
