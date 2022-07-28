// import * as AWS from 'aws-sdk'
// import * as AWSXRay from 'aws-xray-sdk'
// import { DocumentClient } from 'aws-sdk/clients/dynamodb'
// import { createLogger } from '../utils/logger'
// import { TodoItem } from '../models/TodoItem'
// import { TodoUpdate } from '../models/TodoUpdate';

// import { Types } from 'aws-sdk/clients/s3'
// const XAWS = AWSXRay.captureAWS(AWS)

// const logger = createLogger('TodosAccess')

// // TODO: Implement the dataLayer logic



// export class ToDoAccess {
//     constructor(
//         private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
//         private readonly s3Client: Types = new AWS.S3({ signatureVersion: 'v4' }),
//         private readonly todoTable = process.env.TODOS_TABLE,
//         private readonly s3BucketName = process.env.S3_BUCKET_NAME) {
//     }

//     async getAllToDo(userId: string): Promise<TodoItem[]> {
//         console.log("Getting all todo");

//         const params = {
//             TableName: this.todoTable,
//             KeyConditionExpression: "#userId = :userId",
//             ExpressionAttributeNames: {
//                 "#userId": "userId"
//             },
//             ExpressionAttributeValues: {
//                 ":userId": userId
//             }
//         };

//         const result = await this.docClient.query(params).promise();
//         console.log(result);
//         const items = result.Items;

//         return items as TodoItem[];
//     }

//     async createToDo(todoItem: TodoItem): Promise<TodoItem> {
//         console.log("Creating new todo");

//         const params = {
//             TableName: this.todoTable,
//             Item: todoItem,
//         };

//         const result = await this.docClient.put(params).promise();
//         console.log(result);

//         return todoItem as TodoItem;
//     }

//     async updateToDo(todoUpdate: TodoUpdate, todoId: string, userId: string): Promise<TodoUpdate> {
//         console.log("Updating todo");

//         const params = {
//             TableName: this.todoTable,
//             Key: {
//                 "userId": userId,
//                 "todoId": todoId
//             },
//             UpdateExpression: "set #a = :a, #b = :b, #c = :c",
//             ExpressionAttributeNames: {
//                 "#a": "name",
//                 "#b": "dueDate",
//                 "#c": "done"
//             },
//             ExpressionAttributeValues: {
//                 ":a": todoUpdate['name'],
//                 ":b": todoUpdate['dueDate'],
//                 ":c": todoUpdate['done']
//             },
//             ReturnValues: "ALL_NEW"
//         };

//         const result = await this.docClient.update(params).promise();
//         console.log(result);
//         const attributes = result.Attributes;

//         return attributes as TodoUpdate;
//     }

//     async deleteToDo(todoId: string, userId: string): Promise<string> {
//         console.log("Deleting todo");

//         const params = {
//             TableName: this.todoTable,
//             Key: {
//                 "userId": userId,
//                 "todoId": todoId
//             },
//         };

//         const result = await this.docClient.delete(params).promise();
//         console.log(result);

//         return "" as string;
//     }

//     async generateUploadUrl(todoId: string): Promise<string> {
//         console.log("Generating URL");

//         const url = this.s3Client.getSignedUrl('putObject', {
//             Bucket: this.s3BucketName,
//             Key: todoId,
//             Expires: 1000,
//         });
//         console.log(url);

//         return url as string;
//     }
// }

import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
const AWSXRay = require('aws-xray-sdk')

import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'

const XAWS = AWSXRay.captureAWS(AWS)
const todosTable = process.env.TODOS_TABLE
const todosByUserIndex = process.env.TODOS_CREATED_AT_INDEX
const docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient()


export async function createTodoItem(item: TodoItem): Promise<void> {
  await docClient
    .put({
      TableName: todosTable,
      Item: item
    }).promise()
}

export async function getTodoItemsByUser(userId: string): Promise<TodoItem[]> {
  const result = await docClient
    .query({
      TableName: todosTable,
      IndexName: todosByUserIndex,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }).promise()

  return result.Items as TodoItem[]
}

export async function getTodoItem(userId: string, todoId: string): Promise<TodoItem> {
  const result = await docClient
    .get({
      TableName: todosTable,
      Key: {userId, todoId }
    }).promise()

  return result.Item as TodoItem
}

export async function updateTodoItem(
  userId: string,
  todoId: string,
  todoUpdate: TodoUpdate
): Promise<TodoItem> {
  const result = await docClient
    .update({
      TableName: todosTable,
      Key: {userId, todoId },
      UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
      ExpressionAttributeNames: {
        '#name': 'name'
      },
      ExpressionAttributeValues: {
        ':name': todoUpdate.name,
        ':dueDate': todoUpdate.dueDate,
        ':done': todoUpdate.done
        },
      ReturnValues: "ALL_NEW"
    }).promise()

    return result.Attributes  as TodoItem
}

export async function deleteTodoItem(userId: string, todoId: string): Promise<TodoItem> {
  const result = await docClient
    .delete({
      TableName: todosTable,
      Key: { userId, todoId },
      ReturnValues: 'ALL_OLD',
    }).promise()

    return result.Attributes  as TodoItem
}

export async function updateAttachmentInTodoItem(
  userId: string,
  todoId: string,
  attachmentUrl: string
): Promise<void> {
    await docClient
    .update({
      TableName: todosTable,
      Key: { userId, todoId },
      UpdateExpression: 'set attachmentUrl = :attachmentUrl',
      ExpressionAttributeValues: {
        ':attachmentUrl': attachmentUrl
      },
    }).promise()

  return
}