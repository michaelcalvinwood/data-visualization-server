const mysql = require('./utils/mysql');

const processResult = result =>
  result
    .filter(({ status }) => status === 'fulfilled')
    .reduce(
      (acc, { value }) => ({
        ...acc,
        [Object.keys(value[0])[0]]: value.map(item => {
          delete item['NULL'];

          return item;
        })
      }),
      {}
    );

exports.getUniversalData = async () => {
  const queries = [
    'SELECT demo, demo_fantasy, id FROM demo',
    'SELECT topic, id FROM topic',
    'SELECT name AS location, id FROM location',
    'SELECT edition AS timeframe, id FROM timeframe',
    'SELECT d.demo_cut, d.id, t.demo FROM demo_cut d JOIN demo t ON d.demo_id = t.id',
    'SELECT a.action, a.id, t.topic FROM action a JOIN topic t ON a.topic_id = t.id'
  ];

  try {
    const result = await Promise.allSettled(
      queries.map(query => mysql.poolQuery(query))
    );

    return processResult(result);
  } catch (error) {
    console.error('Got error fetching universal data :>>', error);

    return {};
  }
};

exports.getSingleChartData = async ({
  location_id,
  edition_id,
  action_id,
  topic_id,
  demo_id,
  project
}) => {
  const query = `
    SELECT DISTINCT
      p.value_type,
      p.float_value,
      p.integer_value,
      dc.demo_cut AS demo_cut,
      dc.demo_cut_fantasy AS demo_cut_fantasy
    FROM ${project} AS p
    LEFT JOIN demo_cut AS dc ON p.demo_cut_id = dc.id
    WHERE
      p.topic_1 = ${topic_id}
      AND p.action_1 = ${action_id}
      AND p.action_2 is NULL
      AND p.demo_id = ${demo_id}
      AND p.edition_id = ${edition_id}
      AND p.location_id = ${location_id}
      ;
    `;

  try {
    const result = await mysql.poolQuery(query);

    console.log('query :>>\n', query.replace(/\s+/g, ' ').trim());

    return result;
  } catch (error) {
    console.error('Got error fetching project data :>>', error);

    return [];
  }
};
