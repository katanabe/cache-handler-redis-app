"use server";

import {cookies} from "next/headers";

export const getCookies = async () => await cookies();