import { handler } from "../src/services/spaces/handler";

process.env.AWS_REGION = "ap-northeast-1";
process.env.TABLE_NAME = "SpacesTable-0e0c3842defd";

// // POST TEST
// handler({
//   httpMethod: 'POST',
//   body: JSON.stringify({
//     location: 'marshall'
//   })
// } as any, {} as any)

// // GET TEST
// handler({
//   httpMethod: 'GET',
//   queryStringParameters: {
//     id: '7df65f76-cd70-4ef7-9d95-36c4422034be'
//   }
// } as any, {} as any)

// // PUT TEST
// handler({
//   httpMethod: 'PUT',
//   queryStringParameters: {
//     id: '7df65f76-cd70-4ef7-9d95-36c4422034be'
//   },
//   body: JSON.stringify({
//     location: 'marshall22222'
//   })
// } as any, {} as any)

// DELETE TEST
handler({
  httpMethod: 'DELETE',
  queryStringParameters: {
    id: '7df65f76-cd70-4ef7-9d95-36c4422034be'
  }
} as any, {} as any)

.then((res) => {
  console.log('error', res);
})