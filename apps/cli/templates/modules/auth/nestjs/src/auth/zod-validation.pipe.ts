import { BadRequestException, type PipeTransform } from "@nestjs/common";
import type { ZodType } from "zod";

// Validates a request body against a Zod schema and returns the parsed value
export class ZodValidationPipe<T> implements PipeTransform<unknown, T> {
  constructor(private readonly schema: ZodType<T>) {}

  transform(value: unknown): T {
    // The body is undefined when the request has none
    const result = this.schema.safeParse(value ?? {});
    if (!result.success) {
      throw new BadRequestException(result.error.issues[0].message);
    }
    return result.data;
  }
}
