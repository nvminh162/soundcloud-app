'use client'

import { useSearchParams } from "next/navigation";

export default function DetailTrackPage(props: any) {
    const { params } = props;
    const searchParams = useSearchParams();
    const search = searchParams.get("audio");
    console.log(search);

    return <div>DetailTrackPage</div>;
}
