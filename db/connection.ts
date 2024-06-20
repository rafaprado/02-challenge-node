import {knex as knexSetup} from "knex";
import config from "../knexfile";

export const knex = knexSetup(config);