import { sendRequest } from '@/utils/api';
import Container from '@mui/material/Container';

export default async function TestA() {
    const res = await sendRequest<any>({
        url: `http://localhost:3000/api/test`,
        method: 'GET',
        nextOption: {
            // cache: 'no-store', // mỗi lần f5 -> fetch data mới
            // next: { revalidate: 10 },    // second unit | default: 86400s = 1d
                                            // => chờ hết thời gian trên (có thể tắt máy :v)
                                            // => khi gửi request mới (nextjs trigger re-render) => request tiếp theo mới nhận kết quả mới
            next: { tags: ['n-v-m-i-n-h-1-6-2'] } // khi nào cần thì gọi API Validate gồm tags và secret
        },
    });
    return (
        <Container sx={{ mt: 5 }}>
            <div>{JSON.stringify(res)}</div>
        </Container>
    );
}
