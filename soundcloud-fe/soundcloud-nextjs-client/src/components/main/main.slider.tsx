'use client';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import { Settings } from 'react-slick';
import { Box } from '@mui/material';
import Button from '@mui/material/Button/Button';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Divider from '@mui/material/Divider';
import Link from 'next/link';
import { convertSlugUrl } from '@/utils/api';
import Image from 'next/image';
// import flower from '../../../public/flower/flowers.jpg'

interface IProps {
    title: string;
    data: ITrackTop[];
}

const MainSlider = (props: IProps) => {
    const { title, data } = props;

    const NextArrow = (props: any) => {
        return (
            <Button
                variant="contained"
                color="inherit"
                onClick={props.onClick}
                sx={{
                    position: 'absolute',
                    right: 25,
                    top: '25%',
                    zIndex: 2,
                    minWidth: 30,
                    width: 35,
                }}
            >
                <ChevronRightIcon />
            </Button>
        );
    };

    const PrevArrow = (props: any) => {
        return (
            <Button
                variant="contained"
                color="inherit"
                onClick={props.onClick}
                sx={{
                    position: 'absolute',
                    top: '25%',
                    zIndex: 2,
                    minWidth: 30,
                    width: 35,
                }}
            >
                <ChevronLeftIcon />
            </Button>
        );
    };

    const settings: Settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };
    //box === div

    return (
        <Box
            sx={{
                margin: '0 50px',
                '& a': {
                    textDecoration: 'none', // Bỏ gạch chân
                    color: 'inherit', // Bỏ màu xanh mặc định của Link, dùng màu của text cha
                },
                '.track': {
                    padding: '0 10px',
                    img: {
                        height: 150,
                        width: 150,
                    },
                },
                h3: {
                    border: '1px solid #ccc',
                    padding: '20px',
                    height: '200px',
                },
            }}
        >
            <h2>{title}</h2>

            <Slider {...settings}>
                {data.map((track, index) => (
                    <Link href={`track/${convertSlugUrl(track.title)}-${track._id}.html?audio=${track.trackUrl}`} className="track" key={track._id}>
                        {/* <img src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track.imgUrl}`} /> */}
                        <div style={{ position: 'relative', height: '360px', width: '100%' }}>
                            <Image
                                alt={track.title}
                                // src={flower}
                                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track.imgUrl}`}
                                fill // tự dông co giãn = với parent size =thêm fill nextjs sẽ bỏ qua width và height báo lỗi, nextjs sẽ dựa vào HTML
                                sizes="(max-width: 480px) 100vw, (max-width: 600px) 50vw, (max-width: 1024px) 33vw, 20vw"
                                priority={title === 'Top Chill' && index === 0}
                                style={{ objectFit: 'contain' }}
                            />
                            {/*do backend không có cơ chế height width ảnh, mặc dù forward _next/image đã truyền w=?q=? ảnh lúc nào cũng là width height ban đầu */}
                            {/* nếu dùng hình ảnh có sãn trong src của nextjs thì nextjs sẽ làm giúp (local) => cái náy có tính phí! */}
                        </div>
                        <h4>{track.title}</h4>
                        <h5>{track.description}</h5>
                    </Link>
                ))}
            </Slider>
            <Divider />
        </Box>
    );
};

export default MainSlider;
