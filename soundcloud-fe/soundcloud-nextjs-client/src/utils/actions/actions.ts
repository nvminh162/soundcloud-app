'use server'

import { getServerSession } from "next-auth";
import { sendRequest } from "../api";
import { authOptions } from "@/app/api/auth/auth.options";
import { revalidateTag } from 'next/cache'

export const handleLikeTrackAction = async (id: string | undefined, quantity: number) => {
    const session = await getServerSession(authOptions);

    await sendRequest<IBackendRes<IModelPaginate<ITrackLike>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/likes`,
        method: 'POST',
        body: {
            track: id,
            quantity: quantity,
        },
        headers: {
            Authorization: `Bearer ${session?.access_token}`,
        },
    });

    revalidateTag('track-by-id');
    revalidateTag('liked-by-user');
}