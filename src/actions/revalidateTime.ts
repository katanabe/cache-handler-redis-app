"use server";

import { revalidateTag } from "next/cache";

export const revalidateTime = async () => {
  revalidateTag("time-data");
}

