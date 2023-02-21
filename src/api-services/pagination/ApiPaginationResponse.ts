import { Type, applyDecorators } from '@nestjs/common'
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger'
import { PaginatedData } from './dto/PaginationData'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const ApiPaginatedResponse = <TModel extends Type>(
  model: TModel,
) => {
  return applyDecorators(
    ApiExtraModels(PaginatedData),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginatedData) },
          {
            properties: {
              data: {
                type: 'array',
                items: {
                  $ref: getSchemaPath(model)
                }
              }
            }
          }
        ]
      }
    })
  )
}
