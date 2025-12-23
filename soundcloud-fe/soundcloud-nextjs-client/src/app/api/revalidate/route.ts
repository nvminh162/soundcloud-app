// nextjs 13: có 2 cách
// + revalidate path: 1 đường link URL
// + revalidate tag:  đặt tag cho API (giống ID)

// => tại nơi nào muốn nextjs build lại data => gọi API, truyền options tag

// đối với on-demand: là cơ chế khi nào cần thì nói với nextjs hãy validate qua API để kiểm soát tốt!

// Giúp người quản lý thực hiện cập nhật lại dữ liệu khi đã build dự án rồi
import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

// 'your-wesite.com/api/revalidate?tag=collection&secret=<token>'
// tag=collection
// secret=<token>
// => nếu lộ REVALIDATE_SECRET => hacker có thể gọi API liên tục => website sẽ build lại liên tục
export async function POST(request: NextRequest) {
    const secret = request.nextUrl.searchParams.get('secret');
    const tag = request.nextUrl.searchParams.get('tag');

    if (secret !== process.env.REVALIDATE_SECRET) { // có thể dùng chung NEXT_AUTH_SECRET .env
        return NextResponse.json({ message: 'Invalid secret...' }, { status: 401 });
    }

    if (!tag) {
        return NextResponse.json({ message: 'Missing tag param' }, { status: 400 });
    }

    revalidateTag(tag);

    return NextResponse.json({
        revalidated: true,
        now: Date.now(),
    });
}

/* Câu hỏi ? => khi nào dùng revalidate tags | path (14|1892:13:00)
=>  path: muốn nextjs bỏ hết dữ liệu 1 trang
=>  tag (ID): nơi nào dùng API A (ví dụ có 3 nơi trong thì build lại 3 nơi thuộc đó thôi)
    +++>tag > path
 */

/*
revalidatePath vs. router.refresh:
router.refresh không clear "Data cache" (chỉ clear router cache và re-render page) => dùng cache: "no-store :v
*/