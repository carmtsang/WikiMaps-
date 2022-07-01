const { Pool } = require('pg');

const getMarkers = () => {
  return db.query(`SELECT * FROM locations`)
    .then((res) => {
      return res.rows
    });
}

const getMarker = (id) => {
  return db.query(`SELECT * FROM locations WHERE locations.id = $1`, [id])
    .then((res) => {
      return res.rows[0];
    });
}

const getMapById = (map_id, db) => {
  const queryString = `SELECT * FROM maps
  WHERE id = $1;`;
  return db.query(queryString, [map_id])
    .then(res => res.rows[0])
    .catch(err => console.log(err.message))
}

const addMap = (userID, map, db) => {
  const queryString = `INSERT INTO maps (
    name, description, owner_id)
    VALUES ($1, $2, $3) RETURNING *;`;

  return db.query(queryString, [map.name, map.description, userID])
    .then(res => res.rows)
    .catch(err => console.log(err.message));
};

const addMarker = (userID, locations, db) => {
  const queryString = `INSERT INTO locations (owner_id, map_id, longitude, latitude, name, description, url)
   VALUES ($1, $2, $3, $4, $5, $6, $7)
  RETURNING *;`

    const values = [
      userID,
      locations.mapid,
      locations.longitude,
      locations.latitude,
      locations.name,
      locations.description,
      locations.url
    ]

  return db.query(queryString, values)
    .then(res => {
      console.log(res.rows[0]);
      return res.rows[0];
    });
  }

  const deleteMarker = (mapID, locationsID) => {
    const queryString = `DELETE FROM locations WHERE map_id = $1 AND id = $2`;

    return db.query(queryString, [mapID, locationsID])
      .then(res => {
        (res.rows[0]);
      });
  }

  const editMarker = (marker) => {
    const queryString = ` UPDATE locations SET longitude = $1,
    latitude = $2,
    name = $3,
    description = $4,
    owner_id = $5,
    map_id = $6,
    url = $7
    RETURN *`;

    const values = [
      locations.longitude,
      locations.latitude,
      locations.name,
      locations.description,
      locations.owner_id,
      locations.map_id,
      locations.url
    ]

    return db.query(queryString, values)
    .then(res => {
      (res.rows[0]);
    });

  }


  module.exports = {
    getMarkers,
    getMarker,
    addMarker,
    editMarker,
    deleteMarker
  }
