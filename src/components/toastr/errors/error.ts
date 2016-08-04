/**
 * Wrapper around Error that sets the error message.
 */
export class MdError extends Error {
  constructor(value: string) {
    super();
    this.message = value;
  }
}
