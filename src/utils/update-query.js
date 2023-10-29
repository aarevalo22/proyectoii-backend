const camelToSnake = require('./camel-to-snake')

/**
 * Returns the SET and WHERE statements of an UPDATE dynamically
 * @param cols - this is the req.body with the fields to be updated
 */
module.exports = (id, cols) => {
  const query = ['SET']
  const columns = []
  // creates array of column = value
  Object.keys(cols).forEach((col, i) => {
    columns.push(`${camelToSnake(col)} = ?`)
  })
  // join column = value by ,
  query.push(columns.join(', '))
  // add where clause
  query.push('WHERE id =' + id)
  // join entire query together
  return query.join(' ')
}
