const fetch = require('node-fetch')
// constants for your GraphQL Post and Author types

const transformKnackData = (record, schemaMap) => {}

exports.sourceNodes = async (
  { actions, createContentDigest, createNodeId, getNodesByType },
  {
    scene,
    view,
    applicationId,
    restApiKey = 'knack',
    nodeType = 'knack',
    schemaMap,
  },
) => {
  if (!scene || !view || !application_id) return
  const { createNode } = actions
  const data = await fetch(
    `https://api.knack.com/v1/pages/${scene}/views/${view}/records`,
    {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
        'X-Knack-Application-Id': applicationId,
        'X-Knack-REST-API-KEY': restApiKey,
      },
      redirect: 'follow',
      referrer: 'no-referrer',
    },
  ).then((res) => res.json())

  // loop through data and create Gatsby nodes
  data.records.forEach((rawRecord) => {
    const record = transformKnackData(rawRecord, schemaMap) || rawRecord
    return createNode({
      ...record,
      id: createNodeId(`${nodeType}-${record.id}`),
      parent: null,
      children: [],
      internal: {
        type: nodeType,
        content: JSON.stringify(record),
        contentDigest: createContentDigest(record),
      },
    })
  })
  return
}
