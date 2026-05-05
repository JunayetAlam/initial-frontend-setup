/* eslint-disable @typescript-eslint/no-explicit-any */

export const errorMessageGenerator = (err: any) => {
  return `${err?.status && `${err?.status}:`} ${err?.data?.message || "Something went wrong"}`;
};
