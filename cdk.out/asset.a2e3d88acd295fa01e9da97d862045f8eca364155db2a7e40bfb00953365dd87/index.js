var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/services/spaces/handler.ts
var handler_exports = {};
__export(handler_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(handler_exports);
var import_client_dynamodb5 = require("@aws-sdk/client-dynamodb");

// src/services/spaces/PostSpaces.ts
var import_client_dynamodb = require("@aws-sdk/client-dynamodb");
var import_util_dynamodb = require("@aws-sdk/util-dynamodb");

// src/services/shared/Validator.ts
var MissingFieldError = class extends Error {
  constructor(missingField) {
    super(`Value for ${missingField} expected!`);
  }
};
var JsonError = class extends Error {
};
function validateAsSpaceEntry(arg) {
  if (arg.location == void 0) {
    throw new MissingFieldError("location");
  }
}

// node_modules/uuid/dist/esm-node/stringify.js
var byteToHex = [];
for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 256).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
  return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
}

// node_modules/uuid/dist/esm-node/rng.js
var import_node_crypto = __toESM(require("node:crypto"));
var rnds8Pool = new Uint8Array(256);
var poolPtr = rnds8Pool.length;
function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    import_node_crypto.default.randomFillSync(rnds8Pool);
    poolPtr = 0;
  }
  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

// node_modules/uuid/dist/esm-node/native.js
var import_node_crypto2 = __toESM(require("node:crypto"));
var native_default = {
  randomUUID: import_node_crypto2.default.randomUUID
};

// node_modules/uuid/dist/esm-node/v4.js
function v4(options, buf, offset) {
  if (native_default.randomUUID && !buf && !options) {
    return native_default.randomUUID();
  }
  options = options || {};
  const rnds = options.random || (options.rng || rng)();
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  if (buf) {
    offset = offset || 0;
    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }
    return buf;
  }
  return unsafeStringify(rnds);
}
var v4_default = v4;

// src/services/shared/Utils.ts
function createRandomId() {
  return v4_default();
}
function parseJSON(arg) {
  try {
    return JSON.parse(arg);
  } catch (e) {
    throw new JsonError(e.message);
  }
}
function hasAdminGroup(event) {
  const condition = event.requestContext.authorizer.claims["cognito:groups"];
  if (condition) {
    return condition.includes("admins");
  }
  return false;
}

// src/services/spaces/PostSpaces.ts
async function postSpaces(event, ddbClient2) {
  const randomId = createRandomId();
  const item = {
    id: randomId,
    location: parseJSON(event.body)
  };
  validateAsSpaceEntry(item);
  const result = await ddbClient2.send(new import_client_dynamodb.PutItemCommand({
    TableName: process.env.TABLE_NAME,
    Item: (0, import_util_dynamodb.marshall)(item)
    // Item: {
    //   id: {
    //     S: item.id
    //   },
    //   location: {
    //     S: item.location
    //   }
    // }
  }));
  return {
    statusCode: 201,
    body: JSON.stringify({ id: randomId })
  };
}

// src/services/spaces/GetSpaces.ts
var import_client_dynamodb2 = require("@aws-sdk/client-dynamodb");
var import_util_dynamodb2 = require("@aws-sdk/util-dynamodb");
async function getSpaces(event, ddbClient2) {
  if (event.queryStringParameters && "id" in event.queryStringParameters) {
    const spaceId = event.queryStringParameters["id"];
    const getItemResponse = await ddbClient2.send(new import_client_dynamodb2.GetItemCommand({
      TableName: process.env.TABLE_NAME,
      Key: {
        "id": { S: spaceId }
      }
    }));
    if (getItemResponse.Item) {
      const unmarshalled = (0, import_util_dynamodb2.unmarshall)(getItemResponse.Item);
      return {
        statusCode: 200,
        body: JSON.stringify(unmarshalled)
      };
    } else {
      return {
        statusCode: 404,
        body: `space with id ${spaceId} not found`
      };
    }
  } else {
    const result = await ddbClient2.send(new import_client_dynamodb2.ScanCommand({
      TableName: process.env.TABLE_NAME
    }));
    const unmarshalledList = result.Items?.map((item) => (0, import_util_dynamodb2.unmarshall)(item));
    return {
      statusCode: 201,
      body: JSON.stringify(unmarshalledList)
    };
  }
}

// src/services/spaces/UpdateSpace.ts
var import_client_dynamodb3 = require("@aws-sdk/client-dynamodb");
async function updateSpace(event, ddbClient2) {
  if (event.queryStringParameters && "id" in event.queryStringParameters && event.body) {
    const parsedBody = JSON.parse(event.body);
    const spaceId = event.queryStringParameters["id"];
    const requestBodyKey = Object.keys(parsedBody)[0];
    const requestBodyValue = parsedBody[requestBodyKey];
    const updateResult = await ddbClient2.send(new import_client_dynamodb3.UpdateItemCommand({
      TableName: process.env.TABLE_NAME,
      Key: {
        "id": { S: spaceId }
      },
      UpdateExpression: "SET #updateTarget = :new",
      ExpressionAttributeNames: {
        "#updateTarget": requestBodyKey
      },
      ExpressionAttributeValues: {
        ":new": {
          S: requestBodyValue
        }
      },
      ReturnValues: import_client_dynamodb3.ReturnValue.UPDATED_NEW
    }));
    return {
      statusCode: 204,
      body: JSON.stringify(updateResult)
    };
  }
  return {
    statusCode: 400,
    body: "invalid parameter"
  };
}

// src/services/spaces/DeleteSpace.ts
var import_client_dynamodb4 = require("@aws-sdk/client-dynamodb");
async function deleteSpace(event, ddbClient2) {
  const isAuthorized = hasAdminGroup(event);
  if (!isAuthorized) {
    return {
      statusCode: 401,
      body: "Not authorized!"
    };
  }
  if (event.queryStringParameters && "id" in event.queryStringParameters) {
    const spaceId = event.queryStringParameters["id"];
    await ddbClient2.send(new import_client_dynamodb4.DeleteItemCommand({
      TableName: process.env.TABLE_NAME,
      Key: {
        "id": { S: spaceId }
      }
    }));
    return {
      statusCode: 200,
      body: "Deleted space with id " + spaceId
    };
  }
  return {
    statusCode: 400,
    body: "invalid parameter"
  };
}

// src/services/spaces/handler.ts
var ddbClient = new import_client_dynamodb5.DynamoDBClient({});
async function handler(event, context) {
  let message;
  try {
    switch (event.httpMethod) {
      case "GET":
        const getResponse = await getSpaces(event, ddbClient);
        return getResponse;
      case "POST":
        const postResponse = await postSpaces(event, ddbClient);
        return postResponse;
      case "PUT":
        const putResponse = await updateSpace(event, ddbClient);
        return putResponse;
      case "DELETE":
        const deleteResponse = await deleteSpace(event, ddbClient);
        return deleteResponse;
      default:
        break;
    }
  } catch (e) {
    if (e instanceof MissingFieldError) {
      return {
        statusCode: 400,
        body: JSON.stringify(e.message)
      };
    }
    if (e instanceof JsonError) {
      return {
        statusCode: 400,
        body: JSON.stringify(e.message)
      };
    }
    return {
      statusCode: 500,
      body: JSON.stringify(e.message)
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
