import 'source-map-support/register'

// import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
// import * as middy from 'middy'
// import * as uuid from 'uuid'
// import { cors, httpErrorHandler } from 'middy/middlewares'

// import { createsuccess, failure, getUserId } from '../utils'
// import { createLogger } from '../../utils/logger'
// import { generateSignedUrl, updateAttachmentUrl } from '../../businessLogic/todos'

// const logger = createLogger('createTodo')

// export const handler = middy(
//   async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
//     logger.info('Generating uploadUrl', { event })
//     try {

//       const userId = getUserId(event)
//       const todoId = event.pathParameters.todoId
//       const attachmentId = uuid.v4()

//       const uploadUrl = await generateSignedUrl(attachmentId)
//       await updateAttachmentUrl(userId, todoId, attachmentId)
//       console.log(uploadUrl)
//       return createsuccess({ uploadUrl })
//     } catch (error) {
//       return failure(error, error.code)
//     }
//   }
// )

// handler
//   .use(httpErrorHandler())
//   .use(
//     cors({
//       credentials: true
//     })
//   )

import {APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler} from 'aws-lambda'
import {generateUploadUrl} from "../../businessLogic/todos";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    console.log("Processing Event ", event);
    const todoId = event.pathParameters.todoId;

    const URL = await generateUploadUrl(todoId);

    return {
        statusCode: 202,
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
            uploadUrl: URL,
        })
    };
};