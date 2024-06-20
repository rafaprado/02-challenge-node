import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("meals", (table) => {
    table.uuid("id").unique().primary();
    table.text("name").notNullable();
    table.text("description");

    table.boolean("on_diet").notNullable();

    table.date("created_at_date").notNullable();
    table.time("created_at_hour").notNullable();
    table.uuid("user_id").notNullable();

    table.foreign("user_id").references("id").inTable("users");
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("meals");
}

