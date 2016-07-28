import _ from 'lodash';
import promise from 'bluebird';
import {createInsertQuery, createUpdateQuery, sendBackJSON, createSelectQuery} from './queryHelpers';

export default class Stork {
  constructor(connectionString, schema) {
    this.pg = require('pg-promise')({promiseLib: promise})(connectionString);
    this.schema = schema;
  }

  getAll() {
    return this.pg.query(`select * from ${this.schema.tableName}`);
  }

  getOne(id) {
    return this.pg.query(`select * from ${this.schema.tableName} where id = ${id}`);
  }

  find(obj) {
    return this.pg.query(createSelectQuery(this.schema, obj));
  }

  create(obj) {
    return this.pg.query(createInsertQuery(this.schema, obj));
  }

  findOrCreate(obj) {
    return this.find(obj)
    .then((foundObj) => {
      if (foundObj.length > 0) {
        return foundObj;
      }
      return this.create(obj);
    });
  }

  remove(id) {
    return this.pg.query(`delete from ${this.schema.tableName} where id = ${id}`);
  }
}
