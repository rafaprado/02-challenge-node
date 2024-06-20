import { Knex } from "knex";

declare module "knex/types/tables" {
  export interface Tables {
    users: {
      id: string,
      name: string,
      email: string,
      password: string,
      created_at: string,
      updated_at?: string
    },

    meals: {
      id: string,
      name: string,
      description?: string,
      on_diet: boolean,
      created_at_date: string,
      created_at_hour: string,
      user_id: string
    }
  }
}