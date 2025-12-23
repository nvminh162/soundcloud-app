export async function generateStaticParams() {
    return [{ slug: '1' }, { slug: '12' }, { slug: '123' }];
}

export default function TestSlug({ params }: any) {
    const { slug } = params;
    return <div>TestSlug: {slug}</div>;
}
