import TableUser from "./components/table.user";

const CRUDPage = async ({ searchParams }: {
    searchParams: { [key: string]: string | string[] | undefined }
}) => {

    const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0b2tlbiBsb2dpbiIsImlzcyI6ImZyb20gc2VydmVyIiwiX2lkIjoiNjk0YWI1YThiNDU3OTQzNWI2YWY0N2RhIiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJhZGRyZXNzIjoiVmlldE5hbSIsImlzVmVyaWZ5Ijp0cnVlLCJuYW1lIjoiSSdtIGFkbWluIiwidHlwZSI6IlNZU1RFTSIsInJvbGUiOiJBRE1JTiIsImdlbmRlciI6Ik1BTEUiLCJhZ2UiOjY5LCJpYXQiOjE3NjY1NzgwNjksImV4cCI6MTg1Mjk3ODA2OX0.ptFBeQkvZGpLbTP60_8_73PKLz7UrKUP6sjz2D6Qiuw";
    const LIMIT = 5;
    const page = Number(searchParams?.page) || 1;

    const res = await fetch(
        `http://localhost:8000/api/v1/users?current=${page}&pageSize=${LIMIT}&sort=-updatedAt`,
        {
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
                "Content-Type": "application/json",
            },
            // next: { tags: ['listUsers'] }
            cache: 'no-store'
        })

    const raw = await res.json();

    return (
        <div style={{ padding: "50px" }}>
            <TableUser
                raw={raw}
                access_token={ACCESS_TOKEN}
            />
        </div>
    )
}
export default CRUDPage;