const { BadRequestError } = require("../expressError");

/**
 * Given dataToUpdate ({firstName: 'Test', lastName: 'User'})
 * and jsToSql ({firstName: first_name, lastName: last_name})
 *
 * return { setCols: ['first_name', 'last_name'], vaues: [1, 2]}
 */
function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  const cols = keys.map(
    (colName, idx) => `${jsToSql[colName] || colName}=$${idx + 1}`
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate)
  };
}

module.exports = {
  sqlForPartialUpdate
};