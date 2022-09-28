"use strict";

const db = require("../db");
const { sqlForPartialUpdate } = require("../helpers/sql");

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
    // duplicate check for registering the same listing???
    const result = await db.query(
      `INSERT INTO listing (name, description, max_occupancy, price, zip_code, owner)
      VALUES ($1, $2, $3, $4, $5, $6)`,
      [name, description, max_occupancy, price, zipCode, owner]
    );
    return result.rows[0];
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
  static async update(listingId, ownerId, data) {
    const checkOwner = await db.query(
      `SELECT *
        FROM listing
        WHERE owner = $1
        AND id = $2`,
      [ownerId, listingId]
    );

    if (checkOwner.rows.length === 0) {
      throw new UnauthorizedError("Invalid listing or owner id.");
    }

    const jsToSql = {
      maxOccupancy: "max_occupancy",
      zipCode: "zip_code"
    };

    const { cols, vals } = sqlForPartialUpdate(data, jsToSql);
    const listingIdx = cols.length + 1;
    const ownerIdx = cols.length + 2;

    const result = await db.query(
      `UPDATE listing
        SET ${cols}
        WHERE id = $${listingIdx}
        AND owner = $${ownerIdx}
        RETURNING *`,
      [...vals, listingIdx, ownerIdx]
    );
    const listing = result.rows[0];
    if (!listing) throw new NotFoundError(`Listing not found with id: ${id}`);
    return listing;
  }

  /** Delete given listing from database, returns undefined */
  static async remove(listingId, ownerId) {
    const result = await db.query(
      `DELETE FROM listings
        WHERE id = $1
        AND owner = $2`,
      [listingId, ownerId]
    );
    const listing = result.rows[0];
    if (!listing) throw new NotFoundError('No listing with the given information.');
  }
}

module.exports = Listing;