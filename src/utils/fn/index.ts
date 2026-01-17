export const getFieldError = (
  state: { error?: string | Record<string, string[] | undefined> } | null | undefined,
  fieldName: string
) => {
  // Check if state exists and if the error property is the 'nested' object from Valibot
  if (state?.error && typeof state.error === 'object') {
    const fieldErrors = state.error[fieldName];
    return Array.isArray(fieldErrors) ? fieldErrors[0] : undefined;
  }
  return undefined;
};
