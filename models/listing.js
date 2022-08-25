"use strict";

const db = require("../db");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError
} = require("../expressError");

/** Related functions for listings. */

class Listing {

  /** Register a new listing.
   *
   *  Returns { name, max_occupancy, price, zip_code, owner }.
   */
  static async register({ name, description, max_occupancy, price, zipCode, owner }) {
    const result = await db.query(
      `INSERT INTO listing (name, description, max_occupancy, price, zip_code, owner)
      VALUES ($1, $2, $3, $4, $5, $6)`,
      [name, description, max_occupancy, price, zipCode, owner]
    );
  }

  /**  Get a listing based on its id
   *
   *   Returns { name, description, max_occupancy, price, zipCode, owner }.
   *
   *   Throws NotFoundError if listing id is not found.
   */
  static async get(id) {
    const result = await db.query(
      `SELECT *
        FROM listings
        WHERE id = $1`,
      [id]
    );
    const listing = result.rows[0];
    if (!listing) throw NotFoundError(`Listing not found with id: ${id}`);
    return listing;
  }

  /** Update a listing with given data
   *
   *  Returns updated listing { name, description, max_occupancy, price, zip_code, owner }.
   *
   *  Throw NotFoundError if given id is not found.
  */
  static async update(id, data) {
    const result = await db.query(
      `UPDATE listing
        SET name = $1
            description = $2
            max_occupancy = $3
            price = $4
            zip_code = $5
        WHERE id = $6
        RETURNING *`,
      [data.name, data.description, data.maxOccupancy, data.price, data.zipCode, id]
    );
    if (!result.rows[0]) throw new NotFoundError(`Listing not found with id: ${id}`);
    return result.rows[0];
  }
}